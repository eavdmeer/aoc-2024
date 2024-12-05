#!/usr/bin/env node
import humanizeDuration from 'humanize-duration';
import * as fs from 'fs/promises';

async function run()
{
  const buffer = await fs.readFile('times.txt');
  const [ start, t1, t2 ] = buffer.toString()
    .split('\n')
    .filter(v => /^\d+$/.test(v))
    .map(v => 1000 * Number(v));
  console.log('Part 1:', humanizeDuration(t1 - start));
  console.log('Part 2:', humanizeDuration(t2 - t1));
}

run()
  .catch(ex => console.log(ex.message));
