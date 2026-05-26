---
task: sprint4/fluid-typography-tokens
branch_hint: codex/fluid-typography-tokens
created: 2026-05-26
author: tech-lead (Claude Code)
acceptance:
  - CSS custom properties --text-hero, --text-h1, --text-h2, --text-h3, --text-body-lg, --text-body defined in tokens.css
  - All homepage section h1/h2 headings use the new tokens instead of raw Tailwind text-3xl/text-4xl/text-5xl/text-6xl
  - All /about, /work, /ai-systems, /contact, /now page h1s use the tokens
  - Insights article h1 and article body text use tokens
  - No visual regression: font sizes must be equivalent at all breakpoints (tokens must match the old clamp values)
  - npm run build passes, zero TypeScript errors
  - No copy changes
---

# Codex task — Fluid typography token system

## Context

wojciech.io uses Tailwind CSS v4 + CSS design tokens in `src/styles/tokens.css`. Currently,
headings are sized with raw Tailwind utilities like `text-4xl md:text-5xl lg:text-6xl` spread
across 15+ components. This means:
- Inconsistent scale (some pages use 4xl/5xl, others 3xl/4xl for the same hierarchy level)
- Hard to globally adjust type scale for mobile optimization
- Duplicate breakpoint logic everywhere

This task introduces a fluid typography token system using CSS `clamp()` and applies it
systematically across all main headings.

## Constraints

- Zakaz em dashów (—).
- Nie pushuj do main — tylko PR z branch `codex/fluid-typography-tokens`.
- Nie zmieniaj copy.
- Font sizes must remain visually equivalent — nie zmniejszaj nagłówków, tylko ujednolicaj.
- Do NOT change body text sizes, nav text, or button text — headings only (h1, h2, h3 in
  main content sections).

## Step 1 — Add tokens to tokens.css

Add these custom properties inside the existing `:root { }` block in `src/styles/tokens.css`:

```css
/* Fluid typography scale */
--text-hero:    clamp(2rem,    5vw + 0.5rem, 3.8rem);   /* homepage h1 */
--text-h1:      clamp(1.75rem, 4vw + 0.25rem, 3rem);    /* page h1s */
--text-h2:      clamp(1.5rem,  3vw + 0.25rem, 2.5rem);  /* section h2s */
--text-h3:      clamp(1.125rem,2vw + 0.25rem, 1.5rem);  /* subsection h3s */
--text-lead:    clamp(1rem,    1.5vw + 0.125rem, 1.25rem); /* lead paragraphs */
```

## Step 2 — Apply tokens

Replace Tailwind text-size utilities with `style` or `class` using the custom property.
Since Tailwind v4 allows arbitrary CSS values, you can use:

```astro
<h1 class="text-[var(--text-hero)] font-bold leading-[1.08] ...">
```

Or use `@apply` is NOT available in component templates — use the `text-[var(...)]` pattern.

### Mapping: what to replace with what

| Old Tailwind classes | Token to use | Where |
|---|---|---|
| `text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.8rem]` | `--text-hero` | HeroSection h1 |
| `text-4xl md:text-5xl` | `--text-h1` | AboutContent h1, ContactContent h1, NowContent h1, AiSystemsContent h1 |
| `text-4xl md:text-6xl` | `--text-h1` (use hero for work if 6xl is intentional — keep it) | WorkContent h1 |
| `text-3xl md:text-4xl` | `--text-h2` | all section h2s (HowIWork, ProjectsSection, AILeverage, TestimonialsSection, InsightsPreview) |
| `text-4xl md:text-5xl` | `--text-h1` | insights/index.astro h1, insights/[slug].astro article h1 |
| `text-lg md:text-xl` in hero/lead paragraphs | `--text-lead` | HeroSection lead p, AboutContent lead p |

### Files to modify

- `src/styles/tokens.css` (add tokens)
- `src/components/home/HeroSection.astro`
- `src/components/home/HowIWork.astro`
- `src/components/home/ProjectsSection.astro`
- `src/components/home/AILeverage.astro`
- `src/components/home/TestimonialsSection.astro`
- `src/components/home/InsightsPreview.astro`
- `src/components/pages/AboutContent.astro`
- `src/components/pages/WorkContent.astro`
- `src/components/pages/AiSystemsContent.astro`
- `src/components/pages/ContactContent.astro`
- `src/components/pages/NowContent.astro`
- `src/pages/insights/index.astro`
- `src/pages/insights/[slug].astro`

Do NOT change: Header.astro, Footer.astro, Nav.astro, button text sizes, card body text.

## Step 3 — Verify

1. `npm run build` must pass.
2. Check rendered output: `grep -r "text-4xl\|text-5xl\|text-6xl\|text-3xl" dist/ | wc -l`
   should return 0 (all headings now use the token).
3. Spot-check at 390px viewport (mobile) in browser: hero h1 should be ~2rem, section h2
   should be ~1.5rem — readable, not too small.

## Estimated effort

1 Codex session (1.5–2 h).
