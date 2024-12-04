#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day04');

if (process.argv[2])
{
  day04(process.argv[2])
    .then(console.log)
    .catch(err => console.log(err.message));
}

function solve1(data)
{
  debug('data:', data);

  let total = 0;

  for (let r = 0; r < data.length; r++)
  {
    for (let c = 0; c < data[r].length; c++)
    {
      if (data[r][c] !== 'X') { continue; }

      const score = {
        up:
          data[r - 1]?.[c] === 'M' &&
          data[r - 2]?.[c] === 'A' &&
          data[r - 3]?.[c] === 'S' ? 1 : 0,
        down:
          data[r + 1]?.[c] === 'M' &&
          data[r + 2]?.[c] === 'A' &&
          data[r + 3]?.[c] === 'S' ? 1 : 0,
        left:
          data[r]?.[c - 1] === 'M' &&
          data[r]?.[c - 2] === 'A' &&
          data[r]?.[c - 3] === 'S' ? 1 : 0,
        right:
          data[r]?.[c + 1] === 'M' &&
          data[r]?.[c + 2] === 'A' &&
          data[r]?.[c + 3] === 'S' ? 1 : 0,
        diag1:
          data[r + 1]?.[c + 1] === 'M' &&
          data[r + 2]?.[c + 2] === 'A' &&
          data[r + 3]?.[c + 3] === 'S' ? 1 : 0,
        diag2:
          data[r - 1]?.[c + 1] === 'M' &&
          data[r - 2]?.[c + 2] === 'A' &&
          data[r - 3]?.[c + 3] === 'S' ? 1 : 0,
        diag3:
          data[r - 1]?.[c - 1] === 'M' &&
          data[r - 2]?.[c - 2] === 'A' &&
          data[r - 3]?.[c - 3] === 'S' ? 1 : 0,
        diag4:
          data[r + 1]?.[c - 1] === 'M' &&
          data[r + 2]?.[c - 2] === 'A' &&
          data[r + 3]?.[c - 3] === 'S' ? 1 : 0
      };
      total += Object.values(score).reduce((a, v) => a + v, 0);

    }
  }

  return total;
}

function solve2(data)
{
  debug('data:', data);

  let total = 0;

  for (let r = 0; r < data.length; r++)
  {
    for (let c = 0; c < data[r].length; c++)
    {
      if (data[r][c] !== 'A') { continue; }

      const score = {
        diag1:
          data[r - 1]?.[c - 1] === 'M' &&
          data[r + 1]?.[c + 1] === 'S' ? 1 : 0,
        diag2:
          data[r + 1]?.[c - 1] === 'M' &&
          data[r - 1]?.[c + 1] === 'S' ? 1 : 0,
        diag3:
          data[r - 1]?.[c + 1] === 'M' &&
          data[r + 1]?.[c - 1] === 'S' ? 1 : 0,
        diag4:
          data[r + 1]?.[c + 1] === 'M' &&
          data[r - 1]?.[c - 1] === 'S' ? 1 : 0
      };
      if (Object.values(score).reduce((a, v) => a + v, 0) >= 2)
      {
        total++;
      }
    }
  }

  return total;
}

export default async function day04(target)
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

  debug('data', data);

  const part1 = solve1(data);
  const expect1a = 18;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 2562;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 9;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 1902;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day04', part1, part2, duration: Date.now() - start };
}
