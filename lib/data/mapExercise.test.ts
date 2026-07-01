import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error - importing plain .mjs mapper (no type declarations needed)
import { mapExercise } from '../../scripts/lib/mapExercise.mjs';

const SOURCE_DOC = {
  _id: 'abc123',
  __v: 0,
  exerciseId: '0002',
  name: 'Band Side Bend',
  aliases: ['Resistance Band Side Bend', 'Band Oblique Side Bend'],
  body_part: 'waist',
  target: 'obliques',
  secondary_muscles: ['rectus abdominis', 'erector spinae'],
  equipment: 'band',
  muscle_group: 'external obliques',
  difficulty: 'beginner',
  compound: false,
  unilateral: false,
  short_description: 'A standing lateral bend using a band.',
  instructions: 'Stand upright and bend laterally.',
  steps: ['Anchor the band.', 'Stand beside it.'],
  form_cues: ['Keep chest up'],
  common_mistakes: ['Rotating the torso'],
  breathing: 'Exhale while bending.',
  // fields that MUST be stripped:
  gif_url: 'https://cdn/videos/0002.gif',
  image: 'https://cdn/images/0002.jpg',
  video_url: '',
  video_prompt: 'SUBJECT_BLOCK ...',
  thumbnail_prompt: 'a person ...',
  enrichment_version: 'v6-drive',
  priority: 50,
  // media:
  video_url_male: 'https://r2/male/band-side-bend.mp4',
  video_url_female: 'https://r2/female/band-side-bend.mp4',
  poster_url_male: 'https://r2/male/band-side-bend.jpg',
  poster_url_female: 'https://r2/female/band-side-bend.jpg',
};

test('maps source doc to camelCase public schema', () => {
  const ex = mapExercise(SOURCE_DOC);
  assert.equal(ex.id, '0002');
  assert.equal(ex.name, 'Band Side Bend');
  assert.equal(ex.bodyPart, 'waist');
  assert.deepEqual(ex.secondaryMuscles, ['rectus abdominis', 'erector spinae']);
  assert.deepEqual(ex.steps, ['Anchor the band.', 'Stand beside it.']);
  assert.equal(ex.breathing, 'Exhale while bending.');
});

test('includes both gender videos + thumbnails when present', () => {
  const ex = mapExercise(SOURCE_DOC);
  assert.equal(ex.videos.male, 'https://r2/male/band-side-bend.mp4');
  assert.equal(ex.videos.female, 'https://r2/female/band-side-bend.mp4');
  assert.equal(ex.thumbnails.male, 'https://r2/male/band-side-bend.jpg');
  assert.equal(ex.thumbnails.female, 'https://r2/female/band-side-bend.jpg');
});

test('omits a gender key when that video/poster is empty', () => {
  const ex = mapExercise({ ...SOURCE_DOC, video_url_female: '', poster_url_female: '  ' });
  assert.equal(ex.videos.female, undefined);
  assert.ok('male' in ex.videos);
  assert.equal(ex.thumbnails.female, undefined);
});

test('strips ExerciseDB + internal + mongo fields', () => {
  const ex = mapExercise(SOURCE_DOC) as Record<string, unknown>;
  for (const banned of [
    'gif_url', 'image', 'video_url', 'video_prompt', 'thumbnail_prompt',
    'enrichment_version', 'priority', '_id', '__v', 'body_part', 'secondary_muscles',
  ]) {
    assert.equal(banned in ex, false, `field ${banned} should be stripped`);
  }
});
