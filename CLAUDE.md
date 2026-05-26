# CLAUDE.md - wojciech.io v2

## Mission

Build `wojciech.io v2` as a fast, precise, premium personal site for Wojciech Łuszczyński. This is **not** a Framer clone. It is a rewrite that reflects his current positioning:

- growth / GTM operator,
- builder of revenue systems,
- AI-native workflow architect,
- product-minded executive who can also ship real software.

## Tech decisions

- Framework: **Astro**
- Hosting: **Cloudflare Pages**
- Language at launch: **English only**
- Content: **MDX / Astro content collections**
- Styling: **Tailwind CSS + CSS design tokens**
- Deployment: GitHub `main` -> Cloudflare Pages production staging at `wojciech-io.pages.dev`

## Design direction

Use:

- visual system / palette / polish inspired by `app.wojciech.io`,
- narrative rhythm and proof-led storytelling closer to `brand24-ai.vercel.app`,
- editorial, restrained, premium, technical, but not cold.

Avoid:

- generic SaaS gradients,
- old service-agency landing structure,
- giant testimonial carousels,
- copy that sounds like a marketing consultant brochure,
- cloning existing Framer sections 1:1.

## Core pages for v2

- `/` - new homepage, rewrite from scratch
- `/about` - new operator profile, rewrite from scratch
- `/work` - selected proof / case studies
- `/ai-systems` - AI systems, workflows, agents, practical use of AI
- `/insights` - article index
- `/insights/claude-code-vs-clay` - migrated and improved article
- `/resources` - starter packs, repositories, downloadable assets; may ship as lean placeholder in v1

External destination, not rebuilt here:

- `https://app.wojciech.io/apps` - products / app portfolio

## Content decisions already made

- Current homepage: rewrite from scratch.
- `/about`: rewrite from scratch.
- `/solutions`: retire current content; likely redirect to `/work`.
- `/my-gpt`: retire current content; concept absorbed into `/ai-systems`.
- `/pricing`: do not migrate.
- `/support`: do not migrate unless a later technical reason appears.
- `/styleguide`: do not migrate publicly.
- Blog: keep only the current valuable article `claude-code-vs-clay`; legacy posts are not part of v2 content strategy.
- Testimonials: retain all in inventory for now; feature a curated subset on homepage later.

## Proof architecture

Do not present a flat list of apps. Group proof into three clusters:

1. **AI-native GTM systems**
   - AdsAI
   - Ad Assistant
   - Claude Code GTM Agent Starter Pack
   - Notch macOS native app built with Codex + Xcode

2. **Growth architecture in practice**
   - B2B SaaS growth system / Q1-Q2 architecture (client under NDA)
   - CRM / SEO / CRO / winback / analytics operating systems
   - Brand24 AI Adoption task as a demonstration of approach

3. **Products actually shipped**
   - Kamperownia booking engine
   - selected apps from `app.wojciech.io/apps`
   - examples such as Działka+, Paczka+, Resume+, where useful

## Working rules

- Read `docs/` before implementing.
- Do not invent metrics. Put unknown proof points into `TBD` until validated.
- Use semantic HTML, minimal JS, accessible components, and strong typography.
- Prefer reusable components over repeated markup.
- Keep all copy editable and structured.
- Before large changes, propose plan and file list.
- Commit in logical slices.
- Do not change production DNS or custom domains.

## Required deliverables by sprint

### Sprint 1

- project skeleton
- Tailwind + tokens
- global layout
- SEO primitives
- reusable components
- homepage wireframe / section shell

### Sprint 2

- homepage content and layout
- `/about`, `/work`, `/ai-systems`
- proof cards and case-study system
- testimonial system

### Sprint 3

- `/insights`
- migrated article
- redirects, sitemap, RSS, llms.txt, analytics
- QA and production cutover checklist

## References

- `docs/01-site-audit.md`
- `docs/02-current-state-inventory.md`
- `docs/03-content-decisions.md`
- `docs/04-ia-v2.md`
- `docs/05-design-direction.md`
- `docs/06-proof-architecture.md`
- `docs/07-sprint-plan.md`
- `docs/08-migration-backlog.md`
- `docs/09-seo-migration.md`
