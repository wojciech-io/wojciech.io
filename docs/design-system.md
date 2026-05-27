# Design system — wojciech.io

Reference for all design tokens, typography, spacing, colour, and component conventions across wojciech.io and its subdomains.

Source of truth: `src/styles/tokens.css`. All values below are extracted from that file; update both when changing a token.

---

## Colour

### Light theme (default)

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#f8f5ee` | Page background |
| `--color-surface` | `#ffffff` | Card backgrounds |
| `--color-surface-2` | `#f1eee7` | Nested surface, tag backgrounds |
| `--color-border` | `#dfdbd1` | Default dividers |
| `--color-border-2` | `#cec8bb` | Stronger dividers, focused borders |
| `--color-text` | `#171717` | Body text |
| `--color-text-muted` | `#66645f` | Secondary text, captions |
| `--color-text-dim` | `#6e6a63` | Placeholder, helper text |
| `--color-accent` | `#171717` | Eyebrow labels, accent text |
| `--color-accent-cta` | `#ebff00` | CTA button background only |
| `--color-accent-cta-hi` | `#d4e600` | CTA button hover |
| `--color-accent-hi` | `#000000` | Hover state for accent text |
| `--color-accent-lo` | `#f3ff59` | Pale yellow tint for subtle backgrounds |
| `--color-accent-text` | `#0c0c0c` | Text on accent (lime) background |
| `--color-success` | `#166534` | Success states |

### Dark theme (`data-theme="dark"`)

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#0c0c0c` | Page background |
| `--color-surface` | `#171717` | Card backgrounds |
| `--color-surface-2` | `#222222` | Nested surface |
| `--color-border` | `#2a2a2a` | Default dividers |
| `--color-border-2` | `#3a3a3a` | Stronger dividers |
| `--color-text` | `#f2f2f2` | Body text |
| `--color-text-muted` | `#888888` | Secondary text |
| `--color-text-dim` | `#848180` | Helper text |
| `--color-accent` | `#ebff00` | Primary accent (lime — safe on dark bg) |
| `--color-accent-cta` | `#ebff00` | CTA button background |
| `--color-accent-cta-hi` | `#f5ff66` | CTA button hover |
| `--color-accent-hi` | `#f5ff66` | Hover state |
| `--color-accent-lo` | `#2a2a2a` | Subtle backgrounds (neutral dark tint) |
| `--color-accent-text` | `#0c0c0c` | Text on lime background |
| `--color-success` | `#4ade80` | Success states |

### Colour rules

- Never use raw hex in component styles. Always use a CSS token.
- The lime (`#ebff00`) is reserved for CTA buttons and primary interactive accents. Do not apply it to decorative elements or body text in light theme.
- In dark theme the lime can appear on text accent labels (eyebrows, highlights). In light theme use `--color-accent` (near-black) for text accents.
- `--color-accent-lo` is different in light vs dark: pale yellow tint in light, neutral dark tint in dark. Components that use it must look correct in both modes.

---

## Typography

### Fonts

| Token | Family | Usage |
|---|---|---|
| `--font-sans` | `'Geist', ui-sans-serif, system-ui, sans-serif` | All body and UI text |
| `--font-mono` | `'Geist Mono', ui-monospace, monospace` | Code blocks, metadata, timestamps |

Fonts are self-hosted at `/public/fonts/`. No CDN. Required preloads in `SEOHead.astro`:
```
Geist-Regular.woff2
Geist-SemiBold.woff2
Geist-Bold.woff2
GeistMono-Regular.woff2  (loaded on demand — not preloaded on every page)
```

### Type scale

Fixed sizes (mirrors Tailwind `text-*` classes):

| Token | Value | Tailwind equiv |
|---|---|---|
| `--text-2xs` | `0.6875rem` (11px) | — |
| `--text-xs` | `0.75rem` (12px) | `text-xs` |
| `--text-sm` | `0.875rem` (14px) | `text-sm` |
| `--text-base` | `1rem` (16px) | `text-base` |
| `--text-lg` | `1.125rem` (18px) | `text-lg` |
| `--text-xl` | `1.25rem` (20px) | `text-xl` |
| `--text-2xl` | `1.5rem` (24px) | `text-2xl` |
| `--text-3xl` | `1.875rem` (30px) | `text-3xl` |
| `--text-4xl` | `2.25rem` (36px) | `text-4xl` |
| `--text-5xl` | `3rem` (48px) | `text-5xl` |
| `--text-6xl` | `3.75rem` (60px) | `text-6xl` |

Fluid sizes (scale with viewport):

| Token | Range | Usage |
|---|---|---|
| `--text-hero` | `2rem → 3.8rem` | Hero primary headline |
| `--text-h1` | `1.75rem → 3rem` | Page h1 |
| `--text-h2` | `1.5rem → 2.5rem` | Section h2 |
| `--text-h3` | `1.125rem → 1.5rem` | Subsection h3 |
| `--text-body-lg` | `1rem → 1.25rem` | Lead paragraphs, article intros |
| `--text-body` | `1rem` | Default body |

### Typography rules

- Articles (`src/content/insights`) render at `--text-body-lg` for body text, `--width-prose: 65ch` max-width.
- Eyebrow labels: `--text-xs`, `font-weight: 600`, `letter-spacing: 0.1em`, uppercase, `--color-accent`.
- Do not use `font-size` in px in component styles; use a token or Tailwind class.

---

## Spacing

### Base scale (8pt grid)

| Token | Value | Notes |
|---|---|---|
| `--space-3xs` | `0.125rem` (2px) | Hairline, fine detail |
| `--space-2xs` | `0.25rem` (4px) | Tight inline spacing |
| `--space-xs` | `0.5rem` (8px) | Small gaps |
| `--space-sm` | `0.75rem` (12px) | Chip and button internal |
| `--space-md` | `1rem` (16px) | Base rhythm, card padding |
| `--space-lg` | `1.5rem` (24px) | Card internal padding |
| `--space-xl` | `2rem` (32px) | Section internal |
| `--space-2xl` | `3rem` (48px) | Between subsections |
| `--space-3xl` | `4rem` (64px) | Between sections |
| `--space-4xl` | `6rem` (96px) | Hero breathers |

### Section spacing

`--space-section: clamp(1.25rem, 4vw, 3.5rem)` — fluid, used for vertical padding between top-level sections. Scales from 20px on mobile to 56px on wide screens.

### Rules

- Prefer tokens over arbitrary Tailwind values (`p-[58px]`).
- Migration path: any `p-[N]`, `mt-[N]` not in the scale should be migrated to the nearest token.
- Mobile-first: use `md:` prefix for larger spacing, not the other way around.

---

## Container widths

| Token | Value | Usage |
|---|---|---|
| `--width-prose` | `65ch` | Article body max-width |
| `--width-card-sm` | `22rem` | Compact card |
| `--width-card-md` | `28rem` | Medium card |
| `--width-card-lg` | `36rem` | Wide card |
| `--width-content` | `72rem` | Page max content width (matches `max-w-6xl`) |

---

## Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `0.375rem` (6px) | Tags, small chips |
| `--radius-card` | `0.5rem` (8px) | Cards, panels |
| `--radius-btn` | `0.4375rem` (7px) | Buttons |
| `--radius-badge` | `9999px` | Pill badges |
| `--radius-input` | `0.4375rem` (7px) | Form inputs |

---

## Shadows

| Token | Value |
|---|---|
| `--shadow-card` | Soft multi-layer box shadow (light: warm tint; dark: opaque black) |
| `--shadow-card-hover` | `none` in light; subtle lime glow in dark |

---

## Favicon and brand mark

- SVG favicon at `/public/favicon.svg`
- Mark: geometric W polyline, `#ebff00` stroke, `stroke-width 3.2`, round caps/joins
- Background: `#0c0c0c` rounded square, `rx=7` on 32×32 viewBox
- All PNG sizes generated via `rsvg-convert` from the SVG
- Version query string in `SEOHead.astro` and `src/pages/cv.astro` must be bumped after any favicon change

---

## Component conventions

### Cards
- `border-radius: var(--radius-card)`
- `box-shadow: var(--shadow-card)`
- `background: var(--color-surface)`
- Hover: border-color shifts to `--color-border-2`; no background change in light, subtle glow shadow in dark

### Buttons
- Primary CTA: `background: var(--color-accent-cta)`, `color: var(--color-accent-text)`, hover `--color-accent-cta-hi`
- Secondary / ghost: `border: 1px solid var(--color-border-2)`, `color: var(--color-text)`, transparent background
- Icon buttons: `border-radius: var(--radius-btn)`, minimum 44×44px tap target

### Chips / badges
- Background `var(--color-surface-2)`, border `var(--color-border)`, `border-radius: var(--radius-badge)`
- Accent chip: border and background use `--color-accent-lo`, text `--color-accent`

### Eyebrow labels
```css
font-size: var(--text-xs);
font-weight: 600;
letter-spacing: 0.1em;
text-transform: uppercase;
color: var(--color-accent);
```

---

## Themes

Light is default. Dark is set via `data-theme="dark"` on `<html>`. Theme preference is stored in `localStorage` under key `theme`. The inline script in `SEOHead.astro` applies the stored preference before first paint to prevent FOUC.

`prefers-color-scheme` is the fallback if no stored preference. Both `theme-color` meta tags are set in `SEOHead.astro` (media-query matched).

---

## Related files

- `src/styles/tokens.css` — all CSS custom properties
- `src/styles/global.css` — base resets, font-face declarations, body defaults
- `src/components/seo/SEOHead.astro` — canonical meta, favicon links, theme init script
- `docs/10-tone-of-voice.md` — copy voice, brand language rules
