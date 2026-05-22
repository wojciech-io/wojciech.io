# Agent ownership map

First line of defense against two agents editing the same files. Pairs with `CODEOWNERS` (the enforced version once branch protection is on) and `AGENTS.md` (the human/multi-model role model).

## Principle

Each path has exactly one **owning agent**. An agent may read anything but only opens PRs touching paths it owns. Cross-boundary changes require a handoff message (see `agent-comms.md`), not a silent edit.

## Full roster — 9 roles, two layers

**Layer A — strategic roles** (manual / conversational, defined in `AGENTS.md`):

| # | Role | Status | Where it runs | Activated |
|---|---|---|---|---|
| 1 | Wojciech | ACTIVE | Accept/reject layer | always |
| 2 | Claude Code | ACTIVE | This session, repo edits | always |
| 3 | Codex | SCAFFOLD | Separate session via `.codex-tasks/<task>.md` specs | Sprint 1 (first task pending) |
| 4 | GPT-5.5 Thinking | INFORMAL | ChatGPT strategy thread | ad-hoc |
| 5 | Claude Design | INFORMAL | Separate ideation thread | Sprint 1-2 visual exploration |

**Layer B — autonomous agents** (cron/CI fired, defined in `.claude/agents/*.md`):

| # | Agent | Status | Trigger | Activated |
|---|---|---|---|---|
| 6 | tech-lead | OPERATIONAL | `daily-digest.yml` cron Mon-Fri 08:00 UTC | Sprint 1 (PR #7) |
| 7 | security-auditor | OPERATIONAL | `security.yml` cron Sun 22:00 UTC + on PR | Sprint 1 (PR #7) |
| 8 | test-engineer | DRAFT | `ci.yml` e2e job on PR + nightly | Sprint 1 (PR #14, pending merge) |
| 9 | release-manager | SCAFFOLD | `release-please.yml` (currently `workflow_dispatch` only) | Sprint 2 (after first ACK'd dry-run) |

> "9 agents" is **5 strategic roles + 4 autonomous agents**, not 9 daemons. The autonomous tier is intentionally lean — every agent's "presence" is a CI workflow + an `.agent-state/<name>/` directory + a `.claude/agents/<name>.md` definition. There is no background daemon process anywhere. State changes happen on CI runs, not in real time.

## Ownership table

| Path | Owner | Notes |
|---|---|---|
| `src/**` | Claude Code (human-driven) | Production code; autonomous agents do NOT edit |
| `tests/**` | Test Engineer | Sprint 1+; Playwright e2e, a11y, visual regression |
| `playwright.config.ts` | Test Engineer | |
| `docs/**` | shared | Whoever proposes the decision; review before merge |
| `docs/security/**` | Security Auditor | Tech Lead reviews |
| `.github/workflows/security.yml` | Security Auditor | |
| `.github/workflows/{ci,smoke-prod,visual-regression,lighthouse}.yml` (test jobs) | Test Engineer | Owns test-related jobs; build/release jobs Tech Lead |
| `.github/workflows/{release-please,rollback,daily-digest}.yml` | Tech Lead | Release Manager will co-own from Sprint 1 |
| `.agent-state/<agent>/**` | that agent only | Never edit another agent's state |
| `.agent-reports/**` | append-only, any agent | Reports are immutable once written |
| `.codex-tasks/**` | Tech Lead writes, Codex consumes | Closed task specs |
| `CODEOWNERS`, `renovate.json`, `.gitleaks.toml`, `.gitleaksignore` | Tech Lead (renovate) / Security Auditor (leaks) | |
| `.claude/agents/**` | Tech Lead | Agent definitions |
| `package.json`, lockfile | Tech Lead | Renovate auto-PRs grouped weekly; Test Engineer may add test-only devDeps |
| `CHANGELOG.md`, version field, `v*.*.*` tags | Release Manager | Auto-generated via release-please; editorial review only |
| `.github/workflows/release-please.yml` | Release Manager | Tech Lead reviews changes |

## Collision protocol

1. **Convention** — worktree prefix (`claude/`, `codex/`, `agent/<role>-`) signals owner.
2. **CODEOWNERS** — once branch protection is on, owning team must approve.
3. **git merge conflict** — last-resort hard stop; nothing is silently overwritten.

If an agent needs a change outside its ownership, it files an inbox message to the owner and waits, or opens a draft PR tagging the owner for review.
