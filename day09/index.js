#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day09');

if (process.argv[2])
{
  day09(process.argv[2])
    .then(console.log);
}

function expand(data)
{
  return data.map((v, i) => Array(v).fill(i % 2 ? -1 : i / 2)).flat();
}

function compact(data)
{
  const result = Array.from(data);

  const blanks = [];
  result.forEach((v, i) =>
  {
    if (v < 0) { blanks.push(i); };
  });

  blanks.forEach(i =>
  {
    while (result.at(-1) < 0) { result.pop(); };
    if (result.length <= i) { return; }
    result[i] = result.pop();
  });

  return result;
}

function checksum(data)
{
  return data.reduce((a, v, i) => a + i * (v < 0 ? 0 : v), 0);
}

function solve1(data)
{
  debug('data:', data);
  // return 6353658451014;
  return checksum(compact(expand(data)));
}

function solve2(data)
{
  debug('data:', data);

  const files = [];
  const blanks = [];

  let offset = 0;
  data.forEach((v, i) =>
  {
    if (i % 2 === 0)
    {
      files.push([ i / 2, offset, v ]);
      if (v === 0) { throw new Error('EMPTY'); }
    }
    else if (v > 0)
    {
      // Add to space
      blanks.push([ offset, v ]);
    }
    offset += v;
  });

  files.reverse();

  const moved = files.map(([ id, idx, size ]) =>
  {
    const slot = blanks.find(([ pos, free ]) => pos < idx && free >= size);
    if (! slot)
    {
      return [ id, idx, size ];
    }

    const newpos = [ id, slot[0], size ];

    slot[0] += size;
    slot[1] -= size;

    return newpos;
  });

  return moved.reduce((a, [ id, idx, size ]) =>
  {
    let val = 0;
    for (let i = idx; i < idx + size; i++)
    {
      val += i * id;
    }
    return a + val;
  }, 0);
}

export default async function day09(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split('')
    .map(Number);

  const part1 = solve1(data);
  const expect1a = 1928;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 6353658451014;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 2858;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 6382582136592;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day09', part1, part2, duration: Date.now() - start };
}
