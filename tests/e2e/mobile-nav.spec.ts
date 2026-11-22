import { test, expect, type Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321';
const pageUrl = (path: string) => new URL(path, BASE_URL).toString();

async function openMobileNav(page: Page) {
  await page.locator('#mobile-nav-open').click();
  await expect(page.locator('#mobile-nav-overlay')).toHaveClass(/translate-x-0/);
  await expect(page.locator('#mobile-nav-open')).toHaveAttribute('aria-expanded', 'true');
}

// The site header and its hamburger live on every page that uses Layout.astro.
// The home page (`/`) is built from the /revolution/ preview and has its own
// menu, covered by the separate describe block at the bottom.
test.describe('Mobile nav', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(pageUrl('/about/'));
  });

  test('opens when hamburger is clicked', async ({ page }) => {
    await openMobileNav(page);
    await expect(page.locator('#mobile-nav-overlay')).toHaveAttribute('aria-hidden', 'false');
  });

  test('closes when close button is clicked', async ({ page }) => {
    await openMobileNav(page);
    await page.locator('#mobile-nav-close').click();
    await expect(page.locator('#mobile-nav-overlay')).toHaveClass(/translate-x-full/);
    await expect(page.locator('#mobile-nav-open')).toHaveAttribute('aria-expanded', 'false');
  });

  test('closes when Escape is pressed', async ({ page }) => {
    await openMobileNav(page);
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-nav-overlay')).toHaveClass(/translate-x-full/);
    await expect(page.locator('#mobile-nav-open')).toHaveAttribute('aria-expanded', 'false');
  });

  test('closes when a nav link is clicked', async ({ page }) => {
    await openMobileNav(page);
    await page.locator('#mobile-nav-overlay .mobile-nav-link[href="/work/"]').click();
    await page.waitForURL(/\/work\/$/);
    await expect(page.locator('#mobile-nav-overlay')).toHaveClass(/translate-x-full/);
    await expect(page.locator('#mobile-nav-open')).toHaveAttribute('aria-expanded', 'false');
  });

  test('locks body scroll while open', async ({ page }) => {
    await openMobileNav(page);
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await page.locator('#mobile-nav-close').click();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
  });
});

test.describe('Home menu (built from the preview)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(pageUrl('/'));
  });

  test('opens from the Menu button and closes with Escape', async ({ page }) => {
    const menu = page.locator('#mn');
    await expect(menu).toHaveAttribute('aria-hidden', 'true');
    await page.getByRole('button', { name: 'Menu' }).first().click();
    await expect(menu).toHaveAttribute('aria-hidden', 'false');
    // The menu ignores keys while its mask animation runs, so retry until it
    // has finished opening and takes the Escape.
    await expect(async () => {
      await page.keyboard.press('Escape');
      await expect(menu).toHaveAttribute('aria-hidden', 'true', { timeout: 1500 });
    }).toPass({ timeout: 8000 });
  });

  test('lists the existing language homes as links', async ({ page }) => {
    for (const code of ['pl', 'de', 'es', 'it', 'dk', 'no', 'jp', 'ar']) {
      await expect(page.locator(`#mn a[href="/${code}/"]`)).toHaveCount(1);
    }
  });
});
