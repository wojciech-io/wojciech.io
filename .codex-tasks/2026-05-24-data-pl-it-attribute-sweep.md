---
task: cleanup/data-pl-it-attribute-sweep
branch_hint: codex/data-pl-it-sweep
created: 2026-05-24
author: tech-lead (Claude Code, session nervous-bartik-5a866d)
acceptance:
  - All `data-pl="..."` and `data-it="..."` attributes removed from src/**/*.astro
  - No visible behavior change on EN-only live site (these attributes were only consumed by the now-deleted language switcher in Header.astro)
  - npm run build passes
  - npx playwright test smoke a11y passes
  - PR diff is large but mechanical (just attribute deletions)
  - Reference doc updated: docs/SPRINT2_VOICE_AUDIT.md "deferred sweep" note removed
---

# Closed task — Sweep `data-pl` and `data-it` translation attributes

## Context

Sprint 2 B1 ripped multilingual route directories (`src/pages/[lang]/`, `/pl/`, `/it/`) and Sprint 2 D removed the visible language switcher from Header.astro. The `data-pl="..."` and `data-it="..."` attributes on dozens of elements throughout the codebase are now **dead code** — nothing reads them.

Removing them is a wider mechanical sweep deferred from PR #27/#30 to keep those PRs focused. This task closes the cleanup.

## Why this matters

- ~200+ stale attributes inflate HTML payload (~5-10 KB per page after Tailwind)
- Future readers see PL/IT translations and assume multilingual is supported (it isn't)
- When localization sprint comes (Sprint X), it'll use proper content collections per locale — NOT data-attr injection — so these attrs are pure noise

## Scope — files in play

Search command to find every file:

```bash
grep -rl 'data-pl="\|data-it="' src/
```

Likely candidates (based on prior inventory):
- `src/pages/index.astro` (homepage — many sections)
- `src/pages/about.astro`, `work.astro`, `ai-systems.astro`, `apps.astro`, `contact.astro`, `cv.astro`, `now.astro`, `privacy.astro`, `resources.astro`
- `src/components/layout/Header.astro` (any remaining after PR #30)
- `src/components/layout/Footer.astro`
- `src/components/layout/Nav.astro`
- `src/components/pages/*.astro`
- `src/components/ui/*.astro`
- `src/components/home/*.astro`

## How to execute

1. For each file in scope, remove the `data-pl="..."` and `data-it="..."` attributes ONLY. Keep the visible English text intact.

   Before:
   ```astro
   <a data-en="Book a call" data-pl="Umów rozmowę" data-it="Prenota una call" href="...">
     Book a call
   </a>
   ```

   After:
   ```astro
   <a href="...">
     Book a call
   </a>
   ```

   Note: `data-en` can also be removed since it's the visible content already. Whether to keep it as semantic marker is your call — recommend remove for cleanest diff.

2. If any component has a `langPrefix` prop that's now always empty string `''`, remove the prop entirely and replace `langPrefix + '/contact'` with `'/contact'`. Header.astro and Nav.astro likely have this.

3. Run `npm run build` — should pass with 13 pages.
4. Run `npx playwright test smoke a11y` — should pass.
5. Update `docs/SPRINT2_VOICE_AUDIT.md`: remove the "deferred sweep" note at end (the wider data-pl/it cleanup mentioned).

## Out of scope

- Adding new translations (this is REMOVAL only)
- Touching `tests/e2e/*.spec.ts` (already cleaned in PR #31)
- Touching `archive/insights-legacy/` (archived content can keep its attrs)
- Restoring multilingual routes (separate future task per docs/SPRINT012_BLOCKERS.md localization plan)

## Boundaries (hard)

- You do NOT merge to main
- You do NOT touch content collections (`src/content/`)
- You do NOT add `data-de`, `data-da`, `data-no` for the future localization sprint — that comes later when the proper i18n infrastructure lands

## Estimated effort

1-1.5 Codex sessions. Big diff (200+ deletions) but mechanical.
