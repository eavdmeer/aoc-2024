#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day17');

if (process.argv[2])
{
  day17(process.argv[2])
    .then(console.log);
}

function combo(val, a, b, c)
{
  switch (val)
  {
    case 1:
    case 2:
    case 3: return val;
    case 4: return a;
    case 5: return b;
    case 6: return c;
    default: throw new Error(`Invalid combo: ${val}`);
  }
}

function run(av, bv, cv, program)
{
  let [ a, b, c ] = [ av, bv, cv ];
  let pc = 0;
  const output = [];

  while (pc < program.length)
  {
    const opcode = program[pc];
    const operand = program[pc + 1];
    pc += 2;

    switch (opcode)
    {
      case 0:
        // ADV: a / 2 ** combo(operand) => a
        a >>= combo(operand, a, b, c);
        break;
      case 1:
        // BXL: b xor operand => b
        b ^= operand;
        break;
      case 2:
        // BST: combo(operand) % 8 => B
        b = combo(operand, a, b, c) % 8;
        break;
      case 3:
        // JNZ: set PC to operand if A is not 0
        pc = a === 0 ? pc + 2 : operand;
        break;
      case 4:
        // BXC: b xor c => b
        b ^= c;
        break;
      case 5:
        // OUT: combo(operand) % 8 => output
        output.push(combo(operand, a, b, c) % 8);
        break;
      case 6:
        // BDV: a / 2 ** combo(operand) => b
        b = a >> combo(operand, a, b, c);
        break;
      case 7:
        // CDV: a / 2 ** combo(operand) => c
        c = a >> combo(operand, a, b, c);
        break;
      default:
        throw new Error(`Invalid opcode: ${opcode}!`);
    }

    if (a < 0) { throw new Error('negative A!'); }
    if (b < 0) { throw new Error('negative B!'); }
    if (c < 0) { throw new Error('negative C!'); }
  }

  return output.join(',');
}

function solve1(data)
{
  debug('data:', data);

  const [ a, b, c ] = data.registers;

  return run(a, b, c, data.program);
}

function find(prg, ans = 0n)
{
  if (prg.length === 0) { return ans; }

  for (let n = 0n; n < 8n; n++)
  {
    const a = ans << 3n | n;
    let b = a % 8n;
    let c = 0n;
    b ^= 1n;
    c = a >> b;
    b ^= 4n;
    b ^= c;
    /* eslint-disable-next-line eqeqeq */
    if (b % 8n == prg.at(-1))
    {
      const sub = find(prg.slice(0, -1), ans << 3n | n);
      if (sub === undefined) { continue; }

      return sub;
    }
  }

  return undefined;
}

function solve2(data)
{
  debug('data:', data);

  const queue = [];

  const v1 = find(data.program);

  const p2 = av =>
  {
    const output = [];
    let a = av;
    if (a < 0n) { throw new Error('negative A!'); }
    let b = 0n;
    let c = 0n;
    /* eslint-disable operator-assignment, line-comment-position */
    /* eslint-disable no-inline-comments */
    while (a)
    {
      b = a % 8n; // BST A
      b = b ^ 1n; // BXL 1
      c = a >> b; // CDV B
      a = a >> 3n; // ADV 3
      b = b ^ 4n; // BXL 4
      b = b ^ c; // BXC A
      output.push(b % 8n);
    }
    return output.join(',');
  };

  queue.push([ 0n, 0 ]);

  while (queue.length)
  {
    const [ base, idx ] = queue.shift();

    const want = data.program.slice(-(idx + 1)).join(',');
    for (let a = base; a < base + 8n; a++)
    {
      const ar = p2(a);
      if (ar === want)
      {
        if (idx + 1 === data.program.length)
        {
          if (a !== v1) { console.log('solutions differ!'); }
          return a;
        }
        queue.push([ a << 3n, idx + 1 ]);
      }
    }
  }

  return 0;
}

export default async function day17(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const [ regs, prg ] = buffer
    .toString()
    .trim()
    .split('\n\n');

  const data = {
    registers: [ ...regs.matchAll(/\d+/g) ].map(Number),
    program: [ ...prg.matchAll(/\d+/g) ].map(Number)
  };

  const part1 = solve1(data);
  const expect1a = '4,6,3,5,6,3,5,2,1,0';
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = '6,1,6,4,2,4,7,3,5';
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
  const expect2b = 202975183645226n;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day17', part1, part2, duration: Date.now() - start };
}
