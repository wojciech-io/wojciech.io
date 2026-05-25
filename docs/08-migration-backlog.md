# 08 - Migration backlog

> **Status as of 2026-05-25: ALL launch items DONE. Site is live at wojciech.io.**
> This file is kept for historical reference. Use Sprint 4 planning for post-launch work.

## Epic 1 - project foundation

- [x] Add Tailwind CSS
- [x] Add global design tokens
- [x] Add typography scale
- [x] Add layout primitives
- [x] Add reusable buttons, cards, badges, section headers
- [x] Configure site constants
- [x] Configure metadata helper
- [x] Configure image handling

## Epic 2 - core IA

- [x] Build homepage
- [x] Build `/about`
- [x] Build `/work`
- [x] Build `/ai-systems`
- [x] Build `/insights`
- [x] Build `/resources`
- [x] Build 404 page

## Epic 3 - proof system

- [x] Define proof-cluster data model
- [x] Define project / case-study data model
- [x] Add testimonial inventory data model
- [x] Add metric validation table
- [x] Implement proof cluster cards
- [x] Implement testimonial components

## Epic 4 - content

- [x] Migrate Claude Code article to MDX (slug: `how-to-build-gtm-ai-agent-outbound-crm`)
- [x] Build article template
- [x] Add article metadata fields
- [x] Create future content placeholders / taxonomy
- [x] Decide treatment of legacy posts (retired; only the GTM article migrated)

## Epic 5 - SEO / migration

- [x] Finalize redirect map
- [x] Add `_redirects` (`/solutions→/work`, `/my-gpt→/ai-systems`, `/blog→/insights`, old slug→new)
- [x] Add canonical handling
- [x] Add sitemap (`/sitemap-index.xml`, `/sitemap-0.xml`)
- [x] Add RSS (`/rss.xml`)
- [x] Add robots.txt
- [x] Add `llms.txt`
- [x] Add article schema (BlogPosting JSON-LD)
- [x] Add person / website schema
- [x] Add OG / social defaults + per-article OG images (`/og/[slug].png`)
- [x] Add GA4 (`G-4ED804XJLP`, via `PUBLIC_GA_MEASUREMENT_ID`)

## Epic 6 - QA

- [x] Responsive review
- [x] Lighthouse / CWV review
- [x] Accessibility review
- [x] Link check
- [x] Metadata review (hreflang en/pl/it/x-default, canonicals)
- [x] Redirect review (all 301s verified live)
- [x] Production cutover checklist (DNS cutover done, site live)

## Backlog not for v1 launch (still open)

- [ ] multilingual version (hreflang infra in place; /pl/ /it/ pages retired at launch)
- [ ] search UI
- [ ] full resource library
- [ ] large historical blog recovery
- [ ] complex app embeds
