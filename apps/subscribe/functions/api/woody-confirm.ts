import type { KVNamespace } from '@cloudflare/workers-types';
// The link in the email of the Woody waiting list: it moves the address from "pending" to the list (woody:<email>) and sends the person back to the Woody page, which says
// they are in. Reading the link twice does no harm. See woody-waitlist.ts for the keys.

interface Env {
  SUBSCRIBE_KV: KVNamespace;
}

interface PagesFunctionContext {
  request: Request;
  env: Env;
}

const DONE_URL = 'https://wojciech.io/woody/?confirmed=1#join';
const PAGE_URL = 'https://wojciech.io/woody/';
const tokenPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function failure(message: string, status: number) {
  return new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Woody waiting list</title><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#0C0F14;color:#F4F5F7;font:17px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"><main style="max-width:30em;padding:32px"><h1 style="margin:0 0 12px;font:700 32px/1.15 Georgia,'Times New Roman',serif">${message}</h1><p style="margin:0 0 24px;color:#B4BCC9">Join the list again and I will send a new link.</p><a href="${PAGE_URL}#join" style="display:inline-block;padding:14px 26px;border-radius:999px;background:#FF4D2E;color:#0C0F14;font-weight:700;text-decoration:none">Back to Woody</a></main></body></html>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } },
  );
}

export async function onRequestGet({ request, env }: PagesFunctionContext) {
  const token = new URL(request.url).searchParams.get('token') ?? '';
  if (!tokenPattern.test(token)) return failure('This link is incomplete.', 400);

  const stored = await env.SUBSCRIBE_KV.get(`woody-pending:${token}`);
  if (!stored) {
    if (await env.SUBSCRIBE_KV.get(`woody-confirmed:${token}`)) return Response.redirect(DONE_URL, 302);
    return failure('This link has expired.', 410);
  }

  let record: { email?: string; consentAt?: string } = {};
  try { record = JSON.parse(stored); } catch { /* a value that is not ours */ }
  if (!record.email) return failure('This link is not valid.', 410);

  await env.SUBSCRIBE_KV.put(`woody:${record.email}`, JSON.stringify({ email: record.email, consentAt: record.consentAt, confirmedAt: new Date().toISOString(), source: 'woody-landing' }));
  await env.SUBSCRIBE_KV.put(`woody-confirmed:${token}`, '1', { expirationTtl: 60 * 60 * 24 * 30 });
  await env.SUBSCRIBE_KV.delete(`woody-pending:${token}`);
  return Response.redirect(DONE_URL, 302);
}
