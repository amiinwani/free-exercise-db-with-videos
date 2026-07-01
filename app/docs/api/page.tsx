import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Reference — Free Exercise API',
  description: 'REST endpoints for the free exercise database: list, filter, search, and fetch exercises with demo video URLs, form cues and instructions.',
};

const ROWS = [
  ['GET', '/api/v1/exercises', 'List all exercises. Query: bodyPart, equipment, target, difficulty, search, limit, offset'],
  ['GET', '/api/v1/exercises/:id', 'Fetch one exercise by id'],
  ['GET', '/api/v1/search?q=', 'Search by name, alias, target or muscle (min 2 chars)'],
  ['GET', '/api/v1/bodyparts', 'Body-part facets with counts'],
  ['GET', '/api/v1/equipment', 'Equipment facets with counts'],
  ['GET', '/api/v1/targets', 'Target-muscle facets with counts'],
];

const SAMPLE = `{
  "success": true,
  "count": 317,
  "data": [
    {
      "id": "0489",
      "name": "45 Degree Hyperextension",
      "bodyPart": "back",
      "target": "erector spinae",
      "equipment": "leverage machine",
      "difficulty": "beginner",
      "steps": ["…"],
      "formCues": ["Keep back straight", "Hinge from hips"],
      "commonMistakes": ["Rounding the back"],
      "videos": {
        "male":   "https://…/exercise-videos/male/45-degree-hyperextension.mp4",
        "female": "https://…/exercise-videos/female/45-degree-hyperextension.mp4"
      },
      "thumbnails": { "male": "https://…/male/45-degree-hyperextension.jpg" }
    }
  ]
}`;

export default function ApiDocs() {
  return (
    <>
      <h1>API reference</h1>
      <p>Base URL: <code>/api/v1</code>. All responses are JSON with a <code>{`{ success, count?, data }`}</code> envelope. No auth, no API key.</p>

      <h2>Endpoints</h2>
      <table className="api">
        <thead><tr><th>Method</th><th>Path</th><th>Description</th></tr></thead>
        <tbody>
          {ROWS.map(([m, p, d]) => (
            <tr key={p}><td><code>{m}</code></td><td><code>{p}</code></td><td>{d}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Example</h2>
      <pre><code>curl https://your-instance/api/v1/exercises?bodyPart=back&amp;limit=1</code></pre>
      <pre><code>{SAMPLE}</code></pre>

      <h2>Rate limits</h2>
      <p>The hosted demo caps each IP at 4 requests, returning <code>429</code> with <code>{`{ error: { code: "DEMO_LIMIT" } }`}</code>. Self-hosted instances are unlimited (set <code>DEMO_MODE</code> unset/false).</p>

      <h2>OpenAPI</h2>
      <p>A machine-readable spec ships at <code>openapi.yaml</code> in the repo root.</p>
    </>
  );
}
