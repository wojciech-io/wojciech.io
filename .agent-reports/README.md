# Agent reports

Append-only. Each agent run writes `<date>-<agent>.md` (or `<date>-incident-<slug>.md`). Reports are immutable once written — never edit a past report, add a new one. The daily digest reads from here. See `docs/agent-comms.md` and `docs/agent-session-lifecycle.md`.
