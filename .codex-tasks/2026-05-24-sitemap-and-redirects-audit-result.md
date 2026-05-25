---
task: seo/sitemap-and-redirects-audit
brief: 2026-05-24-sitemap-and-redirects-audit.md
status: completed
verified_against: local build + Playwright preview
executed_by: Codex
date: 2026-05-25
---

# Sitemap + redirects audit — result

## Audit — per criterion

1. `dist/sitemap-index.xml` excludes archived insights, multilingual routes, and dev/app subdomains — **PASS.** `npm run build` generated `dist/sitemap-index.xml` and `dist/sitemap-0.xml`; the sitemap lists current public routes including `/insights/claude-code-vs-clay/` and does not contain `/pl/`, `/it/`, `/en/`, archived insight slugs, `dev.wojciech.io`, or `app.wojciech.io`. I confirmed with `rg` against `dist/sitemap-0.xml`.

2. `public/_redirects` covers the 15 archived insight slugs — **PASS.** All 15 `.mdx` files under `archive/insights-legacy/` have direct `/insights/<slug>` and trailing-slash redirects to `/insights/` with 301 (`public/_redirects:36`). A Node comparison of archive filenames against `public/_redirects` returned `count: 15` and `missing: []`.

3. `public/_redirects` covers `/pl/*` and `/it/*` to `/` — **PASS.** I changed stale locale redirects from `/:splat` preservation to root redirects for `/pl/*`, `/it/*`, and `/en/*`, with exact `/pl`, `/it`, and `/en` guards (`public/_redirects:10`).

4. Redirect assertions added to `tests/e2e/critical-paths.spec.ts` — **PASS.** The spec now defines the archived slug list, locale redirects, restored `claude-code-vs-clay` blog redirect, and generic `/blog/*` redirect (`tests/e2e/critical-paths.spec.ts:22`, `tests/e2e/critical-paths.spec.ts:40`). The assertions use `maxRedirects: 0` and `timeout: 5_000` (`tests/e2e/critical-paths.spec.ts:104`). They skip locally because Astro preview does not apply Cloudflare Pages `_redirects`.

5. `docs/09-seo-migration.md` updated — **PASS.** Added a Sprint 2 redirect map with locale-rip rationale, blog redirect handling, restored `claude-code-vs-clay` routing, and the 15 archived insight slugs (`docs/09-seo-migration.md:21`).

## Files changed

- `public/_redirects` — corrected locale redirects to `/`, restored `/blog/claude-code-vs-clay` to the live article, added generic `/blog/*`.
- `tests/e2e/critical-paths.spec.ts` — added prod-only Cloudflare redirect assertions with 5s request timeout.
- `docs/09-seo-migration.md` — documented the Sprint 2 redirect map and rationale.
- `.codex-tasks/2026-05-24-sitemap-and-redirects-audit-result.md` — this result file.

## New tests added

- Prod-only assertions for `/pl/*`, `/it/*`, and `/en/*` locale redirects.
- Prod-only assertion for `/blog/claude-code-vs-clay/` to `/insights/claude-code-vs-clay/`.
- Prod-only assertion for generic `/blog/*` to `/insights/:splat`.
- Prod-only assertions for all 15 archived `/insights/<slug>/` redirects to `/insights/`.

## Verification

- `npm run build` — passed.
- `rg` against `dist/sitemap-0.xml` for locale routes, archived insight slugs, and dev/app hostnames — no matches.
- Archive-to-redirect Node comparison — passed with 15 archived slugs and zero missing redirects.
- `npx playwright test tests/e2e/critical-paths.spec.ts` — passed locally: 12 passed, 42 skipped. The skipped tests are intentionally prod-only because `_redirects` is applied by Cloudflare Pages, not Astro preview.

## Open questions — tech-lead inbox

- None.
