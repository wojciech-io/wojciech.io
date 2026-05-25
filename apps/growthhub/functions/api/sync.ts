// POST /api/sync — manual trigger for GA4 + Pipedrive pull. Gated by middleware.
// Optionally wire to a CF Cron Trigger by adding a [triggers] schedule in wrangler.toml.
// ?source=ga4|pipedrive  limits to one adapter; omit to run all.

import { syncGA4 } from '../../src/lib/adapters/ga4';
import { syncPipedrive } from '../../src/lib/adapters/pipedrive';

interface Env {
  DB: D1Database;
  PIPEDRIVE_API_TOKEN?: string;
  PIPEDRIVE_DOMAIN?: string;
  GA4_PROPERTY_ID?: string;
  GA4_SERVICE_ACCOUNT_JSON?: string;
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { env, request } = ctx;
  const url = new URL(request.url);
  const source = url.searchParams.get('source');

  const results: Record<string, { rows_written: number; error?: string }> = {};

  if (!source || source === 'ga4') {
    results.ga4 = await syncGA4(env);
    await logSync(env.DB, 'ga4', results.ga4);
  }
  if (!source || source === 'pipedrive') {
    results.pipedrive = await syncPipedrive(env);
    await logSync(env.DB, 'pipedrive', results.pipedrive);
  }

  return new Response(JSON.stringify({ ok: true, results }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

async function logSync(db: D1Database, source: string, r: { rows_written: number; error?: string }) {
  await db.prepare(
    'INSERT INTO sync_log (source, status, rows_written, error_message) VALUES (?, ?, ?, ?)'
  ).bind(source, r.error ? 'error' : 'ok', r.rows_written, r.error ?? null).run();
}
