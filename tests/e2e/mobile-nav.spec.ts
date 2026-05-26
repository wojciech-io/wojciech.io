import { test, expect, type Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321';
const pageUrl = (path: string) => new URL(path, BASE_URL).toString();

async function openMobileNav(page: Page) {
  await page.locator('#mobile-nav-open').click();
  await expect(page.locator('#mobile-nav-overlay')).toHaveClass(/translate-x-0/);
  await expect(page.locator('#mobile-nav-open')).toHaveAttribute('aria-expanded', 'true');
}

test.describe('Mobile nav', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(pageUrl('/'));
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
