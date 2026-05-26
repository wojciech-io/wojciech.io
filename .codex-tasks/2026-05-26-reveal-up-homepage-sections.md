---
task: sprint4/reveal-up-homepage-sections
branch_hint: codex/reveal-up-homepage-sections
created: 2026-05-26
author: tech-lead (Claude Code)
acceptance:
  - reveal-up class added to section headings and key elements in: MetricsStrip, ProjectsSection, AILeverage, TestimonialsSection, InsightsPreview
  - HeroSection: headline, subheadline, and CTA button each have reveal-up with data-reveal-index for stagger
  - NO motion library imports added to components — the inView observer is already wired in Layout.astro
  - prefers-reduced-motion: elements with reveal-up but without is-visible are not visible (opacity 0); reduced motion skips animation and shows immediately
  - npm run build passes with zero type errors
  - no layout shift: elements without is-visible must be visually hidden but NOT layout-hidden (use opacity:0, not display:none)
---

# Codex task — Add reveal-up scroll animations to homepage sections

## Context

wojciech.io is an Astro SSG site. Sprint 4 added a scroll-reveal system:

- `motion` npm package is already installed (Motion One, vanilla JS, no React).
- CSS class `.reveal-up` is defined in `src/styles/global.css`:
  - default: `opacity: 0; transform: translateY(var(--motion-fade-dist))` (22px)
  - `.reveal-up.is-visible`: animated in via CSS transition using `--motion-entrance` token
  - reduced motion: instant (no transition)
- `Layout.astro` already runs `inView()` (from `motion`) on every element with class `reveal-up` at page load and after every `astro:page-load` event. It adds `is-visible` when the element enters the viewport.

**What this task does:** add `reveal-up` (and optionally `data-reveal-index`) to elements in homepage sections that currently have no entrance animation. No JS changes — just HTML class additions.

## Constraints (hard rules)

- Zakaz em dashów (—) w jakimkolwiek widocznym tekście, tytułach, komentarzach.
- Nie pushuj do main — tylko PR z branch `codex/reveal-up-homepage-sections`.
- Nie zmieniaj logiki JS ani CSS — tylko dodaj klasy do markupu.
- Nie zmieniaj copy, treści, ani layoutu.
- Nie dodawaj `<script>` ani importow motion do komponentow — system jest juz podpiety w Layout.astro.

## How the stagger works

Add `data-reveal-index="0"`, `data-reveal-index="1"`, etc. to sibling elements. The CSS uses
`animation-delay: calc(var(--motion-stagger) * var(--data-reveal-index, 0))` — OR Codex can
apply inline style `style="--reveal-delay: calc(var(--motion-stagger) * N)"` if the CSS is
not already parameterized. Check `src/styles/global.css` lines near `.reveal-up` to see the
exact mechanism and match it.

If global.css does not already support `data-reveal-index` for delay, add the following rule
to the `.reveal-up` block (do NOT remove existing rules):

```css
.reveal-up {
  animation-delay: calc(var(--motion-stagger, 0.08s) * var(--data-reveal-index, 0));
}
```

Or use `transition-delay` instead — match whichever property is already in use.

## Files to modify

- `src/components/home/HeroSection.astro`
- `src/components/home/MetricsStrip.astro`
- `src/components/home/ProjectsSection.astro`
- `src/components/home/AILeverage.astro`
- `src/components/home/TestimonialsSection.astro`
- `src/components/home/InsightsPreview.astro`
- `src/styles/global.css` (only if stagger delay mechanism needs to be added)

Do NOT modify HowIWork.astro (already has reveal-up on cards).

## Specific elements to animate per component

### HeroSection.astro

Three elements in sequence (stagger 0, 1, 2):
- The `<h1>` tag — `data-reveal-index="0"`
- The subheadline `<p>` below h1 — `data-reveal-index="1"`
- The CTA button row (`<div>` containing the CTA links) — `data-reveal-index="2"`

### MetricsStrip.astro

The stat items in the grid — each `<div class="flex flex-col items-center ...">` gets:
- `reveal-up` class
- `data-reveal-index` 0, 1, 2, 3 (there are 4 stats in a grid)

### ProjectsSection.astro

Two separate reveal targets:
- Section heading block (`<h2>` or its wrapper) — `reveal-up data-reveal-index="0"`
- Each project card — `reveal-up` with `data-reveal-index` matching its position (0, 1, 2...)

### AILeverage.astro

- Section heading `<h2>` — `reveal-up data-reveal-index="0"`
- Each feature/item block — `reveal-up` with sequential `data-reveal-index`

### TestimonialsSection.astro

- Section heading `<h2>` — `reveal-up data-reveal-index="0"`
- First testimonial card — `reveal-up data-reveal-index="1"`
- Remaining cards — `reveal-up` (no stagger needed, just entrance)

### InsightsPreview.astro

- Section heading — `reveal-up data-reveal-index="0"`
- Each article preview card — `reveal-up` with `data-reveal-index` per position

## Verification steps

1. `npm run build` — must pass, zero errors.
2. Manual check in browser: on first scroll to each section, elements should fade up.
3. In DevTools: toggle `prefers-reduced-motion: reduce` (Rendering panel) — elements must appear immediately, no invisible content.
4. Page source: `reveal-up` class must be in built HTML on all targeted elements.

## Out of scope

- Pages other than homepage (`/about`, `/work`, etc.) — separate task.
- Adding Motion One `animate()` calls — the CSS transition system is sufficient.
- VideoLoop component — not on homepage yet.
- Any copy changes.

## Estimated effort

1 Codex session (1.5-2 h).
