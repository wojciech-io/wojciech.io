---
task: sprint4/lenis-smooth-scroll
branch_hint: codex/lenis-smooth-scroll
created: 2026-05-26
author: tech-lead (Claude Code)
acceptance:
  - lenis package installed (lenis in package.json)
  - smooth scroll active on / and /about only (not on article pages or other routes)
  - only enabled on pointer:fine devices (desktop/trackpad), not on touch devices
  - destroys correctly on Astro View Transitions navigation event
  - no layout shift or scroll jump on page load
  - npm run build passes
---

# Closed task — Lenis smooth scroll on homepage and /about

## Context

wojciech.io is Astro SSG. Sprint 4 adds smooth scroll to the two long narrative pages.
Lenis is the chosen library (8 kB, framework-agnostic, works with Astro's native scroll).

Do NOT use Locomotive Scroll, ScrollSmoother (GSAP plugin), or any other scroll library.

## Constraints (hard rules)

- Zakaz em dashów (—).
- Nie pushuj do main — tylko PR.
- Only enable on / and /about. Never on /insights/[slug] (breaks reading scroll position).
- Only enable on pointer:fine (desktop, trackpad). Touch devices use native scroll.
- Must clean up Lenis instance on Astro View Transitions page navigation.

## Files in play

- `package.json` (add lenis dependency)
- `src/pages/index.astro` (add Lenis init script)
- `src/pages/about.astro` OR `src/components/pages/AboutContent.astro` (add Lenis init script)

## Steps

### 1. Install

```bash
npm install lenis
```

### 2. Create shared Lenis init snippet

Add a `<script>` block (not is:inline) to both pages. Pattern:

```ts
import Lenis from 'lenis';

// Only on pointer:fine (desktop/trackpad)
if (window.matchMedia('(pointer: fine)').matches) {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Clean up on Astro View Transitions page navigation
  document.addEventListener('astro:before-preparation', () => lenis.destroy(), { once: true });
}
```

If Astro View Transitions are NOT yet enabled (view-transitions task may not have landed),
omit the `astro:before-preparation` listener and add a TODO comment.

### 3. Do NOT add to article pages

Do not touch:
- `src/pages/insights/[slug].astro`
- `src/pages/contact.astro`
- `src/pages/work.astro`
- `src/pages/ai-systems.astro`
- Any other page

### 4. Verify

- `npm run build` must pass.
- No TypeScript errors from Lenis types.
- On desktop browser: scroll feels smooth on / and /about.
- On touch device simulation (Chrome DevTools): native scroll (Lenis NOT active).

## Out of scope

- GSAP ScrollTrigger integration with Lenis (future task, after GSAP is approved).
- Any custom scroll events or parallax effects in this task.
- Programmatic scroll-to (anchor links) — Lenis handles this automatically.

## Estimated effort

1 Codex session (~1 h).
