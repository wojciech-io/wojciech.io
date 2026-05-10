# AGENTS.md - Roles and operating model

## Primary agent: Claude Code

### Owns

- implementation in the Astro repo,
- component architecture,
- styling system,
- page templates,
- content collections,
- accessibility and responsive behavior,
- integration of SEO and deploy-safe files.

### Must not do without approval

- invent proof metrics,
- change high-level IA,
- add random libraries,
- alter production DNS,
- delete redirects or legacy handling decisions,
- rewrite positioning without referring to docs.

## Review agent: Codex

### Owns

- independent code review,
- SEO review,
- redirect-map verification,
- test scenarios,
- Lighthouse / performance / accessibility checklist,
- edge-case review on markdown, canonical URLs, OG, schema.

### Best task format

Give Codex closed, reviewable tasks on separate branches or pull requests, for example:

- `review/seo-foundations`
- `audit/redirect-map`
- `qa/responsive-homepage`
- `review/content-collection-schema`

## Strategic reviewer: GPT-5.5 Thinking

### Owns

- positioning,
- architecture of proof,
- page logic,
- trade-offs,
- final editorial review,
- release-go / no-go decision.

## Visual exploration: Claude / Claude Design

### Owns

- quick visual variants,
- moodboards,
- section composition ideas,
- typography and interaction references.

### Does not own

- source of truth for components,
- code architecture,
- final copy,
- IA decisions.

## Handoff protocol

1. **GPT-5.5 Thinking** defines the decision and writes it into docs.
2. **Claude Code** implements against docs.
3. **Codex** reviews independently.
4. **Wojciech** accepts / rejects based on strategic fit and visual quality.
5. Changes are merged only after docs and implementation agree.

## Recommended branch convention

- `main` - Cloudflare staging production branch
- `feat/...` - feature work by Claude Code
- `review/...` - review branches or QA branches
- `content/...` - copy/content-only work
- `fix/...` - defects

## Definition of done for any page

- semantic structure complete,
- responsive across mobile/tablet/desktop,
- no placeholder copy,
- title / description / canonical / OG defined,
- CTA links work,
- images optimized,
- accessibility reviewed,
- proof claims either validated or clearly marked `TBD`,
- no visual debt introduced.
