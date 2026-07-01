import { NextResponse } from 'next/server';

export { getClientIp } from './ip';

const CACHE = 'public, s-maxage=3600, stale-while-revalidate=86400';

export function ok<T>(data: T, count?: number): NextResponse {
  const body = count != null ? { success: true, count, data } : { success: true, data };
  return NextResponse.json(body, { headers: { 'Cache-Control': CACHE } });
}

export function fail(code: string, status = 400): NextResponse {
  return NextResponse.json({ success: false, error: { code } }, { status });
}
