import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Headings used to set their own size, weight, leading and tracking: five hero
// sizes, section headings at weight 400 on the home page and 600 elsewhere, a
// clamp() per page. They now take a type role (t-display, t-h1, t-h2, t-h3,
// defined in global.css) and nothing that competes with it.
const ROLE = /^t-(display|h1|h2|h3)$/;
const COMPETING = [
  /^((sm|md|lg|xl):)?text-(xs|sm|base|lg|xl|[2-9]xl)$/,
  /^((sm|md|lg|xl):)?text-fluid-/,
  /^text-\[(length:|clamp|\d)/,
  /^((sm|md|lg|xl):)?font-(thin|light|normal|medium|semibold|bold|black)$/,
  /^((sm|md|lg|xl):)?leading-/,
  /^((sm|md|lg|xl):)?tracking-/,
];

function astroFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return astroFiles(path);
    return path.endsWith('.astro') ? [path] : [];
  });
}

// The CV is a printable A4 document (noindex) with its own print type scale.
const EXEMPT = ['src/components/pages/CvDocument.astro', 'src/pages/ar/cv.astro'];

const headings = astroFiles('src')
  .filter((file) => !EXEMPT.includes(relative('.', file)))
  .flatMap((file) =>
  [...readFileSync(file, 'utf-8').matchAll(/<(h1|h2)\b[^>]*>/g)].flatMap((m) => {
    const cls = m[0].match(/\sclass="([^"]*)"/);
    if (!cls) return [];
    return [{ file: relative('.', file), tag: m[0].replace(/\s+/g, ' '), classes: cls[1].split(/\s+/) }];
  }),
);

describe('h1 and h2 take a type role', () => {
  it('finds headings to check', () => {
    expect(headings.length).toBeGreaterThan(40);
  });

  it.each(headings)('$file', ({ file, tag, classes }) => {
    const role = classes.find((c) => ROLE.test(c));
    const competing = classes.filter((c) => COMPETING.some((re) => re.test(c)));
    expect(role, `${file}: ${tag.slice(0, 110)} has no t-display / t-h1 / t-h2 / t-h3`).toBeDefined();
    expect(competing, `${file}: ${tag.slice(0, 110)} overrides its role`).toEqual([]);
  });
});
