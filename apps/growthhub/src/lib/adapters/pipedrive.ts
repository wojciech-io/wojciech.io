// Pipedrive adapter — pulls deals/persons, normalises into leads + pipeline_snapshot + deals_closed.
// Stub: real fetch wired when PIPEDRIVE_API_TOKEN is set in env.
//
// Required env vars:
//   PIPEDRIVE_API_TOKEN  (Secret) — read-only personal API token
//   PIPEDRIVE_DOMAIN     (Plain)  — e.g. "wojciech" → wojciech.pipedrive.com
//
// Scoring rules live in ../scoring.ts. We push raw fields into leads, scoring
// is calculated at write time.

import type { D1Database } from '@cloudflare/workers-types';
import { scoreLead } from '../scoring';

export interface PipedriveEnv {
  DB: D1Database;
  PIPEDRIVE_API_TOKEN?: string;
  PIPEDRIVE_DOMAIN?: string;
}

interface SyncResult { rows_written: number; error?: string }

export async function syncPipedrive(env: PipedriveEnv): Promise<SyncResult> {
  if (!env.PIPEDRIVE_API_TOKEN || !env.PIPEDRIVE_DOMAIN) {
    return { rows_written: 0, error: 'pipedrive-not-configured' };
  }

  const base = `https://${env.PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1`;
  const auth = `api_token=${env.PIPEDRIVE_API_TOKEN}`;

  // Resolve stage IDs → human-readable names once per sync.
  const stageMap = await fetchStageMap(base, auth);

  // 1. Persons — feed `leads` table.
  const personsRes = await fetch(`${base}/persons?limit=500&sort=update_time DESC&${auth}`);
  if (!personsRes.ok) {
    return { rows_written: 0, error: `persons HTTP ${personsRes.status}` };
  }
  const persons = (await personsRes.json() as any).data || [];

  let written = 0;
  for (const p of persons) {
    const stage = p.open_deals_count > 0 ? 'Open' : (p.closed_deals_count > 0 ? 'Closed' : 'New');
    const amount_cents = Math.round((p.value || 0) * 100);
    const industry = p.org_id?.label_ids?.[0] || null;
    const company_size = null;
    const role = p.title || null;
    const scored = scoreLead({ industry, company_size, role, source: 'inbound-form' });

    await env.DB.prepare(
      `INSERT INTO leads (id, source, created_at, icp_score, behaviour_score, total_score, stage, amount_cents, industry, company_size, role, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(id) DO UPDATE SET
         stage=excluded.stage, amount_cents=excluded.amount_cents,
         icp_score=excluded.icp_score, behaviour_score=excluded.behaviour_score,
         total_score=excluded.total_score, updated_at=CURRENT_TIMESTAMP`
    ).bind(
      `pd-${p.id}`, 'inbound-form', p.add_time, scored.icp, scored.behaviour, scored.total,
      stage, amount_cents, industry, company_size, role,
    ).run();
    written++;
  }

  // 2. Pipeline snapshot — group open deals by resolved stage name.
  const dealsRes = await fetch(`${base}/deals?status=open&limit=500&${auth}`);
  if (dealsRes.ok) {
    const deals = (await dealsRes.json() as any).data || [];
    const byStage = new Map<string, { count: number; amount: number }>();
    for (const d of deals) {
      const stage = stageMap.get(d.stage_id) ?? d.stage_name ?? 'Unknown';
      const acc = byStage.get(stage) || { count: 0, amount: 0 };
      acc.count++;
      acc.amount += Math.round((d.value || 0) * 100);
      byStage.set(stage, acc);
    }
    const today = new Date().toISOString().slice(0, 10);
    for (const [stage, { count, amount }] of byStage) {
      await env.DB.prepare(
        `INSERT INTO pipeline_snapshot (date, stage, count, amount_cents) VALUES (?, ?, ?, ?)
         ON CONFLICT(date, stage) DO UPDATE SET count=excluded.count, amount_cents=excluded.amount_cents`
      ).bind(today, stage, count, amount).run();
    }
  }

  // 3. Closed deals — won/lost.
  const closedRes = await fetch(`${base}/deals?status=closed&limit=200&${auth}`);
  if (closedRes.ok) {
    const closed = (await closedRes.json() as any).data || [];
    for (const d of closed) {
      const outcome = d.status === 'won' ? 'won' : 'lost';
      const closed_at = d.close_time || d.update_time;
      const cycle_days = d.add_time && closed_at
        ? Math.round((new Date(closed_at).getTime() - new Date(d.add_time).getTime()) / 86_400_000)
        : null;
      await env.DB.prepare(
        `INSERT INTO deals_closed (id, closed_at, outcome, amount_cents, cycle_days, source) VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET outcome=excluded.outcome, amount_cents=excluded.amount_cents, cycle_days=excluded.cycle_days`
      ).bind(`pd-${d.id}`, closed_at, outcome, Math.round((d.value || 0) * 100), cycle_days, 'pipedrive').run();
    }
  }

  return { rows_written: written };
}

async function fetchStageMap(base: string, auth: string): Promise<Map<number, string>> {
  const map = new Map<number, string>();
  try {
    const res = await fetch(`${base}/stages?${auth}`);
    if (!res.ok) return map;
    const stages = (await res.json() as any).data || [];
    for (const s of stages) map.set(s.id, s.name);
  } catch {
    // Non-fatal — fall back to deal's stage_name field
  }
  return map;
}
