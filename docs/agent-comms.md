# Agent communication protocol

How autonomous agents exchange messages, track threads, and escalate to the human. File-based, git-tracked, auditable. No external broker.

## Channels

Each agent owns a directory under `.agent-state/<agent>/`:

- `inbox/` — messages addressed TO this agent
- `outbox/` — messages this agent has sent (copy kept for audit)
- `state.md` — current working state, last run timestamp, health
- `open-threads.md` — index of unresolved conversations

## Message format

One Markdown file per message: `inbox/<ISO8601>-<from>-<slug>.md`

```markdown
---
from: security-auditor
to: tech-lead
thread: cve-astro-4x
priority: high        # low | normal | high | urgent
created: 2026-05-22T22:14:00Z
needs_decision: true
---

Body: what happened, what's needed, deep-link to PR/issue.
```

## Threads

A `thread` slug groups related messages. `open-threads.md` lists each open thread with status (`waiting-human`, `waiting-agent`, `blocked`). Close a thread by moving its index line to a `## Resolved` section with the resolution.

## Escalation ladder

1. `priority: normal` → surfaces in next daily digest (8:00 mail).
2. `priority: high` → top of next digest, flagged `🔴 WYMAGA DECYZJI`.
3. `priority: urgent` → immediate `[URGENT]` mail (Sprint 1+); for now still daily digest but pinned first.

Agents NEVER act on a `needs_decision: true` item without a human reply written back into their inbox. Silence ≠ approval.

## Human replies

The human (or a session acting for them) replies by dropping a message into the agent's `inbox/` with `from: human`. The agent picks it up on next run.
