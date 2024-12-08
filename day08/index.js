#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day08');

if (process.argv[2])
{
  day08(process.argv[2])
    .then(console.log)
    .catch(err => console.log(err.message));
}

function getPairs(data)
{
  const m = new Map();

  for (let r = 0; r < data.rows; r++)
  {
    for (let c = 0; c < data.cols; c++)
    {
      const ch = data[r][c];
      if (ch === '.') { continue; }
      const l = m.get(ch) ?? [];
      l.push([ r, c ]);
      m.set(ch, l);
    }
  }

  const pairs = [];
  [ ...m.values() ].forEach(row =>
  {
    row.forEach((p1, i, a) =>
    {
      a.slice(i + 1).forEach(p2 =>
      {
        pairs.push([ p1, p2 ]);
      });
    });
  });

  return pairs;
}

function solve1(data)
{
  debug('data:', data);

  const anti = new Set();

  getPairs(data).forEach(([ p1, p2 ]) =>
  {
    const dr = p2[0] - p1[0];
    const dc = p2[1] - p1[1];

    if (p1[0] - dr >= 0 && p1[0] - dr < data.cols &&
        p1[1] - dc >= 0 && p1[1] - dc < data.rows)
    {
      anti.add(`${1 + p1[0] - dr},${1 + p1[1] - dc}`);
    }
    if (p2[0] + dr >= 0 && p2[0] + dr < data.cols &&
        p2[1] + dc >= 0 && p2[1] + dc < data.rows)
    {
      anti.add(`${1 + p2[0] + dr},${1 + p2[1] + dc}`);
    }
  });

  return anti.size;
}

function solve2(data)
{
  debug('data:', data);

  const anti = new Set();

  getPairs(data).forEach(([ p1, p2 ]) =>
  {
    const dr = p2[0] - p1[0];
    const dc = p2[1] - p1[1];
    let r = p1[0];
    let c = p1[1];
    while (r >= 0 && r < data.rows && c >= 0 && c < data.cols)
    {
      anti.add(`${1 + r},${1 + c}`);
      r += dr;
      c += dc;
    }
    r = p1[0] - dr;
    c = p1[1] - dc;
    while (r >= 0 && r < data.rows && c >= 0 && c < data.cols)
    {
      anti.add(`${1 + r},${1 + c}`);
      r -= dr;
      c -= dc;
    }
  });

  return anti.size;
}

export default async function day08(target)
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
  const expect1a = 14;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 252;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 34;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 839;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day08', part1, part2, duration: Date.now() - start };
}
