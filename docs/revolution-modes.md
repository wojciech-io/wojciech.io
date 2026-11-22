# Light and dark modes in /revolution

Scope: the preview in `public/revolution` (32 pages). The production tokens in `src/styles/tokens.css` are a separate system.

## Why this exists

Before this change the two modes were one palette turned over. On the 13 older pages the dark mode was the original design and the light mode swapped a few tokens. The hero, the closing card and two strips stayed fixed. The 19 v4 pages had a different switch (`v4theme`, `?theme=`, a reload) that did not read `data-mode`, and no button in the header.

## The two modes

| | Dark, "Ink" | Light, "Paper" |
|---|---|---|
| Ground | deep ink `#171A11`, strips `#10120C` and `#0A0B08` | bright paper `#EEF0E3`, cards `#F5F6EE` |
| Structure | flat surfaces, 1px lime hairline between sections, no drop shadows on interface windows | surfaces lifted with soft shadows, no hairlines between sections |
| Accent | lime `#D2FF00` only | olive `#4D5C00` only, lime stays on fills (buttons, chips) |
| Text | `#F4F4ED` | `#23261B`, secondary `#565C49` |
| Interface windows (`ui-*`) | stay light, as approved; a 1px lime ring stage | stay light; soft shadow stage |

No new accent colour. Light and dark share one palette; what differs is ground, structure and which surface carries the depth.

## Decisions

- **Hero (Home):** follows the mode. Dark hero is ink with the cut-out portrait; light hero is the cream it was. The navigation reads the real background under it (see below).
- **First screen (`c3h`):** follows the mode. Paper in light, ink in dark.
- **About hero (`abh`):** follows the mode.
- **Closing card (`ft` on old pages, `ftr__pn` on v4):** follows the mode. Dark card in dark, paper card in light.
- **Lens pages (GTM, Marketing, Growth):** the cream hero and the light sheets turn to ink in dark. In light, the sheets that were dark keep their olive cover banners (the cover is an image) but the section ground is not yet paper: see "Not done".
- **Strips `ex` and `so` on Home, `so` on Work and Insights, `nlb`, `nli`, `ar2__rel`:** conscious exception. They stay paper (or lime) in both modes. They hold light app windows and brand logos on white, and they give the dark page a rhythm. Eight sections in total.
- **Cut-out and photo scenes:** unchanged.
- **Navigation:** the tone (light or dark text) is now taken from the computed background of the section under the header, not from `data-theme`. This fixed an invisible logo on the legal pages in dark and on About in light.

## How it is wired

- `html[data-mode]` is set in `<head>` before first paint from `localStorage.wl-mode`, else `prefers-color-scheme`. The 19 v4 pages got the same inline script. It also writes `v4theme`, so `v4.js` follows `data-mode` without being edited. `?theme=light|dark` still works and is stored.
- v4 pages: `assets/g22/modes4.js` adds the same button as the older pages to the header. v4.js builds light by rewriting the markup, so the button stores the choice and reloads once, keeping the scroll position.
- Rules live in the block `MODES R3` at the end of `assets/g22/g22.css`. `v4.css`, `ui4.css` and `mono.css` are untouched.
- Tokens used by the older pages (`--sf0`, `--sf1`, `--sf2`, `--sfb`, `--sh`) are redefined per mode at `:root`; sections with `data-theme="light"` still reset them on purpose.

## Check

`node scripts/revolution-modes-check.mjs` loads every page in both modes at 390 and 1440 px and checks:

1. `html[data-mode]` equals the stored choice,
2. no horizontal scroll,
3. axe `color-contrast` has no violations.

`node scripts/revolution-modes-shots.mjs <dir> [base] [pages]` writes dark and light side by side.

## Not done

- Light mode on the lens pages: `gt-rail`, `mk-bd`, `mk-tools`, `gr-pov`, `gr-cs`, `gr-fq` and `abh`-like blocks keep literal dark backgrounds. They need their own paper rules per section.
- The eight strips above are an exception on purpose; revisit after Wojtek looks at the screenshots.
- Covers (`cv`) have per-mode rules from before; a per-mode crop is for the covers thread.
