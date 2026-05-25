---
task: refactor/testimonialslider-read-from-collection
brief: 2026-05-23-testimonialslider-migrate-to-collection.md
status: completed
verified_against: local build + Playwright preview
executed_by: Codex
date: 2026-05-25
---

# TestimonialSlider collection migration — result

## Audit — per criterion

1. `TestimonialSlider.astro` accepts transformed collection shape — **PASS.** The component still accepts the legacy display shape (`quote`, `name`, `role`, `company`, `linkedin`, `avatar`) in `src/components/ui/TestimonialSlider.astro:2`, and the homepage transforms collection entries into that shape. This matches the task's recommended Option B.

2. `src/pages/index.astro` removes inline testimonials and reads from the collection — **PASS.** The page imports `getCollection` (`src/pages/index.astro:2`), filters `featured && !draft`, sorts by `order`, and maps collection data into the slider props (`src/pages/index.astro:64`). No inline testimonial array remains.

3. Rendered output identical and ordered Robert, Dariusz, Mike — **PASS.** The source collection orders Robert Sikorski first, Dariusz Gołębiewski second, and Mike Zoladkowski third via `order` values. Built `dist/index.html` renders the same order in both desktop and mobile testimonial markup.

4. Visible behavior preserved — **PASS.** The existing slider template still renders five-star icons, avatar image/fallback, LinkedIn link, `role · company`, and quote in both desktop and mobile branches (`src/components/ui/TestimonialSlider.astro:19`, `src/components/ui/TestimonialSlider.astro:90`).

5. No layout shift or a11y regression — **PASS.** No visual implementation changed in this branch. `npx playwright test smoke a11y` passed across Chromium desktop and mobile Safari; existing baseline a11y findings remain tolerated by the current spec.

## Files changed

- `.codex-tasks/2026-05-23-testimonialslider-migrate-to-collection-result.md` — result file only.

## New tests added

- None. The migration implementation was already present on `main`; I verified it with existing build, smoke, and a11y coverage.

## Verification

- `npm run build` — passed.
- `npx playwright test smoke a11y` — passed: 24 passed.
- `rg` against `dist/index.html` confirmed rendered testimonial order: Robert Sikorski, Dariusz Gołębiewski, Mike Zoladkowski.

## Open questions — tech-lead inbox

- None.
