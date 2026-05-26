---
task: sprint4/pagefind-search
branch_hint: codex/pagefind-search
created: 2026-05-26
author: tech-lead (Claude Code)
acceptance:
  - @pagefind/default-ui installed as devDependency
  - Astro build config updated to run pagefind after build (postbuild script or astro:build:done hook)
  - SearchModal.astro component created in src/components/ui/
  - Search trigger button added to Header.astro desktop nav (between nav links and ThemeToggle)
  - Search trigger button added to mobile nav overlay bottom bar
  - Keyboard shortcut Cmd+K / Ctrl+K opens the modal
  - Modal closes on Escape and outside click
  - pagefind CSS imported, brand colors overridden to match --color-accent (#EBFF00) and --color-bg
  - npm run build passes (pagefind indexes after build)
  - No TypeScript errors
---

# Codex task — Pagefind static site search

## Context

wojciech.io is an Astro SSG site on Cloudflare Pages. It has ~17 pages including 3+ articles
in `/insights`. Currently there is no search. Pagefind is a free, fully static search library
(no server, no paid plan) that indexes the built HTML and runs entirely in the browser.

**Why Pagefind:** zero cost, zero server, works with Astro SSG, ~100 KB JS (lazy-loaded),
supports Polish characters, indexes full page text and headings.

## Constraints

- Zakaz em dashów (—) w jakimkolwiek widocznym tekście.
- Nie pushuj do main — tylko PR z branch `codex/pagefind-search`.
- Nie zmieniaj copy, treści artykułów, ani layoutu stron.
- Nie dodawaj płatnych usług ani zewnętrznych API.
- Pagefind musi działać w trybie SSG (static build) — bez SSR.

## Stack note

This site uses Astro 6 + Tailwind CSS v4 + CSS design tokens. Components are `.astro` files.
No React. Scripts use TypeScript via `<script>` tags (not `<script is:inline>`).

## Installation

```bash
npm install --save-dev @pagefind/default-ui
```

Add postbuild script to `package.json` (under `scripts`):
```json
"postbuild": "pagefind --site dist --output-path dist/pagefind"
```

Verify `pagefind` CLI is available via npx if not in PATH:
```json
"postbuild": "npx pagefind --site dist --output-path dist/pagefind"
```

## Files to create/modify

- `package.json` — add postbuild script
- `src/components/ui/SearchModal.astro` — new component (see below)
- `src/components/layout/Header.astro` — add search trigger button in two places
- `src/styles/global.css` — add Pagefind CSS overrides (brand colors)

## SearchModal.astro

Create `src/components/ui/SearchModal.astro`:

```astro
---
// Pagefind search modal — opens via Cmd+K / search button
// Lazy-loads pagefind JS only when first opened
---

<div
  id="search-modal"
  role="dialog"
  aria-modal="true"
  aria-label="Search"
  class="fixed inset-0 z-[200] hidden items-start justify-center pt-[15vh] px-4"
>
  <!-- Backdrop -->
  <div id="search-backdrop" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

  <!-- Modal box -->
  <div class="relative w-full max-w-2xl rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg)] shadow-2xl overflow-hidden">
    <div id="pagefind-ui-root"></div>
  </div>
</div>

<script>
  let pagefindLoaded = false;

  async function loadPagefind() {
    if (pagefindLoaded) return;
    pagefindLoaded = true;
    // @ts-ignore — pagefind is generated at build time into /pagefind/
    const { PagefindUI } = await import('/pagefind/pagefind-ui.js');
    new PagefindUI({
      element: '#pagefind-ui-root',
      showSubResults: true,
      resetStyles: false,
    });
  }

  function openSearch() {
    const modal = document.getElementById('search-modal')!;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    loadPagefind().then(() => {
      const input = modal.querySelector<HTMLInputElement>('input[type="text"]');
      input?.focus();
    });
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    const modal = document.getElementById('search-modal')!;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  // Backdrop click closes
  document.getElementById('search-backdrop')?.addEventListener('click', closeSearch);

  // Escape key closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const modal = document.getElementById('search-modal')!;
      modal.classList.contains('hidden') ? openSearch() : closeSearch();
    }
  });

  // Expose for trigger buttons
  (window as any).openSearch = openSearch;

  // Re-wire after View Transitions navigation
  document.addEventListener('astro:page-load', () => {
    document.getElementById('search-backdrop')?.addEventListener('click', closeSearch);
  });
</script>
```

## Search trigger button — Header.astro

Add once in `<SearchModal />` import at top of frontmatter:
```astro
import SearchModal from '../ui/SearchModal.astro';
```

Render `<SearchModal />` just before `</header>` closing tag.

### Desktop nav trigger

Find the line with ThemeToggle in the desktop nav section. Before `<ThemeToggle />`, add:

```astro
<button
  type="button"
  onclick="openSearch()"
  class="flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-sm"
  aria-label="Search (Cmd+K)"
>
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
  <kbd class="hidden xl:inline text-[10px] font-mono border border-[var(--color-border)] rounded px-1 py-0.5 text-[var(--color-text-dim)]">⌘K</kbd>
</button>
```

### Mobile nav trigger

In the bottom bar of the mobile nav overlay (`id="mobile-nav-overlay"`), add a search button
next to the existing ThemeToggle row.

## Pagefind CSS overrides — global.css

Add at the end of `src/styles/global.css`:

```css
/* Pagefind brand overrides */
:root {
  --pagefind-ui-scale: 0.9;
  --pagefind-ui-primary: var(--color-accent);
  --pagefind-ui-text: var(--color-text);
  --pagefind-ui-background: var(--color-bg);
  --pagefind-ui-border: var(--color-border);
  --pagefind-ui-tag: var(--color-surface-2);
  --pagefind-ui-border-width: 1px;
  --pagefind-ui-border-radius: var(--radius-btn);
  --pagefind-ui-font: inherit;
}
```

Import pagefind CSS in the same script block where PagefindUI is loaded (already handled
via `resetStyles: false` — the CSS vars above override Pagefind's defaults).

## Local dev note

Pagefind only works after a full `npm run build`. In dev mode (`npm run dev`), the search
modal will open but show no results — this is expected. Add a dev-mode notice:

In the modal's script, if window.location.hostname includes 'localhost':
show a small note: "Search available after build. Run npm run build to index."

## Verification

1. `npm run build` — must include postbuild pagefind step, `dist/pagefind/` directory must exist.
2. Open `dist/` with a local server (`npx serve dist`), open search, type "GTM" — results must appear.
3. `npm run build` passes without TypeScript errors.
4. Cmd+K opens modal on desktop.
5. Clicking the search icon opens modal.

## Estimated effort

1 Codex session (2–3 h).
