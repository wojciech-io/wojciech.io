---
task: cleanup/data-pl-it-attribute-sweep
branch: codex/data-pl-it-sweep
status: complete
completed: 2026-05-25
---

# Result

Completed the PL/IT data attribute sweep for live Astro sources.

## Changes

- Removed all `data-en`, `data-pl`, and `data-it` attributes from `src/**/*.astro`.
- Removed stale `data-placeholder-*` and `data-aria-*` translation attributes from the booking embed because the page now renders English-only static markup.
- Removed dead language initialization from `Layout.astro` so the live site no longer partially localizes based on browser language or stale `wio_lang` localStorage.
- Removed `langPrefix` / `prefix` route plumbing from `Header.astro` and `Nav.astro`; header/nav links now point directly at English-only routes.
- Updated `docs/SPRINT2_VOICE_AUDIT.md` by removing the deferred sweep note.

## Verification

- `rg -n 'data-pl=|data-it=|data-en=' src dist --glob '*.astro' --glob '*.html'` returned no matches.
- `rg -n 'wio_lang|setLang|wio:langchange|langPrefix|initialLang|data-placeholder|data-aria' src --glob '*.astro'` returned no matches.
- `git diff --check` passed.
- `npm run build` passed. Current `main` builds 14 pages.
- `npx playwright test smoke a11y` passed: 24 passed.

## Notes

- The diff is intentionally mechanical: attribute deletions plus the narrow dead route/language plumbing that only existed to support the removed PL/IT data attributes.
- No content collections under `src/content/` were changed.
