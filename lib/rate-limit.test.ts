import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { checkRateLimit, __resetRateLimit, DEMO_LIMIT } from './rate-limit.ts';

beforeEach(() => __resetRateLimit());
afterEach(() => {
  delete process.env.DEMO_MODE;
  __resetRateLimit();
});

test('unlimited when DEMO_MODE is not set', async () => {
  delete process.env.DEMO_MODE;
  for (let i = 0; i < 100; i++) {
    const r = await checkRateLimit('1.1.1.1');
    assert.equal(r.ok, true);
  }
});

test('allows DEMO_LIMIT requests then blocks (in-memory)', async () => {
  process.env.DEMO_MODE = 'true';
  const ip = '2.2.2.2';
  for (let i = 0; i < DEMO_LIMIT; i++) {
    const r = await checkRateLimit(ip);
    assert.equal(r.ok, true, `request ${i + 1} should pass`);
  }
  const blocked = await checkRateLimit(ip);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.remaining, 0);
});

test('remaining counts down', async () => {
  process.env.DEMO_MODE = 'true';
  const first = await checkRateLimit('3.3.3.3');
  assert.equal(first.remaining, DEMO_LIMIT - 1);
});

test('separate IPs have independent budgets', async () => {
  process.env.DEMO_MODE = 'true';
  for (let i = 0; i < DEMO_LIMIT; i++) await checkRateLimit('4.4.4.4');
  const other = await checkRateLimit('5.5.5.5');
  assert.equal(other.ok, true);
});
