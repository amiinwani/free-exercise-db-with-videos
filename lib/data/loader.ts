import exercisesJson from '@/data/exercises.json';
import metaJson from '@/data/meta.json';
import type { Exercise, Meta } from './types';

// Static data loaded once from the bundled JSON. No database, no I/O at request time.
const ALL: Exercise[] = exercisesJson as Exercise[];
const BY_ID = new Map<string, Exercise>(ALL.map((e) => [e.id, e]));

export function getAllExercises(): Exercise[] {
  return ALL;
}

export function getExercise(id: string): Exercise | undefined {
  return BY_ID.get(id);
}

export function getMeta(): Meta {
  return metaJson as Meta;
}

export function getFacets(): Meta['facets'] {
  return getMeta().facets;
}
