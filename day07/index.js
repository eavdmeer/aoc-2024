#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day07');

if (process.argv[2])
{
  day07(process.argv[2])
    .then(console.log)
    .catch(err => console.log(err.message));
}

function solve1(data)
{
  debug('data:', data);

  return data.filter(line =>
  {
    const value = line[0];
    const nums = line.slice(1);

    let stack = [ nums.shift() ];

    nums.forEach(n =>
    {
      stack = stack.map(v => [ v * n, v + n ]).flat();
    });

    return stack.includes(value);
  }).reduce((a, v) => a + v[0], 0);
}

function canMake(value, terms, methods = '*+')
{
  const last = terms.at(-1);
  if (terms.length === 1)
  {
    return value === last;
  }
  if (value % last === 0)
  {
    if (canMake(value / last, terms.slice(0, -1), methods)) { return true; }
  }
  if (value > last)
  {
    if (canMake(value - last, terms.slice(0, -1), methods)) { return true; }
  }
  if (methods.includes('||') && `${value}`.endsWith(`${last}`))
  {
    const next = Number(`${value}`.replace(new RegExp(`${last}$`), ''));
    if (canMake(next, terms.slice(0, -1), methods)) { return true; }
  }
  return false;
}

function solve1a(data)
{
  debug('data:', data);

  return data.filter(line => canMake(line[0], line.slice(1)))
    .reduce((a, v) => a + v[0], 0);
}

function solve2a(data)
{
  debug('data:', data);

  return data.filter(line => canMake(line[0], line.slice(1), '*+||'))
    .reduce((a, v) => a + v[0], 0);
}

function solve2(data)
{
  debug('data:', data);

  return data.filter(line =>
  {
    const value = line[0];
    const nums = line.slice(1);

    let stack = [ nums.shift() ];

    // Calculate all but the last operation
    nums.slice(0, -1).forEach(n =>
    {
      stack = stack.map(v => [ v * n, v + n, Number(`${v}${n}`) ]).flat();
    });

    const last = nums.at(-1);

    // Last operation will be the most calculations, so benefit from early-out
    return stack.some(v => v * last === value || v + last === value ||
      Number(`${v}${last}`) === value);
  }).reduce((a, v) => a + v[0], 0);
}

export default async function day07(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v
      .split(': ')
      .map(w => w.split(' '))
      .flat()
      .map(n => Number(n)));

  const version = 2;
  const part1 = version === 1 ? solve1(data) : solve1a(data);
  const expect1a = 3749;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 4364915411363;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = version === 1 ? solve2(data) : solve2a(data);
  const expect2a = 11387;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 38322057216320;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day07', part1, part2, duration: Date.now() - start };
}
