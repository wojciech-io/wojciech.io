# 05 - Design direction

## Direction chosen

**Hybrid direction**:

- visual system and color family closer to `app.wojciech.io`,
- storytelling rhythm and section clarity closer to `brand24-ai.vercel.app`,
- no Figma workflow for now; use Claude / Claude Design for ideation and Claude Code for implementation.

## Desired feel

- premium,
- technical,
- editorial,
- precise,
- composed,
- built by an operator rather than a design studio.

## Visual principles

1. **Dark-first but not black-box generic**
   - use deep navy / charcoal surfaces,
   - controlled accent color,
   - strong contrast,
   - avoid overdone gradients.

2. **Information density with breathing room**
   - more structured than a brochure site,
   - less noisy than a dashboard,
   - sections should feel like chapters.

3. **Proof-led cards**
   - metrics, systems, products and outcomes should be visually legible,
   - each card must answer: what was built, why it matters, what it proves.

4. **Typography carries the brand**
   - restrained scale,
   - strong headings,
   - avoid too many decorative elements.

5. **Motion is support, not content**
   - subtle reveal, hover and transition states,
   - no heavy Framer-style animation dependence.

## Suggested component vocabulary

- Hero statement
- System card
- Proof cluster card
- Metric strip
- Case study card
- Testimonial card
- Insight card
- CTA band
- External product link card
- Timeline / operating model block

## Design source material

### From current `app.wojciech.io`

- color family,
- darker, more technical feeling,
- portfolio / product thinking,
- system-like UI polish.

### From `brand24-ai`

- narrative progression,
- sharper section hierarchy,
- artifact-led proof,
- less filler between claims and evidence.

### From current `wojciech.io`

- keep only proof assets and potentially selected photos,
- do not clone section order or old visual framing.

## Working without Figma

1. Define tokens in code.
2. Generate 2-3 coded homepage style directions in Astro / Tailwind.
3. Review screenshots and iterate with Claude Design prompts.
4. Freeze tokens before building full pages.
5. Build components once direction is accepted.

## Non-goals

- do not create a generic SaaS landing,
- do not mimic current Framer page structure,
- do not let product screenshots dominate the homepage at the expense of strategy,
- do not turn the site into a dev portfolio.
