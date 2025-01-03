#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day22');

if (process.argv[2])
{
  day22(process.argv[2])
    .then(console.log);
}

function next(val)
{
  const step1 = (val ^ val << 6) & 16777215;
  const step2 = (step1 ^ step1 >> 5) & 16777215;
  const result = (step2 ^ step2 << 11) & 16777215;

  return result;
}

function solve1(data)
{
  debug('data:', data);

  return data.reduce((a, num) =>
  {
    let val = num;
    for (let i = 0; i < 2000; i++) { val = next(val); }
    return a + val;
  }, 0);
}

function solve2(data)
{
  // 2nd example is slightly different
  if (data.length < 5)
  {
    data[1] = 2;
    data[2] = 3;
  }
  debug('data:', data);

  const prices = new Map();
  let bestPrice = 0;

  data.forEach(num =>
  {
    const seen = new Set();
    let val = num;
    let lastVal;
    let k = 0;

    for (let i = 0; i < 2000; i++)
    {
      val = next(val);

      // Keep last four differences in 20 bits number
      k = (k << 5 | val % 10 - lastVal + 9) & 1048575;

      lastVal = val % 10;

      if (i <= 4) { continue; }

      if (! seen.has(k))
      {
        seen.add(k);
        const newPrice = prices.has(k) ? prices.get(k) + lastVal : lastVal;
        bestPrice = Math.max(bestPrice, newPrice);
        prices.set(k, newPrice);
      }
    }
  });

  return bestPrice;
}

export default async function day22(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .map(Number);

  const part1 = solve1(data);
  const expect1a = 37327623;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 13764677935;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 23;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 1619;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day22', part1, part2, duration: Date.now() - start };
}
