import { test, expect } from '@playwright/test';

/**
 * Verifies that interactive MDX components render and function
 * on articles that use them.
 */

test.describe('Interactive MDX components', () => {
  test('CodeBlock renders with copy button on claude-code-vs-clay', async ({ page }) => {
    await page.goto('/insights/claude-code-vs-clay/');
    const codeBlock = page.locator('[data-code-block]').first();
    await expect(codeBlock).toBeVisible();
    const copyBtn = codeBlock.locator('button');
    await expect(copyBtn).toBeVisible();
  });

  test('Accordion renders and expands on claude-code-vs-clay', async ({ page }) => {
    await page.goto('/insights/claude-code-vs-clay/');
    const accordion = page.locator('[data-accordion]');
    await expect(accordion).toBeVisible();
    const firstItem = accordion.locator('details').first();
    await expect(firstItem).toBeVisible();
  });

  test('Tabs render on ai-production-stack', async ({ page }) => {
    await page.goto('/insights/ai-production-stack/');
    const tabs = page.locator('[data-tabs]');
    await expect(tabs).toBeVisible();
    const tabButtons = tabs.locator('[data-tab-index]');
    const count = await tabButtons.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('Tabs switch content on click', async ({ page }) => {
    await page.goto('/insights/ai-production-stack/');
    const tabs = page.locator('[data-tabs]').first();
    const tabButtons = tabs.locator('[data-tab-index]');

    await tabButtons.nth(1).click();
    await expect(tabButtons.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(tabButtons.nth(0)).toHaveAttribute('aria-selected', 'false');
  });

  // A fifth test used to assert all three components on
  // /insights/component-showcase/. That page was never generated: the insights
  // route filters on `!draft` unconditionally, and the showcase entry carried
  // `draft: true`, so it resolved to a 404 in dev, preview and production
  // alike. The test only ever "passed" because it was not wired into CI.
  // Tabs, Accordion and CodeBlock are each covered above on real articles, so
  // the assertion is gone along with its fixture rather than restored.
});
