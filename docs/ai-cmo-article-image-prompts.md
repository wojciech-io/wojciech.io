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

**Concept:** a request that fits no bet is handed back, not written.

**Self-contained prompt.** Paste this on its own, in a fresh generation. Do not
paste this file, and do not paste more than one prompt at a time: the first
batch was generated from the whole document and came back as contact sheets of
five thumbnails instead of five images.

> A single photorealistic editorial image, one continuous scene filling the
> whole frame. Not a grid, not a contact sheet, no panels, no captions, no
> numbered labels, no borders.
>
> Scene: a bright minimal interior in bone white and warm off-white. Plaster
> walls, a travertine ledge running across the lower third, one sculptural
> rounded cream armchair at the far right, a green plant in a pale ceramic pot,
> soft daylight from a window on the right casting a long gentle shadow across
> the wall. Shallow depth of field, high-end product photography, calm and airy.
>
> A man in his mid thirties with dark curly hair and a short beard, wearing a
> cream ribbed knit jumper and light beige chinos, stands at the far left,
> turned three quarters away, one hand at his chin, thinking. He is soft and out
> of focus and he is not looking at the camera.
>
> Floating in front of the wall, sharply in focus, is the subject: one wide
> rounded card of frosted white glass, tilted slightly off axis, carrying faint
> grey placeholder bars instead of readable text and a single small lime yellow
> dot in its top right corner. It hovers above and apart from everything else.
>
> Below it, standing on the travertine ledge in a neat row, three upright
> frosted white cards of equal size, each with a short thick lime yellow
> underline near the top and grey placeholder bars beneath. They are labelled in
> small clean dark sans type: B1, B2, B3.
>
> Thin dashed lime yellow lines descend from the tilted card toward the three
> cards below, but each line stops short in the empty gap and ends in a small
> lime yellow cross. Nothing connects. The visible gap between the floating card
> and the row is the point of the picture.
>
> Palette: bone white, warm pale grey, soft beige, one green plant. Lime yellow
> #EBFF00 appears only on the dot, the three underlines, and the dashed lines
> with their crosses. No other colour. No readable sentences anywhere, no logos,
> no neon, no dark background, no holographic blue interface. Aspect ratio 4:3,
> 1456 x 1088.

**Reject the render if:** the dashed lines actually reach the three cards, which
inverts the meaning into "it fits all three"; or the floating card sits level
with the row instead of above and apart from it.

---

## 3. In-article: the gate and the throttle

**File:** `public/images/insights/ai-cmo-ship-gate.webp`
Place it after the section "The approval bottleneck is a capacity problem".

**Concept:** three review lanes moving at different rates, and the backlog that
piles up behind the narrowest one.

**Do not render this as physical objects.** The first attempt asked for ceramic
channels holding ceramic tokens and came back looking like a stack of plates.
Everything in this frame is screen furniture: glass panels and UI tiles, the
same material language as the panels on the cover.

**Self-contained prompt.** Paste on its own.

> A single photorealistic editorial image, one continuous scene filling the
> whole frame. Not a grid, not a contact sheet, no panels, no captions, no
> numbered labels, no borders.
>
> Scene: a bright minimal interior in bone white and warm off-white. Plaster
> wall, soft daylight from the right, a hint of a green plant at the far edge.
> Shallow depth of field, high-end product photography, calm and airy.
>
> The subject is three floating horizontal lanes of frosted white glass, stacked
> one above the other with even gaps, running left to right across the frame,
> each with thin light grey edges and a soft shadow on the wall behind. Each
> lane is labelled at its left end with a single small dark letter: A on the top
> lane, B in the middle, C at the bottom.
>
> Inside each lane sits a row of small rounded rectangular cards, like little
> interface tiles, white with two faint grey placeholder bars on each.
>
> Lane A: tiles evenly spaced along the whole lane with clear gaps, moving
> freely, nothing blocking them.
> Lane B: a thin vertical lime yellow bar crosses the lane about two thirds
> along. Tiles are evenly spaced before it and more thinly spread after it.
> Lane C: the thin vertical lime yellow bar sits right at the left end. Only
> four or five tiles have passed it. Behind that bar, outside the lane, a dense
> block of identical tiles is stacked up and overlapping like a held queue,
> clearly waiting, with one single lime yellow tile at the front of the queue.
>
> A man in his mid thirties with dark curly hair and a cream knit jumper stands
> at the right edge of the frame, in soft focus, arms folded, looking at the
> lanes. He is not looking at the camera.
>
> Everything in this image is screen furniture: glass panels and interface
> tiles. No physical objects, no ceramic discs, no stone tokens, no plates, no
> bowls, no coins, no stacked crockery.
>
> Palette: bone white, warm pale grey, soft beige. Lime yellow #EBFF00 only on
> the two vertical bars and the single tile at the head of the queue. No other
> colour. No readable sentences, no logos, no neon, no dark background. Aspect
> ratio 4:3, 1456 x 1088.

**Reject the render if:** the tiles read as ceramic discs, coins or plates; the
queue behind lane C is scattered rather than stacked; or all three lanes look
equally full, which loses the whole point.

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
