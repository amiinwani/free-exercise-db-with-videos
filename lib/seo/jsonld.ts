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

function breadcrumb(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/**
 * Rich schema for one exercise: ExercisePlan + VideoObject (when a demo exists)
 * + HowTo (from the ordered steps) + BreadcrumbList. Maximises rich-result
 * eligibility for "<exercise> how to / video / form" queries.
 */
export function exerciseJsonLd(ex: Exercise, slug: string, bodyPartSlug: string) {
  const url = `${SITE_URL}/exercise/${slug}`;
  const video = ex.videos.male ?? ex.videos.female;
  const thumb = ex.thumbnails.male ?? ex.thumbnails.female;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'ExercisePlan',
      name: ex.name,
      description: ex.shortDescription,
      exerciseType: ex.bodyPart,
      url,
    },
    breadcrumb([
      { name: 'Exercises', url: `${SITE_URL}/exercises` },
      { name: `${ex.bodyPart} exercises`, url: `${SITE_URL}/exercises/${bodyPartSlug}` },
      { name: ex.name, url },
    ]),
  ];

  if (ex.steps.length) {
    graph.push({
      '@type': 'HowTo',
      name: `How to do the ${ex.name}`,
      description: ex.shortDescription,
      step: ex.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s })),
      ...(video ? { video: { '@type': 'VideoObject', name: `${ex.name} demo`, contentUrl: video, thumbnailUrl: thumb ? [thumb] : undefined, uploadDate: '2026-06-01' } } : {}),
    });
  }

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

/** CollectionPage + ItemList for a body-part hub / the exercises index. */
export function collectionJsonLd(
  name: string,
  url: string,
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url,
    isAccessibleForFree: true,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: it.url,
      })),
    },
  };
}

/** FAQPage for the landing — eligible for FAQ rich results. */
export function faqJsonLd(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
