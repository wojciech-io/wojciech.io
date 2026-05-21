// Meta Ads adapter — pulls ad-account insights (spend/clicks/leads), writes paid_daily.
// Stub: real fetch wired when the env vars below are set. Until then the
// playground renders synthetic paidChannels from lib/dummy-data.ts.
//
// Required env vars:
//   META_ACCESS_TOKEN   (Secret) — long-lived system-user token, ads_read scope
//   META_AD_ACCOUNT_ID  (Plain)  — e.g. "act_1234567890"
//
// Target table: paid_daily(date, platform, spend_cents, clicks, leads, source).
// Graph API: GET /{ad_account}/insights?fields=spend,clicks,actions
//   &time_increment=1&date_preset=last_7d. spend is in account currency units.

import type { D1Database } from '@cloudflare/workers-types';

export interface MetaAdsEnv {
  DB: D1Database;
  META_ACCESS_TOKEN?: string;
  META_AD_ACCOUNT_ID?: string;
}

interface SyncResult { rows_written: number; error?: string }

export async function syncMetaAds(env: MetaAdsEnv): Promise<SyncResult> {
  if (!env.META_ACCESS_TOKEN || !env.META_AD_ACCOUNT_ID) {
    return { rows_written: 0, error: 'meta-ads-not-configured' };
  }

  // TODO(real-integration): GET
  //   https://graph.facebook.com/v20.0/{META_AD_ACCOUNT_ID}/insights
  //   ?fields=spend,clicks,actions&time_increment=1&date_preset=last_7d
  //   &access_token=...
  // Map spend → spend_cents (round(spend*100)); pull lead actions from
  // actions[] where action_type='lead'; upsert paid_daily platform='meta-ads'.
  return { rows_written: 0, error: 'meta-ads-not-implemented' };
}
