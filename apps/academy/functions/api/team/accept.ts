import { createOpaqueToken, sha256 } from '../../_utils/crypto';
import { clientIp, rateLimit } from '../../_utils/ratelimit';

interface Env {
  DB?: D1Database;
  RATE_LIMIT?: KVNamespace;
}

// Invitee opens this from the email. Creates their membership tied to the team,
// marks the invite accepted, then hands off to /api/auth to set the session.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const rl = await rateLimit(env.RATE_LIMIT, `academy-team-accept:${clientIp(request)}`, 20, 600);
  if (!rl.ok) return rl.response!;

  if (!env.DB) return new Response('Not configured', { status: 500 });

  const url = new URL(request.url);
  const token = url.searchParams.get('token') || '';
  if (!token) return new Response('Brak tokenu', { status: 400 });

  const tokenHash = await sha256(token);
  const invite = await env.DB.prepare(
    `SELECT i.id AS invite_id, i.team_id, i.email, i.status, i.expires_at, t.plan
     FROM team_invites i JOIN teams t ON t.id = i.team_id
     WHERE i.token_hash = ? LIMIT 1`
  ).bind(tokenHash).first<{ invite_id: string; team_id: string; email: string; status: string; expires_at: string; plan: string }>();

  if (!invite || invite.status === 'revoked' || Date.parse(invite.expires_at) < Date.now()) {
    return new Response('Zaproszenie wygasło albo jest nieprawidłowe.', { status: 401 });
  }

  const email = invite.email.toLowerCase();
  const existing = await env.DB.prepare('SELECT id FROM customers WHERE email = ?').bind(email).first<{ id: string }>();
  const customerId = existing?.id || `seat_${crypto.randomUUID()}`;
  const accessExpiresAt = addMonthsIso(new Date(), 12);

  await env.DB.prepare(
    `INSERT INTO customers (id, email, created_at, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT(email) DO UPDATE SET updated_at=CURRENT_TIMESTAMP`
  ).bind(customerId, email).run();

  await env.DB.prepare(
    `INSERT INTO memberships (id, customer_id, plan, status, stripe_checkout_session_id, team_id, access_expires_at, created_at, updated_at)
     VALUES (?, ?, 'team-seat', 'active', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
  ).bind(`mem_${crypto.randomUUID()}`, customerId, `seat_${invite.invite_id}`, invite.team_id, accessExpiresAt).run();

  await env.DB.prepare(
    "UPDATE team_invites SET status='accepted', accepted_at=CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(invite.invite_id).run();

  // Hand off to the existing magic-link consumer so the seat lands logged in.
  const authToken = createOpaqueToken();
  const authHash = await sha256(authToken);
  const authExpires = new Date(Date.now() + 1000 * 60 * 30).toISOString();
  await env.DB.prepare(
    `INSERT INTO auth_tokens (id, email, token_hash, redirect_path, expires_at)
     VALUES (?, ?, ?, '/app', ?)`
  ).bind(crypto.randomUUID(), email, authHash, authExpires).run();

  return Response.redirect(`${url.origin}/api/auth?token=${encodeURIComponent(authToken)}`, 302);
};

function addMonthsIso(date: Date, months: number): string {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next.toISOString();
}
