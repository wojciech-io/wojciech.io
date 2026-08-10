import { defineConfig } from 'vitest/config';

/**
 * Checks that read the built site in `dist/`.
 *
 * These assertions used to run in Playwright, which meant booting two browsers
 * to read static markup. They are pure HTML and file checks, so they belong
 * here: same coverage, no browser.
 *
 * Kept in a separate config because they need a build first. `npm run test:unit`
 * runs without one, so folding these into it would either fail or, worse, skip
 * silently and report green.
 *
 * Run with `npm run test:built` (build first).
 */
export default defineConfig({
  test: {
    include: ['tests/built/**/*.test.ts'],
    environment: 'node',
  },
});
