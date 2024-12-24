#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day24');

if (process.argv[2])
{
  day24(process.argv[2])
    .then(console.log);
}

const pad = num => String(num).padStart(2, '0');

const tobits = dec => dec.toString(2);

function intersect(set, otherSet)
{
  const result = new Set();
  otherSet.forEach(value =>
  {
    if (set.has(value)) { result.add(value); }
  });
  return result;
}

const f = {
  OR: (a, b) => a || b,
  AND: (a, b) => a && b,
  XOR: (a, b) => a !== b
};

function evaluate(a1, a2, op, logic, init)
{
  return f[op](
    init.has(a1) ? init.get(a1) : evaluate(...logic.get(a1), logic, init),
    init.has(a2) ? init.get(a2) : evaluate(...logic.get(a2), logic, init)
  );
}

function solve(input, logic)
{
  const bits = 1n + BigInt([ ...logic.keys() ]
    .filter(v => v.startsWith('z'))
    .toSorted()
    .at(-1)
    .substr(1));

  let result = 0n;
  for (let bit = 0n; bit < bits; bit++)
  {
    if (evaluate(...logic.get(`z${pad(bit)}`), logic, input))
    {
      result |= 1n << bit;
    }
  }

  return result;
}

function solve1(data)
{
  debug('data:', data);

  return solve(data.initial, data.logic);
}

function expand(wire, logic)
{
  const [ a1, a2, op ] = logic.get(wire);
  return [
    /^[xy]/.test(a1) ? a1 : expand(a1, logic),
    /^[xy]/.test(a2) ? a2 : expand(a2, logic),
    op
  ];
}

function solve2(data)
{
  debug('data:', data);

  const all = [ ...data.logic.entries() ];

  const res = new Set();
  const bad = {};

  const bits = 1n + BigInt([ ...data.logic.keys() ]
    .filter(v => v.startsWith('z'))
    .toSorted()
    .at(-1)
    .substr(1));

  for (let bit = 0; bit < bits; bit++)
  {
    console.log(JSON.stringify(expand(`z${pad(bit)}`, data.logic)));
  }

  const lastBit = `z${pad(bits - 1n)}`;

  // Outputs must be the result of an XOR.
  // Only exception is the last bit, which is the carry bit from the last two
  // bits being added. This is an OR
  bad.output = all
    .filter(([ o, [ , , op ] ]) =>
    {
      if (/^z/.test(o))
      {
        if (op === 'OR' && o === lastBit) { return false; }
        if (op !== 'XOR') { return true; }
        return false;
      }
      return false;
    })
    .map(v => v[0]);
  bad.output.forEach(v => res.add(v));
  console.log('zxx output not the result of an XOR');
  console.log(bad.output);

  // AND output not connected to an OR
  // Only exception is z01, where it can be connected to an XOR due to
  // carry bit input for z00 being 0
  bad.and = all
    .filter(([ , [ , , op ] ]) => op === 'AND')
    .map(v => v[0])
    .filter(v =>
    {
      const gotor = all.some(([ o, [ a, b, op ] ]) =>
        (op === 'OR' || op === 'XOR' && o === 'z01') &&
        (a === v || b === v));
      return ! gotor;
    });
  bad.and.forEach(v => res.add(v));
  console.log('AND output not connected to an OR');
  console.log(bad.and);

  // OR output not connected to XOR + AND
  bad.or = all
    .filter(([ o, [ , , op ] ]) => op === 'OR' && ! /^z/.test(o))
    .map(v => v[0])
    .filter(v =>
    {
      const gotand = all.some(([ , [ a, b, op ] ]) =>
        op === 'AND' && (a === v || b === v));
      const gotxor = all.some(([ , [ a, b, op ] ]) =>
        op === 'XOR' && (a === v || b === v));
      return ! gotand || !gotxor;
    })
    .filter(v => v[0] !== 'z' || data.logic.get(v)[2] !== 'XOR');
  bad.or.forEach(v => res.add(v));
  console.log('OR output not connected to XOR + AND');
  console.log(bad.or);

  // XOR output not connected to XOR + AND
  bad.xor = all
    .filter(([ o, [ , , op ] ]) => op === 'XOR' && ! /^z/.test(o))
    .map(v => v[0])
    .filter(v =>
    {
      const gotand = all.some(([ , [ a, b, op ] ]) =>
        op === 'AND' && (a === v || b === v));
      const gotxor = all.some(([ , [ a, b, op ] ]) =>
        op === 'XOR' && (a === v || b === v));
      return ! gotand || !gotxor;
    })
    .filter(v => v[0] !== 'z' || data.logic.get(v)[2] !== 'XOR');
  bad.xor.forEach(v => res.add(v));
  console.log('XOR output not connected to XOR + AND');
  console.log(bad.xor);

  return [ ...res ].sort().join(',');
}

export default async function day24(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const [ init, logic ] = buffer.toString().trim().split('\n\n');

  const data = {
    initial: init.split('\n')
      .map(v => v.split(': '))
      .reduce((a, [ n, v ]) => a.set(n, v === '1'), new Map()),
    logic: logic.split('\n')
      .map(v => v.split(/ -> | /))
      .reduce((a, [ a1, op, a2, out ]) => a.set(out, [ a1, a2, op ]),
        new Map())
  };

  const part1 = solve1(data);
  const expect1a = 2024n;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 36902370467952n;
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
  const expect2b = 'cvp,mkk,qbw,wcb,wjb,z10,z14,z34';
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day24', part1, part2, duration: Date.now() - start };
}
