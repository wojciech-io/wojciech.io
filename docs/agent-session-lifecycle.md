# Agent session lifecycle

Every autonomous agent run follows the same startup and shutdown checklist. Keeps state coherent across cron-fired sessions that share nothing but the git repo.

## Startup

1. **Sync** — `git fetch`, fast-forward the agent's working branch to `main`. If diverged, stop and escalate.
2. **Create/enter worktree** — `agent/<role>-<task>` prefix. Never reuse another agent's worktree.
3. **Read state** — `.agent-state/<agent>/state.md` + `open-threads.md`.
4. **Drain inbox** — process `inbox/` oldest-first. Human replies first, then peer messages.
5. **Check ownership** — confirm the planned work is within owned paths (`agent-ownership.md`).

## During

- Work only within owned paths. Cross-boundary need → outbox message, do not edit.
- Commit in logical slices with conventional-commit messages.
- Append findings to `.agent-reports/<date>-<agent>.md` (append-only).
- Anything needing a human call → inbox message with `needs_decision: true`; do not proceed on that item.

## Shutdown

1. **Update state** — write `state.md`: last run timestamp, what was done, what's pending, health (`OK`/`STALE`/`BLOCKED`).
2. **Update threads** — move resolved threads to `## Resolved` in `open-threads.md`.
3. **Open PR** — if changes were made, `gh pr create` to `main` (draft if incomplete). Never self-merge unless permission allows (only Tech Lead may merge).
4. **Clean worktree** — remove the worktree if no uncommitted work remains.

## Health / staleness

Daily digest flags an agent `STALE` if `state.md` last-run is >24h old while its cron is enabled. Investigate cron before assuming the agent is fine.
