import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onRequestGet } from '../../apps/subscribe/functions/api/confirm';

describe('subscription confirmation', () => {
  const email = 'subscriber@example.com';
  const token = 'confirmation-token';
  let records: Map<string, string>;
  let fetchMock: ReturnType<typeof vi.fn>;
  let kv: { get: ReturnType<typeof vi.fn>; put: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    records = new Map([[`pending:${token}`, JSON.stringify({ email, consentAt: '2026-10-06T00:00:00Z' })]]);
    kv = {
      get: vi.fn(async (key: string) => records.get(key) ?? null),
      put: vi.fn(async (key: string, value: string) => { records.set(key, value); }),
      delete: vi.fn(async (key: string) => { records.delete(key); }),
    };
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  function confirm(apiKey = 'test-key', query = `?token=${token}`) {
    return onRequestGet({
      request: new Request(`https://subscribe.wojciech.io/api/confirm${query}`),
      env: { SUBSCRIBE_KV: kv as never, RESEND_API_KEY: apiKey },
    });
  }

  function lookup(contact: Record<string, unknown> | null) {
    fetchMock.mockResolvedValueOnce(Response.json(contact || {}, { status: contact ? 200 : 404 }));
  }

  it('creates a global Resend contact without an audience setting before reporting success', async () => {
    lookup(null);
    fetchMock.mockResolvedValueOnce(Response.json({ id: 'contact-id' }));
    fetchMock.mockResolvedValueOnce(Response.json({ id: 'welcome-id' }));
    const response = await confirm();
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toContain('confirmed=1');
    expect(fetchMock.mock.calls[1][0]).toBe('https://api.resend.com/contacts');
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ email, unsubscribed: false });
    expect(records.has(`pending:${token}`)).toBe(false);
    expect(records.get(`confirmed:${token}`)).toBe('contact-id');
    expect(JSON.parse(records.get(`consent:${email}`)!)).toMatchObject({ contactId: 'contact-id', consentAt: '2026-10-06T00:00:00Z' });
  });

  it.each([403, 429, 500])('preserves the token and avoids false success after Resend HTTP %s', async (status) => {
    lookup(null);
    fetchMock.mockResolvedValueOnce(Response.json({ message: 'provider error' }, { status }));
    const response = await confirm();
    expect(response.status).toBe(503);
    expect(records.has(`pending:${token}`)).toBe(true);
    expect(records.has(`consent:${email}`)).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(await response.text()).toContain('Try again');
  });

  it('preserves the token after a network failure', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network failure'));
    expect((await confirm()).status).toBe(503);
    expect(records.has(`pending:${token}`)).toBe(true);
  });

  it('requires a Resend key before consuming the token', async () => {
    expect((await confirm('')).status).toBe(503);
    expect(records.has(`pending:${token}`)).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not claim confirmation for an expired or unknown token', async () => {
    records.clear();
    expect((await confirm()).status).toBe(410);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns a visible error for a missing token', async () => {
    expect((await confirm('test-key', '')).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('handles a confirmed-token replay without duplicate writes or messages', async () => {
    records.clear();
    records.set(`confirmed:${token}`, 'contact-id');
    expect((await confirm()).status).toBe(302);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(kv.put).not.toHaveBeenCalled();
  });

  it('accepts legacy tokens and keeps an existing contact without sending another welcome', async () => {
    records.set(`pending:${token}`, email);
    records.set(`consent:${email}`, JSON.stringify({ confirmedAt: '2026-07-03T00:00:00Z' }));
    lookup({ id: 'existing-id', unsubscribed: false });
    expect((await confirm()).status).toBe(302);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(records.get(`consent:${email}`)!)).toMatchObject({ confirmedAt: '2026-07-03T00:00:00Z', contactId: 'existing-id' });
  });

  it('requires successful contact activation for a new opt-in by an unsubscribed contact', async () => {
    lookup({ id: 'existing-id', unsubscribed: true });
    fetchMock.mockResolvedValueOnce(Response.json({}, { status: 500 }));
    expect((await confirm()).status).toBe(503);
    expect(fetchMock.mock.calls[1][1].method).toBe('PATCH');
    expect(records.has(`pending:${token}`)).toBe(true);
  });

  it('does not consume the token when storing the consent record fails', async () => {
    lookup({ id: 'existing-id', unsubscribed: false });
    kv.put.mockRejectedValueOnce(new Error('KV unavailable'));
    expect((await confirm()).status).toBe(503);
    expect(records.has(`pending:${token}`)).toBe(true);
  });

  it('rejects malformed stored email data before calling Resend', async () => {
    records.set(`pending:${token}`, JSON.stringify({ email: 42 }));
    expect((await confirm()).status).toBe(410);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('retries a rate-limited welcome with the same idempotency key without rewriting the contact', async () => {
    vi.useFakeTimers();
    lookup(null);
    fetchMock.mockResolvedValueOnce(Response.json({ id: 'contact-id' }));
    fetchMock.mockResolvedValueOnce(Response.json({}, { status: 429 }));
    fetchMock.mockResolvedValueOnce(Response.json({ id: 'welcome-id' }));
    const confirmation = confirm();
    await vi.runAllTimersAsync();
    expect((await confirmation).status).toBe(302);
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock.mock.calls[2][1].headers['Idempotency-Key']).toBe('subscription-welcome/confirmation-token');
    expect(fetchMock.mock.calls[3][1].headers['Idempotency-Key']).toBe(fetchMock.mock.calls[2][1].headers['Idempotency-Key']);
    expect(records.has(`pending:${token}`)).toBe(false);
  });
});
