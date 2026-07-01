import { getExercise } from '@/lib/data/loader';
import { ok, fail, getClientIp } from '@/lib/api/respond';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const rl = await checkRateLimit(getClientIp(req));
  if (!rl.ok) return fail('DEMO_LIMIT', 429);

  const { id } = await params;
  const ex = getExercise(id);
  if (!ex) return fail('NOT_FOUND', 404);
  return ok(ex);
}
