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

function dfs(node, path, conn, groups)
{
  const con = conn.get(node);
  if (! path.every(n => con.includes(n))) { return; }

  const npath = [ ...path, node ];
  const k = npath.toSorted().join(',');

  if (groups.has(k)) { return; }
  groups.add(k);

  con
    .filter(n => ! npath.includes(n))
    .forEach(n => dfs(n, npath, conn, groups));
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

  const groups = new Set();
  [ ...connections.keys() ].forEach(n => dfs(n, [], connections, groups));

  return [ ...groups ]
    .sort((a, b) => b.length - a.length)
    .at(0)
    .split(',')
    .sort()
    .join(',');
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
