import { test, expect } from '@playwright/test';

/**
 * The contact page contract.
 *
 * This file used to assert a contact form (#contact-name, #contact-email,
 * #contact-context) and the absence of any Cal.com embed. Both stopped being
 * true when the custom scheduler was replaced by the Cal.com calendar, and
 * nothing caught it: the spec was not in the CI run list. It is now.
 *
 * What the page must do: mount the inline calendar, and keep a route to
 * booking even when the third-party embed cannot load.
 */

const CAL_LINK = 'wojciech-luszczynski/30-minutes';

test.describe('Contact page', () => {
  test('mounts the Cal.com inline calendar', async ({ page }) => {
    await page.goto('/contact/');
    const host = page.locator(`[data-cal-inline="${CAL_LINK}"]`);
    await expect(host, 'inline calendar container missing').toHaveCount(1);
    await expect(host.locator('iframe'), 'calendar iframe never mounted').toHaveCount(1, {
      timeout: 20_000,
    });
  });

  test('offers a booking fallback that survives a blocked embed', async ({ page }) => {
    await page.goto('/contact/');
    // Present in the markup regardless; revealed by CSS when the embed fails.
    const fallback = page.locator('.cal-fallback');
    await expect(fallback, 'fallback booking link missing').toHaveCount(1);
    await expect(fallback).toHaveAttribute('href', new RegExp(`cal\\.com/${CAL_LINK}$`));
  });

  test('keeps LinkedIn as the alternative contact route', async ({ page }) => {
    await page.goto('/contact/');
    await expect(page.locator('a[href*="linkedin.com/in/wojciech"]')).not.toHaveCount(0);
  });

  test('a booking CTA opens the scheduler in place', async ({ page }) => {
    await page.goto('/about/');

    const triggers = page.locator(`a[data-cal-link="${CAL_LINK}"]`);
    expect(await triggers.count(), 'no scheduler trigger on a non-contact page').toBeGreaterThan(0);

    // Desktop shows the header CTA directly. On mobile it lives inside the nav
    // drawer, which is off-screen until opened: the element still reports as
    // visible there, so the drawer has to be opened explicitly rather than
    // relying on a visibility check.
    const isMobile = (page.viewportSize()?.width ?? 1024) < 768;
    if (isMobile) {
      await page.locator('#mobile-nav-open').click();
      await expect(page.locator('#mobile-nav-overlay')).toHaveClass(/translate-x-0/);
    }

    await triggers.locator('visible=true').first().click();

    await expect(page.locator('cal-modal-box'), 'scheduler modal did not open').toHaveCount(1, {
      timeout: 20_000,
    });
    expect(page.url(), 'clicking the trigger should not navigate away').toContain('/about/');
  });
});
