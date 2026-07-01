// App-facing, memoized slug index built from the static dataset.
import { getAllExercises } from './data/loader';
import { buildSlugMap } from './slug';
import type { Exercise } from './data/types';

const ALL = getAllExercises();
const ID_TO_SLUG = buildSlugMap(ALL);
const SLUG_TO_EX = new Map<string, Exercise>(
  ALL.map((e) => [ID_TO_SLUG.get(e.id)!, e] as const),
);

export function slugFor(ex: Exercise): string {
  return ID_TO_SLUG.get(ex.id)!;
}

export function exerciseBySlug(slug: string): Exercise | undefined {
  return SLUG_TO_EX.get(slug);
}

export function allSlugs(): string[] {
  return [...ID_TO_SLUG.values()];
}
