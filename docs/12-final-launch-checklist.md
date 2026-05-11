# 12 - Final launch checklist

This checklist is for the end of Sprint 3, after staging is approved. Do not start DNS cutover until every pre-cutover item is complete.

## Pre-cutover blockers

- [ ] Confirm `https://github.com/wojciechluszczynski/gtm-agent-repo` is public and is the intended Starter Pack target.
- [ ] Add `PUBLIC_CF_BEACON_TOKEN` to Cloudflare Pages production environment variables.
- [ ] Confirm the latest `main` commit is deployed to `https://wojciech-io.pages.dev`.
- [ ] Confirm the staging build does not include `noindex` unless intentionally testing preview-only indexing behavior.

## Staging smoke test

Run these checks on `https://wojciech-io.pages.dev` before touching DNS:

- [ ] `/` loads and the mobile menu opens.
- [ ] `/about/` loads.
- [ ] `/work/` loads.
- [ ] `/work/#ai-gtm`, `/work/#growth-architecture`, and `/work/#products-shipped` land on the right sections.
- [ ] `/ai-systems/` loads.
- [ ] `/resources/` loads and every external link is intentional.
- [ ] `/insights/` loads and lists the article.
- [ ] `/insights/claude-code-vs-clay/` loads with the final article body.
- [ ] `/rss.xml` contains the article.
- [ ] `/sitemap-index.xml` exists.
- [ ] `/sitemap-0.xml` contains `/insights/claude-code-vs-clay/`.
- [ ] `/robots.txt` points to `https://wojciech.io/sitemap-index.xml`.
- [ ] `/llms.txt` includes the core pages and article URL.
- [ ] Cloudflare Web Analytics beacon appears in page HTML after `PUBLIC_CF_BEACON_TOKEN` is set.

## Redirect verification

Check these on the Cloudflare Pages staging URL before DNS cutover, then repeat on `https://wojciech.io` after cutover:

- [ ] `/solutions` -> `/work/` with 301.
- [ ] `/solutions/` -> `/work/` with 301.
- [ ] `/my-gpt` -> `/ai-systems/` with 301.
- [ ] `/my-gpt/` -> `/ai-systems/` with 301.
- [ ] `/blog` -> `/insights/` with 301.
- [ ] `/blog/` -> `/insights/` with 301.
- [ ] `/blog/claude-code-vs-clay` -> `/insights/claude-code-vs-clay/` with 301.
- [ ] `/blog/claude-code-vs-clay/` -> `/insights/claude-code-vs-clay/` with 301.
- [ ] `/styleguide` returns 410 or is otherwise retired from public indexing.

## SEO checks

- [ ] Each public page has exactly one `h1`.
- [ ] Canonicals point to `https://wojciech.io/...`, not the Pages staging domain.
- [ ] Article has `og:type=article`.
- [ ] Article has `article:published_time` and `article:modified_time`.
- [ ] Article JSON-LD is present and valid enough for Google Rich Results testing.
- [ ] Default OG image loads at `https://wojciech.io/og-default.png` after cutover.
- [ ] Submit `https://wojciech.io/sitemap-index.xml` in Search Console after DNS cutover.

## DNS cutover

- [ ] Confirm Cloudflare Pages custom domain is ready.
- [ ] Lower DNS TTL if applicable.
- [ ] Point `wojciech.io` to Cloudflare Pages according to Cloudflare's current instructions.
- [ ] Confirm HTTPS certificate issuance.
- [ ] Confirm `https://wojciech.io/` serves the new Astro site.
- [ ] Confirm `www` behavior is intentional, either redirecting or serving consistently.

## Post-cutover monitoring

Within the first hour:

- [ ] Re-run redirect verification on production.
- [ ] Re-run sitemap, RSS, robots, llms, and article checks on production.
- [ ] Confirm Cloudflare Web Analytics receives traffic.
- [ ] Check Cloudflare Pages deployment logs for errors.

Within 24-48 hours:

- [ ] Check Search Console coverage and sitemap discovery.
- [ ] Watch for unexpected 404s.
- [ ] Check branded query snippets when Google refreshes.
- [ ] Validate that old Framer URLs are no longer reachable without the intended redirect/retirement behavior.

Within 7 and 30 days:

- [ ] Review Search Console clicks, impressions, CTR, and indexed pages.
- [ ] Review Cloudflare Web Analytics traffic patterns.
- [ ] Decide whether additional legacy blog URLs should be redirected, rewritten, or retired.
