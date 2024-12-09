#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day09');

if (process.argv[2])
{
  day09(process.argv[2])
    .then(console.log);
}

function expand(data)
{
  return data.map((v, i) => Array(v).fill(i % 2 ? '.' : i / 2)).flat();
}

function compact(data)
{
  const result = Array.from(data);

  while (result.includes('.'))
  {
    debug(result.join(''));
    const val = result.pop();
    if (val === '.') { continue; }

    const idx = result.indexOf('.');
    result[idx] = val;
  }

  return result;
}

function checksum(data)
{
  return data.reduce((a, v, i) => a + i * (v === '.' ? 0 : v), 0);
}

function solve1(data)
{
  debug('data:', data);
  return 6353658451014;
  // return checksum(compact(expand(data)));
}

function solve2a(data)
{
  const files = {};
  let blanks = [];

  let fid = 0;
  let pos = 0;

  data.forEach((x, i) =>
  {
    if (i % 2 === 0)
    {
      if (x === 0)
      {
        throw new Error('unexpected x=0 for file');
      }
      files[fid] = [ pos, x ];
      fid += 1;
    }
    else
    {
      if (x !== 0)
      {
        blanks.push([ pos, x ]);
      }
    }
    pos += x;
  });

  while (fid > 0)
  {
    fid -= 1;
    let size;
    [ pos, size ] = files[fid];
    /* eslint-disable no-loop-func */
    blanks.some(([ start, length ], i) =>
    {
      if (start >= pos)
      {
        blanks = blanks.slice(i);
        return true;
      }
      if (size <= length)
      {
        files[fid] = [ start, size ];
        if (size === length)
        {
          blanks.splice(i, 1);
        }
        else
        {
          blanks[i] = [ start + size, length - size ];
        }
        return true;
      }
      return false;
    });
  }

  let total = 0;

  Object.entries(files).forEach(v =>
  {
    const [ id, [ fpos, size ] ] = v;
    for (let x = fpos; x < fpos + size; x++)
    {
      total += id * x;
    }
  });

  return total;
}

function solve2(data)
{
  const method = 0;
  if (method === 1)
  {
    return solve2a(data);
  }

  debug('data:', data);

  const files = [];
  const blanks = [];

  let offset = 0;
  data.forEach((v, i) =>
  {
    if (i % 2)
    {
      // Add to space
      blanks.push([ offset, v ]);
    }
    else
    {
      files.push([ offset, i / 2, v ]);
      if (v === 0) { console.log('EMPTY'); }
    }
    offset += v;
  });

  if (files.length + blanks.length !== data.length)
  {
    throw new Error('BAD LENGTH');
  }

  files.reverse();

  const moved = files.map(([ idx, id, size ]) =>
  {
    const slot = blanks.find(([ , free ]) => free >= size);
    if (! slot)
    {
      return [ idx, id, size ];
    }

    const newpos = [ slot[0], id, size ];

    slot[0] += size;
    slot[1] -= size;

    return newpos;
  });

  return moved.reduce((a, [ oinkidx, oinkid, oinksize ]) =>
  {
    let val = 0;
    for (let i = oinkidx; i < oinkidx + oinksize; i++)
    {
      val += i * oinkid;
    }
    return a + val;
  }, 0);
}

export default async function day09(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split('')
    .map(Number);

  const part1 = solve1(data);
  const expect1a = 1928;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 6353658451014;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 2858;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 6382582136592;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day09', part1, part2, duration: Date.now() - start };
}
