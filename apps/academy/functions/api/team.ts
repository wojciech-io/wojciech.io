import { currentSession } from '../_utils/session';

interface Env {
  DB?: D1Database;
  AUTH_SECRET?: string;
}

// Returns the caller's team-owner status plus current seats, for the dashboard
// team panel. Non-owners get { is_owner: false }.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB || !env.AUTH_SECRET) return json({ ok: false, error: 'not-configured' }, 500);

  const session = await currentSession(request, env.AUTH_SECRET);
  if (!session) return json({ ok: false, error: 'unauthorized' }, 401);

  const team = await env.DB.prepare(
    'SELECT id, name, seat_limit FROM teams WHERE owner_customer_id = ? ORDER BY created_at DESC LIMIT 1'
  ).bind(session.sub).first<{ id: string; name: string | null; seat_limit: number }>();

  if (!team) return json({ ok: true, is_owner: false });

  const { results } = await env.DB.prepare(
    "SELECT email, status, invited_at, accepted_at FROM team_invites WHERE team_id = ? AND status != 'revoked' ORDER BY invited_at"
  ).bind(team.id).all<{ email: string; status: string; invited_at: string; accepted_at: string | null }>();

  const seats = results ?? [];
  return json({
    ok: true,
    is_owner: true,
    team: { name: team.name, seat_limit: team.seat_limit },
    seats_used: seats.length,
    seats,
  });
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
