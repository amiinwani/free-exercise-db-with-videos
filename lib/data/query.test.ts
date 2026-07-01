import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterExercises, searchExercises } from './query.ts';
import type { Exercise } from './types.ts';

function ex(partial: Partial<Exercise>): Exercise {
  return {
    id: '0',
    name: '',
    aliases: [],
    bodyPart: '',
    target: '',
    secondaryMuscles: [],
    equipment: '',
    muscleGroup: '',
    difficulty: '',
    compound: false,
    unilateral: false,
    shortDescription: '',
    instructions: '',
    steps: [],
    formCues: [],
    commonMistakes: [],
    breathing: '',
    videos: {},
    thumbnails: {},
    ...partial,
  };
}

const DATA: Exercise[] = [
  ex({ id: '1', name: 'Barbell Squat', bodyPart: 'upper legs', target: 'quads', equipment: 'barbell', difficulty: 'intermediate', aliases: ['back squat'] }),
  ex({ id: '2', name: 'Band Side Bend', bodyPart: 'waist', target: 'obliques', equipment: 'band', difficulty: 'beginner' }),
  ex({ id: '3', name: 'Dumbbell Curl', bodyPart: 'upper arms', target: 'biceps', equipment: 'dumbbell', difficulty: 'beginner' }),
  ex({ id: '4', name: 'Goblet Squat', bodyPart: 'upper legs', target: 'quads', equipment: 'kettlebell', difficulty: 'beginner' }),
];

test('filter by bodyPart returns only that body part', () => {
  const { count, data } = filterExercises(DATA, { bodyPart: 'upper legs' });
  assert.equal(count, 2);
  assert.deepEqual(data.map((e) => e.id).sort(), ['1', '4']);
});

test('filter is case-insensitive', () => {
  const { count } = filterExercises(DATA, { equipment: 'BAND' });
  assert.equal(count, 1);
});

test('search matches name AND alias', () => {
  assert.equal(searchExercises(DATA, 'squat').length, 2); // Barbell + Goblet
  assert.equal(searchExercises(DATA, 'back squat').length, 1); // alias only
});

test('limit/offset paginate and count reflects pre-pagination total', () => {
  const { count, data } = filterExercises(DATA, { limit: 2, offset: 1 });
  assert.equal(count, 4);
  assert.equal(data.length, 2);
});

test('unknown filter value returns empty', () => {
  const { count, data } = filterExercises(DATA, { bodyPart: 'nonexistent' });
  assert.equal(count, 0);
  assert.equal(data.length, 0);
});

test('combined filters AND together', () => {
  const { count } = filterExercises(DATA, { bodyPart: 'upper legs', difficulty: 'beginner' });
  assert.equal(count, 1); // Goblet Squat only
});
