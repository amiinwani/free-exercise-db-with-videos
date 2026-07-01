import type { MetadataRoute } from 'next';
import { getAllExercises } from '@/lib/data/loader';
import { slugFor } from '@/lib/slugs';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/docs', '/docs/api', '/docs/self-host', '/docs/download'].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.7,
  }));

  const exercisePages = getAllExercises().map((ex) => ({
    url: `${SITE_URL}/exercise/${slugFor(ex)}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...exercisePages];
}
