#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day12');

if (process.argv[2])
{
  day12(process.argv[2])
    .then(console.log);
}

function key(r, c)
{
  return `${r},${c}`;
}

function flood(data, r, c, seen)
{
  const ch = data[r][c];

  const region = { r, c, ch, perimiter: 0, vertices: 0, size: 0 };

  const check = [ [ r, c ] ];
  while (check.length)
  {
    const [ nr, nc ] = check.pop();
    const nk = key(nr, nc);
    if (seen.has(nk) || data[nr][nc] !== ch)
    {
      continue;
    }

    seen.add(nk);
    region.size++;

    const dirs = [ [ nr - 1, nc ], [ nr, nc + 1 ],
      [ nr + 1, nc ], [ nr, nc - 1 ] ];

    dirs.forEach(([ cr, cc ]) =>
    {
      const v = data[cr]?.[cc];
      if (v === ch) { return; }
      region.perimiter++;
    });

    // vertex check

    // nothing up and right
    if (data[nr - 1]?.[nc] !== ch && data[nr]?.[nc + 1] !== ch)
    {
      region.vertices++;
    }
    // nothing up and left
    if (data[nr - 1]?.[nc] !== ch && data[nr]?.[nc - 1] !== ch)
    {
      region.vertices++;
    }
    // nothing down and right
    if (data[nr + 1]?.[nc] !== ch && data[nr]?.[nc + 1] !== ch)
    {
      region.vertices++;
    }
    // nothing down and left
    if (data[nr + 1]?.[nc] !== ch && data[nr]?.[nc - 1] !== ch)
    {
      region.vertices++;
    }

    // nothing left but something up and left-up
    if (data[nr]?.[nc - 1] !== ch && data[nr - 1]?.[nc] === ch &&
      data[nr - 1]?.[nc - 1] === ch)
    {
      region.vertices++;
    }
    // nothing left but something down and left-down
    if (data[nr]?.[nc - 1] !== ch && data[nr + 1]?.[nc] === ch &&
      data[nr + 1]?.[nc - 1] === ch)
    {
      region.vertices++;
    }

    // nothing right but something up and right-up
    if (data[nr]?.[nc + 1] !== ch && data[nr - 1]?.[nc] === ch &&
      data[nr - 1]?.[nc + 1] === ch)
    {
      region.vertices++;
    }
    // nothing right but something down and right-down
    if (data[nr]?.[nc + 1] !== ch && data[nr + 1]?.[nc] === ch &&
      data[nr + 1]?.[nc + 1] === ch)
    {
      region.vertices++;
    }

    check.push(...dirs.filter(([ a, b ]) =>
      a >= 0 && b >= 0 && a < data.rows && b < data.cols));
  }

  return region;
}

function solve1(data)
{
  debug('data:', data);

  const seen = new Set();
  const regions = [];

  for (let r = 0; r < data.rows; r++)
  {
    for (let c = 0; c < data.cols; c++)
    {
      if (data[r][c] === '.') { continue; }
      if (seen.has(key(r, c))) { continue; }
      regions.push(flood(data, r, c, seen));
    }
  }

  return regions.reduce((a, { size, perimiter }) => a + size * perimiter, 0);
}

function solve2(data)
{
  debug('data:', data);

  const seen = new Set();
  const regions = [];

  for (let r = 0; r < data.rows; r++)
  {
    for (let c = 0; c < data.cols; c++)
    {
      if (data[r][c] === '.') { continue; }
      if (seen.has(key(r, c))) { continue; }
      regions.push(flood(data, r, c, seen));
    }
  }

  return regions.reduce((a, { size, vertices }) => a + size * vertices, 0);
}

export default async function day12(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split(''));
  data.rows = data.length;
  data.cols = data[0].length;

  const part1 = solve1(data);
  const expect1a = 1930;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 1483212;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 1206;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 897062;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day12', part1, part2, duration: Date.now() - start };
}
