// POST /api/sync — manual trigger for GA4 + Pipedrive pull. Gated by middleware
// (only authed user can hit). Same handler can be wired to a CF Cron Trigger
// later by binding this Function to a schedule.
//
// Adapter modules can't be imported here directly (Pages Functions and Astro
// SSR share env but live in separate bundles). To keep build simple, the
// sync handler is a thin shim that calls a /sync internal endpoint on the
// Astro side via env.ASSETS — or, equivalently, performs the work here using
// inlined adapter logic. v1.1 ships the inlined version; v1.2 will switch to
// shared package.

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
  const source = url.searchParams.get('source'); // optional: 'ga4' | 'pipedrive'

  const results: Record<string, { rows_written: number; error?: string }> = {};

  if (!source || source === 'ga4') {
    results.ga4 = await runGA4(env);
    await logSync(env.DB, 'ga4', results.ga4);
  }
  if (!source || source === 'pipedrive') {
    results.pipedrive = await runPipedrive(env);
    await logSync(env.DB, 'pipedrive', results.pipedrive);
  }

  return new Response(JSON.stringify({ ok: true, results }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

async function logSync(db: D1Database, source: string, r: { rows_written: number; error?: string }) {
  await db.prepare(
    "INSERT INTO sync_log (source, status, rows_written, error_message) VALUES (?, ?, ?, ?)"
  ).bind(source, r.error ? 'error' : 'ok', r.rows_written, r.error || null).run();
}

// --- inlined stubs — full logic mirrors src/lib/adapters/{ga4,pipedrive}.ts ---
async function runGA4(env: Env): Promise<{ rows_written: number; error?: string }> {
  if (!env.GA4_PROPERTY_ID || !env.GA4_SERVICE_ACCOUNT_JSON) {
    return { rows_written: 0, error: 'ga4-not-configured' };
  }
  // Placeholder: real implementation in src/lib/adapters/ga4.ts. Wiring it
  // through the Functions bundle requires either: (a) duplicating the code
  // here, (b) extracting to a packages/ workspace and importing both sides.
  // Defer to v1.2; this endpoint returns "not-configured" until then.
  return { rows_written: 0, error: 'ga4-adapter-not-yet-wired' };
}

async function runPipedrive(env: Env): Promise<{ rows_written: number; error?: string }> {
  if (!env.PIPEDRIVE_API_TOKEN || !env.PIPEDRIVE_DOMAIN) {
    return { rows_written: 0, error: 'pipedrive-not-configured' };
  }
  return { rows_written: 0, error: 'pipedrive-adapter-not-yet-wired' };
}
