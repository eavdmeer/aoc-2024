#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day19');

if (process.argv[2])
{
  day19(process.argv[2])
    .then(console.log);
}

function solve1(data)
{
  debug('data:', data);

  return data.designs.filter(design =>
  {
    const queue = [ design ];
    const seen = new Set();
    while (queue.length)
    {
      const search = queue.shift();
      if (search.length === 0) { return true; }

      if (seen.has(search)) { continue; }
      seen.add(search);

      data.towels
        .filter(t => search.startsWith(t))
        .forEach(t => queue.push(search.substr(t.length)));
    }

    return false;
  }).length;
}

const cache = new Map();

function count(design, towels)
{
  if (design === '') { return 1; }

  if (cache.has(design)) { return cache.get(design); }

  const fit = towels.filter(t => design.startsWith(t));
  const score = ! fit.length ? 0 :
    fit.map(t => count(design.substr(t.length), towels))
      .reduce((a, v) => a + v, 0);

  cache.set(design, score);

  return score;
}

function solve2(data)
{
  debug('data:', data);

  return data.designs.reduce((a, v) => a + count(v, data.towels), 0);
}

export default async function day19(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const [ towels, designs ] = buffer.toString().split('\n\n');

  const data = {
    towels: towels.split(/, /),
    designs: designs.trim().split('\n')
  };

  const part1 = solve1(data);
  const expect1a = 6;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 276;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 16;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 681226908011510;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day19', part1, part2, duration: Date.now() - start };
}
