---
task: review/seo-foundations
brief: 2026-05-22-seo-foundations-review.md
status: completed
verified_against: local build + Playwright preview
executed_by: Codex
date: 2026-05-25
---

# SEO foundations review — result

## Audit — per criterion

1. Canonical URLs correct on all public pages — **PASS for current public pages; N/A for the named article URL.** `SEOHead.astro` builds canonicals from the explicit `canonical` prop or current path against `Astro.site` (`src/components/seo/SEOHead.astro:33`) and emits one canonical tag (`src/components/seo/SEOHead.astro:99`). Playwright now checks `/`, `/about/`, `/work/`, `/ai-systems/`, and `/insights/` (`tests/e2e/seo.spec.ts:35`, `tests/e2e/seo.spec.ts:53`). `/insights/claude-code-vs-clay/` is not a built public page in this checkout because `src/content/insights/` is absent; adding article content or pages is outside this task's hard boundaries.

2. OG tags present and resolve on every page — **PASS for current public pages; N/A for the named article URL.** `SEOHead.astro` emits `og:type`, `og:url`, `og:title`, `og:description`, and `og:image` from the same canonical/default image path (`src/components/seo/SEOHead.astro:103`). Playwright verifies required OG tags and fetches the local OG image for the audited pages (`tests/e2e/seo.spec.ts:20`, `tests/e2e/seo.spec.ts:61`, `tests/e2e/seo.spec.ts:71`).

3. Twitter card tags present — **PASS for current public pages; N/A for the named article URL.** `SEOHead.astro` emits `summary_large_image`, title, description, and image tags (`src/components/seo/SEOHead.astro:114`). Playwright verifies every required Twitter tag is present and non-empty, then fetches the referenced image locally (`tests/e2e/seo.spec.ts:28`, `tests/e2e/seo.spec.ts:80`, `tests/e2e/seo.spec.ts:90`).

4. Sitemap references indexable pages and excludes drafts/dev/app subdomains — **PASS.** Astro still emits its standard `/sitemap-index.xml` plus `/sitemap-0.xml`; `robots.txt` points crawlers at that index. I added a sitemap filter that keeps only `wojciech.io`, strips future `/en/`, `/pl/`, and `/it/` paths, and excludes noindex `/cv/` and `/privacy/` (`astro.config.mjs:9`, `astro.config.mjs:11`, `astro.config.mjs:28`). The generated sitemap lists the current indexable pages and excludes dev/app hostnames (`tests/e2e/seo.spec.ts:36`, `tests/e2e/seo.spec.ts:185`).

5. robots.txt allows public crawl and app/dev posture is blocked where represented — **PASS with dev N/A.** The root `public/robots.txt` allows `wojciech.io` crawling and references the sitemap index; Playwright verifies that response (`tests/e2e/seo.spec.ts:160`). `apps/app/public/robots.txt` blocks all crawling and is now covered by a file-backed test (`tests/e2e/seo.spec.ts:169`). There is no `dev.wojciech.io` project or robots file in this checkout, so dev remains N/A.

6. llms.txt present with current content — **PASS.** `public/llms.txt` is present and substantial, matching the launch-file requirement in `docs/09-seo-migration.md`. Playwright checks `/llms.txt` returns 200 and is non-trivial (`tests/e2e/seo.spec.ts:178`).

7. hreflang on multilingual routes — **PASS.** `CLAUDE.md` says launch is English-only, and there are no `/pl` or `/it` route directories. I removed stale PL/IT alternate output from `SEOHead.astro`; it now emits only `og:locale="en_US"` and no hreflang alternates (`src/components/seo/SEOHead.astro:36`, `src/components/seo/SEOHead.astro:109`). The existing hreflang spec verifies the homepage emits no hreflang alternates.

8. No broken internal links across pages — **PASS.** `tests/e2e/links.spec.ts` already covered core internal links; I added `/ai-systems/` to the audited page set so the full brief page list is represented (`tests/e2e/links.spec.ts:13`). The focused Playwright run passed for both desktop Chromium and mobile Safari.

9. schema.org structured data — **PASS for current pages; article template prepared.** `SEOHead.astro` emits base `Person` and `WebSite` JSON-LD (`src/components/seo/SEOHead.astro:41`, `src/components/seo/SEOHead.astro:81`), and Playwright checks `Person` on `/about/` plus `WebSite` on `/` (`tests/e2e/seo.spec.ts:100`, `tests/e2e/seo.spec.ts:116`). I changed the insight article template from `TechArticle` to the brief-required `BlogPosting` (`src/pages/insights/[slug].astro:84`), and the test will enforce `BlogPosting` when published insight content exists (`tests/e2e/seo.spec.ts:132`).

## Files changed

- `src/components/seo/SEOHead.astro` — removed stale PL/IT hreflang and `og:locale:alternate` output for the English-only launch.
- `src/pages/insights/[slug].astro` — changed article JSON-LD type to `BlogPosting`.
- `astro.config.mjs` — added sitemap filtering for noindex pages, locale paths, and non-root hostnames.
- `tests/e2e/seo.spec.ts` — expanded SEO acceptance coverage.
- `tests/e2e/links.spec.ts` — added `/ai-systems/` to internal-link coverage.
- `.codex-tasks/2026-05-22-seo-foundations-review-result.md` — replaced stale production-era result with this current audit.

## New tests added

- Canonical assertions for the audited public pages.
- OG and Twitter metadata completeness checks, including local image fetches.
- Person/WebSite schema assertions and future BlogPosting assertion for published insight articles.
- Sitemap inclusion/exclusion checks for indexable, noindex, locale, dev, and app URLs.
- App subdomain robots disallow check from `apps/app/public/robots.txt`.
- Internal-link coverage for `/ai-systems/`.

## Verification

- `npm run build` — passed. Build warns that `src/content/insights/` is missing/empty.
- `npx playwright test tests/e2e/seo.spec.ts tests/e2e/hreflang.spec.ts tests/e2e/links.spec.ts` — passed: 78 passed, 2 skipped. The skipped checks are the article-schema tests because no published insight article exists in this checkout.

## Open questions — tech-lead inbox

- The brief names `/insights/claude-code-vs-clay/`, but current source has no `src/content/insights/` directory and builds no insight article pages. Should Sprint 3 restore the `claude-code-vs-clay` article, or should the closed SEO brief be updated to treat article checks as future-content N/A until the migration lands?
