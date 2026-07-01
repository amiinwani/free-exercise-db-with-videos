'use client';

import { useState } from 'react';

export function InstructBlock({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="trybox" style={{ marginTop: 8 }}>
      <div className="tryrow" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>🤖 Paste this to your AI agent</strong>
        <button className="btn" onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button>
      </div>
      <pre className="code" style={{ marginTop: 12 }}>{prompt}</pre>
    </div>
  );
}
