# Image prompts: "An AI CMO without a plan is just a very fast intern"

Article: `src/content/insights/ai-cmo-claude-skills-marketing-system.mdx`
Category: AI Marketing · slug `ai-cmo-claude-skills-marketing-system`

These follow the **current** house style, which is the bright editorial look used on
the project cards (`/images/work/*.webp`) and the recent insight covers, not the
dark schematic style described in `insight-cover-generation-brief.md`. That older
brief is still accurate for the terminal and benchmark covers, and the dark
variant below is there for the same reason.

---

## The style block

Paste this verbatim at the top of every prompt in this file. It is what makes the
series look like one series, and it is the part that stops the output drifting
into generic AI stock imagery.

> Bright editorial product photography, high-end 3D render hybrid. A calm,
> minimal interior in bone white, warm off-white and pale grey: plaster walls,
> travertine and matte ceramic surfaces, one sculptural rounded chair or plinth,
> one green plant, soft daylight from a window on the right casting a gentle
> shadow. A man in his mid-thirties, dark curly hair, short beard, cream knitted
> jumper and light beige chinos, working at a laptop, seen in three-quarter or
> profile view, looking at the screen and never at the camera. Floating
> semi-transparent frosted-glass UI panels with rounded corners, thin light-grey
> strokes and grey placeholder bars instead of readable body text. Lime yellow
> #EBFF00 used sparingly as the single accent: one highlighted row, one active
> node, one line on a chart, thin dashed connector lines. Optional single very
> dark navy chip for contrast. Shallow depth of field, clean composition,
> generous negative space, no logos, no watermark, no readable paragraphs, no
> neon, no cyberpunk, no dark background.

**Format for all article images:** 1456 × 1088 px, WebP, quality 85.
**Save to:** `public/images/insights/`.

---

## 1. Cover

**File:** `public/images/insights/ai-cmo-claude-skills-marketing-system.webp`

After generating it, uncomment the `coverImage` line in the frontmatter of both
the EN and PL article. The unit test `insight cover art` fails on purpose if the
file exists and the frontmatter still points elsewhere.

**Concept:** two decision files standing in front of a row of execution panels.
Everything downstream is dimmed and waiting; the two files at the front are lit.

**Prompt:**

> [style block]
> Composition: on the left the man stands at a low travertine table with a
> laptop. Floating in front of him, closest to camera and clearly in focus, two
> upright document panels labelled in small clean type: "positioning.md" and
> "quarter.md", each with a lime yellow left edge and a short lime marker line.
> Behind them, receding slightly out of focus, a row of six smaller identical
> panels in plain white with no lime, each showing a faint generic icon, waiting.
> Thin dashed lime connector lines run from the two front documents back to the
> six panels, and nowhere else. The two front documents are the only lit objects
> in the frame. Right-hand third stays soft and empty. 1456 x 1088.

**Alternative dark variant**, if this ends up as the OG image on a dark feed:
swap the interior for the low-key evening desk used on the GPT-5.6 cover, keep
the same two-documents-in-front composition, headline area left, lime accents
identical.

---

## 2. In-article: the refusal

**File:** `public/images/insights/ai-cmo-brief-refusal.webp`
Place it after the section "The refusal is the feature".

**Concept:** a request that fits no bet gets handed back, not written.

**Prompt:**

> [style block]
> Composition: centre frame, three horizontal cards labelled with short type,
> "B1", "B2", "B3", each with a thin lime underline. A fourth card floats above
> them, slightly rotated, tinted a very pale grey and clearly not connected to
> anything, with a small lime dot on its corner and a thin dashed line that stops
> short of all three cards instead of joining one. The man is small in the left
> background, out of focus, hands off the laptop. Emphasis on the gap between the
> floating card and the three cards below it. 1456 x 1088.

---

## 3. In-article: the gate and the throttle

**File:** `public/images/insights/ai-cmo-ship-gate.webp`
Place it after the section "The approval bottleneck is a capacity problem".

**Concept:** three lanes at different widths, and the queue that forms when the
input is wider than the lane.

**Prompt:**

> [style block]
> Composition: three horizontal channels in matte ceramic running left to right
> across the frame, stacked, of visibly different widths: the top one wide and
> open, the middle one narrower with a small lime gate marker part way along, the
> bottom one narrow with a lime gate marker at the start. Small identical pale
> tokens flow along each channel. Above the narrowest channel, a neat stack of
> waiting tokens has formed, not scattered, deliberately queued. One lime token
> at the head of the queue. The man is at the right edge, in profile, out of
> focus, watching. No text labels except three tiny letters A, B, C at the left
> end of the channels. 1456 x 1088.

---

## 4. OG and LinkedIn share image

**File:** `public/images/insights/og-ai-cmo-claude-skills-marketing-system.webp`
Only needed if you want to override the auto-generated `/og/<slug>.png`.

**Format:** 1200 × 630 px.

**Prompt:**

> [style block]
> Composition: right-weighted. The two document panels "positioning.md" and
> "quarter.md" sit on the right two-thirds, lit, with six dimmed execution panels
> receding behind them. The left third is clean empty off-white wall, reserved
> for headline text added afterwards in the layout, so keep it free of objects
> and shadow detail. No text in the image. 1200 x 630.

Headline to set over the empty left third, in the site's sans, near black on
off-white, with a lime uppercase mono eyebrow above it:

- Eyebrow: `AI MARKETING`
- Headline: `An AI CMO without a plan is just a very fast intern`
- PL headline: `Sztuczny CMO bez planu to tylko bardzo szybki stażysta`

---

## 5. LinkedIn square

**File:** not committed, upload straight to LinkedIn.
**Format:** 1200 × 1200 px.

**Prompt:**

> [style block]
> Composition: square, centred. Seven identical pale panels arranged in a loose
> arc, all dim. In front of them, one upright document panel with a lime left
> edge, clearly closer to camera and the only lit object. Thin dashed lime lines
> run from the single document to each of the seven panels. No people. Generous
> empty space at the top for a headline added afterwards. 1200 x 1200.

---

## Checklist before committing an image

- [ ] Off-white, bright, daylight. Not dark, not blue, not neon.
- [ ] Lime #EBFF00 on no more than three elements.
- [ ] No readable sentences anywhere in the frame. Short labels only.
- [ ] No faces looking at camera, no hands hovering over a keyboard as the subject.
- [ ] No floating holographic dashboards stacked in a fan. One or two panels, placed.
- [ ] Reads at 320 px wide, which is how it appears in the insights grid on mobile.
- [ ] Sits next to `growthhub.webp` and `gtm-starter-pack.webp` without looking like a different site.
- [ ] Converted to WebP at quality 85 before commit.
