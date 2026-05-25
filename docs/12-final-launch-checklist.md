# 12 - Final launch checklist

> **Status as of 2026-05-25: DNS cutover DONE. Site is live at wojciech.io.**
> All pre-cutover items completed. Checklist below reflects verified production state.

## Pre-cutover blockers — ALL DONE

- [x] Confirm `https://github.com/wojciechluszczynski/gtm-agent-repo` is public and is the intended Starter Pack target.
- [x] `PUBLIC_CF_BEACON_TOKEN` — set in CF Pages; CF Analytics beacon verified in page HTML.
- [x] GA4 `G-4ED804XJLP` — wired via `PUBLIC_GA_MEASUREMENT_ID`.
- [x] Latest `main` commit deployed to `https://wojciech-io.pages.dev`.
- [x] No rogue `noindex` on public pages (CV pages correctly noindexed, all others allow crawl).

## Staging smoke test — PASSED (verified live on wojciech.io)

- [x] `/` loads and the mobile menu opens.
- [x] `/about/` loads.
- [x] `/work/` loads.
- [x] `/ai-systems/` loads.
- [x] `/resources/` loads.
- [x] `/insights/` loads and lists articles (multiple, not just one).
- [x] `/insights/how-to-build-gtm-ai-agent-outbound-crm/` loads with full article body.
- [x] `/rss.xml` — 200 ✅
- [x] `/sitemap-index.xml` exists ✅
- [x] `/robots.txt` points to `https://wojciech.io/sitemap-index.xml` ✅
- [x] `/llms.txt` — 200 ✅
- [x] `/og-default.png` — 200 ✅
- [x] CF Analytics beacon present in HTML ✅

## Redirect verification — PASSED

- [x] `/solutions` → `/work/` 301 ✅
- [x] `/my-gpt` → `/ai-systems/` 301 ✅
- [x] `/blog` → `/insights/` 301 ✅
- [x] `/blog/claude-code-vs-clay` → `/insights/how-to-build-gtm-ai-agent-outbound-crm/` 301 ✅
- [x] `/styleguide` → 410 ✅
- [x] Old article slug → new slug 301 ✅

## SEO checks — PASSED

- [x] hreflang en/pl/it/x-default on localized pages ✅
- [x] Canonicals point to `https://wojciech.io/...` ✅
- [x] Article `og:type=article` ✅
- [x] Article `article:published_time` + `article:modified_time` ✅
- [x] BlogPosting JSON-LD present ✅
- [x] i18n: CV `/cv/`, `/pl/cv/`, `/it/cv/` → 200, noindex, correct lang ✅

## DNS cutover — DONE

- [x] Cloudflare Pages custom domain configured.
- [x] `wojciech.io` pointing to Cloudflare Pages.
- [x] HTTPS certificate active.
- [x] `www` behavior intentional.

## Post-cutover monitoring — ONGOING (Sprint 4)

- [ ] Submit `https://wojciech.io/sitemap-index.xml` in Search Console (if not done).
- [ ] Monitor GSC coverage after first crawl.
- [ ] Confirm GA4 receiving live traffic.
- [ ] Watch for unexpected 404s.

## Open operational items (not blocking launch, require user action)

### Academy
- [ ] `wrangler d1 migrations apply academy-db --env production` (migration 0002)
- [ ] CF Pages secrets: `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `RESEND_FROM`
- [ ] After secrets: Deployments → Retry (CF Pages does NOT auto-redeploy)
- [ ] Audio content (36 episodes) — ElevenLabs TTS, awaiting material
- [ ] Vault scrape (100+ resources) — not started

### GrowthHub
- [ ] Create D1 `growthhub-db` in CF dashboard → get `database_id` → update `apps/growthhub/wrangler.toml`
- [ ] CF Pages secrets: `PIPEDRIVE_API_TOKEN`, `PIPEDRIVE_DOMAIN`, `GA4_PROPERTY_ID`, `GA4_SERVICE_ACCOUNT_JSON`
- [ ] Cron Trigger `0 3 * * *` — CF dashboard → Pages → growthhub → Settings

### Infra
- [ ] WAF rate-limit `/api/*` — CF token lacks `cf:waf:edit`; set up in CF dashboard or generate new token
