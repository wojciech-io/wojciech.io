import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Every article widget draws from one stylesheet (packages/mdx-components/styles/widgets.css).
 * Before it did, thirty-odd components each carried their own scoped CSS, so one widget could be
 * rebuilt while its neighbour kept a different border, label style and breakpoint, and nothing
 * noticed. These checks keep the rules from drifting back, one component at a time.
 */

const COMPONENTS_DIR = resolve('./packages/mdx-components/components');
const CSS = readFileSync(resolve('./packages/mdx-components/styles/widgets.css'), 'utf8');

/** Renders an image and has no look of its own. */
const NO_STYLE_NEEDED = new Set(['ContentImage.astro']);

/** Wrappers kept for structure, with no rule of their own. A class that is not here and not in the CSS is a typo. */
const STRUCTURAL = new Set(['w-tldr', 'w-toc__nav', 'w-stack__group', 'w-tools__slot']);

function components(): Array<{ file: string; text: string }> {
  const out: Array<{ file: string; text: string }> = [];
  for (const dir of [COMPONENTS_DIR, join(COMPONENTS_DIR, 'diagrams')]) {
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.astro')) continue;
      // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal
      // file is a plain filename from readdirSync over a constant directory.
      out.push({ file, text: readFileSync(join(dir, file), 'utf8') });
    }
  }
  return out;
}

const all = components();

describe('widgets.css', () => {
  it('finds the components to check', () => {
    expect(all.length).toBeGreaterThan(40);
  });

  it('is imported by every widget, directly or through Figures', () => {
    const missing = all
      .filter(({ file }) => !NO_STYLE_NEEDED.has(file))
      .filter(({ text }) => !/widgets\.css/.test(text) && !/from\s+['"]\.\/Figures\.astro['"]/.test(text))
      .map(({ file }) => file);
    expect(missing).toEqual([]);
  });

  it('leaves no component with a style block of its own', () => {
    expect(all.filter(({ text }) => /<style[\s>]/i.test(text)).map(({ file }) => file)).toEqual([]);
  });

  it('leaves no Tailwind arbitrary-value utility in a widget', () => {
    const offenders = all
      .filter(({ text }) => /class(?::list)?=[^>]*\b[a-z][a-z-]*-\[[^\]]+\]/.test(text))
      .map(({ file }) => file);
    expect(offenders).toEqual([]);
  });

  it('starts every widget script on astro:page-load', () => {
    // A script that runs once at load goes dead after a client-side navigation to another article.
    const offenders = all
      .filter(({ text }) => /<script[\s>]/i.test(text) && !/astro:page-load/.test(text))
      .map(({ file }) => file);
    expect(offenders).toEqual([]);
  });

  it('defines every w- class a component uses', () => {
    // Class names the sheet defines, read once with a literal pattern; matching is plain string work after that.
    const defined = new Set((CSS.match(/\.w-[a-z0-9_-]+/g) ?? []).map((c) => c.slice(1)));
    // a block root (w-shot) counts as defined when any of its parts (.w-shot__window) is
    const isDefined = (token: string) =>
      STRUCTURAL.has(token) ||
      defined.has(token) ||
      [...defined].some((d) => d.startsWith(`${token}__`) || d.startsWith(`${token}--`));
    const undefinedClasses: string[] = [];
    for (const { file, text } of all) {
      for (const token of new Set(text.match(/\bw-[a-z0-9]+(?:__[a-z0-9]+)?(?:--[a-z0-9]+)?\b/g) ?? [])) {
        if (!isDefined(token)) undefinedClasses.push(`${file}: ${token}`);
      }
    }
    expect(undefinedClasses).toEqual([]);
  });

  it('lays out with container queries, not viewport breakpoints', () => {
    // The one exception places an article's margin notes against the page margin, so it keys off the viewport.
    const mediaQueries = [...CSS.matchAll(/@media\s*([^{]+)\{/g)].map((m) => m[1].trim());
    const viewport = mediaQueries.filter((q) => !/prefers-reduced-motion/.test(q));
    expect(viewport).toEqual(['(min-width: 1100px)']);
  });
});

/**
 * The visual rules in DESIGN.md that a stylesheet can break without any test noticing. Each one is a tell of a
 * generated site: a filled rounded card, an accent bar down the left edge, a font weight that is not loaded
 * (the browser fakes it), the serif creeping into body text.
 */
describe('widgets.css visual rules', () => {
  // Every rule as { selector, body }. Nested at-rules are fine: the pattern only matches innermost blocks.
  const rules = [...CSS.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ selector: m[1].trim(), body: m[2] }));

  it('has no radius above 8px except pills and circles', () => {
    const offenders: string[] = [];
    for (const { selector, body } of rules) {
      for (const [, value] of body.matchAll(/border-radius:\s*([^;]+);/g)) {
        const v = value.trim();
        if (['0', 'inherit', '50%', '999px', '9999px'].includes(v)) continue;
        const rem = /^([\d.]+)rem$/.exec(v);
        const px = /^([\d.]+)px$/.exec(v);
        const px8 = rem ? Number(rem[1]) * 16 : px ? Number(px[1]) : Infinity;
        if (px8 > 8) offenders.push(`${selector} { border-radius: ${v} }`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('draws no accent bar down the left edge of a box', () => {
    expect(CSS).not.toMatch(/inset\s+3px\s+0\s+0/);
  });

  it('uses only font weights that are loaded', () => {
    const weights = new Set([...CSS.matchAll(/font-weight:\s*([^;]+);/g)].map((m) => m[1].trim()));
    expect([...weights].filter((w) => !['400', '600', 'inherit', 'normal'].includes(w))).toEqual([]);
  });

  it('keeps the serif to figures, step numerals, side titles, quotes and deck headings', () => {
    const allowed = ['w-fig__value', 'w-rail', 'w-versus', 'w-delta__value', 'w-hero__value', 'w-ticker__value', 'w-quote__text', 'w-deck__heading'];
    const offenders = rules
      .filter(({ body }) => /font-family:\s*var\(--w-serif\)/.test(body))
      .map(({ selector }) => selector)
      .filter((selector) => !allowed.some((stem) => selector.includes(stem)));
    expect(offenders).toEqual([]);
  });
});
