// Synthetic data for /demo. Designed to look plausible for a B2B SaaS
// growth team, but is entirely fictional — no real client metrics here.

export interface AcquisitionDay {
  date: string;
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
  company_size: string;
  industry: string;
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

const today = new Date('2026-05-20');
const days = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export const acquisitionLast14: AcquisitionDay[] = [
  { date: days(13), sessions: 1284, signups: 18, leads: 9, cpl_cents: 4200 },
  { date: days(12), sessions: 1391, signups: 21, leads: 11, cpl_cents: 3950 },
  { date: days(11), sessions: 1247, signups: 16, leads: 8, cpl_cents: 4310 },
  { date: days(10), sessions: 1502, signups: 24, leads: 13, cpl_cents: 3780 },
  { date: days(9),  sessions: 1438, signups: 22, leads: 12, cpl_cents: 3890 },
  { date: days(8),  sessions: 1102, signups: 14, leads: 6,  cpl_cents: 4640 },
  { date: days(7),  sessions: 988,  signups: 11, leads: 5,  cpl_cents: 4820 },
  { date: days(6),  sessions: 1521, signups: 26, leads: 14, cpl_cents: 3690 },
  { date: days(5),  sessions: 1612, signups: 28, leads: 16, cpl_cents: 3540 },
  { date: days(4),  sessions: 1489, signups: 23, leads: 12, cpl_cents: 3810 },
  { date: days(3),  sessions: 1573, signups: 27, leads: 15, cpl_cents: 3610 },
  { date: days(2),  sessions: 1428, signups: 21, leads: 11, cpl_cents: 3920 },
  { date: days(1),  sessions: 1357, signups: 19, leads: 10, cpl_cents: 4050 },
  { date: days(0),  sessions: 1492, signups: 24, leads: 13, cpl_cents: 3770 },
];

export const sourceBreakdown: SourceBreakdown[] = [
  { source: 'Organic search', sessions: 7842, share: 0.41 },
  { source: 'Direct',         sessions: 3621, share: 0.19 },
  { source: 'Paid — Google',  sessions: 2980, share: 0.16 },
  { source: 'Paid — LinkedIn', sessions: 1854, share: 0.10 },
  { source: 'Referral',       sessions: 1432, share: 0.07 },
  { source: 'Paid — Meta',    sessions: 970,  share: 0.05 },
  { source: 'Email',          sessions: 414,  share: 0.02 },
];

export const topLeads: Lead[] = [
  { id: 'CRM-8842', source: 'inbound-form', created_at: days(1),  icp_score: 92, behaviour_score: 88, total_score: 90, stage: 'Qualified', amount_cents: 4800000, company_size: '50-200', industry: 'B2B SaaS',     role: 'Head of Growth' },
  { id: 'CRM-8841', source: 'demo-request', created_at: days(2),  icp_score: 88, behaviour_score: 91, total_score: 89, stage: 'Demo',      amount_cents: 7200000, company_size: '200-500', industry: 'Fintech',     role: 'VP Marketing' },
  { id: 'CRM-8839', source: 'inbound-form', created_at: days(2),  icp_score: 85, behaviour_score: 84, total_score: 85, stage: 'Discovery', amount_cents: 3600000, company_size: '50-200', industry: 'DevTools',     role: 'CMO' },
  { id: 'CRM-8837', source: 'newsletter',   created_at: days(3),  icp_score: 78, behaviour_score: 86, total_score: 82, stage: 'Discovery', amount_cents: 2400000, company_size: '20-50',  industry: 'B2B SaaS',     role: 'Growth Lead' },
  { id: 'CRM-8834', source: 'inbound-form', created_at: days(4),  icp_score: 81, behaviour_score: 76, total_score: 79, stage: 'Qualified', amount_cents: 5400000, company_size: '200-500', industry: 'MarTech',      role: 'Head of Demand Gen' },
  { id: 'CRM-8830', source: 'demo-request', created_at: days(5),  icp_score: 72, behaviour_score: 80, total_score: 76, stage: 'Demo',      amount_cents: 3000000, company_size: '50-200', industry: 'Cybersecurity',role: 'VP Marketing' },
  { id: 'CRM-8828', source: 'inbound-form', created_at: days(6),  icp_score: 68, behaviour_score: 74, total_score: 71, stage: 'Discovery', amount_cents: 1800000, company_size: '20-50',  industry: 'AI / ML',       role: 'Marketing Lead' },
  { id: 'CRM-8825', source: 'newsletter',   created_at: days(7),  icp_score: 64, behaviour_score: 70, total_score: 67, stage: 'New',       amount_cents: 1200000, company_size: '10-50',  industry: 'B2B SaaS',     role: 'Founder' },
];

export const pipeline: PipelineStage[] = [
  { stage: 'New',        count: 47, amount_cents: 14100000 },
  { stage: 'Discovery',  count: 23, amount_cents: 8280000 },
  { stage: 'Qualified',  count: 14, amount_cents: 9520000 },
  { stage: 'Demo',       count: 9,  amount_cents: 7920000 },
  { stage: 'Proposal',   count: 5,  amount_cents: 5400000 },
  { stage: 'Negotiation', count: 3, amount_cents: 4200000 },
];

// --- Paid acquisition (Google Ads + Meta Ads + LinkedIn) -------------------
// Synthetic. Wired to real platforms via lib/adapters/{googleads,meta}.ts when
// their env vars are set; until then the playground renders these.
export interface PaidChannel {
  channel: string;
  platform: 'google-ads' | 'meta-ads' | 'linkedin-ads';
  spend_cents: number;
  clicks: number;
  leads: number;
  cpl_cents: number;   // cost per lead
  roas: number;        // pipeline-attributed return on ad spend (x)
}

export const paidChannels: PaidChannel[] = [
  { channel: 'Google Ads',   platform: 'google-ads',   spend_cents: 420000, clicks: 3980, leads: 38, cpl_cents: 11052, roas: 3.4 },
  { channel: 'Meta Ads',     platform: 'meta-ads',     spend_cents: 265000, clicks: 5210, leads: 22, cpl_cents: 12045, roas: 2.1 },
  { channel: 'LinkedIn Ads', platform: 'linkedin-ads', spend_cents: 310000, clicks: 1240, leads: 17, cpl_cents: 18235, roas: 2.8 },
];

// --- Data-source provenance (integrations status strip) --------------------
// In the playground every source is "demo" (synthetic). Real integrations flip
// the status to "connected" once their adapter has written rows to D1.
export interface DataSource {
  name: string;
  kind: 'analytics' | 'ads' | 'crm';
  status: 'demo' | 'connected' | 'not-configured';
  detail: string;
}

export const dataSources: DataSource[] = [
  { name: 'Google Analytics 4',        kind: 'analytics', status: 'demo', detail: 'Sessions · channels · conversions' },
  { name: 'Google Ads',                kind: 'ads',       status: 'demo', detail: 'Spend · clicks · CPL · ROAS' },
  { name: 'Meta Ads',                  kind: 'ads',       status: 'demo', detail: 'Spend · clicks · CPL · ROAS' },
  { name: 'CRM (Pipedrive / HubSpot)', kind: 'crm',       status: 'demo', detail: 'Leads · pipeline · closed-won' },
];

export const headlineMetrics = {
  sessions_7d: 9970,
  sessions_7d_delta: 0.082,        // +8.2% wow
  signups_7d: 168,
  signups_7d_delta: 0.144,
  leads_7d: 91,
  leads_7d_delta: 0.097,
  cpl_7d_cents: 3793,
  cpl_7d_delta: -0.063,            // CPL down is good
  pipeline_total_cents: 49420000,
  pipeline_delta: 0.057,
  won_mtd_cents: 8700000,
  won_count_mtd: 4,
};

export function formatCurrency(cents: number): string {
  if (cents >= 100_000_000) return `$${(cents / 100_000_000).toFixed(2)}M`;
  if (cents >= 100_000) return `$${(cents / 100_000).toFixed(1)}k`;
  return `$${(cents / 100).toFixed(0)}`;
}

export function formatPct(n: number, digits = 1): string {
  const sign = n > 0 ? '+' : '';
  return `${sign}${(n * 100).toFixed(digits)}%`;
}
