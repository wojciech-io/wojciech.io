// D1 read layer. Returns null when database is empty (caller falls back to dummy).

import type {
  AcquisitionDay, Lead, PipelineStage, SourceBreakdown,
  HeadlineMetrics, DashboardData,
} from '../types';

export interface D1Env {
  DB: D1Database;
}

function pct(now: number, prev: number): number {
  if (!prev) return 0;
  return (now - prev) / prev;
}

export async function readDashboard(env: D1Env): Promise<DashboardData | null> {
  const db = env.DB;
  if (!db) return null;

  // Acquisition — last 14 days for sparkline, last 7 + previous 7 for delta.
  const acqRows = await db.prepare(
    'SELECT date, sessions, signups, leads, cpl_cents FROM acquisition_daily ORDER BY date DESC LIMIT 14'
  ).all<AcquisitionDay>();
  const acquisition = (acqRows.results || []).slice().reverse();
  if (acquisition.length === 0) return null;

  const last7 = acquisition.slice(-7);
  const prev7 = acquisition.slice(-14, -7);
  const sum = (arr: AcquisitionDay[], k: keyof AcquisitionDay) =>
    arr.reduce((a, b) => a + (Number(b[k]) || 0), 0);

  const sessions_7d = sum(last7, 'sessions');
  const signups_7d = sum(last7, 'signups');
  const leads_7d = sum(last7, 'leads');
  // CPL weighted by ad spend isn't stored directly; use mean.
  const cpl_7d_cents = last7.length
    ? Math.round(sum(last7, 'cpl_cents') / last7.length)
    : 0;

  // Source breakdown from most recent row.
  const sourcesRaw = (acquisition[acquisition.length - 1] as any).source_breakdown_json;
  let sources: SourceBreakdown[] = [];
  try {
    sources = sourcesRaw ? JSON.parse(sourcesRaw as string) : [];
  } catch { sources = []; }

  // Pipeline — most recent snapshot.
  const latestPipelineDate = await db.prepare(
    'SELECT MAX(date) AS d FROM pipeline_snapshot'
  ).first<{ d: string | null }>();
  let pipeline: PipelineStage[] = [];
  let pipeline_total_cents = 0;
  let pipeline_delta = 0;
  if (latestPipelineDate?.d) {
    const pipeRows = await db.prepare(
      'SELECT stage, count, amount_cents FROM pipeline_snapshot WHERE date = ?'
    ).bind(latestPipelineDate.d).all<PipelineStage>();
    pipeline = pipeRows.results || [];
    pipeline_total_cents = pipeline.reduce((a, b) => a + (b.amount_cents || 0), 0);

    // Delta — 7 days back.
    const sevenAgo = new Date(latestPipelineDate.d);
    sevenAgo.setDate(sevenAgo.getDate() - 7);
    const sevenStr = sevenAgo.toISOString().slice(0, 10);
    const prev = await db.prepare(
      'SELECT COALESCE(SUM(amount_cents),0) AS total FROM pipeline_snapshot WHERE date <= ? GROUP BY date ORDER BY date DESC LIMIT 1'
    ).bind(sevenStr).first<{ total: number }>();
    pipeline_delta = pct(pipeline_total_cents, prev?.total || 0);
  }

  // Won MTD.
  const monthStart = new Date(); monthStart.setDate(1);
  const monthStr = monthStart.toISOString().slice(0, 10);
  const won = await db.prepare(
    "SELECT COALESCE(SUM(amount_cents),0) AS total, COUNT(*) AS n FROM deals_closed WHERE outcome='won' AND closed_at >= ?"
  ).bind(monthStr).first<{ total: number; n: number }>();

  // Top leads by score.
  const leadsRes = await db.prepare(
    'SELECT id, source, created_at, icp_score, behaviour_score, total_score, stage, amount_cents, industry, company_size, role FROM leads ORDER BY total_score DESC LIMIT 8'
  ).all<Lead>();
  const topLeads = (leadsRes.results || []).map(l => ({
    ...l,
    amount_cents: l.amount_cents || 0,
    industry: l.industry || '—',
    company_size: l.company_size || '—',
    role: l.role || '—',
    stage: l.stage || 'New',
  }));

  // Freshness — last sync per source.
  const freshRes = await db.prepare(
    "SELECT source, MAX(ran_at) AS latest_sync_at FROM sync_log WHERE status='ok' GROUP BY source"
  ).all<{ source: string; latest_sync_at: string }>();

  const headline: HeadlineMetrics = {
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
  };

  return {
    headline,
    acquisition,
    sources,
    pipeline,
    topLeads,
    source: 'd1',
    freshness: freshRes.results,
  };
}
