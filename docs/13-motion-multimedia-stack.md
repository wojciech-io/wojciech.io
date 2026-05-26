# 13 - Motion + multimedia stack

Target architecture for Sprint 4+. Documents package choices, usage rules, and agent briefing notes.

---

## Stack layers

### 1. Astro View Transitions — page transitions

**Package:** none (Astro built-in, `astro:transitions`)
**Status:** not yet enabled
**Purpose:** smooth same-origin navigation, morph hero elements across pages

Enable globally in `src/layouts/Layout.astro`:
```astro
import { ViewTransitions } from 'astro:transitions';
<ViewTransitions />
```

Rules for agents:
- Every page that should participate needs `transition:name` attributes on persistent elements.
- Never add `transition:animate` to elements inside dialogs, drawers, or the cookie banner — it breaks focus management.
- Fallback is instant navigation; do not block on transitions.

---

### 2. Motion One — microinteractions

**Package:** `motion` (Motion One v10, 18 kB gzip)
**Import:** `import { animate, inView, scroll } from 'motion'`
**Status:** not yet installed
**Purpose:** entrance animations (fade-up, stagger), scroll-driven reveals, hover microinteractions

Install:
```
npm install motion
```

Rules for agents:
- Only import inside `<script>` blocks; never in `.astro` frontmatter.
- Always use `inView()` for elements below the fold — no unconditional `animate()` on mount.
- `prefers-reduced-motion` must always be respected:
  ```ts
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) inView(el, () => animate(el, { opacity: [0, 1], y: [20, 0] }));
  ```
- Duration: entrance 0.4–0.6 s, micro 0.15–0.25 s. No bounce/spring on text.
- Never block LCP with animations; animate only non-LCP elements.

Standard motion tokens (add to `global.css`):
```css
:root {
  --motion-entrance: 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  --motion-micro: 0.2s ease;
  --motion-stagger: 0.08s;
}
@media (prefers-reduced-motion: reduce) {
  --motion-entrance: 0s;
  --motion-micro: 0s;
  --motion-stagger: 0s;
}
```

---

### 3. Lenis — smooth scroll

**Package:** `lenis` (8 kB gzip)
**Status:** not yet installed
**Purpose:** buttery scroll on `/` and `/about` — pages with long narrative content

Install:
```
npm install lenis
```

Rules for agents:
- Only enable on desktop (`window.matchMedia('(pointer: fine)')`).
- Never enable on `/insights/[slug]` article pages — interferes with reading focus.
- Initialize once per page in a `<script>` block inside the relevant page or layout.
- `raf` loop via `requestAnimationFrame`, not setTimeout.
- Destroy on Astro View Transitions `astro:before-preparation` event.

```ts
import Lenis from 'lenis';
const lenis = new Lenis();
function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
document.addEventListener('astro:before-preparation', () => lenis.destroy());
```

---

### 4. GSAP — complex hero animations only

**Package:** `gsap` (free tier, no plugins needed initially)
**Status:** not yet installed — **deliberate hold until hero concept is approved**
**Purpose:** GTM Command Center interactive hero, system map orchestrated reveal

Install (when approved):
```
npm install gsap
```

Rules for agents:
- **Do not add GSAP to any page other than the homepage hero** without explicit approval.
- Never import GSAP at the module level inside `.astro` files — always dynamic `import('gsap')`.
- Use ScrollTrigger only if Lenis is disabled or the integration is verified (Lenis v1.1+ has native GSAP integration via `lenis.on('scroll', ScrollTrigger.update)`).
- No GSAP on mobile — fallback to static or Motion One.

---

### 5. SVG system diagrams — inline, animated via CSS / Motion One

**Status:** not yet built
**Purpose:** visual system diagrams for `/ai-systems`, case study sections, article diagrams

Approach:
- SVGs authored in Figma or Inkscape, exported as optimized inline SVG.
- Animations via CSS `@keyframes` or Motion One `animate()` on named SVG elements.
- No Rive for Sprint 4 — Rive is for interactive runtime diagrams (Sprint 5+).

Rules for agents:
- SVG files live in `src/assets/diagrams/`.
- Each SVG must have `aria-label` and `role="img"` or inline `<title>`.
- Complex diagrams should be wrapped in an `<AstroComponent>` for reuse.
- Diagram animations follow the same `prefers-reduced-motion` rule as Motion One.

---

### 6. Product video loops — case studies + hero

**Status:** waiting for media assets from Wojciech
**Purpose:** short (5–15 s), muted, looping `.webm` + `.mp4` pairs showing app UIs

Rules for agents:
- Videos must have `muted autoplay loop playsinline` and no `controls` for background loops.
- Always include a static fallback image via `<picture>` or `poster`.
- Use `loading="lazy"` via IntersectionObserver — never autoplay off-screen.
- Dimensions: max 1200x750 px, max 3 MB per clip.
- Hosted on Cloudflare R2 or `/public/media/` — never on external CDNs without approval.
- Wrap in `<VideoLoop>` component (`src/components/ui/VideoLoop.astro`).

---

### 7. ElevenLabs audio player (articles)

**Package:** none (custom HTML5 `<audio>`)
**Status:** future — deferred to Sprint 5
**Purpose:** optional "listen to this article" narration, generated via ElevenLabs API

Rules for agents (when it arrives):
- Audio file must be pre-generated offline, not fetched at runtime from ElevenLabs.
- Player UI: play/pause + progress bar + speed control. No full podcast widget.
- Placement: above article body, below the hero cover. Opt-in, not autoplay.
- Consent: audio is not analytics — no consent gate needed unless we add tracking.

---

### 8. Pagefind — content search

**Package:** `astro-pagefind` integration or manual postbuild hook
**Status:** not yet installed
**Purpose:** offline-first search across `/insights/` articles

Install:
```
npm install astro-pagefind
```

Rules for agents:
- Index only `/insights/` — exclude `/contact/`, `/subscribe/`, `/resources/`.
- Trigger indexing in `postbuild` script in `package.json`.
- UI component: `<Search>` in the header or a `/search/` standalone page (decision pending).
- No Algolia unless search volume justifies cost.

---

### 9. PostHog — product analytics

**Package:** `posthog-js`
**Status:** not yet installed
**Purpose:** conversion funnels (Book a call CTA, subscribe form), user paths, drop-off analysis

Install:
```
npm install posthog-js
```

Rules for agents:
- Consent-gate PostHog behind the same cookie banner as Mixpanel and GA4.
- EU region: `api.eu.posthog.com`
- Events follow the same naming convention as Mixpanel (`snake_case`, prefixed by surface: `header_cta_click`, `article_subscribe_click`).
- Do not double-track events already tracked by Mixpanel — choose one for each surface.
- Implementation lives in `src/components/ui/Analytics.astro` alongside existing trackers.

---

## Agent briefing protocol

When spawning any agent (Claude Code, Codex, test-engineer) for Sprint 4+, include this block in the prompt:

```
STACK NOTE (Sprint 4+):
- Motion One (`motion` package) for microinteractions — must check prefers-reduced-motion
- Lenis (`lenis`) for smooth scroll on / and /about only
- GSAP (`gsap`) for homepage hero only — not approved elsewhere yet
- SVG diagrams in src/assets/diagrams/ — inline, CSS/Motion One animated
- Video loops via VideoLoop.astro component — no raw <video> tags
- Pagefind for search (postbuild hook)
- PostHog for funnels (consent-gated, EU region)
- Astro View Transitions enabled globally in Layout.astro
None of these packages are installed yet except where noted. Do NOT add them
without the implementation task explicitly calling for it.
```

---

## Installation order (Sprint 4 sequence)

1. `motion` — safest, no side effects, tree-shakeable. Add after PR #46–#48 merge.
2. Astro View Transitions — enable in Layout.astro, add `transition:name` to header wordmark + nav.
3. `lenis` — add to homepage and `/about` only.
4. SVG diagrams — author in Figma, export, animate.
5. Video loops — blocked on media assets from Wojciech.
6. `astro-pagefind` — add after at least 3 articles are live.
7. `posthog-js` — add after Mixpanel migration is confirmed stable.
8. `gsap` — blocked on hero concept approval.

---

## What does NOT belong in this stack

- Framer Motion — React only, wrong framework.
- Three.js / WebGL — too heavy for this site's purpose; if needed, isolate in a canvas island.
- Anime.js — superseded by Motion One.
- Barba.js — superseded by Astro View Transitions.
- Locomotive Scroll — superseded by Lenis.
- ScrollReveal — superseded by Motion One `inView`.
- Any CSS framework animation library (AOS, WOW.js) — superseded by native Astro + Motion One.
