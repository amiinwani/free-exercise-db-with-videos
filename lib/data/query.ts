import type { Exercise, ExerciseFilter } from './types';

const lc = (s: string) => s.toLowerCase().trim();

/** Full-text-ish match across name, aliases, target, muscle group, body part, equipment. */
export function matchesSearch(ex: Exercise, q: string): boolean {
  const needle = lc(q);
  if (!needle) return true;
  const haystack = [
    ex.name,
    ex.target,
    ex.muscleGroup,
    ex.bodyPart,
    ex.equipment,
    ...ex.aliases,
    ...ex.secondaryMuscles,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}

export function searchExercises(all: Exercise[], q: string): Exercise[] {
  return all.filter((e) => matchesSearch(e, q));
}

export interface FilterResult {
  count: number; // total matches before pagination
  data: Exercise[]; // the paginated slice
}

export function filterExercises(all: Exercise[], f: ExerciseFilter = {}): FilterResult {
  let out = all;

  if (f.bodyPart) out = out.filter((e) => lc(e.bodyPart) === lc(f.bodyPart!));
  if (f.equipment) out = out.filter((e) => lc(e.equipment) === lc(f.equipment!));
  if (f.target) out = out.filter((e) => lc(e.target) === lc(f.target!));
  if (f.difficulty) out = out.filter((e) => lc(e.difficulty) === lc(f.difficulty!));
  if (f.search) out = out.filter((e) => matchesSearch(e, f.search!));

  const count = out.length;

  const offset = Math.max(0, f.offset ?? 0);
  const limit = f.limit != null ? Math.max(0, f.limit) : undefined;
  const data = limit != null ? out.slice(offset, offset + limit) : out.slice(offset);

  return { count, data };
}
