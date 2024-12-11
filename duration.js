#!/usr/bin/env node
import humanizeDuration from 'humanize-duration';
import * as fs from 'fs/promises';

async function run()
{
  const buffer = await fs.readFile('times.txt');
  const times = buffer.toString()
    .split('\n')
    .filter(v => /^\d+$/.test(v))
    .map(v => 1000 * Number(v));
  for (let i = 1; i < times.length; i++)
  {
    console.log('Time', i, ':', humanizeDuration(times[i] - times[i - 1]));
  }
}

run()
  .catch(ex => console.log(ex.message));
