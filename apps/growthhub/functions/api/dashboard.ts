// GET /api/dashboard — returns DashboardData JSON.
// Reads from D1 (production); falls back to "empty" signal so client can
// render dummy with banner. Gated by middleware (member-only).
//
// Mirrors src/lib/data/d1.ts logic but lives in Functions so it can access
// the D1 binding directly. v1.2 will dedupe into a shared package.

interface Env { DB: D1Database; }

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const { env } = ctx;
  if (!env.DB) {
    return json({ source: 'empty', reason: 'no-binding' });
  }

  // Bail early if no acquisition rows exist — empty DB.
  const probe = await env.DB.prepare('SELECT COUNT(*) AS n FROM acquisition_daily').first<{ n: number }>();
  if (!probe || probe.n === 0) {
    return json({ source: 'empty', reason: 'no-rows' });
  }

  const acqRows = await env.DB.prepare(
    'SELECT date, sessions, signups, leads, cpl_cents, source_breakdown_json FROM acquisition_daily ORDER BY date DESC LIMIT 14'
  ).all();
  const acquisition = (acqRows.results || []).slice().reverse() as any[];

  const last7 = acquisition.slice(-7);
  const prev7 = acquisition.slice(-14, -7);
  const sum = (arr: any[], k: string) => arr.reduce((a, b) => a + (Number(b[k]) || 0), 0);
  const pct = (a: number, b: number) => b ? (a - b) / b : 0;

  const sessions_7d = sum(last7, 'sessions');
  const signups_7d = sum(last7, 'signups');
  const leads_7d = sum(last7, 'leads');
  const cpl_7d_cents = last7.length ? Math.round(sum(last7, 'cpl_cents') / last7.length) : 0;

  let sources: any[] = [];
  try {
    sources = acquisition.length ? JSON.parse(acquisition[acquisition.length - 1].source_breakdown_json || '[]') : [];
  } catch { sources = []; }

  const latestPipe = await env.DB.prepare('SELECT MAX(date) AS d FROM pipeline_snapshot').first<{ d: string | null }>();
  let pipeline: any[] = [];
  let pipeline_total_cents = 0;
  let pipeline_delta = 0;
  if (latestPipe?.d) {
    const pr = await env.DB.prepare(
      'SELECT stage, count, amount_cents FROM pipeline_snapshot WHERE date = ?'
    ).bind(latestPipe.d).all();
    pipeline = pr.results || [];
    pipeline_total_cents = pipeline.reduce((a, b: any) => a + (b.amount_cents || 0), 0);
    const sevenAgo = new Date(latestPipe.d); sevenAgo.setDate(sevenAgo.getDate() - 7);
    const prev = await env.DB.prepare(
      'SELECT COALESCE(SUM(amount_cents),0) AS total FROM pipeline_snapshot WHERE date <= ? GROUP BY date ORDER BY date DESC LIMIT 1'
    ).bind(sevenAgo.toISOString().slice(0, 10)).first<{ total: number }>();
    pipeline_delta = pct(pipeline_total_cents, prev?.total || 0);
  }

  const monthStart = new Date(); monthStart.setDate(1);
  const won = await env.DB.prepare(
    "SELECT COALESCE(SUM(amount_cents),0) AS total, COUNT(*) AS n FROM deals_closed WHERE outcome='won' AND closed_at >= ?"
  ).bind(monthStart.toISOString().slice(0, 10)).first<{ total: number; n: number }>();

  const leadsRes = await env.DB.prepare(
    'SELECT id, source, created_at, icp_score, behaviour_score, total_score, stage, amount_cents, industry, company_size, role FROM leads ORDER BY total_score DESC LIMIT 8'
  ).all();
  const topLeads = (leadsRes.results || []).map((l: any) => ({
    ...l,
    amount_cents: l.amount_cents || 0,
    industry: l.industry || '—',
    company_size: l.company_size || '—',
    role: l.role || '—',
    stage: l.stage || 'New',
  }));

  return json({
    source: 'd1',
    headline: {
      sessions_7d,
      sessions_7d_delta: pct(sessions_7d, sum(prev7, 'sessions')),
      signups_7d,
      signups_7d_delta: pct(signups_7d, sum(prev7, 'signups')),
      leads_7d,
      leads_7d_delta: pct(leads_7d, sum(prev7, 'leads')),
      cpl_7d_cents,
      cpl_7d_delta: pct(cpl_7d_cents, prev7.length ? sum(prev7, 'cpl_cents') / prev7.length : 0),
      pipeline_total_cents,
      pipeline_delta,
      won_mtd_cents: won?.total || 0,
      won_count_mtd: won?.n || 0,
    },
    acquisition,
    sources,
    pipeline,
    topLeads,
  });
};

function json(obj: unknown): Response {
  return new Response(JSON.stringify(obj), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
