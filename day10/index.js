#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day10');

if (process.argv[2])
{
  day10(process.argv[2])
    .then(console.log)
    .catch(err => console.log(err.message));
}

function score(data, h, r, c, seen)
{
  if (r < 0 || c < 0 || r >= data.rows || c >= data.cols) { return 0; }

  let result = 0;

  if (h === 9)
  {
    if (seen) { seen.add(`${r},${c}`); }
    return 1;
  }

  if (data.at(r - 1)?.at(c) === h + 1)
  {
    result += score(data, h + 1, r - 1, c, seen);
  }
  if (data.at(r)?.at(c + 1) === h + 1)
  {
    result += score(data, h + 1, r, c + 1, seen);
  }
  if (data.at(r + 1)?.at(c) === h + 1)
  {
    result += score(data, h + 1, r + 1, c, seen);
  }
  if (data.at(r)?.at(c - 1) === h + 1)
  {
    result += score(data, h + 1, r, c - 1, seen);
  }

  return result;
}

function solve1(data)
{
  debug('data:', data);

  let total = 0;
  for (let r = 0; r < data.rows; r++)
  {
    for (let c = 0; c < data.cols; c++)
    {
      if (data[r][c] !== 0) { continue; }
      const seen = new Set();
      score(data, 0, r, c, seen);
      total += seen.size;
    }
  }

  return total;
}

function solve2(data)
{
  debug('data:', data);

  return data.reduce((tot, row, r) =>
    tot + row.reduce((a, val, c) => val ? a : a + score(data, 0, r, c), 0),
  0);
}

export default async function day10(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split('').map(Number));
  data.rows = data.length;
  data.cols = data[0].length;

  const part1 = solve1(data);
  const expect1a = 36;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 587;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 81;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 1340;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day10', part1, part2, duration: Date.now() - start };
}
