#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day15');

if (process.argv[2])
{
  day15(process.argv[2])
    .then(console.log);
}

function score(grid)
{
  let total = 0;

  grid.forEach((row, r) => row.forEach((ch, c) =>
  {
    if (ch === 'O' || ch === '[')
    {
      total += 100 * r + c;
    }
  }));

  return total;
}

function solve1(data)
{
  debug('data:', data);

  // Create copies of the things we will modify
  const grid = JSON.parse(JSON.stringify(data.grid));
  let [ r, c ] = data.robot;

  data.steps.forEach(step =>
  {
    if (step === '\n') { return; }

    /* eslint-disable quote-props */
    const dr = { '^': -1, 'v': 1 }[step] ?? 0;
    const dc = { '<': -1, '>': 1 }[step] ?? 0;
    /* eslint-enable quote-props */

    let nr = r + dr;
    let nc = c + dc;
    const move = [];
    while (grid[nr][nc] !== '.' && grid[nr][nc] !== '#')
    {
      move.push([ nr, nc ]);
      nr += dr;
      nc += dc;
    }
    if (grid[nr][nc] === '#') { return; }

    // Move the boxes (effectively only the last one)
    move.slice(-1).forEach(([ cr, cc ]) => grid[cr + dr][cc + dc] = 'O');

    // Move the robot
    grid[r][c] = '.';
    r += dr;
    c += dc;
    grid[r][c] = '@';
  });

  return score(grid);
}

function solve2(data)
{
  debug('data:', data);

  // Create the stretched-out grid
  const grid = data.grid
    .map(row => row.map(v =>
      v === '@' ? [ '@', '.' ] :
        v === 'O' ? [ '[', ']' ] :
          [ v, v ]).flat());

  // Correct robot position
  let [ r, c ] = data.robot;
  c *= 2;

  data.steps.forEach(step =>
  {
    if (step === '\n') { return; }

    /* eslint-disable quote-props */
    const dr = { '^': -1, 'v': 1 }[step] ?? 0;
    const dc = { '<': -1, '>': 1 }[step] ?? 0;
    /* eslint-enable quote-props */

    const seen = new Set();
    const move = [];
    const queue = [ [ r + dr, c + dc ] ];
    while (queue.length)
    {
      const [ nr, nc ] = queue.shift();

      if (seen.has(`${nr},${nc}`)) { continue; }

      debug('look at:', 1 + nr, 1 + nc, queue.length);
      seen.add(`${nr},${nc}`);

      if (grid[nr][nc] === '.') { continue; }
      if (grid[nr][nc] === '#') { return; }

      move.push([ nr, nc, grid[nr][nc] ]);
      queue.push([ nr + dr, nc + dc ]);

      if (dr !== 0)
      {
        queue.push(grid[nr][nc] === '[' ? [ nr, nc + 1 ] : [ nr, nc - 1 ]);
      }
    }

    // Move the boxes in reverse order
    move.reverse();
    move.forEach(([ cr, cc, ch ]) =>
    {
      grid[cr][cc] = '.';
      grid[cr + dr][cc + dc] = ch;
    });

    // Move the robot
    grid[r][c] = '.';
    r += dr;
    c += dc;
    grid[r][c] = '@';
  });

  return score(grid);
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
  const expect2a = 9021;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 1521453;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day15', part1, part2, duration: Date.now() - start };
}
