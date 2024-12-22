#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';

const debug = makeDebug('day16');

if (process.argv[2])
{
  day16(process.argv[2])
    .then(console.log);
}

const key = (r, c, dr, dc) => r << 20 | c << 12 | dr + 1 << 4 | dc + 1;

/*
function printResult(result)
{
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(`${result}`);
}
*/

function solve1(data)
{
  debug('data:', data);

  const queue = new MinPriorityQueue(v => v.cost);
  const [ sr, sc ] = data.start;

  queue.push({ cost: 0, r: sr, c: sc, dr: 0, dc: 1 });

  const seen = new Set();
  seen.add(key(sr, sc, 0, 1));

  while (queue.size())
  {
    const { cost, r, c, dr, dc } = queue.dequeue();

    seen.add(key(r, c, dr, dc));

    if (data[r][c] === 'E') { return cost; }

    const next = [
      [ cost + 1, r + dr, c + dc, dr, dc ],
      [ cost + 1000, r, c, dc, -dr ],
      [ cost + 1000, r, c, -dc, dr ]
    ];
    next.forEach(([ newcost, nr, nc, ndr, ndc ]) =>
    {
      if (data[nr][nc] === '#') { return; }
      if (seen.has(key(nr, nc, ndr, ndc))) { return; }
      queue.push({ cost: newcost, r: nr, c: nc, dr: ndr, dc: ndc });
    });
  }
  throw new Error('No path to end point!');
}

function solve2(data)
{
  debug('data:', data);

  const queue = new MinPriorityQueue(v => v.cost);
  const [ sr, sc ] = data.start;

  queue.push({ cost: 0, r: sr, c: sc, dr: 0, dc: 1, path: [] });

  const seen = new Set();
  seen.add(key(sr, sc, 0, 1));
  let best = -1;
  const bestSquares = new Set();

  while (queue.size())
  {
    const { cost, r, c, dr, dc, path } = queue.dequeue();

    seen.add(key(r, c, dr, dc));
    path.push([ r, c ]);

    if (data[r][c] === 'E')
    {
      if (best === -1) { best = cost; }
      if (cost === best)
      {
        path.forEach(([ pr, pc ]) => bestSquares.add(`${pr},${pc}`));
        continue;
      }
      break;
    }

    const next = [
      [ cost + 1, r + dr, c + dc, dr, dc ],
      [ cost + 1000, r, c, dc, -dr ],
      [ cost + 1000, r, c, -dc, dr ]
    ];
    next.forEach(([ newcost, nr, nc, ndr, ndc ]) =>
    {
      if (data[nr][nc] === '#') { return; }
      if (seen.has(key(nr, nc, ndr, ndc))) { return; }
      queue.push(
        { cost: newcost, r: nr, c: nc, dr: ndr, dc: ndc, path: [ ...path ] });
    });
  }

  return bestSquares.size;
}

export default async function day16(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .map(v => v.split(''));

  data.rows = data.length;
  data.cols = data[0].length;

  data.forEach((row, r) => row.forEach((ch, c) =>
  {
    if (ch === 'S') { data.start = [ r, c ]; }
    else if (ch === 'E') { data.end = [ r, c ]; }
  }));

  const part1 = solve1(data);
  const expect1a = 11048;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 143564;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 64;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 593;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day16', part1, part2, duration: Date.now() - start };
}
