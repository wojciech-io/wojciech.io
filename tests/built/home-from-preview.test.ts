import { describe, it, expect, beforeAll } from 'vitest';
import { html, jsonLd, requireDist, text } from './helpers';

/**
 * `/` is built from the static preview at public/revolution/index.html (see
 * src/lib/revolutionHome.ts). The preview is written to live under
 * /revolution/, so anything it leaves relative would 404 at `/`, and anything
 * it carries for itself (noindex, "Soon" language pills) must not reach the
 * public page. This reads the built home and fails on either.
 */

let home = '';

beforeAll(() => {
  requireDist();
  home = html('/');
});

describe('home page built from the preview', () => {
  it('leaves no relative URL in src, href, poster, srcset or url()', () => {
    const bad = new Set<string>();
    const absolute = /^(\/|#|https?:|mailto:|tel:|data:|javascript:|blob:|%23)/;

    for (const m of home.matchAll(/\b(?:src|href|poster|data-src|data-poster)="([^"]*)"/g)) {
      const v = m[1];
      // Empty values and template placeholders inside script text.
      if (v === '' || absolute.test(v) || /^['"+\s]/.test(v) || /['"]$/.test(v)) continue;
      bad.add(v);
    }
    for (const m of home.matchAll(/\bsrcset="([^"]*)"/g)) {
      for (const part of m[1].split(',')) {
        const v = part.trim().split(/\s+/)[0];
        if (v && !absolute.test(v)) bad.add(`srcset ${v}`);
      }
    }
    for (const m of home.matchAll(/url\(\s*(['"]?)([^)'"]+)\1\s*\)/g)) {
      if (!absolute.test(m[2])) bad.add(`url(${m[2]})`);
    }

    expect([...bad].slice(0, 10), 'relative URLs would 404 at /').toEqual([]);
  });

  it('serves preview files from /revolution/ and links no page as *.html relative', () => {
    expect(home).toContain('/revolution/assets/');
    expect(home).not.toMatch(/href="(?:\.\/)?(?:gtm|marketing|growth|about|work|insights|newsletter|privacy|index)\.html/);
  });

  it('is indexable and carries the SEO head SEOHead owns', () => {
    expect(home).not.toMatch(/<meta[^>]+name="robots"[^>]+noindex/i);
    expect(home.match(/<link rel="canonical"/g)).toHaveLength(1);
    expect(home).toContain('<link rel="canonical" href="https://wojciech.io/">');
    expect(home.match(/<title>[^<]*<\/title>/)?.[0]).toBe(
      '<title>Wojciech Luszczynski · AI-native GTM operator · wojciech.io</title>',
    );
    expect(home.match(/<link[^>]+rel="alternate"[^>]+hreflang=/g)).toHaveLength(10);
    expect(home).toMatch(/<meta property="og:image" content="https:\/\/wojciech\.io\//);
    expect(jsonLd(home)).toHaveLength(3);
  });

  it('turns the "Soon" languages into links to the existing homes', () => {
    expect(home).not.toMatch(/Soon<\/em>|· Soon"/);
    for (const code of ['pl', 'de', 'es', 'it', 'dk', 'no', 'jp', 'ar']) {
      expect(home, `language link /${code}/`).toContain(`href="/${code}/"`);
    }
  });

  it('wires consent and click tracking', () => {
    expect(home).toContain('id="cookie-banner"');
    expect(home).toMatch(/data-mp-cta="Book a call"/);
    expect(home).toMatch(/data-mp-cta="AI Espresso"/);
  });
});

describe('Cal.com booking frame', () => {
  it('is allowed by the CSP in public/_headers and in the generated headers', () => {
    const headers = text('/_headers');
    const csp = headers.split('\n').find((l) => l.includes('Content-Security-Policy')) ?? '';
    expect(csp).toMatch(/frame-src[^;]*https:\/\/cal\.com(?:[\s;]|$)/);
  });
});
