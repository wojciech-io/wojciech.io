import { test, expect } from '@playwright/test';

// Polish diacritics in the name belong to the Polish pages only. Everywhere
// else (title, nav, captions, schema, footer) it is the Latin spelling.
const NON_PL = ['/', '/about/', '/insights/', '/subscribe/', '/de/', '/it/', '/ar/', '/insights/claude-code-vs-clay/'];
const PL = ['/pl/'];

for (const path of NON_PL) {
  test(`latin spelling on ${path}`, async ({ request }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'HTML check, one project is enough.');
    const html = await (await request.get(path)).text();
    expect(html.includes('Łuszczyński'), `${path} contains "Łuszczyński"`).toBe(false);
    expect(html).toContain('Luszczynski');
  });
}

for (const path of PL) {
  test(`polish spelling on ${path}`, async ({ request }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'HTML check, one project is enough.');
    const html = await (await request.get(path)).text();
    expect(html).toContain('Łuszczyński');
  });
}
