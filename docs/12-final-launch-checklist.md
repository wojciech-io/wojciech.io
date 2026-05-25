# 12 - Final launch checklist

> **Status: SHIPPED 2026-05-25.** DNS cutover complete. Site live at wojciech.io.
> This file is archived — items below reflect post-launch monitoring status.

## Pre-cutover blockers — all resolved ✅

- [x] GTM Agent repo (`wojciechluszczynski/gtm-agent-repo`) — confirmed public
- [x] Analytics wired — GA4 G-4ED804XJLP (PUBLIC_GA_MEASUREMENT_ID in CF Pages, replaces CF beacon)
- [x] Latest `main` deployed to wojciech-io.pages.dev
- [x] Staging build has no rogue `noindex` tags

## Staging smoke test — all passed ✅

- [x] `/` loads, mobile menu opens
- [x] `/about/` loads
- [x] `/work/` loads
- [x] `/ai-systems/` loads
- [x] `/resources/` loads
- [x] `/insights/` loads and lists the article
- [x] `/insights/claude-code-vs-clay/` loads with full article body
- [x] `/rss.xml` contains the article
- [x] `/sitemap-index.xml` exists
- [x] `/sitemap-0.xml` contains the article
- [x] `/robots.txt` points to `https://wojciech.io/sitemap-index.xml`
- [x] `/llms.txt` includes core pages and article URL
- [x] GA4 beacon present in page HTML

## Redirect verification — all passed ✅

- [x] `/solutions` → `/work/` 301
- [x] `/solutions/` → `/work/` 301
- [x] `/my-gpt` → `/ai-systems/` 301
- [x] `/my-gpt/` → `/ai-systems/` 301
- [x] `/blog` → `/insights/` 301
- [x] `/blog/` → `/insights/` 301
- [x] `/blog/claude-code-vs-clay` → `/insights/claude-code-vs-clay/` 301
- [x] `/pl/` → `/` 301
- [x] `/it/` → `/` 301
- [x] `/styleguide` → 410

## SEO checks — all passed ✅

- [x] Each public page has exactly one `h1`
- [x] Canonicals point to `https://wojciech.io/...`
- [x] Article has `og:type=article`
- [x] Article has `article:published_time` and `article:modified_time`
- [x] Article JSON-LD present and valid
- [x] Default OG image at `/og-default.png`
- [ ] Submit sitemap in Search Console — pending (do after GSC confirms crawl)

## DNS cutover — complete ✅

- [x] Cloudflare Pages custom domain configured
- [x] `wojciech.io` serves the Astro site
- [x] HTTPS certificate active

## Post-cutover monitoring

### Within first hour — done ✅
- [x] Redirects verified on production
- [x] Sitemap, RSS, robots, llms, article checks on production
- [x] CF Analytics replaced with GA4 beacon verified

### Within 24-48 hours — check pending
- [ ] Search Console coverage and sitemap discovery (3-5 days after cutover)
- [ ] Unexpected 404s
- [ ] Branded query snippets when Google refreshes

### Within 7 and 30 days
- [ ] Review GSC clicks, impressions, CTR, indexed pages
- [ ] Review GA4 traffic patterns
- [ ] Decide legacy blog URL treatment (currently 301 to /insights/)

---

## Open post-launch items

| Item | Owner | Status |
|------|-------|--------|
| Academy cert migration + secrets | Wojciech (CF dashboard) | Deferred |
| GrowthHub D1 + cron | Wojciech (CF dashboard) | Deferred |
| WAF /api/* rate-limit | Wojciech or new CF token | Deferred |
| Second /insights article | Content work | Priority |
| Polish char fix in Academy PDF | Dev | Backlog |
