-- Additive migration. Safe to run on a live academy-db: no existing column is
-- dropped or rewritten. Run once via `wrangler d1 migrations apply` (D1 tracks
-- applied migrations, so the non-idempotent ALTER below runs exactly once).

-- Link a seat-member's membership back to its team. NULL for individual buyers.
ALTER TABLE memberships ADD COLUMN team_id TEXT;

-- Teams: one row per Team-license purchase. Owner is the buyer (a customer).
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT,
  owner_customer_id TEXT NOT NULL,
  plan TEXT NOT NULL,
  seat_limit INTEGER NOT NULL DEFAULT 5,
  stripe_checkout_session_id TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_customer_id) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS idx_teams_owner ON teams(owner_customer_id);

-- Pending / accepted seat invitations. One row per invited email per team.
CREATE TABLE IF NOT EXISTS team_invites (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | accepted | revoked
  invited_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  accepted_at TEXT,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE INDEX IF NOT EXISTS idx_team_invites_team ON team_invites(team_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_team_invites_team_email ON team_invites(team_id, email);

-- Issued program-completion certificates. One per (customer, program).
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  program TEXT NOT NULL DEFAULT 'ai-growth-os',
  recipient_name TEXT,
  verification_code TEXT NOT NULL UNIQUE,
  issued_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  UNIQUE (customer_id, program)
);

CREATE INDEX IF NOT EXISTS idx_certificates_customer ON certificates(customer_id);
