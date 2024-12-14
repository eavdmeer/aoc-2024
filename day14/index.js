#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day14');

if (process.argv[2])
{
  day14(process.argv[2])
    .then(console.log);
}

// JavaScript % operator is kinda weird. -2 % 10 => -2
const posmod = (v, n) => (v % n + n) % n;

function modValue(ax, ay, bx, by, t, xmod, ymod)
{
  return [
    posmod(ax + bx * t, xmod),
    posmod(ay + by * t, ymod)
  ];
}

function danger(points, w, h)
{
  const middle = { x: Math.floor(w / 2), y: Math.floor(h / 2) };

  return [
    points.filter(([ x, y ]) => x < middle.x && y < middle.y).length,
    points.filter(([ x, y ]) => x > middle.x && y < middle.y).length,
    points.filter(([ x, y ]) => x < middle.x && y > middle.y).length,
    points.filter(([ x, y ]) => x > middle.x && y > middle.y).length
  ].reduce((a, v) => a * v, 1);

}

function solve1(data, w, h)
{
  debug('data:', data);

  return danger(data
    .map(([ ax, ay, bx, by ]) => modValue(ax, ay, bx, by, 100, w, h)), w, h);
}

function solve2(data, w, h)
{
  debug('data:', data);

  const minimum = { value: Infinity, time: Infinity };

  for (let t = 1; t < 10000; t++)
  {
    const d = danger(
      data.map(([ ax, ay, bx, by ]) => modValue(ax, ay, bx, by, t, w, h)),
      w, h);
    if (d < minimum.value)
    {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`danger minimum: ${d} at ${t}`);
      minimum.value = d;
      minimum.time = t;
    }
  }

  return minimum.time;
}

export default async function day14(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .map(v => [ ...v.matchAll(/-?\d+/g) ].map(Number));

  const w = target.includes('example') ? 11 : 101;
  const h = target.includes('example') ? 7 : 103;

  const part1 = solve1(data, w, h);
  const expect1a = 12;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 211773366;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data, w, h);
  const expect2a = 0;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 7344;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day14', part1, part2, duration: Date.now() - start };
}
