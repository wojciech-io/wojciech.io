// GA4 adapter — pulls daily sessions/signups/source breakdown, writes to acquisition_daily.
// Stub: real fetch wired when GA4_PROPERTY_ID + GA4_SERVICE_ACCOUNT_JSON are set.
//
// Required env vars:
//   GA4_PROPERTY_ID         (Plain)  — e.g. "properties/123456789"
//   GA4_SERVICE_ACCOUNT_JSON (Secret) — full service account JSON (paste in dashboard)
//
// Uses Google Analytics Data API v1beta with JWT auth (no SDK — manual JWT sign
// to keep the Worker lean).

import type { D1Database } from '@cloudflare/workers-types';

export interface GA4Env {
  DB: D1Database;
  GA4_PROPERTY_ID?: string;
  GA4_SERVICE_ACCOUNT_JSON?: string;
}

interface SyncResult { rows_written: number; error?: string }

export async function syncGA4(env: GA4Env): Promise<SyncResult> {
  if (!env.GA4_PROPERTY_ID || !env.GA4_SERVICE_ACCOUNT_JSON) {
    return { rows_written: 0, error: 'ga4-not-configured' };
  }

  // Get OAuth access token from service account (JWT bearer flow).
  const sa = JSON.parse(env.GA4_SERVICE_ACCOUNT_JSON);
  const accessToken = await mintGoogleAccessToken(sa);

  // Pull last 14 days of sessions + source breakdown.
  const reportRes = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/${env.GA4_PROPERTY_ID}:runReport`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRanges: [{ startDate: '14daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'date' }, { name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
      }),
    },
  );
  if (!reportRes.ok) {
    return { rows_written: 0, error: `ga4 HTTP ${reportRes.status}` };
  }
  const report = await reportRes.json() as any;
  const rows = report.rows || [];

  // Aggregate: { date → { total, breakdown: { source → sessions } } }
  const byDate = new Map<string, { total: number; breakdown: Record<string, number> }>();
  for (const r of rows) {
    const date = formatGADate(r.dimensionValues[0].value);
    const source = r.dimensionValues[1].value || 'Direct';
    const sessions = parseInt(r.metricValues[0].value, 10);
    const acc = byDate.get(date) || { total: 0, breakdown: {} };
    acc.total += sessions;
    acc.breakdown[source] = (acc.breakdown[source] || 0) + sessions;
    byDate.set(date, acc);
  }

  let written = 0;
  for (const [date, { total, breakdown }] of byDate) {
    const breakdownArr = Object.entries(breakdown)
      .map(([source, sessions]) => ({ source, sessions, share: sessions / total }))
      .sort((a, b) => b.sessions - a.sessions);
    await env.DB.prepare(
      `INSERT INTO acquisition_daily (date, sessions, source_breakdown_json, source)
       VALUES (?, ?, ?, 'ga4')
       ON CONFLICT(date) DO UPDATE SET sessions=excluded.sessions, source_breakdown_json=excluded.source_breakdown_json`
    ).bind(date, total, JSON.stringify(breakdownArr)).run();
    written++;
  }
  return { rows_written: written };
}

function formatGADate(yyyymmdd: string): string {
  return `${yyyymmdd.slice(0,4)}-${yyyymmdd.slice(4,6)}-${yyyymmdd.slice(6,8)}`;
}

// Mint Google access token from service account JSON via JWT bearer grant.
async function mintGoogleAccessToken(sa: { client_email: string; private_key: string }): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const b64 = (o: object) => btoa(JSON.stringify(o)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const toSign = `${b64(header)}.${b64(claims)}`;

  // Import RSA private key from PEM.
  const pemBody = sa.private_key.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const der = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'pkcs8', der,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign'],
  );
  const sigBuf = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(toSign));
  const sig = btoa(String.fromCharCode(...new Uint8Array(sigBuf)))
    .replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const jwt = `${toSign}.${sig}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const tokenJson = await tokenRes.json() as any;
  if (!tokenJson.access_token) throw new Error('ga4 token mint failed: ' + JSON.stringify(tokenJson));
  return tokenJson.access_token;
}
