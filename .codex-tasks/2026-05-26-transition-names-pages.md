---
task: sprint4/transition-names-pages
branch_hint: codex/transition-names-pages
created: 2026-05-26
author: tech-lead (Claude Code)
acceptance:
  - transition:name on h1 in: AboutContent.astro, WorkContent.astro, AiSystemsContent.astro, ContactContent.astro, NowContent.astro, insights/index.astro, insights/[slug].astro
  - transition:name values follow the pattern page-title-{slug} (e.g. page-title-about, page-title-work)
  - article slug page uses dynamic: transition:name={`article-title-${post.slug}`}
  - NO transition:name added to header, footer, mobile nav overlay, cookie banner, or modal-like elements
  - npm run build passes with zero errors
  - existing transition:name="site-wordmark" on Header.astro and transition:name="page-title-home" on HeroSection.astro are left untouched
---

# Codex task — Add transition:name to remaining page h1s

## Context

wojciech.io is an Astro SSG site. Sprint 4 merged PR #49 which:
- Enabled `ClientRouter` (Astro View Transitions) in `src/layouts/Layout.astro`
- Added `transition:animate="fade"` to the `<main id="main-content">` wrapper
- Added `transition:name="site-wordmark"` and `transition:name="site-wordmark-mobile"` to the wordmark in `src/components/layout/Header.astro`
- Added `transition:name="page-title-home"` to the `<h1>` in `src/components/home/HeroSection.astro`

**What this task does:** add `transition:name` to the `<h1>` on every remaining main page so the page title morphs smoothly during View Transitions navigation.

## Constraints (hard rules)

- Zakaz em dashów (—) w jakimkolwiek widocznym tekście.
- Nie pushuj do main — tylko PR z branch `codex/transition-names-pages`.
- Nie zmieniaj copy, layoutu, ani logiki JS.
- Nie dodawaj transition:name do elementow w mobile-nav-overlay, cookie-banner, ani stopce.
- Do NOT add transition:persist to any element.

## Important Astro rules

- `transition:name` values must be globally unique per page. Two elements on the same page
  cannot share a name.
- `transition:name` must be a static string in most components, BUT in `[slug].astro` it can
  be dynamic: `transition:name={`article-title-${entry.slug}`}` — this is valid Astro syntax.
- The attribute goes directly on the HTML element, not on a wrapper div.

## Files to modify and exact locations

### 1. `src/components/pages/AboutContent.astro`

Find line ~174 containing `<h1 class="text-4xl md:text-5xl ...">`. Add the attribute:

```astro
<h1 class="text-4xl md:text-5xl font-semibold ..." transition:name="page-title-about">
```

### 2. `src/components/pages/WorkContent.astro`

Find line ~64 containing `<h1 class="text-4xl md:text-6xl ...">`. Add:

```astro
<h1 class="text-4xl md:text-6xl font-semibold ..." transition:name="page-title-work">
```

### 3. `src/components/pages/AiSystemsContent.astro`

Find line ~86 containing `<h1 class="text-4xl md:text-5xl ...">`. Add:

```astro
<h1 class="text-4xl md:text-5xl font-semibold ..." transition:name="page-title-ai-systems">
```

### 4. `src/components/pages/ContactContent.astro`

Find line ~16 containing `<h1 class="text-4xl ...">`. Add:

```astro
<h1 class="text-4xl font-semibold ..." transition:name="page-title-contact">
```

### 5. `src/components/pages/NowContent.astro`

Find line ~12 containing `<h1 class="text-4xl md:text-5xl ...">`. Add:

```astro
<h1 class="text-4xl md:text-5xl font-semibold ..." transition:name="page-title-now">
```

### 6. `src/pages/insights/index.astro`

Find line ~49 containing `<h1 class="text-4xl md:text-5xl ...">`. Add:

```astro
<h1 class="text-4xl md:text-5xl font-semibold ..." transition:name="page-title-insights">
```

### 7. `src/pages/insights/[slug].astro`

Find line ~169 containing `<h1 class="text-4xl md:text-5xl ...">`. Add a DYNAMIC name:

```astro
<h1 class="text-4xl md:text-5xl font-semibold ..." transition:name={`article-title-${entry.slug}`}>
```

Note: the variable holding the current post may be named `entry`, `post`, or `data` — check
the frontmatter of the file to find the correct variable name, then use `${variable.slug}`.

## What NOT to change

- `src/components/home/HeroSection.astro` — already has `transition:name="page-title-home"` from PR #49.
- `src/components/layout/Header.astro` — already has `transition:name="site-wordmark"` and
  `transition:name="site-wordmark-mobile"` from PR #49.
- `src/layouts/Layout.astro` — already has `ClientRouter` and `transition:animate="fade"` from PR #49.
- Mobile nav overlay (`id="mobile-nav-overlay"`) — no transition:* attributes, ever.

## Verification

1. `npm run build` — must pass.
2. Navigate between `/`, `/about`, `/work` in browser: page titles should visually morph.
3. Navigate to an article from `/insights` — article title should animate in.
4. Open mobile nav, close, navigate — no double animation or flicker.

## Out of scope

- Lenis on non-homepage pages — separate task if needed.
- reveal-up on interior page sections — separate task.
- `/resources`, `/subscribe`, `/privacy`, `/cv` pages — not primary nav pages.

## Estimated effort

1 Codex session (1-1.5 h).
