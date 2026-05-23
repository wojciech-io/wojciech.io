# Legacy insights — archive

Snapshot of the 15 articles that lived in `src/content/insights/` before the v2 content rewrite.

**Archived:** 2026-05-22 (Sprint 2 decision B2).
**Reason:** `CLAUDE.md` v2 content strategy keeps only the curated `claude-code-vs-clay` article (Sprint 3 migration). The other 15 are out of scope for v2 launch.

## Status

These files are **preserved in git** (in this folder on `main`) but **outside** the Astro `insights` content collection. They will NOT be built into the live site and will NOT appear in `/insights/`.

## Reviving an article

If a piece deserves a second life:

1. Read the original — voice/claims/structure may not fit the new positioning per `docs/10-tone-of-voice.md`
2. Rewrite for v2 voice (don't just copy-paste — the bar moved)
3. Update frontmatter — confirm `draft: false` only after editorial pass
4. Move back into `src/content/insights/<slug>.mdx`
5. Add redirect entry in `astro.config.mjs` if the slug changed
6. Run `npx playwright test` to verify smoke + a11y

## Index

15 articles, ordered alphabetically:

1. `ai-adoption-framework-b2b-saas-growth-teams.mdx`
2. `astro-cloudflare-pages-portfolio-ai-workflow.mdx`
3. `b2b-crm-revenue-operations-system-guide.mdx`
4. `b2b-revenue-system-design-operator-framework.mdx`
5. `b2b-saas-growth-system-icp-acquisition-retention.mdx`
6. `cloudflare-migration-zero-trust-free-tier.mdx`
7. `component-showcase.mdx`
8. `framer-to-astro-build-vs-buy-website-rebuild.mdx`
9. `google-ads-ai-management-dashboard-guide.mdx`
10. `gtm-ai-agent-four-layer-architecture-guide.mdx`
11. `gtm-tools-build-vs-buy-decision-framework.mdx`
12. `how-to-build-booking-engine-product-architecture.mdx`
13. `how-to-build-gtm-ai-agent-outbound-crm.mdx`
14. `how-to-build-micro-saas-with-ai-tools.mdx`
15. `macos-teleprompter-macbook-notch-native-app.mdx`

## SEO note

These article URLs (`/insights/<slug>`) will 404 on the live site after this change ships. Search engines will deindex them naturally over a few weeks. If specific URLs have meaningful inbound links or rankings, add 301 redirects in `astro.config.mjs` pointing to the most relevant remaining page (typically `/insights` index or the closest topic).

A redirect audit is part of Sprint 2 / Sprint 3 — track via the SEO foundations Codex task at `.codex-tasks/2026-05-22-seo-foundations-review.md`.
