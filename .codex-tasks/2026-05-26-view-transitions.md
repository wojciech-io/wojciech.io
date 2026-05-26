---
task: sprint4/view-transitions
branch_hint: codex/view-transitions
created: 2026-05-26
author: tech-lead (Claude Code)
acceptance:
  - ViewTransitions imported and rendered in src/layouts/Layout.astro
  - transition:name="site-logo" on wordmark anchor in Header.astro (desktop + mobile)
  - transition:name="page-title" on the <h1> in each main page template
  - transition:animate="fade" on main content wrapper in Layout.astro
  - no broken transitions on /insights/[slug] pages (articles have their own h1 transition name)
  - npm run build passes with zero errors
  - mobile nav overlay NOT participating in transitions (no transition:* attributes inside mobile overlay)
---

# PARTIALLY DONE — Enable Astro View Transitions

> **Status (2026-05-26):** ClientRouter enabled in Layout.astro, transition:animate="fade" on main,
> site-wordmark transition:name on Header.astro (desktop + mobile), page-title-home on HeroSection.
> Remaining pages covered by `.codex-tasks/2026-05-26-transition-names-pages.md` — use that spec.
>
> Note: in Astro 6, use `import ClientRouter from 'astro/components/ClientRouter.astro'` NOT
> `import { ViewTransitions } from 'astro:transitions'` — the latter is not exported in v6.

# Original spec — Enable Astro View Transitions

## Context

wojciech.io is Astro SSG on Cloudflare Pages. Astro has built-in View Transitions API support
via the `astro:transitions` module. This task enables global page transitions and marks
persistent elements (logo, page title) so they morph across navigation.

## Constraints (hard rules)

- Zakaz em dashów (—) w jakimkolwiek widocznym tekście.
- Nie pushuj do main — tylko PR.
- Nie zmieniaj copy.
- Do NOT add transition:* to elements inside dialogs, mobile nav overlay, cookie banner.
- Do NOT use transition:persist on header/nav — it causes focus management issues with mobile nav.

## Files in play

- `src/layouts/Layout.astro` — add ViewTransitions import + component, add transition:animate to main wrapper
- `src/components/layout/Header.astro` — add transition:name to wordmark (desktop + mobile)
- `src/pages/index.astro` — add transition:name to hero h1
- `src/pages/about.astro` or `src/components/pages/AboutContent.astro` — add transition:name to h1
- `src/pages/work.astro` or `src/components/pages/WorkContent.astro` — transition:name to h1
- `src/pages/ai-systems.astro` or content component — transition:name to h1
- `src/pages/insights/index.astro` — transition:name to h1
- `src/pages/insights/[slug].astro` — transition:name to article h1 (use post slug to make it unique)
- `src/pages/contact.astro` or content component — transition:name to h1
- `src/pages/now.astro` or content component — transition:name to h1

## Steps

### 1. Enable ViewTransitions in Layout.astro

At top of frontmatter:
```astro
import { ViewTransitions } from 'astro:transitions';
```

In `<head>`, add after the SEOHead component:
```astro
<ViewTransitions />
```

Add `transition:animate="fade"` to the `<main>` wrapper element that contains page content.
The fade duration should use `--motion-entrance` if it exists, else default (0.15s is fine).

### 2. Wordmark in Header.astro

Find the wordmark anchor tag (contains "wojciech" + ".io" spans). Add:
```astro
<a href="/" transition:name="site-logo" ...>
```

There are TWO wordmarks: one in the desktop nav and one in the mobile overlay top bar.
- Desktop: add `transition:name="site-logo"`
- Mobile overlay: add `transition:name="site-logo-mobile"` (different name to avoid clash)

### 3. Page title (h1) on each page

Each page with a hero h1 should have a unique `transition:name`. Use the page slug as the suffix.
Example for homepage: `transition:name="page-title-home"`
Example for about: `transition:name="page-title-about"`

For article pages (`[slug].astro`), use the post slug:
```astro
<h1 transition:name={`article-title-${post.slug}`}>
```

### 4. Verify no interference with mobile nav

The mobile nav overlay has `id="mobile-nav-overlay"` and is controlled by JS. Do NOT add
any `transition:*` attribute to it or any of its children. View Transitions can interfere
with `translateX` animations used by the mobile overlay.

### 5. Test

Build and check:
- Navigate between pages: logo should morph, page content fades.
- Open mobile nav, close it, navigate — no flicker or double-animation.
- Article pages: h1 should animate in from the insights index.
- `npm run build` must pass.

## Out of scope

- Lenis (separate task).
- Motion One entrance animations (separate task, can be layered on top after this lands).
- Transition animations on cards/grids — only persistent elements in this task.

## Estimated effort

1 Codex session (~1.5–2 h).
