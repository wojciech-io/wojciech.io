interface Env {
  SUBSCRIBE_KV: KVNamespace;
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID?: string;
}

interface PagesFunctionContext {
  request: Request;
  env: Env;
}

const SITE_URL = 'https://subscribe.wojciech.io';

export async function onRequestGet({ request, env }: PagesFunctionContext) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return Response.redirect(`${SITE_URL}/?error=missing_token`, 302);
  }

  const email = await env.SUBSCRIBE_KV.get(`pending:${token}`);

  if (!email) {
    // Token expired or already used — redirect to home (graceful)
    return Response.redirect(`${SITE_URL}/?confirmed=1`, 302);
  }

  // Delete token from KV (one-time use)
  await env.SUBSCRIBE_KV.delete(`pending:${token}`);

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

  return Response.redirect(`${SITE_URL}/?confirmed=1`, 302);
}
