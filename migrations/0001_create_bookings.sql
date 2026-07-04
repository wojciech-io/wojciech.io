-- Bookings for the /meet scheduler. D1 (SQLite).
-- Times are stored as UTC ISO-8601 strings so ordering and overlap checks are
-- timezone-proof. Overlap prevention is enforced in the booking Function
-- (SQLite can't express a range-exclusion constraint), backed by these indexes.

CREATE TABLE IF NOT EXISTS bookings (
  id            TEXT PRIMARY KEY,            -- crypto.randomUUID()
  meeting_type  TEXT NOT NULL,              -- MEETING_TYPES id (intro | systems | followup)
  start_utc     TEXT NOT NULL,              -- ISO-8601, e.g. 2026-07-06T07:30:00.000Z
  end_utc       TEXT NOT NULL,
  duration_min  INTEGER NOT NULL,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  company       TEXT,
  notes         TEXT,
  status        TEXT NOT NULL DEFAULT 'confirmed',  -- confirmed | cancelled
  cancel_token  TEXT NOT NULL,              -- unguessable, gates reschedule/cancel
  gcal_event_id TEXT,                       -- Google Calendar event id, null until synced
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Availability scans read confirmed rows in a date window, ordered by start.
CREATE INDEX IF NOT EXISTS idx_bookings_window
  ON bookings (status, start_utc);

-- Cancel/reschedule links resolve a booking by its token.
CREATE INDEX IF NOT EXISTS idx_bookings_cancel_token
  ON bookings (cancel_token);
