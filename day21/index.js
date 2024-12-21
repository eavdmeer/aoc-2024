#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day21');

if (process.argv[2])
{
  day21(process.argv[2])
    .then(console.log);
}

const cartesian = (...a) => a.reduce((b, c) =>
  b.flatMap(d => c.map(e => [ ...d, e ])), [ [] ]);

function pairs(start, seq)
{
  let pos = start;

  return seq.split('').map(ch =>
  {
    const v = `${pos}:${ch}`;
    pos = ch;
    return v;
  });
}

function findMoves(keys)
{
  const dirs = [ 'v', '^', '>', '<' ];
  const moves = new Map();

  const map = {};
  keys.forEach((row, r) => row.forEach((k, c) =>
  {
    if (k !== 'X') { map[k] = [ r, c ]; }
  }));

  const outOfBounds = (r, c) =>
    r < 0 || r >= keys.length ||
    c < 0 || c >= keys[0].length ||
    keys[r][c] === 'X';

  Object.entries(map).forEach(([ key, pos ]) =>
  {
    Object.entries(map).forEach(([ nkey, npos ]) =>
    {
      const queue = [ [ pos, '' ] ];
      const paths = [];
      let best = Infinity;
      while (queue.length)
      {
        const [ [ r, c ], seq ] = queue.shift();

        if (seq.length > best) { break; }

        if (r === npos[0] && c === npos[1])
        {
          paths.push(`${seq}A`);
          best = seq.length;
          continue;
        }

        const next = [ [ r + 1, c ], [ r - 1, c ],
          [ r, c + 1 ], [ r, c - 1 ] ];
        next.forEach(([ nr, nc ], i) =>
        {
          // Skip empty key and out of bounds
          if (outOfBounds(r, c)) { return; }
          queue.push([ [ nr, nc ], `${seq}${dirs[i]}` ]);
        });
      }
      moves.set(`${key}:${nkey}`, paths);
    });
  });

  return moves;
}

const numKeyMoves = findMoves([
  [ '7', '8', '9' ],
  [ '4', '5', '6' ],
  [ '1', '2', '3' ],
  [ 'X', '0', 'A' ]
]);

const keyMoves = findMoves([
  [ 'X', '^', 'A' ],
  [ '<', 'v', '>' ]
]);

function solve(code, moves)
{
  const seq = pairs('A', code).map(p => moves.get(p));

  return cartesian(...seq).map(v => v.join(''));
}

const key = (k, d) => `${k}:${d}`;

const cache = new Map();

function length(pair, depth = 2)
{
  const k = key(pair, depth);

  if (cache.has(k)) { return cache.get(k); }

  const moves = keyMoves.get(pair);

  let result;
  if (depth === 1)
  {
    result = moves[0].length;
  }
  else
  {
    result = Infinity;
    moves.forEach(seq =>
    {
      const len = pairs('A', seq)
        .reduce((a, s) => a + length(s, depth - 1), 0);
      result = Math.min(result, len);
    });
  }

  cache.set(k, result);

  return result;
}

function solve1(data)
{
  debug('data:', data);

  const method = 'fast';

  return data.reduce((total, code) =>
  {
    let moves = solve(code, numKeyMoves);

    if (method === 'fast')
    {
      const best = Math.min(...moves.map(seq =>
        pairs('A', seq).reduce((a, p) => a + length(p, 2), 0)));

      return total + Number(code.replace(/[^0-9]/g, '')) * best;
    }

    for (let i = 0; i < 2; i++)
    {
      moves = moves.map(v => solve(v, keyMoves)).flat();

      if (moves.length > 1)
      {
        moves.sort((a, b) => a.length - b.length);
        const optimal = moves[0].length;
        moves = moves.filter(v => v.length === optimal);
      }
    }

    return total + Number(code.replace(/[^0-9]/g, '')) * moves[0].length;
  }, 0);
}

function solve2(data)
{
  debug('data:', data);

  return data.reduce((total, code) =>
  {
    const moves = solve(code, numKeyMoves);
    let best = Infinity;

    moves.forEach(seq =>
    {
      const len = pairs('A', seq).reduce((a, p) => a + length(p, 25), 0);
      best = Math.min(best, len);
    });

    return total + Number(code.replace(/[^0-9]/g, '')) * best;
  }, 0);
}

export default async function day21(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v);

  const part1 = solve1(data);
  const expect1a = 126384;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 176870;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 0;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 223902935165512;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day21', part1, part2, duration: Date.now() - start };
}
