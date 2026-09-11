# Stack icons brief

How brand icons on `/stack` are sourced, shaped, and rendered. Read this before
adding a file to `public/images/stack/icons/`.

The only consumer is `iconSvg()` in `src/pages/stack.astro`. Nothing else on the
site reads that directory. `STACK` in `src/data/stack.ts` also carries an `icon`
slug, but the only page using it (`src/pages/ar/about.astro`) renders tool names
as text and never touches these files.

## The convention

A tool entry in `flow` or `layers` carries an optional `slug`. At build time
`iconSvg(slug)` reads `public/images/stack/icons/{slug}.svg` and inlines it. No
file, no icon: the entry degrades instead of failing the build.

Slugs follow [Simple Icons](https://simpleicons.org) naming, which is where the
current files came from and why they look like `nodedotjs`, `githubactions`,
`cloudflarepages` and `googleanalytics` rather than `node`, `actions`, `pages`
and `ga4`. `src/data/stack.ts` documents its own `icon` field the same way. Keep
it, so "which file do I need" stays a lookup rather than a guess.

## What a file has to look like

Every icon in the directory today is one line:

```svg
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="..."/></svg>
```

That shape is not cosmetic. Four parts of it are load-bearing:

**`fill="currentColor"` on every painted node.** This is the only reason icons
tint with the theme. `iconSvg()` does not rewrite fills, so an icon carrying a
brand hex keeps that hex in both light and dark mode and reads as a smudge
against one of them. Simple Icons ships `currentColor` already. Anything from a
press kit or a Figma export almost certainly does not: strip the fills yourself.
The colour arrives from `text-[var(--color-text)]` on the wrapping span.

**The document starts with `<svg`.** `iconSvg()` injects its sizing class with

```js
raw.replace(/^\s*<svg\b/, '<svg class="h-full w-full" aria-hidden="true"')
```

That pattern allows leading whitespace and nothing else. An XML prolog
(`<?xml version="1.0"?>`) or a generator comment ahead of the root element makes
the match fail, `replace` returns the string untouched, and the icon inlines with
no class and no `aria-hidden`. Because the file also has no width or height, the
browser falls back to the default replaced-element size and one icon blows out
the row it sits in. There is no warning and no build error. Delete the prolog.

**`viewBox="0 0 24 24"`, with no `width` or `height`.** The injected
`h-full w-full` makes the icon fill its container, and the containers are small
and fixed: `h-8 w-8` with `p-1.5` of padding in the deploy flow, `h-5 w-5` in the
layer chips. A 24-unit square viewBox is what keeps optical weight consistent
between two icons sitting next to each other at 20px.

**No `class` attribute of your own.** The injected `class` is written before the
existing one, so the tag ends up with the attribute twice. HTML parsing keeps the
first and silently drops the rest, which means your class is ignored rather than
merged. Put nothing there.

Also skip `<title>` and `<desc>`. The injected `aria-hidden="true"` is correct
here: every icon sits next to the tool name in visible text, so announcing it
again is noise.

## What happens when the file is missing

`iconSvg()` returns `null` on any read failure and each surface has its own
fallback, so the two look different:

| Surface | With an icon | Without |
|---|---|---|
| Deploy flow | inlined mark in a bordered 32px tile | first two letters of the tool name |
| Layer chips | inlined mark at 20px | a small accent dot before the name |

Both are deliberate. A slug with no file is a soft gap, not a bug, and several
entries run that way on purpose. Adding a file is an upgrade, never a repair.

## Adding one

1. Get the SVG from Simple Icons (CC0) at the slug you need.
2. Confirm it matches the shape above: one `<svg>` root, `viewBox="0 0 24 24"`,
   `fill="currentColor"`, no prolog, no width, no height, no class, no title.
3. Save it as `public/images/stack/icons/{slug}.svg`.
4. Set that `slug` on the tool entry in `src/pages/stack.astro`.
5. `npm run build:site`, then look at `/stack` in both themes. A file that is
   wrong in one of the ways above still builds.

## Checking the directory against the page

Slugs drift out of the page faster than files leave the directory, so counting by
hand goes stale. Recompute instead, from the repo root:

```bash
grep -o "slug: '[a-z0-9]*'" src/pages/stack.astro | sed "s/slug: '//;s/'//" | sort -u > /tmp/slugs
for s in $(cat /tmp/slugs); do [ -f "public/images/stack/icons/$s.svg" ] || echo "no file: $s"; done
for f in public/images/stack/icons/*.svg; do b=$(basename "$f" .svg); grep -qx "$b" /tmp/slugs || echo "unused:  $b"; done
```

"no file" entries are the soft gaps described above and need no action. "unused"
entries are files the page stopped pointing at, which is worth a look before they
accumulate.

## Committing this file

`docs/**` is gitignored behind an allowlist, and the allowlist exists twice: at
the bottom of `.gitignore` and in `is_allowed_doc()` in
`.github/workflows/sensitive-path-guard.yml`. Both name this file. Editing one
without the other is how `docs/copy-quality.md` went missing between #575 and
#582 while two files pointed readers at it.
