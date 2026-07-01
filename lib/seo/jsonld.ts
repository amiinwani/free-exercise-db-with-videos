import type { Exercise } from '@/lib/data/types';
import { SITE_URL, SITE_NAME, DESCRIPTION, REPO_URL, COUNTS } from '@/lib/site';

/** schema.org Dataset describing the whole database (for the home page). */
export function datasetJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: SITE_NAME,
    description: DESCRIPTION,
    url: SITE_URL,
    license: 'https://opensource.org/licenses/MIT',
    keywords: ['exercise api', 'exercise database', 'workout api', 'exercise videos', 'fitness api'],
    creator: { '@type': 'Person', name: 'Arham Wani' },
    isAccessibleForFree: true,
    distribution: [
      { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${REPO_URL}/blob/main/data/exercises.json` },
    ],
    variableMeasured: `${COUNTS.exercises} exercises, ${COUNTS.videos} demo videos`,
  };
}

/** schema.org for one exercise, including a VideoObject when a demo video exists. */
export function exerciseJsonLd(ex: Exercise, slug: string) {
  const video = ex.videos.male ?? ex.videos.female;
  const thumb = ex.thumbnails.male ?? ex.thumbnails.female;
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'ExercisePlan',
      name: ex.name,
      description: ex.shortDescription,
      exerciseType: ex.bodyPart,
      url: `${SITE_URL}/exercise/${slug}`,
    },
  ];
  if (video) {
    graph.push({
      '@type': 'VideoObject',
      name: `${ex.name} — demo video`,
      description: ex.shortDescription,
      contentUrl: video,
      thumbnailUrl: thumb ? [thumb] : undefined,
      uploadDate: '2026-06-01',
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
