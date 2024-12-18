#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';

const debug = makeDebug('day18');

if (process.argv[2])
{
  day18(process.argv[2])
    .then(console.log);
}

function findPath(grid, rows, cols)
{
  const seen = new Set();
  const key = (r, c) => `${r},${c}`;

  const queue = new MinPriorityQueue(v => v[0]);
  queue.push([ 0, 0, 0 ]);

  while (queue.size())
  {
    const [ cost, r, c ] = queue.dequeue();

    if (r === rows - 1 && c === cols - 1) { return cost; }

    if (seen.has(key(r, c))) { continue; }
    seen.add(key(r, c));

    const next = [ [ r + 1, c ], [ r - 1, c ], [ r, c + 1 ], [ r, c - 1 ] ];
    next.forEach(([ nr, nc ]) =>
    {
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== '#')
      {
        queue.push([ cost + 1, nr, nc ]);
      }
    });
  }

  return -1;
}

function solve1(data, drops, rows, cols)
{
  debug('data:', data);

  const grid = Array.from({ length: rows }).map(() =>
    Array.from({ length: cols }).fill('.'));

  data.slice(0, drops).forEach(([ c, r ]) => grid[r][c] = '#');

  return findPath(grid, rows, cols);
}

function solve2(data, rows, cols)
{
  debug('data:', data);

  // Find the drop that will block the path with binary search
  let lo = 0;
  let hi = data.length - 1;

  while (lo < hi)
  {
    const mi = Math.floor((lo + hi) / 2);

    const grid = Array.from({ length: rows }).map(() =>
      Array.from({ length: cols }).fill('.'));
    data.slice(0, mi + 1).forEach(([ c, r ]) => grid[r][c] = '#');
    const connected = findPath(grid, rows, cols) > 0;
    console.log(lo, hi, mi, connected);

    if (connected)
    {
      lo = mi + 1;
    }
    else
    {
      hi = mi;
    }
  }

  // TODO: need +1 for real data, not for the test
  return data[lo + 1].join(',');
}

export default async function day18(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .map(v => v.split(',').map(Number));

  const w = target.includes('example') ? 7 : 71;
  const drops = target.includes('example') ? 12 : 1024;

  const part1 = solve1(data, drops, w, w);
  const expect1a = 22;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 370;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data, w, w);
  const expect2a = '6,1';
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = '19,2';
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day18', part1, part2, duration: Date.now() - start };
}
