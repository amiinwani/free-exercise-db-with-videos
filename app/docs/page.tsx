import type { Metadata } from 'next';
import Link from 'next/link';
import { COUNTS, REPO_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Docs — Free Exercise API with Demo Videos',
  description: `How to use the free, open-source exercise database: ${COUNTS.exercises} exercises, ${COUNTS.videos} demo videos, a JSON API, and one-click self-hosting.`,
};

export default function DocsHome() {
  return (
    <>
      <h1>Documentation</h1>
      <p>
        A free, open-source exercise database with <strong>{COUNTS.exercises} exercises</strong> and{' '}
        <strong>{COUNTS.videos} male &amp; female demo videos</strong>. Every exercise ships with
        step-by-step instructions, form cues, common mistakes, breathing and a thumbnail. MIT licensed.
      </p>

      <h2>What you get</h2>
      <ul>
        <li>A JSON REST API — <Link href="/docs/api">API reference →</Link></li>
        <li>The full dataset as static JSON — <Link href="/docs/download">Download →</Link></li>
        <li>One-click Vercel deploy for a free public instance — <Link href="/docs/self-host">Self-host →</Link></li>
        <li>Real demo videos hosted on a zero-egress CDN.</li>
      </ul>

      <h2>Quick start</h2>
      <pre><code>{`git clone ${REPO_URL}
cd free-exercise-db-with-videos
npm install && npm run dev
# → http://localhost:3000/api/v1/exercises`}</code></pre>

      <h2>The demo vs. self-hosting</h2>
      <p>
        The public demo on this site is rate-limited to 4 requests per IP — it&apos;s a showcase, not a
        production backend. For unlimited use, clone or deploy your own instance (it&apos;s free and needs
        no database or API key).
      </p>
    </>
  );
}
