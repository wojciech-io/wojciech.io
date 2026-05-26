---
task: sprint4/motion-one-install
branch_hint: codex/motion-one-install
created: 2026-05-26
author: tech-lead (Claude Code)
acceptance:
  - motion package installed (motion@latest in package.json)
  - CSS motion tokens added to src/styles/global.css (:root block)
  - prefers-reduced-motion handled via CSS tokens (--motion-entrance: 0s when reduced)
  - entrance animations on homepage sections: HeroSection, StatsBar, ProofCards, TestimonialsSection
  - all animations use inView() — nothing fires before scroll position
  - npm run build passes with zero type errors
  - npm run test passes
---

# PARTIALLY DONE — Install Motion One + homepage entrance animations

> **Status (2026-05-26):** Package installed, CSS tokens added, inView() system wired in Layout.astro
> via `.reveal-up` + `.is-visible` pattern. Per-component class additions are covered by
> `.codex-tasks/2026-05-26-reveal-up-homepage-sections.md` — use that spec instead.

# Original spec — Install Motion One + homepage entrance animations

## Context

wojciech.io uses Astro + Tailwind CSS v4. Sprint 4 goal: add microinteractions and scroll-driven
entrance animations. This task installs the Motion One library (18 kB, tree-shakeable) and
wires up the first set of animations on the homepage only.

Stack note: do NOT add GSAP, anime.js, AOS, ScrollReveal, or any other animation library.
Only Motion One (`motion` package).

## Constraints (hard rules)

- Zakaz em dashów (—) w jakimkolwiek widocznym tekście. Zastępnik: dwukropek lub przecinek.
- Nie pushuj do main — tylko PR.
- Nie zmieniaj copy ani treści artykułów.
- Zmieniaj tylko pliki wymienione poniżej.

## Files in play

- `package.json` (add motion dependency)
- `src/styles/global.css` (add motion token block)
- `src/components/home/HeroSection.astro` (entrance animation)
- `src/components/home/StatsBar.astro` (stagger entrance)
- `src/components/home/ProofCards.astro` or equivalent proof section (stagger entrance)
- `src/components/home/TestimonialsSection.astro` (entrance)

## Steps

### 1. Install package

```bash
npm install motion
```

Verify it appears in `package.json` dependencies (not devDependencies).

### 2. Add motion tokens to global.css

Add this block inside the existing `:root { ... }` (after other tokens, before any component styles):

```css
/* Motion tokens */
--motion-entrance: 0.5s cubic-bezier(0.22, 1, 0.36, 1);
--motion-micro: 0.2s ease;
--motion-stagger: 0.08s;

@media (prefers-reduced-motion: reduce) {
  --motion-entrance: 0s;
  --motion-micro: 0s;
  --motion-stagger: 0s;
}
```

### 3. Add entrance animations

In each homepage component, add a `<script>` block (NOT `<script is:inline>`). Pattern:

```ts
import { animate, inView } from 'motion';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced) {
  // Fade-up for single element
  inView('#hero-headline', (el) => {
    animate(el, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, easing: [0.22, 1, 0.36, 1] });
  });

  // Stagger for lists of cards
  inView('.proof-card', (el) => {
    animate(el, { opacity: [0, 1], y: [16, 0] }, {
      duration: 0.45,
      easing: [0.22, 1, 0.36, 1],
      delay: parseFloat(el.dataset.index || '0') * 0.08,
    });
  }, { margin: '-10% 0px' });
}
```

Required: all animated elements must start at `opacity: 0` via CSS class `motion-init` added to the element. Add to global.css:

```css
.motion-init { opacity: 0; }
```

This prevents flash of unstyled content if JS is slow. Add `motion-init` class in the Astro markup of each animated element.

#### Specific elements to animate

| Component | Elements to animate | Animation |
|---|---|---|
| HeroSection | h1 headline, subheadline, CTA button | fade-up sequential, 80ms stagger |
| StatsBar | each stat item | fade-up stagger 80ms each |
| ProofCards | each card | fade-up stagger 80ms, trigger at -10% margin |
| TestimonialsSection | section heading + first card | fade-up |

### 4. Verify

- `npm run build` must pass.
- `npm run test` must pass (unit tests in src/__tests__/).
- Inspect the built HTML: `motion-init` class must be present on animated elements.
- No unconditional `animate()` calls outside `inView()`.

## Out of scope

- Lenis smooth scroll (separate task).
- Astro View Transitions (separate task).
- Article pages, /about, /work, /ai-systems — homepage only for this task.
- GSAP — not approved yet.

## Estimated effort

1 Codex session (~2–3 h).
