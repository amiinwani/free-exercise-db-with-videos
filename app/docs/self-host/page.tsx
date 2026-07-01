import type { Metadata } from 'next';
import { REPO_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Self-hosting — Free Exercise API',
  description: 'Deploy your own free exercise API in one click on Vercel, or run it locally. No database, no API key, $0 infrastructure.',
};

const DEPLOY = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(REPO_URL)}`;

export default function SelfHost() {
  return (
    <>
      <h1>Self-hosting</h1>
      <p>There is no database and no API key. The dataset is static JSON in the repo, so a deploy costs <strong>$0</strong> and can&apos;t break from a dead backend.</p>

      <h2>One-click Vercel deploy</h2>
      <p>
        <a className="btn btn-primary" href={DEPLOY} target="_blank" rel="noreferrer">Deploy to Vercel ▸</a>
      </p>
      <p>This forks the repo and deploys it. Your public API will be live at <code>https://your-app.vercel.app/api/v1/exercises</code>.</p>

      <h2>Run locally</h2>
      <pre><code>{`git clone ${REPO_URL}
cd free-exercise-db-with-videos
npm install
npm run dev      # dev server on :3000
npm run build && npm start   # production`}</code></pre>

      <h2>Environment</h2>
      <ul>
        <li><code>DEMO_MODE</code> — set to <code>true</code> only for a public showcase to enable the 4-req/IP limit. Leave unset for unlimited.</li>
        <li><code>NEXT_PUBLIC_SITE_URL</code> — your canonical URL (used in metadata &amp; sitemap).</li>
        <li><code>UPSTASH_REDIS_REST_URL</code> / <code>UPSTASH_REDIS_REST_TOKEN</code> — optional, for durable cross-region demo rate limiting.</li>
      </ul>

      <h2>Bring your own video hosting (optional)</h2>
      <p>Videos are referenced by URL. Run <code>bash scripts/download-all-videos.sh</code> to pull every file, then re-host them on your own CDN and update the URLs in <code>data/</code> via <code>scripts/export-from-source.mjs</code>.</p>
    </>
  );
}
