// Shared types for GrowthHub data model. Mirrors D1 schema (apps/growthhub/migrations/).

export interface AcquisitionDay {
  date: string;            // YYYY-MM-DD
  sessions: number;
  signups: number;
  leads: number;
  cpl_cents: number;
}

export interface Lead {
  id: string;
  source: string;
  created_at: string;
  icp_score: number;
  behaviour_score: number;
  total_score: number;
  stage: string;
  amount_cents: number;
  industry: string;
  company_size: string;
  role: string;
}

export interface PipelineStage {
  stage: string;
  count: number;
  amount_cents: number;
}

export interface SourceBreakdown {
  source: string;
  sessions: number;
  share: number;
}

export interface HeadlineMetrics {
  sessions_7d: number;
  sessions_7d_delta: number;
  signups_7d: number;
  signups_7d_delta: number;
  leads_7d: number;
  leads_7d_delta: number;
  cpl_7d_cents: number;
  cpl_7d_delta: number;
  pipeline_total_cents: number;
  pipeline_delta: number;
  won_mtd_cents: number;
  won_count_mtd: number;
}

export interface DashboardData {
  headline: HeadlineMetrics;
  acquisition: AcquisitionDay[];
  sources: SourceBreakdown[];
  pipeline: PipelineStage[];
  topLeads: Lead[];
  // Provenance — UI shows banner when fallback used
  source: 'd1' | 'dummy';
  freshness?: { latest_sync_at: string; source: string }[];
}
