---
task: seo/sitemap-and-redirects-audit
branch_hint: codex/sitemap-redirects-audit
created: 2026-05-24
author: tech-lead (Claude Code, session nervous-bartik-5a866d)
acceptance:
  - dist/sitemap-index.xml (after build) excludes archived insights URLs, multilingual routes (/pl/*, /it/*, /[lang]/*), and dev/app subdomains
  - public/_redirects covers the 15 archived insights slugs from archive/insights-legacy/ (redirect each to /insights/ index with 301; revisit per-slug when articles get rewritten)
  - public/_redirects covers /pl/* and /it/* → / (301; or 410 Gone if SEO research prefers killing them outright)
  - All redirects tested locally (curl with --max-time 5) — assertions in tests/e2e/critical-paths.spec.ts new section
  - docs/09-seo-migration.md updated with new redirect map + rationale
---

# Closed task — Sitemap + redirects audit after Sprint 2 archive + multilingual rip

## Context

Sprint 2 B1 + B2 removed:
- 15 insights articles (moved to archive/insights-legacy/, removed from collection)
- /pl/*, /it/*, /[lang]/* route directories

These URLs were previously indexed. Without proper redirects, SEO juice and external-link traffic 404s.

This task audits sitemap output + writes the redirect map.

## Files in play

- `astro.config.mjs` (sitemap integration config)
- `public/_redirects` (Cloudflare Pages redirects file — current state TBD, may not exist yet)
- `public/robots.txt` (verify it still references sitemap-index.xml correctly)
- `tests/e2e/critical-paths.spec.ts` (add per-redirect assertions)
- `docs/09-seo-migration.md` (update with new map)

## Steps

1. Run `npm run build`, inspect `dist/sitemap-index.xml` + `dist/sitemap-0.xml`. Confirm:
   - Listed: /, /about, /work, /ai-systems, /insights, /contact, /cv, /now, /privacy, /resources, /subscribe, /apps
   - NOT listed: /pl/*, /it/*, /[lang]/*, /insights/<old-slug> (all 15), /dev*, app.wojciech.io* (these are separate CF Pages projects anyway)

2. If sitemap exposes anything from the "NOT listed" set, fix the `filter()` in astro.config.mjs `sitemap()` integration.

3. Build `public/_redirects` with this priority:
   - All 15 archived insights → `/insights/` (301)
   - `/pl/*` → `/` (301) — kill multilingual SEO ghost
   - `/it/*` → `/` (301) — same
   - `/[lang]/*` → `/` (301) — catch-all
   - Legacy `/blog/<slug>` → `/insights/<slug>` (existing rule, verify still present)

   Format reminder:
   ```
   /old-path /new-path 301
   /old-prefix/* /new-target/:splat 301
   ```

4. Add test cases to `tests/e2e/critical-paths.spec.ts`:
   - One assertion per redirect rule
   - Skip in local Playwright (CF _redirects only applies on deployed Pages); only run when BASE_URL contains wojciech.io

5. Update `docs/09-seo-migration.md`:
   - Add "Sprint 2 redirect map" section
   - List all redirects with rationale
   - Note: per-slug revival map will land Sprint 3+ when claude-code-vs-clay returns

## Out of scope

- Restoring archived articles (Sprint 3+ per CLAUDE.md)
- Per-locale sitemaps for future localization (handled when localization sprint lands)
- Manually deindexing in Google Search Console (Wojciech action, separate)

## Boundaries

- You do NOT merge to main
- You do NOT add `noindex` meta to existing live pages
- You do NOT modify content collection schemas
- Redirect to `/insights/` is fine because the index page renders an empty state gracefully (post Sprint 2)

## Estimated effort

1 Codex session. Most time in writing per-slug redirect rules + tests.
