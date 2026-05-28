// GET /api/sync/status — returns last sync run per source + row counts.
// Gated by middleware (member-only). Useful for confirming cron ran OK.

interface Env { DB: D1Database }

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const { env } = ctx;
  if (!env.DB) return json({ ok: false, error: 'no-binding' }, 500);

  // Last run per source
  const rows = await env.DB.prepare(`
    SELECT source, status, rows_written, error_message, ran_at
    FROM sync_log
    WHERE id IN (
      SELECT MAX(id) FROM sync_log GROUP BY source
    )
    ORDER BY ran_at DESC
  `).all();

  // Last 10 runs overall
  const recent = await env.DB.prepare(`
    SELECT source, status, rows_written, error_message, ran_at
    FROM sync_log ORDER BY id DESC LIMIT 10
  `).all();

  return json({
    ok: true,
    latest_per_source: rows.results || [],
    recent_runs: recent.results || [],
  });
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
