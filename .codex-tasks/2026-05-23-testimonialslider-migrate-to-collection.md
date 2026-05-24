---
task: refactor/testimonialslider-read-from-collection
branch_hint: codex/testimonials-collection-read
created: 2026-05-23
author: tech-lead (Claude Code, session nervous-bartik-5a866d)
acceptance:
  - src/components/ui/TestimonialSlider.astro accepts `Testimonial` shape from astro:content collection (CollectionEntry<'testimonials'>['data']) OR a transformed shape, not the legacy inline array
  - src/pages/index.astro removes the inline `testimonials` const (lines ~63-86) and reads from `await getCollection('testimonials', ({ data }) => data.featured && !data.draft).sort((a, b) => a.data.order - b.data.order)`
  - Rendered output identical to today (3 testimonials in same order: Robert Sikorski, Dariusz Gołębiewski, Mike Zoladkowski)
  - Existing visible behavior preserved: stars, avatar, LinkedIn link, role+company line, quote
  - No layout shift, no a11y regression (axe spec stays green)
---

# Closed task — Migrate TestimonialSlider from inline array to content collection

## Context

Sprint 2 B4 landed the `testimonials` content collection schema (PR #28) and Sprint 2 testimonial-migration commit populated the collection with the 3 existing testimonials as .json files matching the schema.

Current state: `src/pages/index.astro` has an inline `testimonials` const that duplicates the .json files. Single-source-of-truth principle demands the inline array goes; rendering reads from the collection.

This task closes the migration so the homepage testimonials section is fully data-driven.

## Files in play

- `src/components/ui/TestimonialSlider.astro` — Props interface change (or add a transform helper)
- `src/pages/index.astro` — drop inline array, read from collection
- `src/content/testimonials/*.json` — source of truth, NO edits (read-only here)
- `src/content.config.ts` — schema is canonical, NO edits

## Mapping between schema and slider fields

Collection schema field → Slider current field:
- `author` → `name`
- `role` → `role` (same)
- `company` → `company` (same)
- `href` → `linkedin`
- `avatar` → `avatar` (same)
- `quote` → `quote` (same)

Two ways to handle the rename — pick whichever is cleaner:

**Option A — Update slider Props to collection shape**
```typescript
interface Testimonial {
  author: string;
  role: string;
  company: string;
  href?: string;
  avatar?: string;
  quote: string;
}
```
Then update template to use `t.author` instead of `t.name`, `t.href` instead of `t.linkedin`. Cleaner long-term.

**Option B — Transform in index.astro**
Read collection, map to existing Props shape:
```typescript
const testimonialsCollection = await getCollection('testimonials', /* filter */);
const testimonials = testimonialsCollection
  .sort((a, b) => a.data.order - b.data.order)
  .map(t => ({
    quote: t.data.quote,
    name: t.data.author,
    role: t.data.role,
    company: t.data.company,
    linkedin: t.data.href,
    avatar: t.data.avatar,
  }));
```
Slider stays untouched. Lower-risk first pass.

**Recommendation:** Option B for this PR. Schedule Option A as a follow-up if the slider gets touched for any other reason.

## Verification

- `npm run build` succeeds, 13+ pages
- Visual check: homepage testimonial section renders identical to current production
- `npx playwright test smoke a11y` passes
- Compare HTML output before/after with `curl https://wojciech.io | grep testimonial-slider` and diff — should be byte-identical or near-identical

## Out of scope

- Adding more testimonials (separate task; needs Wojciech curation)
- Changing the slider visual design
- Migrating TestimonialCard.astro (separate component, separate task)

## Boundaries (hard)

- You do NOT merge to main
- You do NOT add new testimonials
- You do NOT change avatar URLs (third-party `unavatar.io` is the deliberate choice today)

## Estimated effort

0.5-1 Codex session.
