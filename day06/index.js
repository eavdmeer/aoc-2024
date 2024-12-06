#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day06');

if (process.argv[2])
{
  day06(process.argv[2])
    .then(console.log)
    .catch(err => console.log(err.message));
}

function printResult(result)
{
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(`${result}`);
}

const key = (r, c, dir) => `${r},${c}:${dir}`;

function checkPath(data, start)
{
  let { r, c, dir } = start;
  const seen = new Set();

  while (r >= 0 && r < data.length && c >= 0 && c < data[0].length)
  {
    seen.add(key(r, c, dir));

    let next;

    switch (dir)
    {
      case '^': next = data.at(r - 1)?.at(c); break;
      case '>': next = data.at(r)?.at(c + 1); break;
      case 'v': next = data.at(r + 1)?.at(c); break;
      case '<': next = data.at(r)?.at(c - 1); break;
      default: throw new Error(`Unknown direction: ${dir}`);
    }

    if (next === undefined) { break; }

    if (next === '#')
    {
      switch (`${dir}${next}`)
      {
        case '^#': dir = '>'; break;
        case '>#': dir = 'v'; break;
        case 'v#': dir = '<'; break;
        case '<#': dir = '^'; break;
        default: break;
      }
    }
    else
    {
      switch (dir)
      {
        case '^': r--; break;
        case '>': c++; break;
        case 'v': r++; break;
        case '<': c--; break;
        default: throw new Error(`Unknown direction: ${dir}`);
      }
    }

    if (seen.has(key(r, c, dir)))
    {
      throw new Error(`already visited: ${key}`);
    }

    seen.add(key(r, c, dir));
  }

  const pos = new Set();
  seen.forEach(v => pos.add(v.replace(/:./, '')));

  return pos;
}

function getStart(data, dir = '^')
{
  const start = { dir };

  let done = false;
  for (let cr = 0; cr < data.length && ! done; cr++)
  {
    for (let cc = 0; cc < data[cr].length; cc++)
    {
      if (data[cr][cc] === start.dir)
      {
        start.r = cr;
        start.c = cc;
        done = true;
        break;
      }
    }
  }

  return start;
}

function solve1(data)
{
  debug('data:', data);

  const start = getStart(data, '^');

  return checkPath(data, start).size;
}

function solve2(data)
{
  debug('data:', data);

  const start = getStart(data, '^');

  let loops = 0;

  const visited = checkPath(data, start);

  visited.forEach(v =>
  {
    const [ r, c ] = v.split(',');
    if (data[r][c] !== '.') { return; }

    data[r][c] = '#';

    try
    {
      checkPath(data, start);
    }
    catch (err)
    {
      if (/already visited/.test(err.message))
      {
        loops++;
        printResult(loops);
      }
    }

    data[r][c] = '.';
  });

  printResult('');

  return loops;
}

export default async function day06(target)
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

  const part1 = solve1(data);
  const expect1a = 41;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 5199;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 6;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 1915;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day06', part1, part2, duration: Date.now() - start };
}
