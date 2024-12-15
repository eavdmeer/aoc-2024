#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day15');

if (process.argv[2])
{
  day15(process.argv[2])
    .then(console.log);
}

function next(robot, step)
{
  switch (step)
  {
    case '^':
      return { r: robot.r - 1, c: robot.c };
    case '>':
      return { r: robot.r, c: robot.c + 1 };
    case 'v':
      return { r: robot.r + 1, c: robot.c };
    case '<':
      return { r: robot.r, c: robot.c - 1 };
    default:
      throw new Error(`unsupported step: ${step}!`);
  }
}

function score(grid)
{
  let total = 0;

  grid.forEach((row, r) => row.forEach((ch, c) =>
  {
    if (ch === 'O')
    {
      total += 100 * r + c;
    }
  }));

  return total;
}

const charAt = (g, n) => g[n.r]?.at(n.c);
const show = g => debug(g.map(v => v.join('')).join('\n'));

function runstep(grid, robot, step, i)
{
  if (step === '\n') { return; }
  debug('step', i + 1, step);
  const nxt = next(robot, step);

  let tgt = nxt;
  const move = [];
  while (charAt(grid, tgt) !== '.' && charAt(grid, tgt) !== '#')
  {
    move.push({ ...tgt });
    tgt = next(tgt, step);
  }
  if (charAt(grid, tgt) === '#')
  {
    return;
  }

  // Move the boxes
  move.forEach(pos =>
  {
    const nxtnxt = next(pos, step);
    grid[nxtnxt.r][nxtnxt.c] = 'O';
  });

  // Move the robot
  grid[robot.r][robot.c] = '.';
  grid[nxt.r][nxt.c] = '@';
  robot.r = nxt.r;
  robot.c = nxt.c;
}

function solve1(data)
{
  debug('data:', data);

  // Create copies of the things we will modify
  const grid = [ ...data.grid ];
  const robot = { r: data.robot[0], c: data.robot[1] };

  show(grid);

  data.steps.forEach((step, i) =>
  {
    runstep(grid, robot, step, i);
    show(grid);
  });

  return score(grid);
}

function solve2(data)
{
  // debug('data:', data);
  return 0;
}

export default async function day15(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const content = buffer
    .toString()
    .trim()
    .split('\n\n');

  const data = {
    grid: content[0].split('\n').map(v => v.split('')),
    steps: content[1].replace(/n/g, '').split('')
  };
  data.grid.rows = data.grid.length;
  data.grid.cols = data.grid[0].length;
  for (let r = 0; r < data.grid.rows; r++)
  {
    for (let c = 0; c < data.grid.cols; c++)
    {
      if (data.grid[r][c] === '@')
      {
        data.robot = [ r, c ];
        r = data.grid.rows;
        break;
      }
    }
  }

  const part1 = solve1(data);
  const expect1a = 10092;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 1509074;
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
  const expect2b = 0;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day15', part1, part2, duration: Date.now() - start };
}
