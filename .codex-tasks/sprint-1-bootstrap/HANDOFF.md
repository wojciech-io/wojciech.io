# Sprint 1 Bootstrap — Handoff

> Cold-start brief for any agent (Codex or fresh Claude Code) picking up Sprint 1.
> Self-contained. Do NOT need the originating conversation.
> Sprint 0 is COMPLETE on main (see `docs/SPRINT0_HANDOFF.md`).

## Mission

Sprint 1 adds the **observability and quality layer** on top of Sprint 0's foundation:

1. **Test Engineer** — Playwright e2e + accessibility (axe) + visual regression baseline
2. **Release Manager** — auto-rollback wiring, conventional commit linting on PR, deploy-status reporting in daily digest
3. **`dev.wojciech.io` dashboard** — static Astro page behind Cloudflare Access, reads `.agent-reports/` + `.agent-state/` + `gh` API, shows kanban + decision queue + agent health + deploy status

Plus closing the known gap from Sprint 0:
4. **app.wojciech.io login headers fix** — login.html bypasses Layout, needs middleware-emitted headers OR Layout-rendered login

## Hard constraints

- Same as Sprint 0: no destructive operations without explicit ACK
- Test Engineer changes touch `tests/` and `playwright.config.ts` (new), not `src/` (except adding `data-testid` attributes if needed)
- Dashboard lives at `src/pages/dev/` or a separate Astro project — TBD per technical decision in brief.md
- All cron schedules added in Sprint 1 follow the same pattern: `workflow_dispatch` first, cron only after manual smoke test

## Decisions already made (from Sprint 0 conversation)

| Topic | Decision |
|---|---|
| Dashboard URL | `dev.wojciech.io` |
| Dashboard auth | Cloudflare Access + Google OAuth + WebAuthn passkey (per `docs/security/access-policy.md`) |
| Dashboard interactivity | Static only — all "actions" deep-link to GitHub PR/Issue UI |
| Test runner | Playwright (already declared in `docs/agent-ownership.md`) |
| a11y tool | axe-core (Playwright integration) |
| Visual regression | Initial: Playwright screenshot diff (`toHaveScreenshot()`). Future: Percy/Chromatic only if needed |
| Sentry | Already initialized (`sentry.client.config.js` present). DSN must be set in CF Pages secrets |
| Uptime monitor | Better Stack — user must register account; Sprint 1 includes setup doc + workflow stub |

## Decisions still open (decide before starting brief execution)

These come up in brief.md and need user input before agent picks them up:

1. **Dashboard as same Astro project or separate?**
   - Same project (path `src/pages/dev/`): simpler, shares tokens/components, but pollutes main project
   - Separate Astro project (root `apps/dev/`): cleaner isolation, but duplicates build/deploy pipeline
   - **Recommendation:** separate project under `apps/dev/`, mirrors existing `apps/academy`, `apps/growthhub` pattern. Easier to restrict Access scope to that one Pages project.

2. **Playwright base URL** — local dev (`http://localhost:4321`) or Cloudflare Preview per PR?
   - Local: faster CI, no external dep, but doesn't catch deploy-specific issues
   - Preview: full-fidelity, slower (~2-3 min build wait), depends on CF Pages preview being ready
   - **Recommendation:** local for unit-level e2e (default), preview for smoke-prod.yml (already scaffolded)

3. **Release Manager autonomous merge?**
   - Yes: auto-merge dep PRs labeled `automerge:safe` after all checks green
   - No: every merge requires human ack (user-controlled)
   - **Recommendation:** start with NO — verify Sprint 1 trust before granting automerge. Revisit Sprint 2.

## File inventory — mark `[x]` when done

### Tier 1 — This handoff
- [x] `.codex-tasks/sprint-1-bootstrap/HANDOFF.md`
- [ ] `.codex-tasks/sprint-1-bootstrap/brief.md` (per-file specs)

### Tier 2 — Agent definitions
- [ ] `.claude/agents/test-engineer.md`
- [ ] `.claude/agents/release-manager.md`

### Tier 3 — Agent state
- [ ] `.agent-state/test-engineer/{inbox,outbox}/.gitkeep`
- [ ] `.agent-state/test-engineer/state.md`
- [ ] `.agent-state/test-engineer/open-threads.md`
- [ ] `.agent-state/release-manager/{inbox,outbox}/.gitkeep`
- [ ] `.agent-state/release-manager/state.md`
- [ ] `.agent-state/release-manager/open-threads.md`

### Tier 4 — Test Engineer scaffold
- [ ] `playwright.config.ts` at repo root
- [ ] `tests/e2e/smoke.spec.ts` — golden path: /, /about, /work, /ai-systems, /insights/<latest>
- [ ] `tests/e2e/a11y.spec.ts` — axe on every key page
- [ ] `tests/visual/screenshots.spec.ts` — baseline screenshots (3 viewports: 375, 768, 1440)
- [ ] `tests/README.md` — how to run, how to update baselines

### Tier 5 — Release Manager scaffold
- [ ] `.github/workflows/commitlint.yml` — verify conventional commit on PR title + commits
- [ ] `.github/workflows/lighthouse.yml` — Lighthouse CI per PR with budget
- [ ] Wire `smoke-prod.yml` to actually invoke `tests/e2e/smoke.spec.ts` (no longer a stub)
- [ ] Wire `rollback.yml` to be triggered automatically on `smoke-prod.yml` failure (already scaffolded in Sprint 0)

### Tier 6 — `dev.wojciech.io` dashboard
- [ ] `apps/dev/` Astro project scaffold (mirror academy/growthhub structure)
- [ ] `apps/dev/src/pages/index.astro` — main dashboard view (4 sections per the spec in earlier conversation: needs-decision, kanban, agent-health, deploy-status)
- [ ] `apps/dev/functions/_middleware.ts` — Cloudflare Access enforcement at Pages-Functions level (defense in depth even if Access is misconfigured)
- [ ] `apps/dev/scripts/build-data.mjs` — pre-build step that reads `.agent-reports/` + queries `gh` and emits JSON consumed by Astro pages
- [ ] DNS record `dev.wojciech.io` → `wojciech-io-dev.pages.dev` (Cloudflare proxy on)
- [ ] CF Pages project `wojciech-io-dev` linked to repo, build path `apps/dev/`
- [ ] CF Access app created per `docs/security/access-policy.md`

### Tier 7 — Known-gap fix (app.wojciech.io headers)
- [ ] `apps/app/functions/_middleware.ts` — emit security headers on 401 response (or refactor to render login through Layout)
- [ ] Update `security.yml` headers job to flip `app.wojciech.io/login` from `warning` to `blocking`
- [ ] Update `baseline-checklist.md` to close the gap

### Tier 8 — Sprint 1 docs
- [ ] `docs/sprint/sprint-1-retrospective.md` — written at end of sprint
- [ ] Update `docs/agent-ownership.md` with Test Engineer + Release Manager rows
- [ ] Update `docs/observability.md` if Sentry DSN / Better Stack wiring requires doc changes

### Tier 9 — Commits & PRs

Sprint 1 will produce 4-6 PRs (one per Tier 4/5/6/7 unit). Don't dump all into one PR — review surface gets unmanageable.

Suggested order:
1. `chore(ops): Sprint 1 handoff + brief` — this folder
2. `feat(agents): test-engineer + release-manager scaffolds`
3. `feat(test): Playwright e2e + a11y + visual baseline`
4. `feat(ci): commitlint + lighthouse + smoke-prod wiring`
5. `feat(ops): dev.wojciech.io dashboard scaffold` (DRAFT until CF Access configured by user)
6. `fix(security): app.wojciech.io login headers (closes Sprint 0 known gap)`

## Acceptance criteria (Sprint 1 is DONE when)

- [ ] Test Engineer agent runs Playwright suite on every PR; results posted as PR check
- [ ] Visual regression baseline committed, diff displayed in PR on changes
- [ ] a11y violations posted as PR comment (non-blocking initially, blocking after baseline stabilizes)
- [ ] `dev.wojciech.io` loads behind Cloudflare Access, shows current sprint board state
- [ ] smoke-prod.yml triggers real Playwright tests post-deploy (no longer stub)
- [ ] rollback.yml auto-fires on smoke fail (verified via intentional failure simulation)
- [ ] app.wojciech.io/login emits all 6 required security headers
- [ ] Daily digest now includes section "deploy health (last 24h)" with deploy count + smoke status + rollback count
- [ ] Sprint 1 retrospective written

## Quick-resume protocol

1. `pwd` → should be inside a wojciech.io worktree
2. `git log --oneline -15` → see what's already committed under Sprint 1
3. Scan checkboxes top-to-bottom, first `[ ]` is yours
4. Open `brief.md` (after Tier 1.2 is done) for per-file content specs
5. Commit per-tier; update HANDOFF after each tier
6. Ambiguous? Append to `QUESTIONS.md` in this folder; don't improvise on:
   - Cloudflare account/zone IDs (user provides)
   - Sentry DSN (user provides)
   - Better Stack credentials (user provides)
   - Anything that ships a public-facing change without smoke test

## What Sprint 1 explicitly does NOT do

- Does NOT touch existing `src/` pages (only adds `data-testid` attributes if absolutely needed for selectors; prefer ARIA/role-based selectors)
- Does NOT enable branch protection (that's Sprint 2)
- Does NOT add Growth/CRO/Copy agents (Sprint 3)
- Does NOT add Polish/IT linguistic agent (Sprint 4)
- Does NOT migrate any content
- Does NOT deploy to prod without user ACK

## Sprint 0 carryover — known open items

From Sprint 0 + day-1 follow-up work:

- `app.wojciech.io/login` missing security headers (Tier 7 above)
- Cron activation PR #7 is DRAFT — awaiting user Resend setup + manual digest smoke
- GitHub Project board not yet created — awaiting `gh auth refresh -s project,read:project`
- Cloudflare Access for `dev.wojciech.io` not yet configured (user follows `docs/security/access-policy.md`)
- Better Stack uptime monitor not yet set up

These do NOT block Sprint 1 brief writing, but Tier 6 (dashboard) cannot ship to production until CF Access is configured. Sprint 1 dashboard work can build/test locally + on Cloudflare Pages preview while waiting.

---

**Status:** PLANNING (brief.md not yet written; only HANDOFF.md exists)
**Owner of next action:** the agent that takes Sprint 1, writes `brief.md` then starts Tier 2
