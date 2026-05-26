import { createOpaqueToken, sha256 } from '../../_utils/crypto';
import { currentSession } from '../../_utils/session';
import { clientIp, rateLimit } from '../../_utils/ratelimit';

interface Env {
  DB?: D1Database;
  AUTH_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  ACADEMY_BASE_URL?: string;
  RATE_LIMIT?: KVNamespace;
}

// Team owner invites a seat by email. Enforces the team's seat limit and emails
// the invitee a one-click accept link.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const rl = await rateLimit(env.RATE_LIMIT, `academy-team-invite:${clientIp(request)}`, 30, 600);
  if (!rl.ok) return rl.response!;

  if (!env.DB || !env.AUTH_SECRET) return json({ ok: false, error: 'not-configured' }, 500);

  const session = await currentSession(request, env.AUTH_SECRET);
  if (!session) return json({ ok: false, error: 'unauthorized' }, 401);

  const team = await env.DB.prepare(
    'SELECT id, name, seat_limit FROM teams WHERE owner_customer_id = ? ORDER BY created_at DESC LIMIT 1'
  ).bind(session.sub).first<{ id: string; name: string | null; seat_limit: number }>();
  if (!team) return json({ ok: false, error: 'not-a-team-owner' }, 403);

  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch {}
  const email = String(body.email || '').trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return json({ ok: false, error: 'invalid-email' }, 400);
  if (email === session.email.toLowerCase()) return json({ ok: false, error: 'cannot-invite-self' }, 400);

  // Seats in use = active (non-revoked) invites for this team.
  const used = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM team_invites WHERE team_id = ? AND status IN ('pending','accepted')"
  ).bind(team.id).first<{ n: number }>();
  if ((used?.n ?? 0) >= team.seat_limit) {
    return json({ ok: false, error: 'seat-limit-reached', seat_limit: team.seat_limit }, 409);
  }

  const token = createOpaqueToken();
  const tokenHash = await sha256(token);
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();

  const res = await env.DB.prepare(
    `INSERT INTO team_invites (id, team_id, email, token_hash, status, expires_at)
     VALUES (?, ?, ?, ?, 'pending', ?)
     ON CONFLICT(team_id, email) DO UPDATE SET
       token_hash=excluded.token_hash,
       status='pending',
       invited_at=CURRENT_TIMESTAMP,
       accepted_at=NULL,
       expires_at=excluded.expires_at
     WHERE team_invites.status != 'accepted'`
  ).bind(`inv_${crypto.randomUUID()}`, team.id, email, tokenHash, expires).run();

  if ((res.meta as { changes?: number } | undefined)?.changes === 0) {
    return json({ ok: false, error: 'already-accepted' }, 409);
  }

  const origin = (env.ACADEMY_BASE_URL || new URL(request.url).origin).replace(/\/$/, '');
  const acceptUrl = `${origin}/api/team/accept?token=${encodeURIComponent(token)}`;
  const sent = await sendInviteEmail(env, email, acceptUrl, team.name);

  return json({ ok: true, email, sent, accept_url: sent ? undefined : acceptUrl });
};

async function sendInviteEmail(env: Env, email: string, acceptUrl: string, teamName: string | null): Promise<boolean> {
  if (!env.RESEND_API_KEY) return false;
  const team = teamName ? `zespołu „${teamName}"` : 'zespołu';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM || 'AI Growth OS <hello@academy.wojciech.io>',
      to: email,
      subject: 'Zaproszenie do AI Growth OS Academy',
      html: `<div style="font-family:-apple-system,system-ui,sans-serif;max-width:560px">
        <h2 style="margin:0 0 12px;color:#0a0a0a">Masz dostęp do AI Growth OS</h2>
        <p style="color:#3f3f46;line-height:1.55">Dostałeś miejsce w ramach licencji ${escapeHtml(team)}. Kliknij, żeby aktywować dostęp do panelu z odcinkami, vaultem i materiałami.</p>
        <p><a href="${escapeAttr(acceptUrl)}" style="display:inline-block;background:#ff7a1c;color:#0a0a0c;padding:12px 18px;border-radius:10px;font-weight:700;text-decoration:none">Aktywuj dostęp</a></p>
        <p style="font-size:12px;color:#71717a">Link działa 14 dni i jest jednorazowy.</p>
      </div>`,
    }),
  });
  return res.ok;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
