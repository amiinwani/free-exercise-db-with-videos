'use client';

import { useState } from 'react';

const ENDPOINTS = [
  '/api/v1/exercises?limit=2',
  '/api/v1/exercises?bodyPart=back&limit=2',
  '/api/v1/search?q=squat',
  '/api/v1/bodyparts',
  '/api/v1/exercises/0489',
];

export function TryApiWidget() {
  const [endpoint, setEndpoint] = useState(ENDPOINTS[0]);
  const [out, setOut] = useState('// Pick an endpoint and hit Send.');
  const [limited, setLimited] = useState(false);
  const [loading, setLoading] = useState(false);

  async function send() {
    setLoading(true);
    setLimited(false);
    try {
      const res = await fetch(endpoint);
      if (res.status === 429) {
        setLimited(true);
        setOut('// 429 — demo limit reached.');
        return;
      }
      const json = await res.json();
      setOut(JSON.stringify(json, null, 2));
    } catch (e) {
      setOut(`// error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section">
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>Try the API</h2>
            <p>Real responses from this deployment. Every payload includes the video &amp; thumbnail URLs.</p>
          </div>
          <span className="demo-pill">4 requests / IP</span>
        </div>

        <div className="trybox">
          <div className="tryrow">
            <select className="select" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} style={{ flex: 1, minWidth: 260 }}>
              {ENDPOINTS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={send} disabled={loading}>
              {loading ? 'Sending…' : 'Send ▸'}
            </button>
          </div>

          {limited ? (
            <div className="limitbanner">
              <strong>Demo limit reached.</strong> This is a showcase, not a production API — it&apos;s
              capped so it stays fast for everyone. To use it for real, it&apos;s free:{' '}
              <a href="#instruct" style={{ color: 'var(--accent)', fontWeight: 600 }}>clone the repo →</a>
            </div>
          ) : null}

          <pre className="code" style={{ marginTop: 14 }}>{out}</pre>
        </div>
      </div>
    </div>
  );
}
