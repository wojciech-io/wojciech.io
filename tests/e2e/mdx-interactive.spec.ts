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

test.describe('Article widgets', () => {
  test('EmbedDeck shows its slide headings and moves with the buttons', async ({ page }) => {
    await page.goto('/insights/b2b-crm-revenue-operations-system-guide/');
    const deck = page.locator('[data-embed-deck]').first();
    await expect(deck).toHaveAttribute('data-ready', '');
    const active = deck.locator('.w-deck__slide[data-active] .w-deck__heading');
    await expect(active).toContainText('Capture');
    await deck.locator('[data-deck-next]').click();
    await expect(active).toContainText('Enrichment');
    await expect(deck.locator('[data-deck-prev]')).toBeEnabled();
  });

  test('TwoUp renders a titled list per column, not an object', async ({ page }) => {
    await page.goto('/insights/astro-cloudflare-pages-portfolio-ai-workflow/');
    await expect(page.locator('.w-two__pane')).toHaveCount(2);
    await expect(page.locator('.w-two__pane').first().locator('li').first()).toBeVisible();
    await expect(page.locator('body')).not.toContainText('[object Object]');
  });

  // The site uses ClientRouter, so a script that only runs at load goes dead on the next article.
  for (const [path, selector, label] of [
    ['/insights/claude-code-vs-clay/', '[data-copy-btn]', 'CodeBlock copy button'],
    ['/insights/claude-code-vs-clay/', '[data-accordion]', 'Accordion'],
    ['/insights/ai-production-stack/', '[data-tabs]', 'Tabs'],
  ] as const) {
    test(`${label} is wired after a client-side navigation`, async ({ page }) => {
      await page.goto('/insights/');
      await page.evaluate(() => { (window as unknown as { __kept: boolean }).__kept = true; });
      // a programmatic click reaches ClientRouter the same as a tap, and the listing hides some rows
      await page.evaluate((href) => (document.querySelector(`a[href="${href}"]`) as HTMLElement).click(), path);
      await page.waitForURL(`**${path}`);
      const widget = page.locator(selector).first();
      await expect(widget).toHaveAttribute('data-ready', '');
      const sameDocument = await page.evaluate(() => (window as unknown as { __kept?: boolean }).__kept === true);
      expect(sameDocument, 'the navigation should have been client-side').toBe(true);
    });
  }
});
