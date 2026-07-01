import { getAllExercises } from '@/lib/data/loader';
import { filterExercises } from '@/lib/data/query';
import { ok, fail, getClientIp } from '@/lib/api/respond';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const rl = await checkRateLimit(getClientIp(req));
  if (!rl.ok) return fail('DEMO_LIMIT', 429);

  const { searchParams } = new URL(req.url);
  const num = (k: string) => {
    const v = searchParams.get(k);
    return v == null ? undefined : Number(v);
  };
  const { count, data } = filterExercises(getAllExercises(), {
    bodyPart: searchParams.get('bodyPart') ?? undefined,
    equipment: searchParams.get('equipment') ?? undefined,
    target: searchParams.get('target') ?? undefined,
    difficulty: searchParams.get('difficulty') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    limit: num('limit'),
    offset: num('offset'),
  });
  return ok(data, count);
}
