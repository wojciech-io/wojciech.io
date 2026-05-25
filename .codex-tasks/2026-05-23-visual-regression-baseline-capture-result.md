---
task: tests/visual-regression-baseline-capture
brief: 2026-05-23-visual-regression-baseline-capture.md
status: completed
verified_against: local build + Playwright preview
executed_by: Codex
date: 2026-05-25
---

# Visual regression baseline capture — result

## Audit — per criterion

1. `tests/e2e/visual.spec.ts` skip markers removed — **PASS.** The 5 pages × 3 viewports now run as active visual tests (`tests/e2e/visual.spec.ts:31`). The spec is explicitly Chromium-baseline-only so the repository keeps the requested 15 snapshots, not a second WebKit set (`tests/e2e/visual.spec.ts:13`).

2. `tests/e2e/__screenshots__/` committed with 15 baselines — **PASS.** Added 15 PNG baselines under `tests/e2e/__screenshots__/visual.spec.ts-snapshots/`: home, about, work, ai-systems, and insights across mobile, tablet, and desktop.

3. Visual job compares against new baselines — **PASS locally.** `npx playwright test visual` passed with 15 Chromium comparisons and 15 intentional WebKit skips. `npx playwright test visual --project=chromium-desktop` also passed after baseline capture.

4. Baselines visually inspected and dynamic regions masked — **PASS.** I generated a local contact sheet and spot-checked the home mobile and desktop baselines. Only one mask was needed: `#testimonial-slider-mobile`, because the mobile/tablet carousel auto-advances (`tests/e2e/visual.spec.ts:42`). Desktop testimonial cards remain captured.

5. Baseline-update workflow documented — **PASS.** `tests/README.md` now documents the exact Chromium update command, screenshot directory, when to update, when not to update, and mask guidance (`tests/README.md:23`, `tests/README.md:51`).

## Files changed

- `tests/e2e/visual.spec.ts` — enabled visual tests, limited active baselines to Chromium, masked mobile/tablet testimonial slider.
- `playwright.config.ts` — set `toHaveScreenshot.pathTemplate` so committed baselines live under `tests/e2e/__screenshots__/`.
- `tests/README.md` — documented visual baseline update workflow and mask policy.
- `tests/e2e/__screenshots__/visual.spec.ts-snapshots/*.png` — 15 reference baseline images.
- `.codex-tasks/2026-05-23-visual-regression-baseline-capture-result.md` — this result file.

## Baselines captured

- Count: 15 PNG files.
- Pages: `/`, `/about`, `/work`, `/ai-systems`, `/insights`.
- Viewports: mobile `390x844`, tablet `768x1024`, desktop `1440x900`.
- Snapshot directory size: `11M`.

## Masking

- `#testimonial-slider-mobile` on all visual captures. It only affects the visible mobile/tablet carousel on the homepage; the locator is hidden elsewhere. Reason: the testimonial carousel auto-advances and would create false positives in full-page screenshots.

## Verification

- `npx playwright test visual --update-snapshots --project=chromium-desktop` — passed, wrote 15 baselines.
- `npx playwright test visual --project=chromium-desktop` — passed: 15 passed.
- `npx playwright test visual` — passed: 15 passed, 15 skipped.
- Snapshot count: 15.
- Snapshot size total: 11M.

## Open questions — tech-lead inbox

- None.
