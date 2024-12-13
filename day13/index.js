#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';
import linear from 'linear-solve';

const debug = makeDebug('day13');

if (process.argv[2])
{
  day13(process.argv[2])
    .then(console.log);
}

function close(val)
{
  return Math.abs(val - Math.round(val)) < 0.001;
}

function solve1(data)
{
  debug('data:', data);

  return data.reduce((v, [ a, b, p ]) =>
  {
    const sol = linear.solve([ [ a[0], b[0] ], [ a[1], b[1] ] ], [ ...p ]);
    if (close(sol[0]) && close(sol[1]))
    {
      return v + 3 * Math.round(sol[0]) + Math.round(sol[1]);
    }
    return v;
  }, 0);
}

function solve2(data)
{
  debug('data:', data);

  return data.reduce((v, [ a, b, prize ]) =>
  {
    const sol = linear.solve(
      [ [ a[0], b[0] ], [ a[1], b[1] ] ],
      [ 10000000000000 + prize[0], 10000000000000 + prize[1] ]);
    if (close(sol[0]) && close(sol[1]))
    {
      return v + 3 * Math.round(sol[0]) + Math.round(sol[1]);
    }
    return v;
  }, 0);
}

export default async function day13(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split('\n\n')
    .map(v => v.split('\n').map(w => w.replace(/[^0-9,]/g, '')))
    .map(v => v.map(w => w.split(',').map(Number)));

  const part1 = solve1(data);
  const expect1a = 480;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 39996;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 875318608908;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 73267584326867;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day13', part1, part2, duration: Date.now() - start };
}
