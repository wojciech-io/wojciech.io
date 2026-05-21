// POST /api/contact — receives enterprise/cohort/waitlist briefs.
// Sends email to hello@wojciech.io via Resend. Also stores submission
// in KV (CONTACT_KV) for redundancy if Resend fails.
//
// Required env vars:
//   RESEND_API_KEY  (Secret)
//   RESEND_FROM     (Plain, e.g. "AI Growth OS <hello@academy.wojciech.io>")
//   RESEND_TO       (Plain, defaults to hello@wojciech.io)
//   CONTACT_KV      (KV binding, optional)

interface Env {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  RESEND_TO?: string;
  CONTACT_KV?: KVNamespace;
}

const ALLOWED_ORIGINS = [
  'https://academy.wojciech.io',
  'https://academy-v2-wojciech-io.pages.dev',
];

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const origin = request.headers.get('Origin') || '';

  // Permissive CORS — same-origin POST or known preview origin.
  const cors = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.academy-v2-wojciech-io.pages.dev');

  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch {}
  const email = String(body.email || '').trim().toLowerCase();
  const kind = String(body.kind || 'unknown');
  const name = String(body.name || '').trim();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return json({ ok: false, error: 'invalid-email' }, 400, cors, origin);
  }

  // Persist to KV first (best-effort, never blocks email send).
  if (env.CONTACT_KV) {
    const key = `contact:${kind}:${Date.now()}:${email}`;
    await env.CONTACT_KV.put(key, JSON.stringify(body), { expirationTtl: 60 * 60 * 24 * 90 });
  }

  // Email via Resend.
  if (env.RESEND_API_KEY) {
    const subject = kind === 'enterprise'
      ? `[Academy] Enterprise brief od ${name || email}`
      : kind === 'cohort'
        ? `[Academy] Zapis na cohort: ${name || email}`
        : `[Academy] Nowa wiadomość: ${name || email}`;

    const html = renderEmail(body);
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM || 'AI Growth OS <hello@academy.wojciech.io>',
        to:   env.RESEND_TO   || 'hello@wojciech.io',
        reply_to: email,
        subject,
        html,
      }),
    });
    if (!r.ok) {
      const err = await r.text();
      return json({ ok: false, error: 'resend-failed', detail: err.slice(0, 200) }, 502, cors, origin);
    }
  }

  return json({ ok: true }, 200, cors, origin);
};

function renderEmail(body: Record<string, unknown>): string {
  const rows = Object.entries(body)
    .map(([k, v]) => `<tr><td style="padding:6px 10px;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">${escape(k)}</td><td style="padding:6px 10px;color:#0a0a0a">${escape(String(v))}</td></tr>`)
    .join('');
  return `<div style="font-family:-apple-system,system-ui,sans-serif;max-width:560px">
    <h2 style="margin:0 0 12px;color:#0a0a0a">Academy — nowa wiadomość</h2>
    <table style="border-collapse:collapse;width:100%;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden">${rows}</table>
    <p style="font-size:11px;color:#71717a;margin-top:16px">Submission z ${new Date().toISOString()}</p>
  </div>`;
}
function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function json(obj: unknown, status: number, cors: boolean, origin: string): Response {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  };
  if (cors && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
  }
  return new Response(JSON.stringify(obj), { status, headers });
}

export const onRequestOptions: PagesFunction<Env> = async ({ request }) => {
  const origin = request.headers.get('Origin') || '';
  const cors = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.academy-v2-wojciech-io.pages.dev');
  return new Response(null, {
    status: 204,
    headers: cors ? {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    } : {},
  });
};
