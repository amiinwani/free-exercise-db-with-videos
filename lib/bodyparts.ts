import { getAllExercises } from './data/loader';
import type { Exercise } from './data/types';

export function bodyPartSlug(bodyPart: string): string {
  return bodyPart.toLowerCase().replace(/\s+/g, '-');
}

const ALL = getAllExercises();

// Ordered list of distinct body parts with their exercises + slug.
export interface BodyPartGroup {
  bodyPart: string;
  slug: string;
  exercises: Exercise[];
}

const GROUPS: BodyPartGroup[] = (() => {
  const map = new Map<string, Exercise[]>();
  for (const ex of ALL) (map.get(ex.bodyPart) ?? map.set(ex.bodyPart, []).get(ex.bodyPart)!).push(ex);
  return [...map.entries()]
    .map(([bodyPart, exercises]) => ({
      bodyPart,
      slug: bodyPartSlug(bodyPart),
      exercises: exercises.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => b.exercises.length - a.exercises.length);
})();

const BY_SLUG = new Map(GROUPS.map((g) => [g.slug, g]));

export function bodyPartGroups(): BodyPartGroup[] {
  return GROUPS;
}

export function bodyPartBySlug(slug: string): BodyPartGroup | undefined {
  return BY_SLUG.get(slug);
}
