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
    case 0n:
    case 1n:
    case 2n:
    case 3n: return val;
    case 4n: return a;
    case 5n: return b;
    case 6n: return c;
    default: throw new Error(`Invalid combo: ${val}`);
  }
}

function run(av, bv, cv, program)
{
  let [ a, b, c ] = [ BigInt(av), BigInt(bv), BigInt(cv) ];
  let pc = 0;
  const output = [];

  while (pc < program.length)
  {
    const opcode = program[pc];
    const operand = BigInt(program[pc + 1]);
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
        b = combo(operand, a, b, c) % 8n;
        break;
      case 3:
        // JNZ: set PC to operand if A is not 0
        pc = a === 0n ? pc + 2 : Number(operand);
        break;
      case 4:
        // BXC: b xor c => b
        b ^= c;
        break;
      case 5:
        // OUT: combo(operand) % 8 => output
        output.push(combo(operand, a, b, c) % 8n);
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

    if (a < 0n) { throw new Error('negative A!'); }
    if (b < 0n) { throw new Error('negative B!'); }
    if (c < 0n) { throw new Error('negative C!'); }
  }

  return output.join(',');
}

function solve1(data)
{
  debug('data:', data);

  const [ a, b, c ] = data.registers;

  return run(a, b, c, data.program);
}

function solve2(data)
{
  debug('data:', data);

  const queue = [ [ 0n, 0 ] ];

  while (queue.length)
  {
    const [ base, idx ] = queue.shift();

    const want = data.program.slice(-(idx + 1)).join(',');
    for (let a = base; a < base + 8n; a++)
    {
      const ar = run(a, 0, 0, data.program);
      if (ar === want)
      {
        if (idx + 1 === data.program.length) { return a; }
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
