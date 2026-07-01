import type { Metadata } from 'next';
import { REPO_URL, COUNTS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Download the data — Free Exercise API',
  description: 'Download the full exercise dataset as JSON, or pull every demo video and thumbnail with one script.',
};

const RAW = `${REPO_URL}/blob/main/data`;

export default function Download() {
  return (
    <>
      <h1>Download the data</h1>
      <p>Everything is plain files in the repo — no signup, no key.</p>

      <h2>The dataset (JSON)</h2>
      <ul>
        <li><a href={`${RAW}/exercises.json`} target="_blank" rel="noreferrer"><code>data/exercises.json</code></a> — all {COUNTS.exercises} exercises in one array</li>
        <li><code>data/exercises/&lt;id&gt;.json</code> — one file per exercise</li>
        <li><code>data/by-bodypart/&lt;part&gt;.json</code> — pre-split by body part</li>
        <li><code>data/meta.json</code> — counts &amp; facet lists</li>
      </ul>

      <h2>Every video + thumbnail</h2>
      <p>The <code>{COUNTS.videos}</code> videos and posters live on a zero-egress CDN. Pull them all locally:</p>
      <pre><code>{`git clone ${REPO_URL}
cd free-exercise-db-with-videos
bash scripts/download-all-videos.sh
# → ./videos/{male,female}/*.mp4  and  ./thumbnails/{male,female}/*.jpg`}</code></pre>
      <p>The script is idempotent — re-running skips files you already have.</p>

      <h2>Fetch from the API instead</h2>
      <pre><code>curl https://your-instance/api/v1/exercises &gt; exercises.json</code></pre>
    </>
  );
}
