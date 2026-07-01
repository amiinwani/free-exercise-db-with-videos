import metaJson from '@/data/meta.json';
import type { Meta } from '@/lib/data/types';

const meta = metaJson as Meta;

// Canonical site URL. Override with NEXT_PUBLIC_SITE_URL on the deployed demo.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://free-exercise-db-with-videos.vercel.app').replace(/\/$/, '');

export const REPO_URL = 'https://github.com/amiinwani/free-exercise-db-with-videos';

export const COUNTS = meta.counts;

export const SITE_NAME = 'Free Exercise DB with Videos';
export const TAGLINE = 'The free, open-source exercise API with real male & female demo videos.';
export const DESCRIPTION = `Free open-source exercise database & API: ${COUNTS.exercises} exercises, ${COUNTS.videos} male & female demo videos, form cues, common mistakes and step-by-step instructions. MIT licensed. Self-host in one click.`;
