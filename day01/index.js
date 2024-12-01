#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day01');

if (process.argv[2])
{
  day01(process.argv[2])
    .then(console.log)
    .catch(err => console.log(err.message));
}

function solve1(data)
{
  debug('data:', data);

  const d1 = data.map(v => v[0]);
  d1.sort();
  const d2 = data.map(v => v[1]);
  d2.sort();

  return d1.map((v, i) => Math.abs(v - d2[i]))
    .reduce((a, v) => a + v, 0);
}

function solve2(data)
{
  debug('data:', data);

  const d1 = data.map(v => v[0]);
  const m = new Map();
  data.forEach(v => m.set(v[1], (m.get(v[1]) ?? 0) + 1));

  return d1.reduce((a, v) => a + v * (m.get(v) ?? 0), 0);
}

export default async function day01(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  /* eslint-disable no-shadow */
  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split(/\s+/).map(n => Number(n)));
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);
  const expect1a = 11;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 1834060;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 31;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 21607792;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day01', part1, part2, duration: Date.now() - start };
}
