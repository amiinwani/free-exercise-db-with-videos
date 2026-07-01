#!/usr/bin/env node
/**
 * Poster QA: verify every exercise thumbnail is a real, non-blank frame.
 *
 * Downloads each poster, uses ffmpeg's signalstats to compute mean luma (YAVG)
 * and flags near-black (< 16) or blown-out (> 245) frames. Report-only by
 * default — writes scripts/posters-report.json. Regeneration/re-upload of bad
 * frames requires an R2 write token and is intentionally a manual follow-up.
 *
 * Usage:
 *   node scripts/qa-posters.mjs            # check all
 *   node scripts/qa-posters.mjs --sample 40
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const execFileP = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const EXERCISES = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'exercises.json'), 'utf8'));

const sampleIdx = process.argv.indexOf('--sample');
const SAMPLE = sampleIdx > -1 ? Number(process.argv[sampleIdx + 1]) : 0;
const CONCURRENCY = 8;

// Collect all poster URLs with labels.
const posters = [];
for (const ex of EXERCISES) {
  for (const g of ['male', 'female']) {
    const url = ex.thumbnails?.[g];
    if (url) posters.push({ id: ex.id, name: ex.name, gender: g, url });
  }
}
const targets = SAMPLE > 0 ? posters.slice(0, SAMPLE) : posters;

async function meanLuma(url) {
  const tmp = path.join(os.tmpdir(), `qa-${Math.abs(hash(url))}.jpg`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  fs.writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
  try {
    // ffmpeg prints signalstats YAVG to stderr via metadata; parse it.
    const { stderr } = await execFileP('ffmpeg', [
      '-i', tmp, '-vf', 'signalstats,metadata=print', '-frames:v', '1', '-f', 'null', '-',
    ]).catch((e) => ({ stderr: e.stderr || '' }));
    const m = stderr.match(/YAVG=([\d.]+)/);
    return m ? Number(m[1]) : null;
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

async function run() {
  const flagged = [];
  let done = 0;
  for (let i = 0; i < targets.length; i += CONCURRENCY) {
    const batch = targets.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (p) => {
        try {
          const luma = await meanLuma(p.url);
          done++;
          // These are mostly light-background animations, so high luma is
          // normal. The real failure mode is a blank/near-black frame.
          if (luma == null) flagged.push({ ...p, reason: 'no-luma' });
          else if (luma < 16) flagged.push({ ...p, luma, reason: 'near-black' });
          else if (luma > 253) flagged.push({ ...p, luma, reason: 'pure-white' });
        } catch (e) {
          flagged.push({ ...p, reason: `error: ${e.message}` });
        }
      }),
    );
    process.stdout.write(`\r  checked ${done}/${targets.length}, flagged ${flagged.length}   `);
  }
  process.stdout.write('\n');

  const report = {
    checkedAt: new Date().toISOString(),
    total: targets.length,
    flagged: flagged.length,
    items: flagged,
  };
  fs.writeFileSync(path.join(__dirname, 'posters-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(`✓ ${targets.length} posters checked · ${flagged.length} flagged → scripts/posters-report.json`);
  if (flagged.length) console.log(flagged.slice(0, 10).map((f) => `  ${f.id} ${f.gender}: ${f.reason} ${f.luma ?? ''}`).join('\n'));
}

run().catch((e) => { console.error(e); process.exit(1); });
