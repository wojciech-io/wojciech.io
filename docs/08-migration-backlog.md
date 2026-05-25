# 08 - Migration backlog

> **Status as of 2026-05-25:** Site is live at wojciech.io. All Sprint 1–3 epics shipped.
> This file is kept for historical reference and to track post-launch backlog only.

## Sprint 1–3 — completed ✅

### Foundation
- [x] Tailwind CSS + design tokens
- [x] Global layout, typography scale
- [x] Layout primitives, reusable components (buttons, cards, badges, SectionHeader)
- [x] Site constants, metadata helper, image handling
- [x] Geist self-hosted (no external font requests)

### Core IA
- [x] Homepage (rewritten from scratch)
- [x] `/about` (operator profile)
- [x] `/work` (7 proof entries with metrics)
- [x] `/ai-systems`
- [x] `/insights` (index + migrated article)
- [x] `/resources` (lean placeholder)
- [x] `/contact`
- [x] 404 page

### Proof system
- [x] Proof-cluster data model
- [x] Project / case-study content collection
- [x] Testimonial collection (single source of truth, JSON)
- [x] Proof cluster cards, testimonial components

### Content
- [x] `claude-code-vs-clay` article migrated to MDX
- [x] Article template (insights/[slug].astro)
- [x] Article metadata, schema, OG image

### SEO / migration
- [x] `_redirects` (solutions→work, my-gpt→ai-systems, blog→insights, /pl/ /it/ killed)
- [x] Canonical handling
- [x] Sitemap (filtered, production URLs)
- [x] RSS feed
- [x] robots.txt
- [x] llms.txt
- [x] Article JSON-LD schema (BlogPosting)
- [x] Person / WebSite schema
- [x] OG / social defaults
- [x] GA4 (G-4ED804XJLP, via PUBLIC_GA_MEASUREMENT_ID)
- [x] Hreflang cleaned (stale pl/it removed)

### QA
- [x] Responsive review
- [x] Vitest unit tests (43 tests, CI job)
- [x] Playwright E2E (critical paths)
- [x] Visual regression baselines
- [x] Redirect verification
- [x] DNS cutover

---

## Post-launch backlog

### Content (highest priority)
- [ ] Second article in `/insights` — content compounding requires volume
- [ ] Third article and beyond — cadence TBD
- [ ] `/resources` expansion — starter packs, repositories (when assets ready)

### Features
- [ ] `/insights` search / filtering (when >5 articles)
- [ ] Academy cert Polish-char fix — @pdf-lib/fontkit + embedded TTF (Łuszczyński shows as ASCII currently)
- [ ] Re-enable GrowthHub "Open" button in apps/app once growthhub-db live

### Infrastructure
- [ ] WAF rate-limit `/api/*` — CF token needs cf:waf:edit scope
- [ ] GrowthHub D1 setup + cron trigger (user action required)
- [ ] Academy D1 migration 0002 + secrets deploy (user action required)

### Code quality
- [ ] Remove dead PL/IT props from 11 source files (never rendered, cosmetic)
- [ ] Renovate onboarding PR — accept when it appears

### Future (not v1)
- [ ] Multilingual version (FUTURE_CULTURAL_LOCALIZATION.md has the plan)
- [ ] Full resource library
- [ ] Large historical blog recovery
- [ ] Complex app embeds
