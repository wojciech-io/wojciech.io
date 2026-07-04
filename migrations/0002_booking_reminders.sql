-- Reminder bookkeeping for the /meet scheduler.
-- Each column records WHEN a given reminder email was sent, so the cron can be
-- idempotent: a booking is picked up only while its column is still NULL, and
-- a successful send stamps it. Additive and nullable, so existing rows and the
-- current insert path are untouched.

ALTER TABLE bookings ADD COLUMN reminder_24h_sent_at TEXT;
ALTER TABLE bookings ADD COLUMN reminder_1h_sent_at  TEXT;

-- The reminder scan reads confirmed rows by start time, filtered on the two
-- columns above; the existing idx_bookings_window (status, start_utc) already
-- covers that access pattern, so no new index is needed.
