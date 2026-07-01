import { getAllExercises } from '@/lib/data/loader';
import { searchExercises } from '@/lib/data/query';
import { ok, fail, getClientIp } from '@/lib/api/respond';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const rl = await checkRateLimit(getClientIp(req));
  if (!rl.ok) return fail('DEMO_LIMIT', 429);

  const q = new URL(req.url).searchParams.get('q') ?? '';
  if (q.trim().length < 2) return fail('QUERY_TOO_SHORT', 400);
  const data = searchExercises(getAllExercises(), q);
  return ok(data, data.length);
}
