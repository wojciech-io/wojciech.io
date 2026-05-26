import { test, expect } from '@playwright/test';

/**
 * Golden-path smoke. Should pass on every PR + post-deploy.
 *
 * Rules:
 * - No assertions on copy that changes weekly (use stable structure: h1 present, nav present)
 * - No assertions on exact pixel layout (visual regression suite handles that)
 * - No external dependencies (no API calls, no third-party iframes)
 */

const GOLDEN_PATHS = [
  { path: '/', label: 'home' },
  { path: '/about/', label: 'about' },
  { path: '/work/', label: 'work' },
  { path: '/ai-systems/', label: 'ai-systems' },
  { path: '/insights/', label: 'insights index' },
] as const;

for (const { path, label } of GOLDEN_PATHS) {
  test(`${label} loads with HTTP 200 and renders a heading`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.ok(), `expected 2xx for ${path}, got ${response?.status()}`).toBe(true);

    // At least one h1 must be present and non-empty.
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const text = (await h1.textContent())?.trim() ?? '';
    expect(text.length, `h1 on ${path} appears empty`).toBeGreaterThan(0);

    // Page title must be set and non-default.
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title).not.toMatch(/^astro$/i);
  });
}

test('homepage has a working primary CTA link', async ({ page }) => {
  await page.goto('/');
  // Find a link in the hero area that points to internal nav (most likely /work or /about).
  const ctaCandidates = page.locator('main a[href^="/"]').first();
  await expect(ctaCandidates).toBeVisible();
  const href = await ctaCandidates.getAttribute('href');
  expect(href).toMatch(/^\//);
});

test('insights index lists at least one published article', async ({ page }) => {
  await page.goto('/insights/');
  const articleLinks = page.locator('main a[href^="/insights/"][href$="/"]');
  const hrefs = await articleLinks.evaluateAll((links) =>
    links
      .map((link) => link.getAttribute('href'))
      .filter((href): href is string => Boolean(href) && href !== '/insights/'),
  );
  expect(hrefs.length, 'expected at least one /insights/<slug>/ link on the index').toBeGreaterThan(0);
});

test('article page has h1, canonical, og:image, and reading progress bar', async ({ page }) => {
  await page.goto('/insights/');
  const firstLink = await page.locator('main a[href^="/insights/"][href$="/"]').evaluateAll((links) =>
    links
      .map((link) => link.getAttribute('href'))
      .find((href) => href && href !== '/insights/'),
  );
  expect(firstLink, 'no article link found on insights index').toBeTruthy();

  const resp = await page.goto(firstLink!);
  expect(resp?.status(), `article ${firstLink} returned non-200`).toBe(200);

  await expect(page.locator('h1').first()).toBeVisible();

  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical, 'canonical link missing on article').toBeTruthy();
  expect(canonical).toContain('/insights/');

  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(ogImage, 'og:image missing on article').toBeTruthy();
  expect(ogImage).toMatch(/\/og\//);

  await expect(page.locator('#progress-bar')).toBeAttached();
});
