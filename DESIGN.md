# DESIGN.md

How wojciech.io looks and why. This is the first file to read before you build or change any visible part of the site, whether you are a person or a coding agent. `docs/design-system.md` lists tokens and components; where it disagrees with `src/styles/tokens.css` or `packages/mdx-components/styles/widgets.css`, the CSS wins. Voice and wording live in `docs/10-tone-of-voice.md`.

The point of this file is to stop the site drifting toward the average of everything on the web. Every rule below exists because the default would have been generic. Tests enforce the ones that can be enforced (see "What enforces this").

## Principles

1. **Rules, not boxes.** Structure comes from hairlines and one ink rule at the top of a section. A widget is never a filled, rounded card. The only objects are windows: code, terminal, screenshot.
2. **One mark per widget.** A small square in the head, the lime highlighter on the one figure that matters, or the "now" dot on a timeline. Never two marks fighting, never lime as a large fill.
3. **Three registers, one grid.** Prose-side widgets read like an edited page. Number widgets read like an instrument. Code and process widgets read like a log. A widget belongs to exactly one register and borrows nothing from the others.
4. **Every figure has a source.** A number without where it came from and over what period is decoration. Stat and Benchmark carry a source line; do not remove it to make a layout tidier.
5. **Say less.** Text in a widget is a label, a value and one line of explanation. If a widget needs a paragraph, the paragraph belongs in the article.
6. **The column decides the layout.** Container queries, not viewport breakpoints. The one exception is margin notes, which are placed against the page.
7. **Complete at rest.** Motion starts from the finished state. Nothing waits at `opacity: 0` for a script. Reduced motion means no motion, not slower motion.

## Registers

| Register | Reads like | Widgets | Type | Mark |
|---|---|---|---|---|
| **Content** (A) | an edited page | Callout, KeyPoint, KeyTakeaway, TLDR, Quote, PullQuote, Steps, Compare, Comparison, DoDont, BeforeAfter, Accordion, Tabs, TwoUp, ThreadBlock, CaseStudyBlock, EmbedDeck | Geist 400/600; serif for step numerals, side titles, quotes | rule segment, square diode |
| **Numbers** (C) | an instrument | Stat, StatRow, StatGrid, MetricRow, MetricBoard, MetricDelta, StatCallout, ResultCard, NumberTicker, Benchmark, DataTable | serif figures, Geist labels, mono source line | lime highlighter on one figure |
| **Code and process** (B) | a log | CodeBlock, Terminal, AgentFlow, Flow, ProcessFlow, StackLayer, TechStack, ToolCard, Diagram, ArticleTimeline | Geist Mono for identifiers, indices and commands | status diode, index numbers |

Margin notes belong to the content register: a `Callout` of type `note` or `tip`, placed inside `.prose-content`, floats into the right margin at 1100px and wider. Warnings and criticals stay in the column because they are not asides.

## Tokens

All colour comes from `src/styles/tokens.css`. Widget-level tokens live at the top of `widgets.css` (`--w-line`, `--w-line-strong`, `--w-rule`, `--w-lime`, `--w-good`, `--w-warn`, `--w-bad`).

| Role | Value | Notes |
|---|---|---|
| Paper | bone `#f4f3ef` light, warm black `#141009` dark | the page, never pure white or pure black |
| Ink | `#080808` light, `#f4f0e7` dark | text and the top rule of a section |
| Hairline | ink at 11% | between rows |
| Strong hairline | ink at 24% | under headers, around windows |
| Lime | `--color-accent-cta` | the highlighter and the CTA, nothing else; gold on `/ar/` |
| Good, warn, bad | oklch tones, lighter in dark | text colour for deltas and statuses, never a fill |

**Type.** Geist 400 and 600, Geist Mono 400 and 600, Newsreader 400. Nothing else is loaded, so a new weight or face is a performance and consistency decision, not a CSS tweak. Faux bold is a bug (`font-bold` is 700 and is not loaded).

| Use | Face | Sizes in widgets |
|---|---|---|
| Figures, step numerals, side titles, quotes, deck headings | Newsreader 400, `lining-nums tabular-nums` | 24, 32, 40, 48 px |
| Labels, body, table cells | Geist 400 or 600 | 11, 12, 14, 16 px |
| Indices, commands, identifiers, source lines | Geist Mono 400 | 13, 14 px |

The serif is for large numerals and a few display lines only. Do not set body text, buttons, navigation or form labels in it. It loads with `font-display: optional` like Geist, and the Polish letters sit in a separate file that only downloads on a page that needs them.

**Radius.** 2px for chips and diagram boxes, 8px (0.5rem) for windows, 999px for pills, 50% for round buttons. Nothing between. Anything over 8px that is not a pill is a card, and cards are not allowed in widgets.

**Spacing.** Widgets sit 2.25rem apart. Inside a widget: 0.875rem under a top rule, 0.75rem to 1rem between rows.

## Widget rules

- A widget root is `.w`. Inner selectors are written `.w .w-x` (0,2,0) so they beat the prose rules at (0,1,0) without `!important`. A root that is itself a prose element (figure) uses `.w.w`.
- Every widget imports `widgets.css` and has no `<style>` block and no Tailwind arbitrary value. The unit test checks this for every component.
- Reuse before adding: a new widget should compose `.w-eyebrow`, `.w-pill`, `.w-head`, `.w-list`, `.w-rail` and the figure classes before it adds a rule of its own.
- Scripts start on `astro:page-load`, not once at load, or they die after a client-side navigation.
- Motion is CSS first. Scroll-driven animation (`animation-timeline: view()`) is wrapped in `@supports` and `prefers-reduced-motion: no-preference`; a browser without it simply shows the finished state. One moment per widget: the highlighter sweeping across a figure, a benchmark line growing to its point, a timeline dot lighting. No stagger choreography, no counters that run on every scroll.
- Video clips are for short explainers and hero loops only, through `VideoLoop` (3 MB limit). Claude Motion exports MP4 and is not a way to animate a widget inside an article.

## What we do not do

These are the visual tells of a generated site, ranked by how often people name them. Each has a reason the site avoids it.

| Do not | Because | Instead |
|---|---|---|
| A rounded, filled card with a soft shadow around every block | it is the default of the most common component kit and the first thing readers recognise | a rule on top, space around |
| An accent bar down the left edge of a rounded box | same family of defaults | a rule segment on the top hairline |
| Coloured pills for deltas and statuses | dashboard chrome that says "template" | a coloured word, an arrow if it helps |
| Three equal feature tiles with an icon each | the layout every landing page converges on | a ruled list, or a single comparison |
| Gradient meshes, glass panels, glow | decoration standing in for hierarchy | none |
| Bars for two values | a bar chart with two bars is a table with extra steps | a point on a scale joined to zero by a line |
| Traffic-light dots on a window | chrome from somebody else's operating system | the filename and a language label |
| Big quotation marks as ornament | decoration | a rule and the quote in the serif |
| Text that restates the heading | filler, and the commonest complaint after the look itself | delete it |
| Icons as bullets | noise | a dash, or nothing |

## Decisions

Newest first. Add to this list when you reject something, so the next session does not propose it again.

- **2026-10-20, widgets v3.** Replaced the v2 look (filled rounded panels, sans numerals, coloured pills) with three registers. Reason: the owner called v2 generic, and community research on AI-built sites names the default component-kit look as the single most recognisable tell. Rejected: keeping the v2 panels and only recolouring them; a fourth, decorative serif display face for headings (cost and drift); bar charts for two-value comparisons.
- **2026-10-20, article layout.** The sticky "On this page" rail is now an in-column list (open on wide screens, closed on a phone, which had none before). Reason: the right margin now belongs to margin notes, and notes aligned to their paragraphs need that space. Rejected: moving the rail to the left (no room inside the 6xl container), widening the container for articles (content stays in `max-w-6xl`).
- **2026-10-20, Newsreader.** One weight, no italic. An italic file costs 24 KB for a handful of words; "vs." is set upright.

## Review rubric

Score a new or changed widget before merging. Anything below 12 of 16 goes back.

| Question | 0 | 1 | 2 |
|---|---|---|---|
| Is it a rule-and-space layout with no filled rounded card? | card | partly | yes |
| Does it carry exactly one mark? | none or several | one but off-role | one, on the right element |
| Is every number sourced and dated? | no | some | all |
| Does it stay in its register's type roles? | invents sizes | one stray | none |
| Does it work at 390px without a second layout? | breaks | scrolls or wraps badly | container query stacks it cleanly |
| Is it complete with scripts off and motion reduced? | blank | partly | fully |
| Does the text say something the heading does not? | restates | partly | adds |
| Could it be mistaken for another site's widget? | easily | maybe | no |

## What enforces this

- `src/__tests__/widgets-stylesheet.test.ts`: every widget imports the one stylesheet, has no style block, defines every `w-` class it uses, starts scripts on page load, and the stylesheet has no filled rounded card, no unloaded font weight, and the serif only in the roles above.
- `tests/built/widgets-render.test.ts`: no `[object Object]`, no `undefined`, no empty widget heading in any built page.
- `tests/e2e/typography-budget.spec.ts`: no more than 24 distinct text styles on the budget page.
- axe on the fixture and on real articles, in both themes, at 1280 and 390 pixels.

## Where things live

| What | Where |
|---|---|
| Tokens | `src/styles/tokens.css` |
| Fonts | `src/styles/global.css`, files in `public/fonts/` |
| Widget stylesheet | `packages/mdx-components/styles/widgets.css` |
| Widget components | `packages/mdx-components/components/` |
| Article layout and margin column | `src/pages/insights/[slug].astro`, `src/pages/[locale]/insights/[slug].astro` |
| In-column contents list | `src/components/article/ArticleToc.astro` |
