// Google Ads adapter — pulls campaign spend/clicks/conversions, writes paid_daily.
// Stub: real fetch wired when the env vars below are set. Until then the
// playground renders synthetic paidChannels from lib/dummy-data.ts.
//
// Required env vars:
//   GOOGLE_ADS_DEVELOPER_TOKEN   (Secret) — from Google Ads API Center
//   GOOGLE_ADS_CUSTOMER_ID       (Plain)  — 10-digit, no dashes
//   GOOGLE_ADS_REFRESH_TOKEN     (Secret) — OAuth2 refresh token
//   GOOGLE_ADS_CLIENT_ID         (Plain)
//   GOOGLE_ADS_CLIENT_SECRET     (Secret)
//
// Target table: paid_daily(date, platform, spend_cents, clicks, leads, source).
// Query GAQL on customer.googleAds:searchStream, segment by segments.date.

import type { D1Database } from '@cloudflare/workers-types';

export interface GoogleAdsEnv {
  DB: D1Database;
  GOOGLE_ADS_DEVELOPER_TOKEN?: string;
  GOOGLE_ADS_CUSTOMER_ID?: string;
  GOOGLE_ADS_REFRESH_TOKEN?: string;
  GOOGLE_ADS_CLIENT_ID?: string;
  GOOGLE_ADS_CLIENT_SECRET?: string;
}

interface SyncResult { rows_written: number; error?: string }

export async function syncGoogleAds(env: GoogleAdsEnv): Promise<SyncResult> {
  if (
    !env.GOOGLE_ADS_DEVELOPER_TOKEN ||
    !env.GOOGLE_ADS_CUSTOMER_ID ||
    !env.GOOGLE_ADS_REFRESH_TOKEN ||
    !env.GOOGLE_ADS_CLIENT_ID ||
    !env.GOOGLE_ADS_CLIENT_SECRET
  ) {
    return { rows_written: 0, error: 'google-ads-not-configured' };
  }

  // TODO(real-integration): exchange refresh token → access token, then
  // POST GAQL to
  //   https://googleads.googleapis.com/v17/customers/{id}/googleAds:searchStream
  // selecting metrics.cost_micros, metrics.clicks, metrics.conversions
  // grouped by segments.date; upsert into paid_daily with platform='google-ads'.
  // cost_micros / 10_000 = spend_cents.
  return { rows_written: 0, error: 'google-ads-not-implemented' };
}
