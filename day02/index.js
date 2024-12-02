#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day02');

if (process.argv[2])
{
  day02(process.argv[2])
    .then(console.log)
    .catch(err => console.log(err.message));
}

function valid(levels)
{
  const d = levels.map((l, i, a) => l - a[i + 1]);
  d.pop();

  return d.every(v => v > 0 && v <= 3) || d.every(v => v < 0 && v >= -3);
}

function solve1(data)
{
  debug('data:', data);
  return data
    .filter(levels => valid(levels))
    .length;
}

function solve2(data)
{
  debug('data:', data);
  return data
    .filter(levels => levels.some((v, i, a) =>
      valid(a.filter((x, j) => j !== i))))
    .length;
}

export default async function day02(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split(' ').map(n => Number(n)));

  debug('data', data);

  const part1 = solve1(data);
  const expect1a = 2;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 502;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 4;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 544;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day02', part1, part2, duration: Date.now() - start };
}