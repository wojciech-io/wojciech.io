# 11 - Git and Cloudflare operations

## Current repo

- GitHub: `https://github.com/wojciechluszczynski/wojciech-io`
- Local path: `~/wojciech.io`
- Default branch: `main`
- Cloudflare Pages staging: `https://wojciech-io.pages.dev`

## Routine commands

### Start local dev

```bash
cd ~/wojciech.io
npm run dev
```

### Build locally

```bash
npm run build
```

### Save work

```bash
git status
git add .
git commit -m "Describe the change"
git push
```

## Recommended branch use

```bash
git checkout -b feat/design-tokens
```

After work:

```bash
git add .
git commit -m "Add design tokens and base layout"
git push -u origin feat/design-tokens
```

Then open PR on GitHub.

## Cloudflare rules

- `main` currently deploys to `wojciech-io.pages.dev`.
- Do not add the custom production domain `wojciech.io` until Sprint 3 release approval.
- Use Cloudflare Pages, not Workers, for this static Astro site.
- If you see `wrangler deploy` during setup, you are in the wrong flow.
