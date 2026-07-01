import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getClientIp } from './ip.ts';

test('getClientIp reads first x-forwarded-for entry', () => {
  const req = new Request('https://x/', { headers: { 'x-forwarded-for': '9.9.9.9, 10.0.0.1' } });
  assert.equal(getClientIp(req), '9.9.9.9');
});

test('getClientIp falls back to x-real-ip', () => {
  const req = new Request('https://x/', { headers: { 'x-real-ip': '8.8.8.8' } });
  assert.equal(getClientIp(req), '8.8.8.8');
});

test('getClientIp defaults when no headers', () => {
  assert.equal(getClientIp(new Request('https://x/')), '0.0.0.0');
});
