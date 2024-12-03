#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day03');

if (process.argv[2])
{
  day03(process.argv[2])
    .then(console.log)
    .catch(err => console.log(err.message));
}

function solve1(data)
{
  debug('data:', data);
  const re = /mul\((\d{1,3}),(\d{1,3})\)/g;
  const matches = [ ...data.matchAll(re) ];
  return matches
    .reduce((a, v) => a + Number(v[1]) * Number(v[2]), 0);
}

function solve2(data)
{
  debug('data:', data);
  const re = /don't\(\)|do\(\)|mul\((\d{1,3}),(\d{1,3})\)/g;

  const matches = [ ...data.matchAll(re) ];

  let active = true;
  return matches.reduce((a, v) =>
  {
    if (v[0] === 'don\'t()')
    {
      active = false;
      return a;
    }
    else if (v[0] === 'do()')
    {
      active = true;
      return a;
    }

    return active ? a + Number(v[1]) * Number(v[2]) : a;
  }, 0);
}

export default async function day03(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString();

  debug('data', data);

  const part1 = solve1(data);
  const expect1a = 161;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 188741603;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 48;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 67269798;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day03', part1, part2, duration: Date.now() - start };
}
