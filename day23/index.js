#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day23');

if (process.argv[2])
{
  day23(process.argv[2])
    .then(console.log);
}

function pairs(seq)
{
  const res = [];

  for (let i = 0; i < seq.length - 1; i++)
  {
    for (let j = i + 1; j < seq.length; j++)
    {
      res.push([ seq[i], seq[j] ].sort());
    }
  }

  return res.sort();
}

function solve1(data)
{
  const connections = new Map();

  data.forEach(([ a, b ]) =>
  {
    if (! connections.has(a)) { connections.set(a, []); }
    connections.get(a).push(b);
    if (! connections.has(b)) { connections.set(b, []); }
    connections.get(b).push(a);
  });

  const triples = [];
  [ ...connections.entries() ].forEach(([ name, peers ]) =>
  {
    pairs(peers)
      .filter(([ a, b ]) => connections.get(a).includes(b) ||
        connections.get(b).includes(a))
      .forEach(([ a, b ]) => triples.push([ name, a, b ].sort()));
  });
  triples.sort();

  return new Set(triples
    .filter(([ a, b, c ]) => a[0] === 't' || b[0] === 't' || c[0] === 't')
    .map(v => v.join(','))).size;
}

const cache = new Map();
const key = (n, a) => `${n},${a.sort().join(',')}`;

function dfs(node, path, peers, connections)
{
  const k = key(node, path);
  if (cache.has(k))
  {
    return cache.get(k);
  }

  const con = connections.get(node);
  if (! path.every(n => con.includes(n)))
  {
    cache.set(k, path);
    return path;
  }

  const todo = peers.filter(v => ! [ ...path, node ].includes(v));
  if (todo.length === 0) { return path; }

  let bestPath;
  todo.forEach(n =>
  {
    const p = dfs(n, [ ...path, node ], peers, connections);
    if (! bestPath || p.length > bestPath.length) { bestPath = p; }
  });

  cache.set(k, bestPath);

  return bestPath;
}

function solve2(data)
{
  debug('data:', data);

  const connections = new Map();

  data.forEach(([ a, b ]) =>
  {
    if (! connections.has(a)) { connections.set(a, []); }
    connections.get(a).push(b);
    if (! connections.has(b)) { connections.set(b, []); }
    connections.get(b).push(a);
  });

  let bestPath = [];
  const checked = new Set();
  [ ...connections.entries() ].forEach(([ node, peers ]) =>
  {
    if (checked.has(node)) { return; }
    const path = dfs(node, [], peers, connections);
    path.forEach(n => checked.add(n));
    if (path.length > bestPath.length) { bestPath = path; }
  });

  return bestPath.join(',');
}

export default async function day23(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .map(v => v.split('-'));

  const part1 = solve1(data);
  const expect1a = 7;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 1156;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 'co,de,ka,ta';
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 'bx,cx,dr,dx,is,jg,km,kt,li,lt,nh,uf,um';
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day23', part1, part2, duration: Date.now() - start };
}
