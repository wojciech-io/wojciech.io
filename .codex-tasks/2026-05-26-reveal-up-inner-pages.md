---
task: sprint4/reveal-up-inner-pages
branch_hint: codex/reveal-up-inner-pages
created: 2026-05-26
author: tech-lead (Claude Code)
acceptance:
  - AboutContent.astro: section headings, trait cards, bio paragraphs, office photo strip all have reveal-up + data-reveal-index
  - WorkContent.astro: section headings, project cards, cluster labels all have reveal-up + data-reveal-index
  - No animate-fade-up or animate-scale-in classes remain in these two files
  - reveal-up follows the same pattern as HeroSection.astro and InsightsPreview.astro (class="reveal-up", data-reveal-index={0..6})
  - npm run build passes, no TypeScript errors
  - Visual regression: existing Playwright snapshots still pass (or are updated if needed)
---

# Codex task — reveal-up animations on About and Work pages

## Context

The homepage uses a `reveal-up` IntersectionObserver animation system (defined in `src/styles/global.css` lines 145–210). Elements get `class="reveal-up"` + `data-reveal-index="N"` (0–6) to stagger. The observer fires on scroll and adds `.is-visible`.

The AI Systems page was updated in PR #64 to use this system. About and Work pages still use `animate-fade-up`/`animate-scale-in` one-shot CSS animations that fire on load instead of scroll.

## Files to edit

- `src/components/pages/AboutContent.astro`
- `src/components/pages/WorkContent.astro`

## How to apply

1. For each section, pick the primary visible elements (section eyebrow/heading, cards, paragraphs)
2. Add `reveal-up` to the element's class list
3. Add `data-reveal-index={i}` where `i` is 0-based within the section (reset per section)
4. For mapped arrays, use `data-reveal-index={i}` in the `.map((..., i) =>` callback
5. Remove any `animate-fade-up`, `animate-scale-in`, or `[animation-delay:...]` classes

## Reference

See `src/components/home/HeroSection.astro` lines 75-85 for the pattern.
See `src/components/pages/AiSystemsContent.astro` (post-PR #64) for inner-page application.
