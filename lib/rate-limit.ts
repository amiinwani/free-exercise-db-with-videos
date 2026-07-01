// Demo-only IP rate limiter.
//
// Active ONLY when DEMO_MODE === 'true' (the canonical Vercel demo deployment).
// Self-hosted clones leave DEMO_MODE unset → unlimited, always ok.
//
// Default backend: in-memory sliding window (per edge isolate — resets on cold
// start, which is fine for a demo). Optional durable backend: set
// UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to enforce across isolates.

export const DEMO_LIMIT = 4;
const WINDOW_MS = 24 * 60 * 60 * 1000; // rolling 24h

export interface RateResult {
  ok: boolean;
  remaining: number;
}

const hits = new Map<string, number[]>();

function inMemoryCheck(ip: string): RateResult {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= DEMO_LIMIT) {
    hits.set(ip, recent);
    return { ok: false, remaining: 0 };
  }
  recent.push(now);
  hits.set(ip, recent);
  return { ok: true, remaining: DEMO_LIMIT - recent.length };
}

async function upstashCheck(ip: string, url: string, token: string): Promise<RateResult> {
  // INCR the key; set a 24h expiry on first hit. Fail-open on network error.
  const key = `demorl:${ip}`;
  try {
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, String(Math.floor(WINDOW_MS / 1000)), 'NX'],
      ]),
    });
    const out = (await res.json()) as Array<{ result: number }>;
    const count = out?.[0]?.result ?? 1;
    const remaining = Math.max(0, DEMO_LIMIT - count);
    return { ok: count <= DEMO_LIMIT, remaining };
  } catch {
    return { ok: true, remaining: DEMO_LIMIT };
  }
}

export async function checkRateLimit(ip: string): Promise<RateResult> {
  if (process.env.DEMO_MODE !== 'true') {
    return { ok: true, remaining: Number.POSITIVE_INFINITY };
  }
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return upstashCheck(ip, url, token);
  return inMemoryCheck(ip);
}

// Test-only hook to reset in-memory state between cases.
export function __resetRateLimit(): void {
  hits.clear();
}
