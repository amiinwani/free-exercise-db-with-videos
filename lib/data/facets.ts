import type { Exercise } from './types';

export interface Facet {
  value: string;
  count: number;
}

/** Count exercises per distinct value of a string field, sorted by value. */
export function facetCounts(all: Exercise[], key: 'bodyPart' | 'equipment' | 'target'): Facet[] {
  const counts = new Map<string, number>();
  for (const ex of all) {
    const v = ex[key];
    if (!v) continue;
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
}
