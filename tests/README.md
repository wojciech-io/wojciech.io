# Tests — Sprint 1 baseline

Playwright-based end-to-end + accessibility. Owned by `test-engineer` agent.

## Quick commands

```bash
# Install Playwright + browsers (one-time)
npx playwright install --with-deps chromium webkit

# Run full suite (boots local preview automatically)
npx playwright test

# Run just smoke (fastest sanity check)
npx playwright test smoke

# Run just a11y
npx playwright test a11y

# UI mode (debug interactively)
npx playwright test --ui

# Update visual baselines only for intentional UI changes
npx playwright test visual --update-snapshots --project=chromium-desktop

# Run against production (smoke only — no test data assumptions)
BASE_URL=https://wojciech.io npx playwright test smoke
```

## Files

- `playwright.config.ts` — root config; switches between local preview and prod via `BASE_URL`
- `tests/e2e/smoke.spec.ts` — golden-path 200-checks + heading presence; runs everywhere
- `tests/e2e/a11y.spec.ts` — axe-core scan per smoke page; warning-mode in Sprint 1
- `tests/e2e/visual.spec.ts` — visual regression baselines for 5 pages × 3 viewports
- `tests/e2e/__screenshots__/` — committed Playwright screenshot baselines

## Modes

| Trigger | Base URL | Spec | Blocking |
|---|---|---|---|
| Local dev | `http://localhost:4321` (auto-spawned) | all | n/a |
| CI on PR | `http://localhost:4321` (built fresh) | smoke + a11y (warn) | smoke blocks merge |
| `smoke-prod.yml` post-deploy | `https://wojciech.io` | smoke only | failure auto-triggers rollback |

## A11y baseline policy

Sprint 1: **warning-mode** — violations logged + attached to report, no failed test.
Sprint 2 plan: flip `BLOCKING_MIN_IMPACT = 'serious'` in `a11y.spec.ts`. Before flipping, baseline must be clean across all smoke pages.

## Visual regression baseline update workflow

1. Make the intentional UI change in `src/`.
2. Run `npx playwright test visual --update-snapshots --project=chromium-desktop`.
3. Inspect the changed PNGs in `tests/e2e/__screenshots__/visual.spec.ts-snapshots/`.
4. Commit the snapshot update with the code change in the same commit.
5. Commit message must explain why the screenshot changed, for example "feat(home): new hero CTA — screenshot updated".

Never update baselines just to make CI green. If you don't know why a baseline changed, investigate — that's the entire point.

Run visual updates when:

- the page UI intentionally changed,
- typography, spacing, colors, assets, or layout changed by design,
- a legitimate content change affects a captured page.

Do not update visual baselines when:

- CI fails without a known intentional UI change,
- only local font rendering or browser state differs,
- an animated, timestamped, cookie, or live region caused the diff.

Mask regions that are expected to move or vary between runs, using the `mask` option in `tests/e2e/visual.spec.ts`. Current mask: `#testimonial-slider-mobile`, because the mobile/tablet testimonial carousel auto-advances. Add future masks only for dynamic regions; do not mask stable content to hide real regressions.

## CI integration

- `ci.yml` runs smoke + a11y on every PR (against local preview)
- `smoke-prod.yml` runs smoke against prod after every successful deploy; failure triggers `rollback.yml`
- `visual-regression.yml` (Sprint 1 follow-up) runs full visual diff on PR

## Cost / time budget

- Smoke (5 pages): ~15s
- A11y (5 pages): ~25s
- Visual (3 viewports × ~10 sections): ~60s
- **Total PR overhead:** ~2 min including install + boot

If overhead grows past 5 min, parallelize across more workers or split into separate workflows.
