import type { Exercise } from './data/types';

/** Base slug for a name (may collide across exercises — see buildSlugMap). */
export function toSlug(name: string, id: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || id;
}

/**
 * Assign a globally-unique slug to every exercise. On collision, append the
 * exercise id; if that still collides, append a numeric suffix. Deterministic
 * for a given ordered input.
 */
export function buildSlugMap(all: Exercise[]): Map<string, string> {
  const used = new Set<string>();
  const byId = new Map<string, string>();
  for (const ex of all) {
    let slug = toSlug(ex.name, ex.id);
    if (used.has(slug)) slug = `${slug}-${ex.id}`;
    let i = 2;
    const base = slug;
    while (used.has(slug)) slug = `${base}-${i++}`;
    used.add(slug);
    byId.set(ex.id, slug);
  }
  return byId;
}

/** Reverse lookup using the collision-resolved map. */
export function fromSlug(slug: string, all: Exercise[]): Exercise | undefined {
  const byId = buildSlugMap(all);
  const hit = [...byId.entries()].find(([, s]) => s === slug)?.[0];
  return hit ? all.find((e) => e.id === hit) : undefined;
}
