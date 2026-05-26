---
task: sprint4/visual-regression-baseline-reset
branch_hint: codex/visual-regression-baseline-reset
created: 2026-05-26
author: tech-lead (Claude Code)
acceptance:
  - All visual regression tests pass (no height/layout mismatch failures)
  - New baseline snapshots captured for all pages that changed in Sprint 4
  - tests/e2e/visual.spec.ts passes in full npm run test run
  - No production code changes — test snapshots only
---

# Codex task — Reset visual regression baselines after Sprint 4

## Context

wojciech.io uses Playwright visual regression tests in `tests/e2e/visual.spec.ts`.
These tests capture screenshots and compare against stored baselines in
`tests/e2e/__screenshots__/` (or similar path — check the spec file for the exact location).

Sprint 4 (PRs #49, #51, #52) changed page layouts significantly:
- Homepage: reveal-up animations added, hero section updated, metrics strip changed
- /about: hero replaced with studio portrait, new office photo strip added
- /contact: Cal.com inline calendar embed added (extends page height ~600px)
- /work: background image changed
- /ai-systems: GrowthHub video loop added before live embed

The existing baselines were captured before these changes. The visual tests now fail because
pages are taller/different from the stored snapshots. Codex must re-capture the baselines.

## Constraints

- Zakaz em dashów (—).
- Nie pushuj do main — tylko PR z branch `codex/visual-regression-baseline-reset`.
- Nie zmieniaj production code (src/, public/) — tylko test snapshots i ewentualnie visual.spec.ts.
- Do NOT run tests against live staging URL — use localhost:4321 or the built dist.

## Steps

### 1. Check the test setup

Read `tests/e2e/visual.spec.ts` to understand:
- Which pages are tested (URLs)
- Where baselines are stored
- Whether tests run against `localhost:4321` or a built `dist/`

Also read `playwright.config.ts` to understand the BASE_URL and snapshot settings.

### 2. Build the site

```bash
npm run build
```

The build must complete successfully before capturing new baselines.

### 3. Update baselines

Run Playwright in update-snapshots mode:

```bash
npx playwright test tests/e2e/visual.spec.ts --update-snapshots
```

Or if the config uses a specific project:
```bash
npx playwright test tests/e2e/visual.spec.ts --update-snapshots --project=chromium
```

This regenerates all baseline images.

### 4. Verify

Run the tests again WITHOUT `--update-snapshots` to confirm they pass:

```bash
npx playwright test tests/e2e/visual.spec.ts
```

All tests must show `passed`, not `failed`.

### 5. Check diff is snapshots only

Run `git diff --stat` — the only changed/created files should be under
`tests/e2e/__screenshots__/` or equivalent. No src/ files should be modified.

## Important notes

- The Cal.com embed on /contact loads from an external script (`app.cal.com/embed/embed.js`).
  In test mode (no internet or slow), it may not render. If the test checks /contact and the
  calendar is empty, that's acceptable — capture the baseline as-is. Do NOT mock the Cal.com
  script; just let it load or not load naturally.

- The GrowthHub video on /ai-systems uses `preload="none"` and only plays on intersection.
  The poster image will be shown in screenshots. This is correct.

- If `--update-snapshots` fails due to existing snapshot directory permissions, delete the
  existing snapshots directory and re-run.

## Estimated effort

0.5 Codex session (30 min).
