# `/revolution` preview design system

Production tokens live in `docs/design-system.md`. This is the preview. The living reference is
`/revolution/system.html` (noindex); its token tables are read from the CSS.

| Layer | File |
|---|---|
| Tokens and fixes, all 32 pages | `public/revolution/assets/g22/g22.css` |
| v4 templates, 19 pages | `assets/v4/v4.css`, `ui4.css`, `mono.css` |
| Motion | `assets/motion/motion.css` |
| Library shell | `assets/system/system.css`, `system.js` |

Rules: one accent (olive `#4D5C00` light, lime `#D2FF00` dark) · phone type 12/14/18/28/56 px · icons 16/20 px,
stroke 1.5 · radius 8 and 12 · line 1 px · tap target 44 px · screens always whole · motion `cubic-bezier(.2,.7,.1,1)`,
22 px, .8 s · banned: icon cards, glows, decorative gradients, flat colour fields, drift.

Open: two heading families (A on 13 pages, B on 19) still need one token set.

```bash
python3 public/revolution/assets/system/build-system.py
node public/revolution/assets/system/build-thumbs.mjs http://127.0.0.1:PORT
```
