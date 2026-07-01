import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toSlug, fromSlug } from './slug.ts';
import type { Exercise } from './data/types.ts';

test('toSlug lowercases, hyphenates, strips punctuation', () => {
  assert.equal(toSlug('45 Degree Hyperextension', '0489'), '45-degree-hyperextension');
  assert.equal(toSlug("Farmer's Walk", '10'), 'farmers-walk');
  assert.equal(toSlug('Band Side Bend', '2'), 'band-side-bend');
});

test('toSlug falls back to id when name has no usable chars', () => {
  assert.equal(toSlug('!!!', '99'), '99');
});

test('fromSlug round-trips', () => {
  const all = [
    { id: '2', name: 'Band Side Bend' },
    { id: '1', name: 'Barbell Squat' },
  ] as Exercise[];
  assert.equal(fromSlug('barbell-squat', all)?.id, '1');
  assert.equal(fromSlug('nope', all), undefined);
});
