---
task: tests/visual-regression-baseline-capture
branch_hint: codex/visual-regression-baseline
created: 2026-05-23
author: tech-lead (Claude Code, session nervous-bartik-5a866d)
acceptance:
  - tests/e2e/visual.spec.ts has its 15 test.skip() markers removed (5 pages × 3 viewports)
  - tests/e2e/__screenshots__/ committed with 15 reference baselines
  - CI run on the PR passes the visual job (compares against the new baselines — should be identical)
  - tests/README.md (or new tests/visual-README.md) documents the baseline-update workflow: when to run `npx playwright test visual --update-snapshots`, when NOT to, mask patterns for animated regions
---

# Closed task — Visual regression baseline capture (Sprint 1 Tier 5a follow-up)

## Context

Sprint 1 Tier 5a scaffolded `tests/e2e/visual.spec.ts` with 15 `test.skip()` markers (5 pages × 3 viewports). Reason for skip: needed homepage content to stabilize first. Sprint 2 voice audit confirmed site is voice-conformant and content layer is stable enough to capture baselines.

This task captures the baselines so CI can start running real visual diffs.

## Files in play

- `tests/e2e/visual.spec.ts` — remove the `.skip` markers
- `tests/e2e/__screenshots__/` — new directory, will be auto-created by Playwright
- `tests/README.md` — extend with visual regression workflow
- `.gitignore` — verify `__screenshots__/` is NOT gitignored (test artifacts ARE committed; only test-results/ and playwright-report/ are ignored)
- `playwright.config.ts` — verify visual-related settings (no edits expected)

## Steps

1. Read `tests/e2e/visual.spec.ts` to confirm current structure (5 PAGES × 3 VIEWPORTS).
2. Remove the `test.skip()` decorator from each test (lines 31-46 area).
3. Run locally against the deployed preview (or local Astro preview):
   ```bash
   npx playwright test visual --update-snapshots --project=chromium-desktop
   ```
   This creates `tests/e2e/__screenshots__/visual.spec.ts-snapshots/*.png` baselines.
4. Visually inspect EACH baseline — if any captures a transient UI state (e.g., scroll position mid-animation, banner not yet dismissed), mask the region in the spec via `mask: [page.locator(...)]` and re-capture.
5. Commit baselines + spec change in one commit.
6. Push, open PR. CI should pass the visual job (compares against the freshly committed baselines).
7. Write `*-result.md` companion documenting:
   - Number of baselines captured
   - Any URLs where masking was needed (and why)
   - Snapshot file size totals (large baselines can balloon repo size — keep an eye)
8. Document baseline-update workflow:
   - `npx playwright test visual --update-snapshots` when intentional UI changes
   - Visual diffs in CI flag regressions — fail-mode appropriate
   - Mask animated/timestamp regions to avoid false positives

## Out of scope

- Adding new visual specs beyond the 15 already scaffolded
- Switching to Percy/Chromatic (per Sprint 0 decision — stays on Playwright `toHaveScreenshot` until needed)
- Visual regression for `/insights/<slug>` pages (collection currently empty post Sprint 2 B2)

## Boundaries (hard)

- You do NOT merge to main.
- You do NOT touch `src/` (component styles, layout, copy).
- You do NOT add visual specs for unstable surfaces (homepage Hero canvas animation, testimonial slider on mobile if it animates).

## Estimated effort

1 Codex session. Most time is in masking decisions if any spec captures animation.
