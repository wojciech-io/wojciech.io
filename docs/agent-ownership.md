# Agent ownership map

First line of defense against two agents editing the same files. Pairs with `CODEOWNERS` (the enforced version once branch protection is on) and `AGENTS.md` (the human/multi-model role model).

## Principle

Each path has exactly one **owning agent**. An agent may read anything but only opens PRs touching paths it owns. Cross-boundary changes require a handoff message (see `agent-comms.md`), not a silent edit.

## Ownership table

| Path | Owner | Notes |
|---|---|---|
| `src/**` | Claude Code (human-driven) | Production code; autonomous agents do NOT edit |
| `docs/**` | shared | Whoever proposes the decision; review before merge |
| `docs/security/**` | Security Auditor | Tech Lead reviews |
| `.github/workflows/**` | Tech Lead | Security Auditor proposes security gates |
| `.agent-state/<agent>/**` | that agent only | Never edit another agent's state |
| `.agent-reports/**` | append-only, any agent | Reports are immutable once written |
| `.codex-tasks/**` | Tech Lead writes, Codex consumes | Closed task specs |
| `CODEOWNERS`, `renovate.json` | Tech Lead | |
| `.claude/agents/**` | Tech Lead | Agent definitions |
| `package.json`, lockfile | Tech Lead | Renovate auto-PRs grouped weekly |

## Collision protocol

1. **Convention** — worktree prefix (`claude/`, `codex/`, `agent/<role>-`) signals owner.
2. **CODEOWNERS** — once branch protection is on, owning team must approve.
3. **git merge conflict** — last-resort hard stop; nothing is silently overwritten.

If an agent needs a change outside its ownership, it files an inbox message to the owner and waits, or opens a draft PR tagging the owner for review.
