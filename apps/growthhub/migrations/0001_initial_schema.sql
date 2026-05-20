-- GrowthHub v1.1 — initial D1 schema
-- Single-tenant dashboard. No PII beyond CRM ids. All cents-as-int to avoid float drift.

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,                  -- CRM id (e.g. Pipedrive person id)
  source TEXT NOT NULL,                 -- 'inbound-form' | 'demo-request' | 'newsletter' | 'manual'
  created_at TEXT NOT NULL,             -- ISO 8601
  icp_score INTEGER NOT NULL DEFAULT 0, -- 0-100
  behaviour_score INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  stage TEXT,                           -- mirrors CRM stage label
  amount_cents INTEGER,
  industry TEXT,
  company_size TEXT,
  role TEXT,
  meta_json TEXT,                       -- opaque diagnostics payload
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

CREATE TABLE IF NOT EXISTS acquisition_daily (
  date TEXT PRIMARY KEY,                -- YYYY-MM-DD
  sessions INTEGER NOT NULL DEFAULT 0,
  signups INTEGER NOT NULL DEFAULT 0,
  leads INTEGER NOT NULL DEFAULT 0,
  cpl_cents INTEGER NOT NULL DEFAULT 0,
  source_breakdown_json TEXT,           -- JSON: [{source, sessions, share}]
  source TEXT NOT NULL DEFAULT 'ga4'    -- 'ga4' | 'plausible' | 'manual'
);

CREATE TABLE IF NOT EXISTS pipeline_snapshot (
  date TEXT NOT NULL,
  stage TEXT NOT NULL,
  count INTEGER NOT NULL,
  amount_cents INTEGER NOT NULL,
  PRIMARY KEY (date, stage)
);

CREATE TABLE IF NOT EXISTS deals_closed (
  id TEXT PRIMARY KEY,
  closed_at TEXT NOT NULL,
  outcome TEXT NOT NULL,                -- 'won' | 'lost'
  amount_cents INTEGER NOT NULL,
  cycle_days INTEGER,
  source TEXT
);

CREATE INDEX IF NOT EXISTS idx_deals_closed_at ON deals_closed(closed_at DESC);

CREATE TABLE IF NOT EXISTS sync_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,                 -- 'ga4' | 'pipedrive' | 'plausible'
  ran_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL,                 -- 'ok' | 'error' | 'skipped'
  rows_written INTEGER DEFAULT 0,
  error_message TEXT
);
