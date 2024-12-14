#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day05');

if (process.argv[2])
{
  day05(process.argv[2])
    .then(console.log)
    .catch(err => console.log(err.message));
}

function good(update, rules)
{
  return update.every((v, i, a) =>
    ! a.slice(i + 1).some(n => rules.get(n)?.includes(v)));
}

function solve1(data)
{
  debug('data:', data);

  return data.updates
    .filter(u => good(u, data.rules))
    .reduce((a, v) => a + Number(v.at(Math.floor(v.length / 2))), 0);
}

function solve2(data)
{
  debug('data:', data);

  return data.updates
    .filter(u => ! good(u, data.rules))
    .map(v => v.sort((a, b) =>
    {
      if (data.rules.get(a)?.includes(b))
      {
        return -1;
      }
      else if (data.rules.get(b)?.includes(a))
      {
        return 1;
      }
      return 0;
    }))
    .reduce((a, v) => a + Number(v.at(Math.floor(v.length / 2))), 0);
}

export default async function day05(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const [ rules, updates ] = buffer.toString().trim().split('\n\n');

  const data = {
    rules: rules.split('\n').reduce((a, line) =>
    {
      const [ from, to ] = line.split('|');
      if (a.has(from))
      {
        a.get(from).push(to);
        a.get(from).sort();
      }
      else
      {
        a.set(from, [ to ]);
      }
      return a;
    }, new Map()),
    updates: updates.split('\n').map(v => v.split(','))
  };

  const part1 = solve1(data);
  const expect1a = 143;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 4924;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 123;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 6085;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day05', part1, part2, duration: Date.now() - start };
}
