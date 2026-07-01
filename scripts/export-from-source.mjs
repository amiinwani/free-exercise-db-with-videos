#!/usr/bin/env node
/**
 * INTERNAL generator (not shipped as a runtime dependency).
 *
 * Connects to the source Mongo `exercises` collection, selects the
 * video-complete exercises, maps them to the public camelCase schema, and
 * writes the static data files that the API + site read at runtime:
 *
 *   data/exercises.json            full array
 *   data/exercises/<id>.json       one file per exercise
 *   data/by-bodypart/<part>.json   pre-split slices
 *   data/meta.json                 counts, facets, generatedAt, license
 *
 * Requires MONGODB_URI (read from the source backend/.env if present, or the
 * environment). Credentials are NEVER written into shipped output.
 */
import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mapExercise } from './lib/mapExercise.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data');

// Resolve MONGODB_URI: env first, else parse the source backend/.env.
function resolveMongoUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  const envPath = path.resolve(ROOT, '..', 'backend', '.env');
  if (fs.existsSync(envPath)) {
    const line = fs
      .readFileSync(envPath, 'utf8')
      .split('\n')
      .find((l) => l.startsWith('MONGODB_URI='));
    if (line) return line.slice('MONGODB_URI='.length).trim();
  }
  throw new Error('MONGODB_URI not set and not found in ../backend/.env');
}

function writeJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n');
}

async function main() {
  const uri = resolveMongoUri();
  const client = new MongoClient(uri);
  await client.connect();
  const col = client.db().collection('exercises');

  const query = {
    $or: [{ video_url_male: { $gt: '' } }, { video_url_female: { $gt: '' } }],
  };
  const docs = await col.find(query).toArray();
  await client.close();

  const exercises = docs
    .map(mapExercise)
    .filter((e) => e.id && e.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  // Clean + rewrite the data dir from scratch (idempotent regeneration).
  fs.rmSync(DATA, { recursive: true, force: true });
  fs.mkdirSync(DATA, { recursive: true });

  writeJson(path.join(DATA, 'exercises.json'), exercises);
  for (const ex of exercises) {
    writeJson(path.join(DATA, 'exercises', `${ex.id}.json`), ex);
  }

  // by-bodypart slices
  const byPart = {};
  for (const ex of exercises) (byPart[ex.bodyPart] ||= []).push(ex);
  for (const [part, list] of Object.entries(byPart)) {
    writeJson(path.join(DATA, 'by-bodypart', `${part.replace(/\s+/g, '-')}.json`), list);
  }

  const uniq = (key) => [...new Set(exercises.map((e) => e[key]).filter(Boolean))].sort();
  const maleVideos = exercises.filter((e) => e.videos.male).length;
  const femaleVideos = exercises.filter((e) => e.videos.female).length;

  const meta = {
    name: 'free-exercise-db-with-videos',
    license: 'MIT',
    generatedAt: new Date().toISOString(),
    counts: {
      exercises: exercises.length,
      videos: maleVideos + femaleVideos,
      maleVideos,
      femaleVideos,
    },
    facets: {
      bodyParts: uniq('bodyPart'),
      equipment: uniq('equipment'),
      targets: uniq('target'),
      difficulties: uniq('difficulty'),
    },
  };
  writeJson(path.join(DATA, 'meta.json'), meta);

  console.log(`✓ exercises: ${exercises.length}`);
  console.log(`✓ videos:    ${maleVideos + femaleVideos} (male ${maleVideos} / female ${femaleVideos})`);
  console.log(`✓ bodyParts: ${meta.facets.bodyParts.length}, equipment: ${meta.facets.equipment.length}`);

  if (exercises.length !== 317) {
    console.warn(`⚠ expected 317 exercises, got ${exercises.length} — verify source data.`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
