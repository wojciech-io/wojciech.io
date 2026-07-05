-- Push-notification channel state for the /meet Google Calendar webhook.
-- A single row (id = 1) holds the currently-registered events.watch channel so
-- the cron can renew it before expiry and the webhook can verify incoming pings.

CREATE TABLE IF NOT EXISTS gcal_sync (
  id            INTEGER PRIMARY KEY CHECK (id = 1),
  channel_id    TEXT,               -- our random channel id handed to Google
  resource_id   TEXT,               -- Google's resource id (needed to stop the channel)
  channel_token TEXT,               -- secret echoed back in X-Goog-Channel-Token; gates pings
  expiration    INTEGER,            -- ms epoch when Google expires the channel
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

INSERT OR IGNORE INTO gcal_sync (id) VALUES (1);
