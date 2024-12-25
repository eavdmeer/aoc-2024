#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day25');

if (process.argv[2])
{
  day25(process.argv[2])
    .then(console.log);
}

function solve1(data)
{
  debug('data:', data);

  const rows = data.locks[0].length;
  const cols = data.locks[0][0].length;

  const locks = data.locks.map(lock =>
  {
    const h = [];
    for (let c = 0; c < cols; c++)
    {
      let r = 0;
      while (lock[r][c] === '#') { r++; }
      h.push(r - 1);
    }
    return h;
  });

  const keys = data.keys.map(key =>
  {
    const h = [];
    for (let c = 0; c < cols; c++)
    {
      let r = 0;
      while (key[r][c] !== '#') { r++; }
      h.push(rows - r - 1);
    }
    return h;
  });

  const fits = (a, b) => a.every((h, i) => h + b[i] <= 5);

  return locks.map(lock => keys.map(key => fits(lock, key)))
    .flat()
    .filter(v => v)
    .length;
}

function solve2(data)
{
  debug('data:', data);
  return 'Code Chronicle';
}

export default async function day25(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const all = buffer.toString().trim().split('\n\n');

  const data = {
    locks: all
      .filter(v => v[0] === '#')
      .map(v => v.split('\n').map(line => line.split(''))),
    keys: all
      .filter(v => v[0] !== '#')
      .map(v => v.split('\n').map(line => line.split('')))
  };

  const part1 = solve1(data);
  const expect1a = 3;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 3365;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 'Code Chronicle';
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 'Code Chronicle';
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day25', part1, part2, duration: Date.now() - start };
}
