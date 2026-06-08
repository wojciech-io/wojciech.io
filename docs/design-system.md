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

Fluid utility sizes (Tailwind `text-fluid-*` classes, replace breakpoint pairs):

| Token | Range | Tailwind class | Replaces |
|---|---|---|---|
| `--text-fluid-lg` | `1rem → 1.125rem` | `text-fluid-lg` | `text-base md:text-lg` |
| `--text-fluid-xl` | `1.25rem → 1.5rem` | `text-fluid-xl` | `text-xl md:text-2xl` |
| `--text-fluid-2xl` | `1.5rem → 1.875rem` | `text-fluid-2xl` | `text-2xl md:text-3xl` |
| `--text-fluid-3xl` | `1.875rem → 2.25rem` | `text-fluid-3xl` | `text-3xl md:text-4xl` |

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

## Components

Component docs list source path, public props, intended use, and a minimal example. Props marked with `?` are optional.

### Home sections

#### HeroSection
**Path:** `src/components/home/HeroSection.astro`
**Props:** none
**Use:** Homepage hero with primary positioning, CTA pair, proof row, and stage media.
**Example:** `<HeroSection />`

#### AILeverage
**Path:** `src/components/home/AILeverage.astro`
**Props:** none
**Use:** Homepage section explaining AI leverage across strategy, operations, automation, and build work.
**Example:** `<AILeverage />`

#### ProjectsSection
**Path:** `src/components/home/ProjectsSection.astro`
**Props:** none
**Use:** Homepage work preview section built from featured work entries and ProjectCard.
**Example:** `<ProjectsSection />`

#### HowIWork
**Path:** `src/components/home/HowIWork.astro`
**Props:** none
**Use:** Operator-method section for diagnosis, design, build, and delivery steps.
**Example:** `<HowIWork />`

#### InsightsPreview
**Path:** `src/components/home/InsightsPreview.astro`
**Props:** none
**Use:** Homepage article preview list filtered to canonical insight URLs.
**Example:** `<InsightsPreview />`

#### TestimonialsSection
**Path:** `src/components/home/TestimonialsSection.astro`
**Props:** none
**Use:** Homepage social proof section using featured testimonial entries.
**Example:** `<TestimonialsSection />`

#### MetricsStrip
**Path:** `src/components/home/MetricsStrip.astro`
**Props:** none
**Use:** Compact proof strip for high-level experience and operating metrics.
**Example:** `<MetricsStrip />`

### UI primitives

#### ArticleCover
**Path:** `src/components/ui/ArticleCover.astro`
**Props:** coverType? ('terminal' | 'builder' | 'chart' | 'product' | 'system' | 'default'), tags? (string[]), title? (string)
**Use:** Generated visual cover for insight pages and article cards.
**Example:** `<ArticleCover coverType="system" tags={tags} title={title} />`

#### AvatarRing
**Path:** `src/components/ui/AvatarRing.astro`
**Props:** src? (string), alt? (string), size? ('md' | 'lg' | 'xl'), loading? ('eager' | 'lazy'), fetchpriority? ('high' | 'low' | 'auto')
**Use:** Circular portrait treatment with consistent ring, sizing, and loading controls.
**Example:** `<AvatarRing {...props} />`

#### Badge
**Path:** `src/components/ui/Badge.astro`
**Props:** variant? ('default' | 'accent' | 'muted'), class? (string)
**Use:** Inline label, status chip, or compact category marker.
**Example:** `<Badge variant="accent">AI Systems</Badge>`

#### Button
**Path:** `src/components/ui/Button.astro`
**Props:** href? (string), variant? ('primary' | 'ghost' | 'outline'), size? ('sm' | 'md' | 'lg'), external? (boolean), class? (string), [key: string] (unknown)
**Use:** Standard CTA and navigation button with consistent sizing and external-link behavior.
**Example:** `<Button href="/contact/" variant="primary">Book a call</Button>`

#### CTABand
**Path:** `src/components/ui/CTABand.astro`
**Props:** heading? (string), subtext? (string), cta? (string), ctaHref? (string), ctaSecondary? (string), ctaSecondaryHref? (string)
**Use:** Full-width conversion band at the end of pages and sections.
**Example:** `<CTABand {...props} />`

#### CookieBanner
**Path:** `src/components/ui/CookieBanner.astro`
**Props:** none
**Use:** Consent banner for analytics opt-in and local preference storage.
**Example:** `<CookieBanner />`

#### FAQ
**Path:** `src/components/ui/FAQ.astro`
**Props:** items (FAQItem[])
**Use:** Accessible FAQ block for repeated question-answer content.
**Example:** `<FAQ items={items} />`

#### FlagIcon
**Path:** `src/components/ui/FlagIcon.astro`
**Props:** lang ('en' | 'pl' | 'it' | 'de' | 'es'), size? (number), class? (string)
**Use:** Small locale indicator for language navigation and selectors.
**Example:** `<FlagIcon {...props} />`

#### LiveEmbed
**Path:** `src/components/ui/LiveEmbed.astro`
**Props:** src (string), screenshot? (string), alt? (string), label? (string), appName? (string), appDesc? (string)
**Use:** Framed app preview with screenshot facade and gradient fallback.
**Example:** `<LiveEmbed {...props} />`

#### PageBackdrop
**Path:** `src/components/ui/PageBackdrop.astro`
**Props:** src (string), position? (string), opacity? (number), eager? (boolean)
**Use:** Controlled background image layer for pages that need photographic context.
**Example:** `<PageBackdrop {...props} />`

#### ProjectCard
**Path:** `src/components/ui/ProjectCard.astro`
**Props:** title (string), description (string), tags (string[]), href (string), cover? (CoverType), screenshot? (string), icon? (string), cluster? (Cluster), problem? (string), system? (string), artifact? (string), outcome? (string), external? (boolean), revealIndex? (number)
**Use:** Work card with cover, proof fields, tags, and link handling.
**Example:** `<ProjectCard title={title} description={description} tags={tags} href="/work/" />`

#### ProjectCover
**Path:** `src/components/ui/ProjectCover.astro`
**Props:** cover (ProjectCoverType)
**Use:** Inline project cover system for work cards without bitmap screenshots.
**Example:** `<ProjectCover cover="pipeline" />`

#### ProofCard
**Path:** `src/components/ui/ProofCard.astro`
**Props:** title (string), description (string), tags? (string[]), metrics? (Metric[]), href? (string), image? (string), icon? (string), cluster? (string), featured? (boolean)
**Use:** Proof-oriented card for work, outcomes, and portfolio evidence.
**Example:** `<ProofCard {...props} />`

#### SearchModal
**Path:** `src/components/ui/SearchModal.astro`
**Props:** none
**Use:** Sitewide Pagefind search overlay with lazy loading, loading state, and error state.
**Example:** `<SearchModal />`

#### SectionHeader
**Path:** `src/components/ui/SectionHeader.astro`
**Props:** eyebrow? (string), heading (string), lead? (string), align? ('left' | 'center'), class? (string)
**Use:** Standard section heading block with optional eyebrow and lead copy.
**Example:** `<SectionHeader eyebrow="Work" heading="Systems shipped" />`

#### TestimonialCard
**Path:** `src/components/ui/TestimonialCard.astro`
**Props:** quote (string), name (string), role (string), company? (string)
**Use:** Single testimonial quote card with source attribution.
**Example:** `<TestimonialCard {...props} />`

#### TestimonialSlider
**Path:** `src/components/ui/TestimonialSlider.astro`
**Props:** testimonials (Testimonial[])
**Use:** Carousel treatment for multiple testimonial cards.
**Example:** `<TestimonialSlider {...props} />`

#### ThemeToggle
**Path:** `src/components/ui/ThemeToggle.astro`
**Props:** class? (string)
**Use:** Light and dark theme toggle paired with the SEOHead theme init script.
**Example:** `<ThemeToggle {...props} />`

#### VideoLoop
**Path:** `src/components/ui/VideoLoop.astro`
**Props:** src (string), poster? (string), width? (number), height? (number), alt? (string), class? (string)
**Use:** Muted looping product or demo video with poster fallback.
**Example:** `<VideoLoop src="/media/growthhub-demo" poster="/media/growthhub-demo-poster.webp" />`

### Insights MDX components

#### ArticleTimeline
**Path:** `src/components/insights/ArticleTimeline.astro`
**Props:** items (TimelineItem[]), caption? (string)
**Use:** Vertical timeline for phase-based narratives and implementation histories.
**Example:** `<ArticleTimeline {...props} />`

#### BeforeAfter
**Path:** `src/components/insights/BeforeAfter.astro`
**Props:** before (Side), after (Side), label? (string)
**Use:** Side-by-side before and after comparison for process or system changes.
**Example:** `<BeforeAfter {...props} />`

#### Benchmark
**Path:** `src/components/insights/Benchmark.astro`
**Props:** label (string), yours (number), baseline (number), yoursLabel? (string), baselineLabel? (string), unit? (string), caption? (string), lowerIsBetter? (boolean)
**Use:** Visual metric comparison where a current value is compared against a baseline.
**Example:** `<Benchmark {...props} />`

#### Callout
**Path:** `src/components/insights/Callout.astro`
**Props:** type? ('note' | 'tip' | 'warning' | 'critical'), title? (string)
**Use:** Highlighted note, tip, warning, or critical block inside long-form articles.
**Example:** `<Callout {...props} />`

#### CaseStudyBlock
**Path:** `src/components/insights/CaseStudyBlock.astro`
**Props:** tag? (string), client? (string), challenge (string), system (string), result (string), timeframe? (string)
**Use:** Public-safe case study summary with challenge, system, and result fields.
**Example:** `<CaseStudyBlock {...props} />`

#### Compare
**Path:** `src/components/insights/Compare.astro`
**Props:** labelA (string), labelB (string), tagA? (string), tagB? (string), colorCode? (boolean), caption? (string)
**Use:** Two-column comparison wrapper using slots for richer MDX content.
**Example:** `<Compare {...props} />`

#### Comparison
**Path:** `src/components/insights/Comparison.astro`
**Props:** items? (ComparisonItem[]), left? (string), right? (string), leftItems? (string[]), rightItems? (string[]), caption? (string)
**Use:** Compact comparison cards or classic left/right comparison lists.
**Example:** `<Comparison left="Manual" right="System" leftItems={left} rightItems={right} />`

#### DataTable
**Path:** `src/components/insights/DataTable.astro`
**Props:** columns (Column[]), rows (Record<string, string | number>[]), caption? (string), highlight? (number[])
**Use:** Token-aligned data table for compact comparisons and audits.
**Example:** `<DataTable columns={columns} rows={rows} />`

#### DoDont
**Path:** `src/components/insights/DoDont.astro`
**Props:** do? (string[]), dont? (string[]), doLabel? (string), dontLabel? (string), caption? (string)
**Use:** Paired do and do-not guidance for tactical articles.
**Example:** `<DoDont {...props} />`

#### Flow
**Path:** `src/components/insights/Flow.astro`
**Props:** steps (Step[]), caption? (string)
**Use:** Linear process flow for operational sequences.
**Example:** `<Flow {...props} />`

#### Grid
**Path:** `src/components/insights/Grid.astro`
**Props:** cols? (2 | 3 | 4), gap? ('sm' | 'md' | 'lg'), title? (string), caption? (string)
**Use:** Generic MDX grid wrapper for repeated blocks.
**Example:** `<Grid {...props} />`

#### KeyPoint
**Path:** `src/components/insights/KeyPoint.astro`
**Props:** title? (string), items? (string[]), type? ('takeaway' | 'warning' | 'result')
**Use:** Short key point list with tone variants for result, warning, or takeaway.
**Example:** `<KeyPoint {...props} />`

#### KeyTakeaway
**Path:** `src/components/insights/KeyTakeaway.astro`
**Props:** icon? ('info' | 'warning' | 'tip' | 'check'), title? (string), body? (string), items? (string[]), tone? ('accent' | 'warning' | 'neutral')
**Use:** Prominent takeaway block for article summaries and decision points.
**Example:** `<KeyTakeaway icon="check" title="Decision" body="Use the system path." />`

#### MetricRow
**Path:** `src/components/insights/MetricRow.astro`
**Props:** items (Metric[]), caption? (string)
**Use:** Horizontal metric strip for article proof points.
**Example:** `<MetricRow {...props} />`

#### ProcessFlow
**Path:** `src/components/insights/ProcessFlow.astro`
**Props:** steps? (Step[]), title? (string), caption? (string), direction? ('horizontal' | 'vertical')
**Use:** Process visualization with optional horizontal or vertical layout.
**Example:** `<ProcessFlow {...props} />`

#### PullQuote
**Path:** `src/components/insights/PullQuote.astro`
**Props:** quote? (string), source? (string), role? (string), href? (string)
**Use:** Large quoted excerpt with optional linked attribution.
**Example:** `<PullQuote {...props} />`

#### Quote
**Path:** `src/components/insights/Quote.astro`
**Props:** author? (string), role? (string), source? (string)
**Use:** Standard inline quote block with attribution slot support.
**Example:** `<Quote {...props} />`

#### ResultCard
**Path:** `src/components/insights/ResultCard.astro`
**Props:** metric (string), label (string), context? (string), timeframe? (string), tag? (string), compact? (boolean)
**Use:** Single quantified result card for case studies and proof moments.
**Example:** `<ResultCard {...props} />`

#### Screenshot
**Path:** `src/components/insights/Screenshot.astro`
**Props:** src (string), alt (string), url? (string), caption? (string)
**Use:** Responsive screenshot with caption and optional linked source.
**Example:** `<Screenshot src="/images/work/notch.png" alt="Notch interface" />`

#### Stat
**Path:** `src/components/insights/Stat.astro`
**Props:** value (string), label (string), sub? (string), delta? (string), deltaDir? ('up' | 'down' | 'neutral'), source? (string), accent? (boolean)
**Use:** Single metric tile used inside StatGrid or custom MDX layouts.
**Example:** `<Stat {...props} />`

#### StatCallout
**Path:** `src/components/insights/StatCallout.astro`
**Props:** value (string), label (string), body? (string), eyebrow? (string), delta? (string), tone? ('neutral' | 'accent' | 'warning')
**Use:** Large metric callout for article proof or warning moments.
**Example:** `<StatCallout {...props} />`

#### StatGrid
**Path:** `src/components/insights/StatGrid.astro`
**Props:** stats (Stat[]), columns? (2 | 3 | 4), caption? (string)
**Use:** Responsive grid of metric tiles.
**Example:** `<StatGrid {...props} />`

#### StatRow
**Path:** `src/components/insights/StatRow.astro`
**Props:** cols? (2 | 3 | 4), caption? (string)
**Use:** Slot-based metric row when Stat components are authored manually in MDX.
**Example:** `<StatRow {...props} />`

#### Steps
**Path:** `src/components/insights/Steps.astro`
**Props:** items? (StepInput[]), title? (string), caption? (string), start? (number)
**Use:** Ordered implementation steps for playbooks and migration guides.
**Example:** `<Steps {...props} />`

#### TLDR
**Path:** `src/components/insights/TLDR.astro`
**Props:** items? (string[]), title? (string)
**Use:** Short summary block near the top of insight articles.
**Example:** `<TLDR items={frontmatter.tldr} title="TL;DR" />`

#### TOC
**Path:** `src/components/insights/TOC.astro`
**Props:** title? (string), levels? ('h2' | 'h2,h3'), minItems? (number), sticky? (boolean)
**Use:** Generated table of contents for long MDX articles.
**Example:** `<TOC {...props} />`

#### TechStack
**Path:** `src/components/insights/TechStack.astro`
**Props:** title? (string), caption? (string), items? (StackItemInput[]), groups? (StackGroupInput[]), cols? (2 | 3)
**Use:** Tool and platform stack display for implementation articles.
**Example:** `<TechStack {...props} />`

#### ToolCard
**Path:** `src/components/insights/ToolCard.astro`
**Props:** title? (string), caption? (string), items? (Tool[]), cols? (2 | 3)
**Use:** Grid of tools with descriptions, links, and role context.
**Example:** `<ToolCard {...props} />`

#### TwoUp
**Path:** `src/components/insights/TwoUp.astro`
**Props:** left? (string), right? (string), ratio? ('1:1' | '2:1' | '1:2'), gap? ('sm' | 'md' | 'lg')
**Use:** Two-column MDX layout with optional ratio control.
**Example:** `<TwoUp {...props} />`

#### VideoEmbed
**Path:** `src/components/insights/VideoEmbed.astro`
**Props:** id? (string), src? (string), provider? ('youtube' | 'loom' | 'vimeo'), title? (string), caption? (string), aspect? ('16:9' | '4:3' | '1:1' | '9:16')
**Use:** Accessible video embed wrapper with provider or direct source support.
**Example:** `<VideoEmbed provider="youtube" id="abc123" title="Demo" />`

### Interactive MDX components

Client-side interactive components for rich article experiences. Each uses a single `<script>` tag that Astro deduplicates automatically (one load per page regardless of instance count). No framework dependencies.

#### Tabs
**Path:** `packages/mdx-components/components/Tabs.astro`
**Props:** labels (string[]), variant? ('default' | 'pill' | 'underline')
**Use:** Tabbed content switcher for comparisons, alternatives, or multi-view content. Each tab panel is a numbered slot.
**Example:**
```mdx
<Tabs labels={['Claude Code', 'Clay', 'Manual']}>
  <Fragment slot="0">Claude Code content...</Fragment>
  <Fragment slot="1">Clay content...</Fragment>
  <Fragment slot="2">Manual content...</Fragment>
</Tabs>
```

#### Accordion
**Path:** `packages/mdx-components/components/Accordion.astro`
**Props:** items (Array<{title: string, content: string}>), openFirst? (boolean), allowMultiple? (boolean)
**Use:** Expandable FAQ-style sections with smooth height animation. Accessible: uses `<details>`/`<summary>` with enhanced transitions.
**Example:** `<Accordion items={[{title: 'What is MCP?', content: 'Model Context Protocol...'}]} openFirst />`

#### ImageSlider
**Path:** `packages/mdx-components/components/ImageSlider.astro`
**Props:** before (string), after (string), beforeAlt? (string), afterAlt? (string), caption? (string), startPosition? (number)
**Use:** Before/after image comparison with a draggable divider handle. Touch and mouse support. Keyboard accessible.
**Example:** `<ImageSlider before="/images/before.webp" after="/images/after.webp" caption="Dashboard redesign" />`

#### NumberTicker
**Path:** `packages/mdx-components/components/NumberTicker.astro`
**Props:** value (number), prefix? (string), suffix? (string), duration? (number), label? (string)
**Use:** Scroll-triggered animated counter. Uses IntersectionObserver to start the count-up animation when the element enters the viewport.
**Example:** `<NumberTicker value={75} suffix="%" label="Pipeline growth" duration={1500} />`

#### EmbedDeck
**Path:** `packages/mdx-components/components/EmbedDeck.astro`
**Props:** slides (Array<{title?: string, body: string}>), caption? (string), autoplay? (boolean), interval? (number)
**Use:** Inline mini presentation deck inside articles. Arrow-key navigable, swipeable, with slide counter and optional autoplay.
**Example:**
```mdx
<EmbedDeck slides={[
  {title: 'Step 1', body: 'Research phase...'},
  {title: 'Step 2', body: 'Design phase...'},
]} caption="Project timeline" />
```

#### CodeBlock
**Path:** `packages/mdx-components/components/CodeBlock.astro`
**Props:** code (string), lang? (string), title? (string), caption? (string), highlight? (number[])
**Use:** Syntax-highlighted code block with copy-to-clipboard button, optional filename header, and line highlighting. Uses CSS-based syntax theming (no runtime parser).
**Example:** `<CodeBlock code="const x = 1;" lang="ts" title="example.ts" highlight={[1]} />`

### Insights diagram helpers

#### Arrow
**Path:** `src/components/insights/diagrams/Arrow.astro`
**Props:** label? (string), dashed? (boolean), direction? ('right' | 'left' | 'both' | 'down')
**Use:** Directional connector for custom MDX diagrams.
**Example:** `<Arrow {...props} />`

#### Box
**Path:** `src/components/insights/diagrams/Box.astro`
**Props:** variant? ('default' | 'accent' | 'muted' | 'outline'), label? (string), sub? (string)
**Use:** Diagram node used inside custom MDX system diagrams.
**Example:** `<Box {...props} />`

#### Diagram
**Path:** `src/components/insights/diagrams/Diagram.astro`
**Props:** caption? (string), direction? ('row' | 'column'), align? ('start' | 'center' | 'stretch')
**Use:** Diagram container for composed Box, Arrow, and Stack components.
**Example:** `<Diagram {...props} />`

#### Stack
**Path:** `src/components/insights/diagrams/Stack.astro`
**Props:** direction? ('row' | 'column'), gap? ('sm' | 'md' | 'lg'), align? ('start' | 'center' | 'stretch')
**Use:** Grouping component for diagram layers or grouped nodes.
**Example:** `<Stack {...props} />`

### Layout and SEO

#### Footer
**Path:** `src/components/layout/Footer.astro`
**Props:** none
**Use:** Global footer with page links, writing links, network links, and contact links.
**Example:** `<Footer />`

#### Header
**Path:** `src/components/layout/Header.astro`
**Props:** none
**Use:** Global header with navigation, theme toggle, and responsive menu behavior.
**Example:** `<Header />`

#### Nav
**Path:** `src/components/layout/Nav.astro`
**Props:** none
**Use:** Shared navigation list used by the global header.
**Example:** `<Nav />`

#### SEOHead
**Path:** `src/components/seo/SEOHead.astro`
**Props:** title? (string), description? (string), canonical? (string), ogImage? (string), ogImageAlt? (string), noindex? (boolean), type? ('website' | 'article'), ogLocale? (string), alternates? (Array<{ lang: string; href: string }>), publishedAt? (Date | string), updatedAt? (Date | string), schema? (Record<string, unknown> | Record<string, unknown>[])
**Use:** Source of truth for canonical, OG, Twitter, hreflang, schema, favicon, and theme meta.
**Example:** `<SEOHead title={title} description={description} canonical="/about/" />`

## Themes

Light is default. Dark is set via `data-theme="dark"` on `<html>`. Theme preference is stored in `localStorage` under key `theme`. The inline script in `SEOHead.astro` applies the stored preference before first paint to prevent FOUC.

`prefers-color-scheme` is the fallback if no stored preference. Both `theme-color` meta tags are set in `SEOHead.astro` (media-query matched).

---

## Related files

- `src/styles/tokens.css` — all CSS custom properties
- `src/styles/global.css` — base resets, font-face declarations, body defaults
- `src/components/seo/SEOHead.astro` — canonical meta, favicon links, theme init script
- `docs/10-tone-of-voice.md` — copy voice, brand language rules
