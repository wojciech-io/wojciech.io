# 00 - Execution map: what happens when, who does it, where

## Current state

| Area | Status | Where |
|---|---|---|
| Existing production site | live on Framer | `https://wojciech.io` |
| New codebase | created | local `~/wojciech.io` + GitHub `wojciechluszczynski/wojciech-io` |
| New staging deploy | live | `https://wojciech-io.pages.dev` |
| Production DNS cutover | not yet | do not touch until Sprint 3 |

## Phase 1 - immediately after receiving this pack

### Wojciech

**Where:** local repo `~/wojciech.io`

1. Copy into the repo:
   - `CLAUDE.md`
   - `AGENTS.md`
   - `docs/`
   - `templates/`
   - `prompts/`
2. Commit them:

```bash
git add .
git commit -m "Add wojciech.io v2 sprint 0 specification"
git push
```

3. Open Claude Code in the repo and use `prompts/01-claude-code-kickoff.md`.

### GPT-5.5 Thinking

**Where:** ChatGPT / strategy layer

- review Claude Code's proposed Sprint 1 plan before large implementation starts,
- refine the plan if it drifts from the docs.

## Phase 2 - Sprint 1

### Claude Code

**Where:** same repo

- implements foundation only,
- creates Tailwind setup, tokens, global layout, components, SEO primitives,
- proposes visual shell.

### Claude / Claude Design

**Where:** separate ideation thread / prompt pack

- generate visual directions if needed using `prompts/02-claude-design-exploration.md`,
- output ideas, not source-of-truth code.

### Codex

**Where:** separate review branch / review thread

- review the foundation after implementation using `prompts/03-codex-review-seo-foundations.md`.

### Wojciech

**Where:** staging site + local review

- choose visual direction,
- reject anything that becomes generic or brochure-like.

## Phase 3 - Sprint 2

### Claude Code

**Where:** repo

- builds real homepage and core pages,
- implements proof clusters and testimonial system.

### GPT-5.5 Thinking

**Where:** ChatGPT

- develops final proof metric shortlist,
- reviews copy and narrative hierarchy.

### Wojciech

**Where:** review / decision layer

- validates proof, metrics and featured testimonials,
- approves final project packaging.

## Phase 4 - Sprint 3

### Claude Code

**Where:** repo

- builds insights, resources, redirects, analytics, SEO files, final polish.

### Codex

**Where:** review branch

- runs responsive QA using `prompts/04-codex-review-responsive-qa.md`,
- reviews redirects and SEO.

### Wojciech + GPT-5.5 Thinking

**Where:** final staging review

- approve launch candidate,
- finalize redirect decisions,
- only then add custom domain and switch DNS.

## Phase 5 - post-launch

### Wojciech

- watch GSC / GA4,
- publish new content,
- improve proof and case studies over time.

### GPT-5.5 Thinking

- help interpret data and prioritize post-launch iterations.

## Never do before launch readiness

- do not point `wojciech.io` to Cloudflare yet,
- do not delete Framer project,
- do not publish unvalidated proof metrics,
- do not migrate weak legacy articles just to fill space,
- do not let tools invent a new brand direction without updating docs first.
