import { currentSession } from '../_utils/session';
import { clientIp, rateLimit } from '../_utils/ratelimit';

interface Env {
  DB?: D1Database;
  AUTH_SECRET?: string;
  RATE_LIMIT?: KVNamespace;
}

// Records or updates a member's progress on one episode. The certificate gate
// reads this table, so completion has to be written somewhere real.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const rl = await rateLimit(env.RATE_LIMIT, `academy-progress:${clientIp(request)}`, 60, 60);
  if (!rl.ok) return rl.response!;

  if (!env.DB || !env.AUTH_SECRET) return json({ ok: false, error: 'not-configured' }, 500);

  const session = await currentSession(request, env.AUTH_SECRET);
  if (!session) return json({ ok: false, error: 'unauthorized' }, 401);

  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch {}

  const episodeId = String(body.episode_id || '').trim();
  if (!/^s\d+e\d+$/i.test(episodeId)) return json({ ok: false, error: 'invalid-episode' }, 400);

  const position = clampInt(body.last_position_sec, 0, 60 * 60 * 8);
  const completed = body.completed === true;
  const quizScore = body.quiz_score == null ? null : clampInt(body.quiz_score, 0, 100);

  await env.DB.prepare(
    `INSERT INTO progress (customer_id, episode_id, last_position_sec, completed_at, quiz_score, updated_at)
     VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(customer_id, episode_id) DO UPDATE SET
       last_position_sec=MAX(progress.last_position_sec, excluded.last_position_sec),
       completed_at=COALESCE(progress.completed_at, excluded.completed_at),
       quiz_score=COALESCE(excluded.quiz_score, progress.quiz_score),
       updated_at=CURRENT_TIMESTAMP`
  ).bind(
    session.sub,
    episodeId.toLowerCase(),
    position,
    completed ? new Date().toISOString() : null,
    quizScore,
  ).run();

  const row = await env.DB.prepare(
    'SELECT COUNT(*) AS done FROM progress WHERE customer_id = ? AND completed_at IS NOT NULL'
  ).bind(session.sub).first<{ done: number }>();

  return json({ ok: true, completed_count: row?.done ?? 0 });
};

function clampInt(value: unknown, min: number, max: number): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
