# Redesign workflow — Lovable prototypes → Astro implementation

**Status:** future planning. Trigger: Wojciech starts Lovable exploration.
**Author:** Claude Code, 2026-05-24.

> Lovable.dev is React + Tailwind + Vite. wojciech.io is Astro + Tailwind. The codebases don't share runtime, but they share **design tokens, Tailwind config, and component patterns**. Workflow below: Lovable for visual exploration, Astro for production.

---

## Why Lovable for redesign exploration

Strengths for this work:
- Fast iteration on visual ideas (minutes per variation)
- Live URL preview to share + sleep-test designs
- Easy to fork variants and A/B them side-by-side
- AI generates working Tailwind that maps cleanly to Astro

Weaknesses (why not ship from Lovable):
- React app, not static — heavier runtime than Astro
- No content collections integration
- No SEO primitives (no sitemap, hreflang, OG generation)
- No CF Pages middleware/auth
- No agent infrastructure (test-engineer, security-auditor, etc.)

Conclusion: **Lovable is design lab, Astro is production.**

---

## Handoff protocol

```
Wojciech in Lovable
    ↓
1. Explore visual variants (typography, color, hierarchy, section rhythm)
2. Pick winning patterns per section (hero, work cards, testimonials, footer)
3. Share Lovable URLs OR export the Lovable project zip
    ↓
Claude Code receives the patterns
    ↓
4. Extract design tokens (color, spacing, typography, radius, shadow)
5. Map Lovable JSX → Astro components (preserve patterns, not props/runtime)
6. Update src/styles/global.css or tailwind config with new tokens
7. Rewrite affected Astro components (Header, Hero, ProjectCard, etc.)
8. Verify against playwright visual regression (Tier 5a)
9. PR for Wojciech review with side-by-side screenshots
```

---

## What to share with me when Lovable session ends

For fastest handoff, paste these into chat:

1. **Lovable public URL(s)** — one per variant. I open via WebFetch.
2. **Pattern names** — "Hero variant 3, work-card variant 2, footer variant 1" — so I know what to lift, what to ignore.
3. **Design tokens** if you've already extracted (color hex, spacing scale, font sizes). Otherwise I extract from rendered CSS.
4. **Constraints**: any patterns you LIKE but won't ship (e.g., "the animated background, save for later").

If you can export the Lovable project zip — even better. I'll diff token-by-token against current Astro setup.

---

## Design-system inventory (current state, for redesign context)

Today's `src/styles/global.css` + `tailwind.config` use:

- **Color system**: CSS custom properties (`--color-bg`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-accent-cta`, `--color-border`, `--color-surface`, `--color-surface-2`)
- **Typography**: Geist Sans + Geist Mono (font package already installed)
- **Spacing**: Tailwind default scale + custom `--space-section` token
- **Radii**: `--radius-btn`, `--radius-card`
- **Shadows**: `--shadow-card`
- **Components touched by redesign typically**:
  - `src/components/layout/Header.astro`
  - `src/components/layout/Footer.astro`
  - `src/components/layout/Nav.astro`
  - `src/components/home/HeroSystemCanvas.astro` (the interactive hero)
  - `src/components/ui/ProjectCard.astro`
  - `src/components/ui/TestimonialSlider.astro`
  - `src/components/ui/CTABand.astro`
  - `src/pages/index.astro` (section composition)

If Lovable redesign changes tokens, the diff is small (single global.css). If it changes section composition, larger diff across index.astro + home components. If it changes component shape, biggest diff.

---

## Token extraction protocol (if Lovable export available)

```bash
# 1. Inspect Lovable's generated tailwind.config / index.css
cat <lovable-project>/tailwind.config.ts
cat <lovable-project>/src/index.css

# 2. Diff against ours
diff src/styles/global.css <lovable-project>/src/index.css

# 3. Map Lovable tokens → our CSS custom properties
# (preserve our --color-* naming convention; Lovable typically uses --primary, --secondary, etc.)

# 4. Update src/styles/global.css in a single PR
# 5. Tier 5a visual regression catches any unintended shifts
```

---

## What NOT to do

- **Don't copy Lovable's React component code 1:1 into .astro files.** Astro syntax differs (no React state, no useEffect; islands for client-side). I'll rewrite.
- **Don't ship Lovable's preview URL as a wojciech.io subdomain.** Lovable hosting ≠ production-grade. CF Pages stays the deploy target.
- **Don't redesign and re-translate in the same sprint.** Visual + voice changes at once = hard to attribute regressions. Sequence: voice first (done), then redesign, then localization.
- **Don't break existing Sprint 1 invariants:** axe a11y green, Lighthouse warn thresholds passing, headers security gate green.

---

## Codex closed task scaffolded

When Wojciech shares first Lovable variant, I'll write:

`.codex-tasks/202X-XX-XX-redesign-token-extraction.md`
- Extract design tokens from Lovable export
- Diff against current `src/styles/global.css`
- Propose minimal-diff token migration
- Astro component patterns mapping doc (one row per component touched)

And then per-component PRs once Wojciech picks which sections to ship first.

---

## Sequencing recommendation

Given Sprint 2 content is still in flight + 5 closed Codex tasks queued + localization plan ready:

**Don't start redesign yet.** Order:
1. ✅ Sprint 1 infra (done)
2. ⏳ Sprint 2 content (in flight — your inputs from `SPRINT012_BLOCKERS.md`)
3. ⏳ Codex consumption cycle (proven Codex↔Claude Code orchestration)
4. **THEN** redesign with Lovable (Sprint 3 or dedicated visual sprint)
5. **THEN** cultural localization (Sprint 4+)

Reason: redesign before content stabilizes = redo every section twice. Localization before redesign = transcreate twice (once for current design, once for new). Worst case = transcreate-redesign-translocate, three passes per locale.

If you START Lovable exploration in parallel (you'd like to play), do it. Just share findings; I park them in `docs/redesign-lab/` until ready to integrate.
