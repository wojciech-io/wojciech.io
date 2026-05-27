# CLAUDE.md

Public operating brief for AI coding assistants working on `wojciech.io`.

## Product

`wojciech.io` is a public Astro site for Wojciech Łuszczyński: GTM architect,
growth operator, and builder of AI-native revenue systems for B2B SaaS and
technology companies.

## Stack

- Astro, MDX, Tailwind CSS, CSS custom properties
- Cloudflare Pages and Pages Functions
- GitHub Actions for CI, security checks, and Wrangler deploys
- Vitest and Playwright

## Security Rules

- Never commit secrets, local environment files, private notes, handoffs,
  customer documents, or agent state.
- Never include confidential customer names or private dispute context.
- Use anonymized, public-safe language unless a company name is already
  intentionally published in site content.
- Treat Terraform state, `.env*`, `.dev.vars*`, local worktrees, and generated
  reports as private.
- Keep public comments professional: no chat transcripts, no internal memory
  paths, no private operational notes.

## Editing Rules

- Prefer existing Astro components, content collections, and design tokens.
- Keep content structured and reusable.
- Preserve accessibility: semantic HTML, visible focus, labelled controls.
- Run focused tests for the files you touched, then build before opening a PR.
- Use conventional commits.

## Content System

- Articles live in `src/content/insights`.
- Case studies live in `src/content/work`.
- Testimonials live in `src/content/testimonials`.
- MDX article components are registered in `src/pages/insights/[slug].astro`.

## Copy and Design

- All copy must follow the tone of voice spec in `docs/10-tone-of-voice.md`.
  Read it before writing or reviewing any visible text.
- Design tokens, typography, spacing, and colour are documented in
  `docs/design-system.md`. Source of truth is `src/styles/tokens.css`.
- Hard copy bans: no em dashes, no AI slop phrases, no boilerplate structures.
  See `docs/10-tone-of-voice.md` for the full list.

## Deployment

Merges to `main` run CI first. Deploys are handled by Wrangler GitHub Actions
after CI succeeds.
