import { beforeAll, describe, expect, it } from 'vitest';
import { alternates, html, linkHref, requireDist } from './helpers';

/** Ported from tests/e2e/hreflang.spec.ts: same expectations, no browser. */

const EXPECTED_HOME_ALTERNATES: Array<[string, string]> = [
  ['x-default', 'https://wojciech.io/'],
  ['en', 'https://wojciech.io/'],
  ['de-DE', 'https://wojciech.io/de/'],
  ['da-DK', 'https://wojciech.io/dk/'],
  ['nb-NO', 'https://wojciech.io/no/'],
  ['ja-JP', 'https://wojciech.io/jp/'],
  ['it-IT', 'https://wojciech.io/it/'],
  ['es-ES', 'https://wojciech.io/es/'],
  ['pl', 'https://wojciech.io/pl/'],
  ['ar', 'https://wojciech.io/ar/'],
];

const EXPECTED_ABOUT_ALTERNATES: Array<[string, string]> = [
  ['x-default', 'https://wojciech.io/about/'],
  ['en', 'https://wojciech.io/about/'],
  ['de-DE', 'https://wojciech.io/de/about/'],
  ['da-DK', 'https://wojciech.io/dk/about/'],
  ['nb-NO', 'https://wojciech.io/no/about/'],
  ['ja-JP', 'https://wojciech.io/jp/about/'],
  ['it-IT', 'https://wojciech.io/it/about/'],
  ['es-ES', 'https://wojciech.io/es/about/'],
  ['pl', 'https://wojciech.io/pl/about/'],
];

const EXPECTED_CV_ALTERNATES: Array<[string, string]> = [
  ['x-default', 'https://wojciech.io/cv/'],
  ['en', 'https://wojciech.io/cv/'],
  ['pl', 'https://wojciech.io/pl/cv/'],
  ['de-DE', 'https://wojciech.io/de/cv/'],
  ['da-DK', 'https://wojciech.io/dk/cv/'],
  ['nb-NO', 'https://wojciech.io/no/cv/'],
  ['ja-JP', 'https://wojciech.io/jp/cv/'],
  ['it-IT', 'https://wojciech.io/it/cv/'],
  ['es-ES', 'https://wojciech.io/es/cv/'],
];

const pathOf = (href: string) => new URL(href).pathname;

describe('hreflang alternates', () => {
  beforeAll(requireDist);

  it('canonical on an EN page points to root, never /en/', () => {
    const canonical = linkHref(html('/about/'), 'canonical');
    expect(canonical).toMatch(/wojciech\.io\/about\/?$/);
    expect(canonical).not.toMatch(/\/en\//);
  });

  it('homepage emits the localized home alternate set', () => {
    expect(alternates(html('/'))).toEqual(EXPECTED_HOME_ALTERNATES);
  });

  it('localized home pages point back to the same alternate set', () => {
    const localized = EXPECTED_HOME_ALTERNATES.filter(
      ([lang]) => lang !== 'x-default' && lang !== 'en',
    );
    for (const [, href] of localized) {
      const path = pathOf(href);
      expect(alternates(html(path)), `alternates on ${path}`).toEqual(EXPECTED_HOME_ALTERNATES);
    }
  });

  it('localized content pages preserve the current page in their alternates', () => {
    for (const [, href] of EXPECTED_ABOUT_ALTERNATES) {
      const path = pathOf(href);
      expect(alternates(html(path)), `alternates on ${path}`).toEqual(EXPECTED_ABOUT_ALTERNATES);
    }
  });

  it('CV pages emit the full localized CV set', () => {
    for (const [, href] of EXPECTED_CV_ALTERNATES) {
      const path = pathOf(href);
      expect(alternates(html(path)), `alternates on ${path}`).toEqual(EXPECTED_CV_ALTERNATES);
    }
  });
});
