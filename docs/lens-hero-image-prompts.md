# Lens hero image prompts (/gtm, /marketing, /growth)

Image-generation prompts for the greyed hero backdrops on the three lens pages.
Wired in `src/components/pages/LensShowcase.astro` via the `heroImage` prop.

## Where they render

- Desktop only (`lg+`), right ~52% of the hero, behind the headline.
- Rendered **greyscaled (~90%) and dimmed (opacity 0.5 light / 0.28 dark)**, faded
  into the page on the left/top/bottom so the copy stays readable. So: compose the
  subject weighted to the **right**, keep the **left third empty / soft** (that's
  where it dissolves under the text), and make sure the image reads when desaturated.

## Save as (WebP, ~1600×1100, right-weighted composition)

- `public/images/lens/gtm-hero.webp`
- `public/images/lens/marketing-hero.webp`
- `public/images/lens/growth-hero.webp`

## Hard rules (same as the rest of the site)

- **No generated people / faces**, no hands on keyboards, no "AI stock person".
- **No fake floating dashboards / holographic UI cards** (that reads as AI-slop).
- Light, bright, editorial. Clean geometry, real materials or crisp 3D, purposeful
  negative space. Think Stripe/Vercel editorial covers, not neon cyberpunk.
- One consistent series: same light, same material language, same restraint across
  all three. Lime (#EBFF00) allowed as a single small accent (mostly lost in the
  grey wash — rely on composition, not colour).

---

## 1 — GTM (`gtm-hero.webp`)

**Concept:** plumbing / one pipeline, not four dashboards. Interconnected system,
one clean path.

**Prompt:**
> Editorial 3D render, bright soft studio light on an off-white seamless surface.
> A single clean pipeline of connected matte channels and junction nodes routing
> left-to-right, consolidating four thin incoming lines into one thick confident
> output rail on the right. Precise, architectural, minimal. Pale warm greys and
> bone white, one small lime-yellow node as the only accent. Right-weighted
> composition, empty soft space on the left. No text, no people, no screens.
> Shallow depth of field, high-end product-photography feel.

## 2 — Marketing (`marketing-hero.webp`)

**Concept:** demand, not impressions — noisy signal engineered into traceable
structure.

**Prompt:**
> Editorial 3D render, bright airy studio light, off-white background. On the left,
> a diffuse scatter of faint particles/noise resolving toward the right into a clean
> ordered lattice of thin connected rods and nodes — chaos becoming structure. Matte
> ceramic and pale aluminium materials, bone-white and soft grey, a single lime-yellow
> thread tracing the one path that lands. Subject weighted right, soft negative space
> left. Minimal, precise, no text, no people, no UI panels. Shallow depth of field.

## 3 — Growth (`growth-hero.webp`)

**Concept:** compounding loops that ship — a cycle that runs and builds, not a
one-off spike.

**Prompt:**
> Editorial 3D render, bright soft studio light on an off-white surface. A clean
> looping ribbon / torus of matte material on the right, each pass slightly larger —
> a compounding upward loop, calm and mechanical. Pale warm greys and bone white,
> one small lime-yellow segment marking the active pass. Right-weighted composition,
> empty soft space on the left for headline copy. Minimal, architectural, precise.
> No text, no people, no dashboards. Shallow depth of field, premium product render.

---

## After generating

Drop the three WebP files at the paths above and the hero backdrops render
automatically (no code change needed). Until then the pages fall back to the
clean text-only hero.
