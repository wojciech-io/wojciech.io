import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Every landing hero once carried its own clamp(): 4.4rem at weight 400 on the
// home page, 5rem on /apps/academy, 6rem on /apps/notch, an inline 4rem at
// weight 700 on /subscribe. Headings now size from two tokens only:
// --text-hero for landing heroes and --text-h1 for ordinary pages.
const SRC = 'src';
const AD_HOC_SIZE = [
  /text-\[clamp\(/, // per-page fluid size
  /text-\[\d+(\.\d+)?(rem|px|em)\]/, // fixed arbitrary size
  /\btext-[4-9]xl\b/, // Tailwind display sizes
  /style="[^"]*font-size/, // inline size
];

function astroFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return astroFiles(path);
    return path.endsWith('.astro') ? [path] : [];
  });
}

const headings = astroFiles(SRC).flatMap((file) =>
  [...readFileSync(file, 'utf-8').matchAll(/<h1\b[^>]*>/g)].map((m) => ({
    file: relative('.', file),
    tag: m[0],
  })),
);

describe('h1 sizes come from the type tokens', () => {
  it('finds headings to check', () => {
    expect(headings.length).toBeGreaterThan(20);
  });

  it.each(headings)('$file', ({ file, tag }) => {
    const offender = AD_HOC_SIZE.find((re) => re.test(tag));
    expect(
      offender,
      `${file}: h1 sets its own size (${tag.slice(0, 120)}). Use var(--text-hero) or var(--text-h1).`,
    ).toBeUndefined();
  });
});
