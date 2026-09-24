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
// Another worktree's preview server may already hold 4321. reuseExistingServer
// then hands the whole suite somebody else's build, which looks like a pass and
// proves nothing, so the port is overridable per run: PW_PORT=4399 npx playwright test
const PORT = process.env.PW_PORT ?? '4321';
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;
const IS_CI = !!process.env.CI;
// `astro preview` daemonises: the wrapper process exits the moment the server
// is up, and Playwright reads that as "webServer exited early" and aborts,
// even though the server is running and serving. So an explicitly provided
// BASE_URL now means "a server is already there, do not manage one" rather
// than only meaning production. CI passes no BASE_URL and is unaffected.
const HAS_EXTERNAL_SERVER = Boolean(process.env.BASE_URL);
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
  webServer: HAS_EXTERNAL_SERVER
    ? undefined
    : {
        // PW_SKIP_BUILD is set in CI, where dist/ arrives as an artifact from
        // the build job. Locally there is no artifact, so the build runs first.
        command: process.env.PW_SKIP_BUILD
          ? `npm run preview -- --host 127.0.0.1 --port ${PORT}`
          : `npm run build && npm run preview -- --host 127.0.0.1 --port ${PORT}`,
        url: `http://127.0.0.1:${PORT}`,
        reuseExistingServer: !IS_CI,
        timeout: 120_000,
      },
});
