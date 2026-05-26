---
task: sprint4/playwright-nav-tests
branch_hint: codex/playwright-nav-tests
created: 2026-05-26
author: tech-lead (Claude Code)
acceptance:
  - tests/e2e/mobile-nav.spec.ts covers: open, close via X button, close via Escape, close via nav link click, body scroll lock
  - tests/e2e/cookie-banner.spec.ts covers: banner visible on first load, accept stores localStorage, decline stores localStorage, banner hidden after accept, GA/Mixpanel NOT called before consent
  - tests/e2e/lang-selector.spec.ts covers: desktop dropdown opens and closes, EN is active (aria-selected=true), other options are disabled (aria-disabled=true), dropdown closes on outside click
  - all tests pass on the staging URL (wojciech-io.pages.dev) or localhost preview
  - npm run test passes (unit tests unaffected)
---

# Closed task — Playwright e2e tests for mobile nav, cookie banner, lang selector

## Context

wojciech.io has a mobile full-screen nav overlay, a cookie consent banner, and a language
selector dropdown. These are interactive components with JS state. Currently no e2e tests
cover them — the existing tests/e2e/links.spec.ts only checks static links on desktop.

This task adds three focused e2e spec files. No production code changes — tests only.

## Constraints (hard rules)

- Zakaz em dashów (—) w jakimkolwiek tekście, w tym w komentarzach testów.
- Nie pushuj do main — tylko PR.
- Nie zmieniaj src/ kodu produkcyjnego.
- Tests run against BASE_URL env var (default http://localhost:4321).

## Files to create

- `tests/e2e/mobile-nav.spec.ts` (new)
- `tests/e2e/cookie-banner.spec.ts` (new)
- `tests/e2e/lang-selector.spec.ts` (new)

## Reference: component markup

### Mobile nav (Header.astro)
- Open button: `id="mobile-nav-open"`, `aria-expanded="false"/"true"`
- Overlay: `id="mobile-nav-overlay"`, class includes `translate-x-full` when closed, `translate-x-0` when open
- Close button: `id="mobile-nav-close"`
- Nav links: class `.mobile-nav-link`
- Body: `overflow: hidden` when open

### Cookie banner (CookieBanner.astro)
- Container: `id="cookie-banner"` (verify actual id in src/components/ui/CookieBanner.astro)
- Accept button: contains text "Accept" or data attribute — check component
- Decline button: contains text "Decline" or similar — check component
- localStorage key used for consent: check component source, likely `"cookie-consent"` or `"analytics-consent"`

### Lang selector (Header.astro)
- Toggle button: `id="lang-toggle-desktop"`
- Dropdown: `id="lang-dropdown-desktop"`, class `hidden` when closed
- Options: `role="option"`, `aria-selected="true"` for EN, `aria-disabled="true"` for others

## Test patterns

Use existing tests/e2e/links.spec.ts as style reference. Likely Playwright:

```ts
import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:4321';

test.describe('Mobile nav', () => {
  test('opens and closes via X button', async ({ page }) => {
    await page.goto(BASE + '/');
    // open
    await page.click('#mobile-nav-open');
    await expect(page.locator('#mobile-nav-overlay')).toHaveClass(/translate-x-0/);
    await expect(page.locator('#mobile-nav-open')).toHaveAttribute('aria-expanded', 'true');
    // close
    await page.click('#mobile-nav-close');
    await expect(page.locator('#mobile-nav-overlay')).toHaveClass(/translate-x-full/);
    await expect(page.locator('#mobile-nav-open')).toHaveAttribute('aria-expanded', 'false');
  });
  // ... more tests
});
```

## Required test coverage

### mobile-nav.spec.ts
1. Opens when hamburger clicked (overlay visible, aria-expanded true)
2. Closes when X button clicked (overlay hidden, aria-expanded false)
3. Closes when Escape key pressed
4. Closes when a `.mobile-nav-link` is clicked
5. Body overflow is `hidden` while open, `''` after close
6. (viewport: mobile — use `page.setViewportSize({ width: 375, height: 812 })`)

### cookie-banner.spec.ts
1. Banner is visible on first load (fresh page, no localStorage)
2. After Accept click: banner hidden, localStorage key set to accepted value
3. After Decline click: banner hidden, localStorage key set to declined value
4. On second load (localStorage already set): banner is NOT visible
5. Before consent: no calls to `api-eu.mixpanel.com` (use `page.on('request', ...)` to monitor)

### lang-selector.spec.ts (desktop viewport: 1280x800)
1. Dropdown is hidden on page load (has class `hidden`)
2. Click toggle button: dropdown visible (no `hidden` class), `aria-expanded="true"`
3. EN option has `aria-selected="true"`
4. Deutsch, Dansk, Norsk, 日本語 options have `aria-disabled="true"`
5. Click outside dropdown: dropdown hidden again, `aria-expanded="false"`
6. Click toggle again: dropdown reopens (toggle works)

## Out of scope

- Visual regression tests.
- Tests for form submission (contact form).
- Performance tests.
- Tests for the theme toggle.

## Estimated effort

1 Codex session (~2 h).
