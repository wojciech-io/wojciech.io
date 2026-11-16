import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import type { KVNamespace } from '@cloudflare/workers-types';
import { onRequestPost, onRequestOptions } from '../functions/api/woody-waitlist';
import { onRequestGet as confirm } from '../functions/api/woody-confirm';
import { woodyAlreadyEmail, woodyConfirmationEmail } from '../src/email/woody';

// The waiting list of Woody: the page of Woody is the only caller, the address is confirmed by a link before it goes on the list, and the page cannot be used to find out who is on it.
// The handlers run here with a KV made of a Map and a fetch that stands for Resend, so no email goes anywhere.

const kv = () => {
  const m = new Map<string, string>();
  return { m, get: async (k: string) => m.get(k) ?? null, put: async (k: string, v: string) => { m.set(k, v); }, delete: async (k: string) => { m.delete(k); } } as unknown as KVNamespace & { m: Map<string, string> };
};
const ORIGIN = 'https://wojciech.io';
const post = (body: unknown, origin = ORIGIN) => new Request('https://subscribe.wojciech.io/api/woody-waitlist', { method: 'POST', headers: { 'content-type': 'application/json', Origin: origin, 'CF-Connecting-IP': '203.0.113.7' }, body: JSON.stringify(body) });
let mails: Array<{ to: string[]; subject: string; html: string; text: string; from: string }>;

beforeEach(() => {
  mails = [];
  vi.stubGlobal('fetch', vi.fn(async (_url: string, init: RequestInit) => { mails.push(JSON.parse(String(init.body))); return new Response('{}', { status: 200 }); }));
});
afterEach(() => vi.unstubAllGlobals());

describe('woody waiting list: sign up', () => {
  it('answers only to the Woody page', async () => {
    const env = { SUBSCRIBE_KV: kv(), RESEND_API_KEY: 'k' };
    const res = await onRequestPost({ request: post({ email: 'a@b.co', consent: true }, 'https://example.com'), env });
    expect(res.status).toBe(403);
    expect(res.headers.get('access-control-allow-origin')).toBeNull();
    expect(mails).toHaveLength(0);
    expect((await onRequestOptions({ request: new Request('https://x', { method: 'OPTIONS', headers: { Origin: ORIGIN } }), env })).headers.get('access-control-allow-origin')).toBe(ORIGIN);
    expect((await onRequestOptions({ request: new Request('https://x', { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } }), env })).status).toBe(403);
  });

  it('needs a valid address and the box ticked, and ignores a form filled by a script', async () => {
    const env = { SUBSCRIBE_KV: kv(), RESEND_API_KEY: 'k' };
    expect((await onRequestPost({ request: post({ email: 'nope', consent: true }), env })).status).toBe(400);
    expect((await onRequestPost({ request: post({ email: 'a@b.co', consent: false }), env })).status).toBe(400);
    const trapped = await onRequestPost({ request: post({ email: 'a@b.co', consent: true, company: 'Acme' }), env });
    expect((await trapped.json()).ok).toBe(true);
    expect(mails).toHaveLength(0);
    expect(env.SUBSCRIBE_KV.m.size).toBe(0);
  });

  it('keeps a pending token for 24 hours and sends one email with the link, and the list stays empty until the click', async () => {
    const env = { SUBSCRIBE_KV: kv(), RESEND_API_KEY: 'k' };
    const res = await onRequestPost({ request: post({ email: ' Reader@Example.com ', consent: true }), env });
    expect(res.status).toBe(200);
    expect(res.headers.get('access-control-allow-origin')).toBe(ORIGIN);
    expect(mails).toHaveLength(1);
    expect(mails[0].to).toEqual(['reader@example.com']);
    expect(mails[0].from).toMatch(/hello@wojciech\.io/);
    const token = [...env.SUBSCRIBE_KV.m.keys()].find((k) => k.startsWith('woody-pending:'))!.split(':')[1];
    expect(mails[0].html).toContain(`https://subscribe.wojciech.io/api/woody-confirm?token=${token}`);
    expect(mails[0].text).toContain(token);
    expect([...env.SUBSCRIBE_KV.m.keys()].some((k) => k.startsWith('woody:'))).toBe(false);
  });

  it('says the same thing to an address that is on the list, and sends the short email instead of a new link', async () => {
    const env = { SUBSCRIBE_KV: kv(), RESEND_API_KEY: 'k' };
    env.SUBSCRIBE_KV.m.set('woody:reader@example.com', '{}');
    const res = await onRequestPost({ request: post({ email: 'reader@example.com', consent: true }), env });
    expect(await res.json()).toEqual({ ok: true });
    expect(mails).toHaveLength(1);
    expect(mails[0].subject).toBe(woodyAlreadyEmail().subject);
    expect([...env.SUBSCRIBE_KV.m.keys()].some((k) => k.startsWith('woody-pending:'))).toBe(false);
  });

  it('reports a failed email, and a missing key, without a token left behind that works', async () => {
    const env = { SUBSCRIBE_KV: kv(), RESEND_API_KEY: 'k' };
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 500 })));
    expect((await onRequestPost({ request: post({ email: 'a@b.co', consent: true }), env })).status).toBe(502);
    expect((await onRequestPost({ request: post({ email: 'a@b.co', consent: true }), env: { SUBSCRIBE_KV: kv(), RESEND_API_KEY: '' } })).status).toBe(503);
  });
});

describe('woody waiting list: the link in the email', () => {
  const link = (token: string) => ({ request: new Request(`https://subscribe.wojciech.io/api/woody-confirm?token=${token}`), env: { SUBSCRIBE_KV: store } });
  let store: ReturnType<typeof kv>;
  const TOKEN = '11111111-2222-4333-8444-555555555555';
  beforeEach(() => { store = kv(); });

  it('puts the address on the list with both times, sends the person back to the page, and survives a second click', async () => {
    store.m.set(`woody-pending:${TOKEN}`, JSON.stringify({ email: 'reader@example.com', consentAt: '2026-11-16T10:00:00.000Z' }));
    const res = await confirm(link(TOKEN));
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('https://wojciech.io/woody/?confirmed=1#join');
    const row = JSON.parse(store.m.get('woody:reader@example.com')!);
    expect(row).toMatchObject({ email: 'reader@example.com', consentAt: '2026-11-16T10:00:00.000Z', source: 'woody-landing' });
    expect(typeof row.confirmedAt).toBe('string');
    expect(store.m.has(`woody-pending:${TOKEN}`)).toBe(false);
    expect((await confirm(link(TOKEN))).headers.get('location')).toBe('https://wojciech.io/woody/?confirmed=1#join');
  });

  it('refuses a link that is incomplete, unknown or expired, with a page that leads back', async () => {
    expect((await confirm(link('not-a-token'))).status).toBe(400);
    const gone = await confirm(link(TOKEN));
    expect(gone.status).toBe(410);
    expect(await gone.text()).toContain('wojciech.io/woody/#join');
  });
});

describe('woody waiting list: the emails', () => {
  it('carry the link, the banner and the plain text, and have no dashes in the copy', () => {
    const mail = woodyConfirmationEmail({ confirmUrl: 'https://subscribe.wojciech.io/api/woody-confirm?token=abc' });
    expect(mail.html).toContain('https://subscribe.wojciech.io/api/woody-confirm?token=abc');
    expect(mail.html).toContain('https://wojciech.io/woody/img/mail-woody.jpg');
    expect(mail.text).toContain('Confirm my place: https://subscribe.wojciech.io/api/woody-confirm?token=abc');
    for (const m of [mail, woodyAlreadyEmail()]) {
      expect(m.subject + m.text).not.toMatch(/[—–]/);
      expect(m.html).not.toMatch(/[—–]/);
    }
  });
});
