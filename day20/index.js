#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day20');

if (process.argv[2])
{
  day20(process.argv[2])
    .then(console.log);
}

const key = (kr, kc) => kr << 8 | kc;

function getpath(grid, start, end)
{
  const seen = new Map();

  const queue = [];
  queue.push([ 0, ...start ]);

  while (queue.length)
  {
    const [ d, r, c ] = queue.shift();
    if (seen.has(key(r, c))) { continue; }
    seen.set(key(r, c), d);
    if (r === end[0] && c === end[1]) { return seen; }
    const dirs = [ [ r, c + 1 ], [ r, c - 1 ], [ r + 1, c ], [ r - 1, c ] ];
    dirs.forEach(([ nr, nc ]) =>
    {
      if (grid[nr][nc] === '#') { return; }
      queue.push([ d + 1, nr, nc ]);
    });
  }

  return seen;
}

// Euclidian distance
const dist = (a, b) => Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);

function solve(grid, start, end, saving, maxHops)
{
  const seen = getpath(grid, start, end);
  const entries = [ ...seen.entries() ]
    .map(([ a, b ]) => [ [ a >> 8, a & 255 ], b ]);

  return entries.reduce((a, [ [ r, c ], d ]) => a + entries
    .filter(([ [ nr, nc ], nd ]) =>
      nd - d >= saving + dist([ r, c ], [ nr, nc ]) &&
      Math.abs(nr - r) + Math.abs(nc - c) <= maxHops)
    .length, 0);
}

function solve1(data, saving)
{
  debug('data:', data, saving);

  return solve(data.grid, data.start, data.end, saving, 2);
}

function solve2(data, saving)
{
  debug('data:', data);

  return solve(data.grid, data.start, data.end, saving, 20);
}

export default async function day20(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = {
    grid: buffer
      .toString()
      .trim()
      .split(/\s*\n\s*/)
      .map(v => v.split(''))
  };
  data.rows = data.grid.length;
  data.cols = data.grid[0].length;
  data.grid.forEach((row, r) =>
    row.forEach((v, c) =>
    {
      if (v === 'S') { data.start = [ r, c ]; }
      else if (v === 'E') { data.end = [ r, c ]; }
    }));

  const save = target.includes('example') ? 20 : 100;

  const part1 = solve1(data, save);
  const expect1a = 5;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 1307;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const save2 = target.includes('example') ? 50 : 100;

  const part2 = solve2(data, save2);
  const expect2a = 285;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 986545;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day20', part1, part2, duration: Date.now() - start };
}
