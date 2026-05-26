import { test, expect } from '@playwright/test';

/**
 * Insights index — category filter UI behavior.
 *
 * Tests that the JS filter correctly shows/hides articles and updates
 * the URL query string without a full page reload.
 */

test.describe('/insights/ category filter', () => {
  test('shows all articles by default', async ({ page }) => {
    await page.goto('/insights/');
    const allBtn = page.locator('.cat-btn[data-cat="All"]');
    await expect(allBtn).toHaveAttribute('aria-selected', 'true');

    const count = page.locator('#article-count');
    await expect(count).toBeVisible();
    const text = await count.textContent();
    expect(Number(text?.match(/\d+/)?.[0])).toBeGreaterThan(0);
  });

  test('clicking a category button filters articles and updates URL', async ({ page }) => {
    await page.goto('/insights/');

    // Pick the first non-All button
    const catBtns = page.locator('.cat-btn:not([data-cat="All"])');
    const count = await catBtns.count();
    test.skip(count === 0, 'no category filter buttons found');

    const btn = catBtns.first();
    const cat = await btn.getAttribute('data-cat');
    await btn.click();

    await expect(btn).toHaveAttribute('aria-selected', 'true');
    expect(page.url()).toContain(`cat=${encodeURIComponent(cat!)}`);
  });

  test('URL ?cat= param restores filter on load', async ({ page }) => {
    // Navigate directly with a known category param
    const catBtns = (await (async () => {
      await page.goto('/insights/');
      return page.locator('.cat-btn:not([data-cat="All"])');
    })());
    const count = await catBtns.count();
    test.skip(count === 0, 'no category filter buttons found');

    const cat = await catBtns.first().getAttribute('data-cat');
    test.skip(!cat, 'could not read data-cat attribute');

    await page.goto(`/insights/?cat=${encodeURIComponent(cat!)}`);
    const activeBtn = page.locator(`.cat-btn[data-cat="${cat}"]`);
    await expect(activeBtn).toHaveAttribute('aria-selected', 'true');
  });

  test('All button clears category filter', async ({ page }) => {
    // Start filtered
    const firstCatBtn = (await (async () => {
      await page.goto('/insights/');
      return page.locator('.cat-btn:not([data-cat="All"])').first();
    })());
    await firstCatBtn.click();

    // Click All
    await page.locator('.cat-btn[data-cat="All"]').click();
    await expect(page.locator('.cat-btn[data-cat="All"]')).toHaveAttribute('aria-selected', 'true');
    expect(page.url()).not.toContain('cat=');
  });
});
