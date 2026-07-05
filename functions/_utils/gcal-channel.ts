// Two-way sync helpers for the /meet Google Calendar webhook.
//
// ensureChannel() keeps a live events.watch push channel registered (called
// from the 15-min reminder cron). syncCancellations() runs on each webhook ping
// and frees any D1 booking whose Google event the owner deleted directly in
// Calendar. Both are best-effort and gated on Google being configured + a DB.

import { isConfigured, watchEvents, stopChannel, getEventStatuses, type GcalEnv } from './gcal';
import { BOOKING_CONTACTS } from '../../src/data/booking';

export interface ChannelEnv extends GcalEnv {
  DB?: D1Database;
}

interface SyncRow {
  channel_id: string | null;
  resource_id: string | null;
  channel_token: string | null;
  expiration: number | null;
}

// Google caps calendar channels at 7 days; renew a day before they lapse so a
// quiet calendar never leaves a stale, silent channel.
const CHANNEL_TTL_SECONDS = 7 * 24 * 3600;
const RENEW_BEFORE_MS = 24 * 3600 * 1000;

/** The registered channel's token, or null. Used by the webhook to verify pings. */
export async function channelToken(env: ChannelEnv): Promise<string | null> {
  if (!env.DB) return null;
  const row = await env.DB.prepare('SELECT channel_token FROM gcal_sync WHERE id = 1').first<{
    channel_token: string | null;
  }>();
  return row?.channel_token ?? null;
}

/** Register a fresh push channel when none exists or it is within a day of expiry. */
export async function ensureChannel(
  env: ChannelEnv,
  webhookUrl: string,
  now: number
): Promise<{ status: 'skipped' | 'fresh' | 'registered' | 'error' }> {
  if (!env.DB || !isConfigured(env)) return { status: 'skipped' };
  try {
    const row = await env.DB.prepare(
      'SELECT channel_id, resource_id, channel_token, expiration FROM gcal_sync WHERE id = 1'
    ).first<SyncRow>();

    if (row?.channel_id && row.expiration && row.expiration - now > RENEW_BEFORE_MS) {
      return { status: 'fresh' };
    }

    // Retire the old channel first so Google isn't left double-pinging.
    if (row?.channel_id && row.resource_id) {
      try {
        await stopChannel(env, row.channel_id, row.resource_id);
      } catch {
        /* already gone / expired — ignore */
      }
    }

    const channelId = crypto.randomUUID();
    const token = (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, '');
    const { resourceId, expiration } = await watchEvents(env, BOOKING_CONTACTS.ownerCalendarId, {
      address: webhookUrl,
      channelId,
      token,
      ttlSeconds: CHANNEL_TTL_SECONDS,
    });

    await env.DB.prepare(
      `UPDATE gcal_sync
          SET channel_id = ?, resource_id = ?, channel_token = ?, expiration = ?,
              updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        WHERE id = 1`
    )
      .bind(channelId, resourceId, token, expiration || now + CHANNEL_TTL_SECONDS * 1000)
      .run();
    return { status: 'registered' };
  } catch {
    return { status: 'error' };
  }
}

/**
 * Free any confirmed, upcoming booking whose Google event was deleted or
 * cancelled directly in Calendar. Setting status='cancelled' reopens the slot
 * (availability counts only confirmed rows). Google already emailed the guest
 * its own cancellation, so no extra mail is sent here.
 */
export async function syncCancellations(
  env: ChannelEnv,
  now: Date
): Promise<{ checked: number; freed: number }> {
  if (!env.DB || !isConfigured(env)) return { checked: 0, freed: 0 };
  const rows = await env.DB.prepare(
    "SELECT id, gcal_event_id FROM bookings WHERE status = 'confirmed' AND gcal_event_id IS NOT NULL AND start_utc > ?"
  )
    .bind(now.toISOString())
    .all<{ id: string; gcal_event_id: string }>();
  const list = rows.results ?? [];
  if (!list.length) return { checked: 0, freed: 0 };

  const statuses = await getEventStatuses(
    env,
    BOOKING_CONTACTS.ownerCalendarId,
    list.map((r) => r.gcal_event_id)
  );

  let freed = 0;
  for (const r of list) {
    const st = statuses[r.gcal_event_id];
    if (st === 'gone' || st === 'cancelled') {
      await env.DB.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ? AND status = 'confirmed'")
        .bind(r.id)
        .run();
      freed += 1;
    }
  }
  return { checked: list.length, freed };
}
