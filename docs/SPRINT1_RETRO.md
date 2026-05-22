# Sprint 1 — Retrospective

**Date:** 2026-05-22. Session: `nervous-bartik-5a866d`.
**Sprint duration:** Sprint 0 merge → 2026-05-22 (this session).
**Sprint owner:** Wojciech (decisions) + Claude Code (implementation, orchestration).

> Sprint 0 deliverable was the agent infrastructure SCAFFOLD (`docs/SPRINT0_HANDOFF.md`).
> Sprint 1 deliverable is the agent infrastructure **OPERATIONAL** + first quality layer.

---

## What landed (8 PRs merged this sprint)

| PR | Tier | What |
|---|---|---|
| #7 | activation | Daily digest + weekly security crons LIVE; Resend deliverability confirmed |
| #14 | 4 + 5c | Test Engineer agent + Playwright smoke (5 paths) + axe a11y + commitlint |
| #15 | 5b | Release Manager agent scaffold (4th autonomous agent) |
| #16 | 7 | Security headers on `app.wojciech.io/401` login response (correct monorepo path) |
| #17 | 7 | Flip `headers-check` job: warning → blocking |
| #18 | 5d + Codex | Lighthouse CI (weekly cron + manual) + first Codex closed task spec |
| #12 | — | Issue closed (auto via #16 + #17) |

Plus 2 from the security triage line (#5–#8 had already landed before this sprint's first activation moment).

---

## Agent roster — state delta

| # | Role | Before Sprint 1 | After Sprint 1 |
|---|---|---|---|
| 1 | Wojciech | active | active |
| 2 | Claude Code | active | active |
| 3 | Codex | scaffold (no tasks) | **first closed task pending consumption** |
| 4 | GPT-5.5 Thinking | informal | informal (unchanged) |
| 5 | Claude Design | informal | informal (unchanged) |
| 6 | tech-lead | scaffold, cron disabled | **OPERATIONAL** (daily-digest LIVE) |
| 7 | security-auditor | scaffold, cron disabled | **OPERATIONAL** (security cron LIVE + on-PR) |
| 8 | test-engineer | did not exist | **OPERATIONAL** (e2e on PR + a11y warning mode) |
| 9 | release-manager | did not exist | scaffold ready (release-please dispatch-only, awaiting first ACK'd dry-run) |

**Net:** went from 2 scaffolded autonomous agents to 4 operational/scaffold; activated Codex with a real closed task.

---

## What did NOT land (deferred to Sprint 2)

- **Tier 5a — Visual regression baselines.** Spec scaffolded with `test.skip()` markers in `tests/e2e/visual.spec.ts`. Needs operational baseline capture (`npx playwright test --update-snapshots`) once homepage content stabilizes in Sprint 2.
- **Tier 6 — dev.wojciech.io dashboard.** Blocked on Cloudflare Access setup (Wojciech action). Setup instructions delivered in-chat 2026-05-22. Dashboard scaffold (`apps/dev/` Astro project) deferred until Access is live to avoid shipping an unauthenticated build artifact.

## What's blocked on user actions

| Blocker | Owner | What unblocks |
|---|---|---|
| CF Access for `dev.wojciech.io` | Wojciech | 5-7 min in Cloudflare Zero Trust dashboard per chat instructions |
| Codex consumption of first task | Wojciech (opens Codex session) | New Codex session pointed at `.codex-tasks/2026-05-22-seo-foundations-review.md` |
| Better Stack monitor (urgent escalation channel) | Wojciech | Account creation; planned Sprint 2 |
| Linear integration decision | Wojciech | "wire Linear" greenlight or "defer further" call |

---

## Decisions made / locked this sprint

1. **CF Pages source-of-truth confirmed:** `app.wojciech.io` is served from `wojciechluszczynski/wojciech-io` monorepo (NOT the archived `wojciech-app` repo). Memory note: `reference-cf-pages-source`. Implication: any PR touching `functions/**` triggers a real `app.wojciech.io` prod deploy and is subject to the "no prod deploy without greenlight" memory rule.

2. **9-role roster formalized** in `docs/agent-ownership.md`: 5 strategic (Wojciech, Claude Code, Codex, GPT-5.5, Claude Design) + 4 autonomous (tech-lead, security-auditor, test-engineer, release-manager). "9 agents" is roles, not daemons — every autonomous agent is a CI workflow + `.agent-state/<name>/` + `.claude/agents/<name>.md`.

3. **Conventional commits enforced** via `.commitlintrc.json` + `commitlint.yml` workflow. Required for Release Manager auto-CHANGELOG + correct semver bumps.

4. **Lighthouse starts in warning-only mode** (`lighthouserc.json` assertions = `warn`). Tighten budgets after baseline stabilizes (≥4 successful weekly runs).

5. **Linear NOT yet wired** — workspace exists at luscinetti; integration deferred per memory note `integration-linear-workspace`.

---

## Risks observed

- **Active worktree count:** 9+ local Claude Code worktrees as of this session. Convention is in place (`claude/<task>`, `codex/<task>`, `agent/<role>-<task>`) but cleanup is manual. Sprint 2: add `.claude/cleanup-worktrees.sh` or document in `docs/agent-session-lifecycle.md`.
- **`AGENTS.md` vs `docs/agent-ownership.md` drift:** the strategic roster lives in two files. Sprint 2: cross-reference + single source of truth.
- **`functions/_middleware.ts` is shared between `wojciech.io` and `app-wojciech-io` CF Pages projects.** Any future change there is implicitly a dual-deploy. Mitigation: clear comment block already present (lines 2-4); CODEOWNERS could pin Security Auditor approval. Sprint 2.

---

## Sprint 2 — preview scope (not committed yet)

- Homepage content + `/about` + `/work` + `/ai-systems` (real copy per `docs/10-tone-of-voice.md`)
- Proof clusters (per `docs/06-proof-architecture.md`)
- Testimonial system
- Tier 5a visual regression baselines
- Tier 6 dashboard at `dev.wojciech.io` (post-Access)
- First Codex result merged + tech-lead review cycle proven end-to-end
- Branch protection on `main` (Sprint 0 deferred this; Sprint 2 enables after first 2 weeks of clean CI history)
- Release Manager first dry-run → ACK → flip `release-please` to `push: main`
- Optional: Linear integration evaluation

---

## How to pick up Sprint 2 cold

1. Read this file
2. Read `.agent-state/tech-lead/state.md` for current health
3. Read `CLAUDE.md` for mission + locked decisions
4. Check `gh pr list --state open` — any draft work in flight
5. Check `gh issue list --state open` — any open blockers
6. Check `gh workflow run` history for last digest + security run results

The 8 AM digest mail to `w.luszczynski@gmail.com` is the daily heartbeat. If it stops arriving, that's the first signal something broke.
