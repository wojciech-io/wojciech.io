import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for wojciech.io
 *
 * Two modes:
 * - Local (default): runs against `npm run preview` on http://localhost:4321
 *   Used by `ci.yml` PR job (fast, deterministic, no external deps).
 * - Prod smoke: set BASE_URL=https://wojciech.io
 *   Used by `smoke-prod.yml` post-deploy hook.
 *
 * See tests/README.md for run commands and baseline update workflow.
 */
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321';
const IS_CI = !!process.env.CI;
const IS_PROD_SMOKE = BASE_URL.startsWith('https://');

export default defineConfig({
  testDir: './tests',
  // Screenshot baselines are generated on macOS and do not reproduce on the
  // Linux CI runner, so visual regression stays a local-only suite. Everything
  // else in tests/e2e runs in CI, which is why the workflow points at the
  // directory instead of listing files.
  testIgnore: IS_CI ? ['**/visual.spec.ts'] : [],
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  workers: IS_CI ? 2 : undefined,
  reporter: IS_CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      pathTemplate:
        '{testDir}/e2e/__screenshots__/{testFileName}-snapshots/{arg}{-projectName}{-platform}{ext}',
    },
  },
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    userAgent: 'wojciech-io-playwright/1.0',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
  ],
  // Local mode only — spin up the Astro preview server.
  webServer: IS_PROD_SMOKE
    ? undefined
    : {
        command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4321',
        url: 'http://127.0.0.1:4321',
        reuseExistingServer: !IS_CI,
        timeout: 120_000,
      },
});
