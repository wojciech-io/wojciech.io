---
task: review/seo-foundations
branch_hint: codex/seo-foundations-review
created: 2026-05-22
author: tech-lead (Claude Code, session nervous-bartik-5a866d)
acceptance:
  - canonical URLs correct on all public pages (/, /about, /work, /ai-systems, /insights, /insights/claude-code-vs-clay)
  - OG tags (og:title, og:description, og:image, og:url, og:type) present and resolve on every page
  - Twitter card tags (twitter:card, twitter:title, twitter:description, twitter:image) present
  - sitemap.xml at /sitemap.xml references every page that should be indexed and excludes drafts/dev/app subdomains
  - robots.txt allows wojciech.io public crawl, blocks dev.wojciech.io and app.wojciech.io
  - llms.txt present at /llms.txt with current content per docs/09-seo-migration.md
  - hreflang on /[lang]/ if multilingual routes exist (memory check: launch is English-only per CLAUDE.md, so hreflang should be ABSENT or self-referencing only)
  - no broken internal links across pages (tests/e2e/links.spec.ts should already cover; verify it does)
  - schema.org structured data: Person on /about, BlogPosting on /insights/*, WebSite on /
---

# Closed task — SEO foundations review

## Context

Sprint 1 of the wojciech.io v2 rebuild is closing. Test Engineer (Playwright) is live, Release Manager scaffold landed, security headers are now blocking. Before Sprint 2 starts on homepage content, an **independent SEO + metadata audit** is needed across the existing pages so we don't carry forward defects into the content-heavy sprint.

You are picking this up cold — read these before touching code:

- `CLAUDE.md` (root) — site mission, tech decisions, English-only-at-launch rule
- `AGENTS.md` (root) — your role (Codex = independent reviewer + closed implementer)
- `docs/agent-ownership.md` — what you may/may not touch
- `docs/codex-handoff-protocol.md` — how this handoff works + what "done" looks like
- `docs/09-seo-migration.md` — Sprint 3's deliverables; your audit informs which still apply
- `docs/04-ia-v2.md` — current information architecture
- `docs/subdomain-canonical-profile.md` — canonical hostname rules across subdomains

## Files in play (read; touch only on review branch)

- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/pages/ai-systems.astro`
- `src/pages/insights/` (whole folder)
- `src/components/` — look for `Layout.astro`, `SEO.astro` / `Head.astro` (or equivalent), `Schema.astro`
- `public/robots.txt`
- `public/llms.txt`
- `astro.config.mjs` — site URL, sitemap integration
- `tests/e2e/links.spec.ts`, `tests/e2e/hreflang.spec.ts`

## Scope — what to do

1. **Read first** — confirm you understand IA + tone of voice rules (`docs/04-ia-v2.md`, `docs/10-tone-of-voice.md`). Do NOT propose copy changes; voice is locked.

2. **Audit pass** — for each acceptance criterion above, check the current state. Produce one paragraph per criterion in your result file: `PASS`, `FAIL — <evidence + line ref>`, or `N/A — <reason>`.

3. **Fix pass** — open PR from `codex/seo-foundations-review` with the minimum set of changes needed to flip every FAIL to PASS. Limit changes to `src/components/SEO*.astro`, page-level `Astro.props.seo`, `public/robots.txt`, `public/llms.txt`, `astro.config.mjs`. **Do NOT touch copy.** **Do NOT add new pages.** **Do NOT change IA.**

4. **Test coverage** — add or extend Playwright specs in `tests/e2e/` to make each acceptance criterion enforceable. New specs go in `tests/e2e/seo.spec.ts`. Use the same pattern as existing specs.

5. **Result file** — write `.codex-tasks/2026-05-22-seo-foundations-review-result.md` companion with:
   - One-paragraph audit summary per criterion
   - List of files changed and why
   - List of NEW tests added
   - Open questions (if any) routed to tech-lead inbox

## Out of scope

- Performance / Lighthouse — that's Tier 5d, owned by Test Engineer, separate PR (`.github/workflows/lighthouse.yml` just landed).
- Visual regression — Tier 5a, deferred until Sprint 2 baseline capture.
- Copy edits — voice locked per `docs/10-tone-of-voice.md`.
- New marketing pages — those land in Sprint 2.

## Boundaries (hard)

- You never merge to `main` (Tech Lead's PR-merge tool is blocked for you per `AGENTS.md`).
- You never edit `.agent-state/<other>/`.
- You never edit production DNS or Cloudflare config (memory rule: `wojciech.io` push to main is free, `app.wojciech.io` deploy needs greenlight; you neither push to main nor deploy).
- Branch protection is OFF until Sprint 2 — but treat it as if it's ON. Open PR, request review from `wojciechluszczynski`, wait.

## How tech-lead picks this back up

When you write the result file and open the PR, tech-lead (Claude Code) will:

1. Read your result + diff
2. Verify acceptance criteria against the diff
3. Run the new Playwright specs locally or via CI on the PR
4. Merge if green, OR file an inbox message back to you with specific fixes if amber

Estimated effort: 1-2 Codex sessions. If you can't finish in one session, write a partial result file with a `[partial]` marker and what remains.
