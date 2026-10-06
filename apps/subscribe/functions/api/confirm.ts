import { welcomeEmail } from '../../src/email/welcome';
import type { KVNamespace } from '@cloudflare/workers-types';

interface Env {
  SUBSCRIBE_KV: KVNamespace;
  RESEND_API_KEY: string;
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
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function confirmationError(message: string, status: number, token?: string) {
  const retryUrl = token
    ? `https://subscribe.wojciech.io/api/confirm?token=${encodeURIComponent(token)}`
    : `${SITE_URL}/`;
  return new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>AI Espresso subscription</title><body style="font-family:Arial,sans-serif;max-width:480px;margin:64px auto;padding:24px;line-height:1.5"><h1 style="font-size:24px">Subscription not confirmed</h1><p>${message}</p><a href="${retryUrl}">${token ? 'Try again' : 'Request a new confirmation link'}</a></body></html>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }
  );
}

async function saveContact(apiKey: string, email: string): Promise<string> {
  const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'User-Agent': 'AI-Espresso-Subscribe/1.0' };
  const contactUrl = `https://api.resend.com/contacts/${encodeURIComponent(email)}`;
  const existing = await fetch(contactUrl, { headers, signal: AbortSignal.timeout(10000) });
  if (existing.status !== 404) {
    if (!existing.ok) throw new Error(`contact_lookup_${existing.status}`);
    const contact = await existing.json() as { id?: string; unsubscribed?: boolean };
    if (!contact.id) throw new Error('contact_lookup_invalid');
    if (contact.unsubscribed) {
      // A new confirmation click is an explicit request to subscribe again.
      const updated = await fetch(contactUrl, {
        method: 'PATCH', headers, body: JSON.stringify({ unsubscribed: false }),
        signal: AbortSignal.timeout(10000),
      });
      if (!updated.ok) throw new Error(`contact_update_${updated.status}`);
    }
    return contact.id;
  }
  const created = await fetch('https://api.resend.com/contacts', {
    method: 'POST', headers, body: JSON.stringify({ email, unsubscribed: false }),
    signal: AbortSignal.timeout(10000),
  });
  if (!created.ok) throw new Error(`contact_create_${created.status}`);
  const contact = await created.json() as { id?: string };
  if (!contact.id) throw new Error('contact_create_invalid');
  return contact.id;
}

export async function onRequestGet({ request, env }: PagesFunctionContext) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return confirmationError('This confirmation link is incomplete.', 400);
  }

  const stored = await env.SUBSCRIBE_KV.get(`pending:${token}`);

  if (!stored) {
    if (await env.SUBSCRIBE_KV.get(`confirmed:${token}`)) {
      return Response.redirect(`${SITE_URL}/?confirmed=1`, 302);
    }
    return confirmationError('This confirmation link has expired or is invalid.', 410);
  }

  if (!env.RESEND_API_KEY) {
    return confirmationError('We could not save your subscription. Please try again in a moment.', 503, token);
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

  if (typeof email !== 'string' || email.length > 254 || !emailPattern.test(email)) {
    return confirmationError('This confirmation link is invalid.', 410);
  }
  email = email.trim().toLowerCase();

  let newlyConfirmed = false;
  try {
    const contactId = await saveContact(env.RESEND_API_KEY, email);
    const previous = await env.SUBSCRIBE_KV.get(`consent:${email}`);
    const previousConsent = previous ? JSON.parse(previous) as { consentAt?: string; confirmedAt?: string } : null;
    const now = new Date().toISOString();
    newlyConfirmed = !previousConsent?.confirmedAt;
    await env.SUBSCRIBE_KV.put(
      `consent:${email}`,
      JSON.stringify({ consentAt: consentAt || previousConsent?.consentAt || null, confirmedAt: previousConsent?.confirmedAt || now, contactId, syncedAt: now })
    );
    await env.SUBSCRIBE_KV.put(`confirmed:${token}`, contactId, { expirationTtl: 86400 });
    // Keep the pending token until the contact and durable consent record exist.
    await env.SUBSCRIBE_KV.delete(`pending:${token}`);
    console.log(JSON.stringify({ event: 'subscription_confirmed', contactId }));
  } catch (error) {
    const reason = error instanceof Error && /^contact_/.test(error.message) ? error.message : 'subscription_storage_or_network_error';
    console.error(JSON.stringify({ event: 'subscription_confirmation_failed', reason }));
    return confirmationError('We could not save your subscription. Please try again in a moment.', 503, token);
  }

  // Thank-you note, styled like the newsletter. Best-effort: a failed welcome
  // email must not block the confirmation itself.
  if (newlyConfirmed) {
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `subscription-welcome/${encodeURIComponent(token)}`,
      },
      body: JSON.stringify({
        from: env.RESEND_FROM || FROM,
        to: [email],
        subject: "You're in. Thanks for confirming.",
        html: welcomeEmail({ email }),
      }),
    };
    // Contact lookup + creation can exhaust the provider's per-second limit.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const sent = await fetch('https://api.resend.com/emails', {
          ...options, signal: AbortSignal.timeout(10000),
        });
        if (sent.ok || (sent.status !== 429 && sent.status < 500)) break;
      } catch {
        // The same idempotency key makes a retry safe after an uncertain result.
      }
      if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return Response.redirect(`${SITE_URL}/?confirmed=1`, 302);
}
