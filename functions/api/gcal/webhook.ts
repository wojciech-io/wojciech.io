// POST /api/gcal/webhook — receiver for Google Calendar push notifications.
//
// Google POSTs here whenever the owner's calendar changes (headers only — no
// body of substance). We verify the ping carries the channel token we handed
// Google at watch time, then sweep: any confirmed upcoming booking whose Google
// event was deleted/cancelled directly in Calendar gets freed in D1.
//
// Always answers 200. A non-2xx would make Google retry and eventually kill the
// channel, so every failure is swallowed and acknowledged.

import { syncCancellations, channelToken } from '../../_utils/gcal-channel';
import type { GcalEnv } from '../../_utils/gcal';

interface Env extends GcalEnv {
  DB?: D1Database;
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  const state = request.headers.get('x-goog-resource-state') || '';
  const token = request.headers.get('x-goog-channel-token') || '';

  // 'sync' is Google's one-off handshake right after watch — acknowledge only.
  if (state === 'sync') return new Response(null, { status: 200 });

  try {
    if (env.DB && token) {
      const expected = await channelToken(env);
      if (expected && token === expected) {
        await syncCancellations(env, new Date());
      }
    }
  } catch {
    /* swallow — never signal an error back to Google */
  }
  return new Response(null, { status: 200 });
}

// The endpoint only exists for Google's POST pings.
export function onRequestGet() {
  return new Response(null, { status: 405, headers: { 'cache-control': 'no-store' } });
}
