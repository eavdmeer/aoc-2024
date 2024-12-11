#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day11');

if (process.argv[2])
{
  day11(process.argv[2])
    .then(console.log);
}

function step(v)
{
  if (v === 0)
  {
    return [ 1 ];
  }
  const vs = String(v);
  if (vs.length % 2 === 0)
  {
    const l = vs.length / 2;
    return [ Number(vs.substr(0, l)), Number(vs.substr(l, l)) ];
  }
  return [ 2024 * v ];
}

function solve(data, n)
{
  debug('data:', data);

  let max = 0;
  const map = new Map();
  data.forEach(stone => map.set(stone, (map.get(stone) ?? 0) + 1));

  for (let i = 0; i < n; i++)
  {
    const entries = [ ...map.entries() ];
    map.clear();
    entries.forEach(([ stone, cnt ]) =>
    {
      const nstones = step(stone);
      nstones.forEach(nstone => map.set(nstone, (map.get(nstone) ?? 0) + cnt));
    });
    if (map.size > max) { max = map.size; }
  }

  console.log('max map size for n =', n, 'is:', max);
  return [ ...map.values() ].reduce((a, v) => a + v, 0);
}

function solve1(data)
{
  return solve(data, 25);
}

function solve2(data)
{
  return solve(data, 75);
}

export default async function day11(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/ /)
    .map(Number);

  const part1 = solve1(data);
  const expect1a = 55312;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 216042;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 65601038650482;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 255758646442399;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day11', part1, part2, duration: Date.now() - start };
}
