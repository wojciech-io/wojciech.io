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

# Update visual baselines (intentional — commit the result with explanation)
npx playwright test --update-snapshots

# Run against production (smoke only — no test data assumptions)
BASE_URL=https://wojciech.io npx playwright test smoke
```

## Files

- `playwright.config.ts` — root config; switches between local preview and prod via `BASE_URL`
- `tests/e2e/smoke.spec.ts` — golden-path 200-checks + heading presence; runs everywhere
- `tests/e2e/a11y.spec.ts` — axe-core scan per smoke page; warning-mode in Sprint 1
- `tests/visual/screenshots.spec.ts` — visual regression baseline (added separately)

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

1. Make the intentional UI change in `src/`
2. Run `npx playwright test --update-snapshots`
3. Inspect diff in `tests/visual/__screenshots__/` — does the new screenshot match the design intent?
4. Commit the snapshot update WITH the code change in the same commit
5. Commit message must explain WHY the screenshot changed (e.g., "feat(home): new hero CTA — screenshot updated")

Never update baselines just to make CI green. If you don't know why a baseline changed, investigate — that's the entire point.

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
