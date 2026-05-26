import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321';
const pageUrl = (path: string) => new URL(path, BASE_URL).toString();

test.describe('Language selector', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(pageUrl('/'));
  });

  test('opens, reports disabled options, closes outside, and reopens', async ({ page }) => {
    const toggle = page.locator('#lang-toggle-desktop');
    const dropdown = page.locator('#lang-dropdown-desktop');

    await expect(dropdown).toHaveClass(/hidden/);

    await toggle.click();
    await expect(dropdown).not.toHaveClass(/hidden/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await expect(dropdown.locator('[role="option"]').filter({ hasText: 'English' })).toHaveAttribute('aria-selected', 'true');

    for (const label of ['Deutsch', 'Dansk', 'Norsk', '日本語']) {
      await expect(dropdown.locator('[role="option"]').filter({ hasText: label })).toHaveAttribute('aria-disabled', 'true');
    }

    await page.mouse.click(20, 20);
    await expect(dropdown).toHaveClass(/hidden/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(dropdown).not.toHaveClass(/hidden/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});
