import { test, expect } from '@playwright/test';

/**
 * Verifies that locale homepage sections render translated headings
 * instead of hardcoded English. Checks eyebrows and h2 text in
 * ProjectsSection, AILeverage, InsightsPreview, TestimonialsSection.
 */

const LOCALE_SECTIONS = [
  {
    path: '/de/',
    work: 'Ausgewählte Projekte',
    ai: 'AI-Systeme',
    writing: 'Texte',
    testimonials: 'Referenzen',
  },
  {
    path: '/pl/',
    work: 'Wybrane projekty',
    ai: 'Systemy AI',
    writing: 'Artykuły',
    testimonials: 'Rekomendacje',
  },
  {
    path: '/jp/',
    work: '実績',
    ai: 'AIシステム',
    writing: '記事',
    testimonials: '推薦の声',
  },
  {
    path: '/it/',
    work: 'Lavori selezionati',
    ai: 'Sistemi AI',
    writing: 'Articoli',
    testimonials: 'Testimonianze',
  },
] as const;

for (const loc of LOCALE_SECTIONS) {
  test(`${loc.path} has translated section eyebrows`, async ({ page }) => {
    await page.goto(loc.path);
    const body = await page.textContent('body');
    expect(body, `work eyebrow on ${loc.path}`).toContain(loc.work);
    expect(body, `ai eyebrow on ${loc.path}`).toContain(loc.ai);
    expect(body, `writing eyebrow on ${loc.path}`).toContain(loc.writing);
    expect(body, `testimonials eyebrow on ${loc.path}`).toContain(loc.testimonials);
  });
}

test('EN homepage still uses English section headings', async ({ page }) => {
  await page.goto('/');
  const body = await page.textContent('body');
  expect(body).toContain('Selected work');
  expect(body).toContain('AI systems');
  expect(body).toContain('Writing');
  expect(body).toContain('Testimonials');
});
