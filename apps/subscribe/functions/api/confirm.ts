import { welcomeEmail } from '../../src/email/welcome';

interface Env {
  SUBSCRIBE_KV: KVNamespace;
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID?: string;
  RESEND_FROM?: string;
}

interface PagesFunctionContext {
  request: Request;
  env: Env;
}

// Where to send the browser after confirming — the real marketing page now
// lives on the main site; this function (and the token/KV it reads) still
// lives on subscribe.wojciech.io, only the post-confirm landing spot moved.
const SITE_URL = 'https://wojciech.io/subscribe';
const FROM = 'Wojciech from AI Espresso <hello@wojciech.io>';

export async function onRequestGet({ request, env }: PagesFunctionContext) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return Response.redirect(`${SITE_URL}/?error=missing_token`, 302);
  }

  const stored = await env.SUBSCRIBE_KV.get(`pending:${token}`);

  if (!stored) {
    // Token expired or already used — redirect to home (graceful)
    return Response.redirect(`${SITE_URL}/?confirmed=1`, 302);
  }

  // New tokens store JSON with the consent timestamp; older ones stored the
  // bare email string. Accept both so in-flight confirmations keep working.
  let email = stored;
  let consentAt: string | undefined;
  try {
    const parsed = JSON.parse(stored) as { email?: string; consentAt?: string };
    if (parsed.email) {
      email = parsed.email;
      consentAt = parsed.consentAt;
    }
  } catch {
    // legacy plain-string value
  }

  // Delete token from KV (one-time use)
  await env.SUBSCRIBE_KV.delete(`pending:${token}`);

  // Consent trail: signup consent + confirmation click, both timestamped.
  await env.SUBSCRIBE_KV.put(
    `consent:${email}`,
    JSON.stringify({ consentAt: consentAt || null, confirmedAt: new Date().toISOString() })
  );

  // Add to Resend Audience if configured
  if (env.RESEND_API_KEY && env.RESEND_AUDIENCE_ID) {
    await fetch(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });
  }

  // Thank-you note, styled like the newsletter. Best-effort: a failed welcome
  // email must not block the confirmation itself.
  if (env.RESEND_API_KEY) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM || FROM,
        to: [email],
        subject: "You're in. Thanks for confirming.",
        html: welcomeEmail({ email }),
      }),
    }).catch(() => null);
  }

  return Response.redirect(`${SITE_URL}/?confirmed=1`, 302);
}
