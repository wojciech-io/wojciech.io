import { test, expect } from '@playwright/test';

test.describe('Contact page', () => {
  test('renders contact form with all fields', async ({ page }) => {
    await page.goto('/contact/');
    await expect(page.locator('h1')).toContainText('Build, fix, or review');
    await expect(page.locator('#contact-name')).toBeVisible();
    await expect(page.locator('#contact-email')).toBeVisible();
    await expect(page.locator('#contact-context')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Send message');
  });

  test('form fields have correct types and required attribute', async ({ page }) => {
    await page.goto('/contact/');
    const name = page.locator('#contact-name');
    const email = page.locator('#contact-email');
    const message = page.locator('#contact-context');

    await expect(name).toHaveAttribute('required', '');
    await expect(email).toHaveAttribute('type', 'email');
    await expect(email).toHaveAttribute('required', '');
    await expect(message).toHaveAttribute('required', '');
  });

  test('LinkedIn link is present', async ({ page }) => {
    await page.goto('/contact/');
    const linkedinLink = page.locator('a[href*="linkedin.com/in/wojciech"]');
    await expect(linkedinLink.first()).toBeVisible();
  });

  test('no Cal.com embed present', async ({ page }) => {
    await page.goto('/contact/');
    await expect(page.locator('#cal-inline')).toHaveCount(0);
    const calScript = page.locator('script[src*="cal.com"]');
    await expect(calScript).toHaveCount(0);
  });
});
