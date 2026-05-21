// HubSpot CRM adapter — alternative to Pipedrive. Pulls deals/contacts,
// normalises into leads + pipeline_snapshot + deals_closed (same tables as
// the Pipedrive adapter, so the dashboard is CRM-agnostic).
// Stub: real fetch wired when HUBSPOT_PRIVATE_APP_TOKEN is set.
//
// Required env vars:
//   HUBSPOT_PRIVATE_APP_TOKEN  (Secret) — private app token with
//     crm.objects.deals.read + crm.objects.contacts.read scopes
//
// Scoring rules live in ../scoring.ts (shared with Pipedrive).

import type { D1Database } from '@cloudflare/workers-types';
import { scoreLead } from '../scoring';

export interface HubSpotEnv {
  DB: D1Database;
  HUBSPOT_PRIVATE_APP_TOKEN?: string;
}

interface SyncResult { rows_written: number; error?: string }

export async function syncHubSpot(env: HubSpotEnv): Promise<SyncResult> {
  if (!env.HUBSPOT_PRIVATE_APP_TOKEN) {
    return { rows_written: 0, error: 'hubspot-not-configured' };
  }

  // TODO(real-integration): GET
  //   https://api.hubapi.com/crm/v3/objects/deals?properties=amount,dealstage,closedate
  //   and /contacts?properties=jobtitle,industry,num_associated_deals
  // with Bearer HUBSPOT_PRIVATE_APP_TOKEN. Run each contact through scoreLead()
  // and upsert into leads; group open deals into pipeline_snapshot; push
  // closed-won/lost into deals_closed with source='hubspot'.
  void scoreLead;
  return { rows_written: 0, error: 'hubspot-not-implemented' };
}
