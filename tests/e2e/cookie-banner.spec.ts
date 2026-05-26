import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321';
const pageUrl = (path: string) => new URL(path, BASE_URL).toString();
const COOKIE_KEY = 'cookie-consent';

test.describe('Cookie banner', () => {
  test('is visible on first load', async ({ page }) => {
    await page.addInitScript((key) => localStorage.removeItem(key), COOKIE_KEY);
    await page.goto(pageUrl('/'));
    await expect(page.locator('#cookie-banner')).toHaveClass(/translate-y-0/);
  });

  test('accept stores consent and hides banner', async ({ page }) => {
    await page.addInitScript((key) => localStorage.removeItem(key), COOKIE_KEY);
    await page.goto(pageUrl('/'));
    const banner = page.locator('#cookie-banner');
    await expect(banner).toHaveClass(/translate-y-0/);

    await page.locator('#cookie-accept').click();

    await expect(banner).toHaveClass(/translate-y-full/);
    await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), COOKIE_KEY)).toBe('accepted');
  });

  test('decline stores consent and hides banner', async ({ page }) => {
    await page.addInitScript((key) => localStorage.removeItem(key), COOKIE_KEY);
    await page.goto(pageUrl('/'));
    const banner = page.locator('#cookie-banner');
    await expect(banner).toHaveClass(/translate-y-0/);

    await page.locator('#cookie-decline').click();

    await expect(banner).toHaveClass(/translate-y-full/);
    await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), COOKIE_KEY)).toBe('declined');
  });

  test('stays hidden after consent is already stored', async ({ page }) => {
    await page.addInitScript((key) => localStorage.setItem(key, 'accepted'), COOKIE_KEY);
    await page.goto(pageUrl('/'));
    await page.waitForTimeout(1200);
    await expect(page.locator('#cookie-banner')).toHaveClass(/translate-y-full/);
  });

  test('does not call analytics before consent', async ({ page }) => {
    const analyticsRequests: string[] = [];
    page.on('request', (request) => {
      const requestUrl = request.url();
      if (
        requestUrl.includes('api-eu.mixpanel.com') ||
        requestUrl.includes('googletagmanager.com') ||
        requestUrl.includes('google-analytics.com')
      ) {
        analyticsRequests.push(requestUrl);
      }
    });

    await page.addInitScript((key) => localStorage.removeItem(key), COOKIE_KEY);
    await page.goto(pageUrl('/'));
    await expect(page.locator('#cookie-banner')).toHaveClass(/translate-y-0/);
    await page.waitForTimeout(700);

    expect(analyticsRequests).toEqual([]);
  });
});
