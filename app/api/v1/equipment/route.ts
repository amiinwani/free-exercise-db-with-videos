import { getAllExercises } from '@/lib/data/loader';
import { facetCounts } from '@/lib/data/facets';
import { ok, fail, getClientIp } from '@/lib/api/respond';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const rl = await checkRateLimit(getClientIp(req));
  if (!rl.ok) return fail('DEMO_LIMIT', 429);

  const data = facetCounts(getAllExercises(), 'equipment');
  return ok(data, data.length);
}
