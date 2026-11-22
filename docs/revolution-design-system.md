# Design system of the `/revolution` preview

`docs/design-system.md` and `DESIGN.md` describe the production site (`src/styles/tokens.css`). This file describes the
preview that becomes the new Home on 24 November. The living version is the library page,
`/revolution/system.html` (noindex). It reads its token tables from the stylesheets themselves, so the page is the
reference and this file is the short version of the rules.

## Where the system lives

| Layer | File | Loaded on |
|---|---|---|
| Shared tokens and fixes | `public/revolution/assets/g22/g22.css` | all 32 pages |
| v4 content templates | `assets/v4/v4.css`, `ui4.css`, `mono.css` | 19 pages (apps, insights, work) |
| Motion | `assets/motion/motion.css`, `motion.js` | pages that opt in with `data-m` |
| Library shell | `assets/system/system.css`, `system.js` | `system.html` only |

Two heading families exist today. A (13 pages): Mona Sans 800, 75% width, uppercase. B (v4 pages): Mona Sans 700,
uppercase, letter spacing -0.038em. Playfair Display is only an accent. Merging them into one token set is open work.

## Rules

- **Accent:** one. Olive `#4D5C00` on light, lime `#D2FF00` on dark. No other accent colours.
- **Phone type scale:** 12 / 14 / 18 / 28 / 56 px, plus 120 px display on desktop. Nothing below 12 px.
- **Icons:** 16 and 20 px, stroke 1.5, round caps, `currentColor`. Header controls 18 px.
- **Radius:** 8 px controls, 12 px cards and screens. **Line:** 1 px.
- **Tap targets:** 44 px on a phone. Form fields 16 px.
- **Screens:** an interface is always shown whole. On a phone the `-m` portrait replaces the desktop screen.
- **Motion:** one easing `cubic-bezier(.2,.7,.1,1)`, 22 px distance, 0.8 s, 80 ms step; transform and opacity only;
  `prefers-reduced-motion` shows the final state.
- **Banned:** icon cards, glows, decorative gradients, flat colour fields, drift.

## Page templates

Ten types, each with a model file: Home `index.html`, Lens `gtm.html`, About `about.html`, Work index `work.html`,
Case `work/content-studio.html`, Insights index `insights.html`, Article `article.html`, App `apps/adsai.html`,
Newsletter `newsletter.html`, Legal and 404 `privacy.html`. Anatomy, components and phone behaviour are on the
Page templates tab.

## Maintaining the library

```bash
python3 public/revolution/assets/system/build-system.py            # regenerate system.html
node public/revolution/assets/system/build-thumbs.mjs http://127.0.0.1:PORT   # refresh thumbnails (serve public/ first)
```

Lists of icons, logos and screens come from the folders, so adding a file and regenerating is enough. The library is not
linked from the navigation of the other pages; the link is a decision for the coordinator.
