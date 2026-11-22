/**
 * The public home page (`/`) is built from the static preview at
 * `public/revolution/index.html`, so a change to the preview reaches `/` with
 * no copying.
 *
 * The preview is a finished document written to live under /revolution/: its
 * asset and page links are relative, its <head> says noindex and carries no
 * canonical, hreflang, social tags, analytics or consent. This module turns it
 * into the two pieces `layouts/RevolutionLayout.astro` needs:
 *
 *   headHtml  what the preview's own <head> contributes (styles, the colour-mode
 *             script, the g22 stylesheet). Everything SEO-ish is dropped here
 *             because SEOHead emits it for `/`.
 *   bodyHtml  the preview body, with paths and links made absolute.
 *
 * It changes mechanics only: no copy, no markup structure, no CSS. Every
 * assumption is asserted, so a preview change that breaks one fails the build
 * with a message instead of shipping a broken home page.
 */

/** One entry of `homeAlternates` (src/data/locales.ts). */
export interface HomeAlternate {
  lang: string;
  href: string;
}

export interface RevolutionHome {
  headHtml: string;
  bodyHtml: string;
}

/** Where the preview's own files are served from. */
const BASE = '/revolution';

/** Preview pages that have a canonical counterpart on the existing site. */
const PAGE_LINKS: Record<string, string> = {
  'index.html': '/',
  'gtm.html': '/gtm/',
  'marketing.html': '/marketing/',
  'growth.html': '/growth/',
  'about.html': '/about/',
  'work.html': '/work/',
  'insights.html': '/insights/',
  'newsletter.html': '/subscribe/',
  'privacy.html': '/privacy/',
  // Nothing equivalent on the existing site; the preview page works and is
  // accurate once `/` carries the banner and analytics.
  'cookies.html': `${BASE}/cookies.html`,
};

/** Sub-pages of the preview with no counterpart yet (apps, case pages). */
const PREVIEW_SUBPAGE = /^(apps|work)\/([\w-]+)\.html(#.*)?$/;

/** Head nodes of the preview that SEOHead (or the layout) emits for `/`. */
const DROP_FROM_HEAD: RegExp[] = [
  /^<meta\s+charset=/i,
  /^<meta\s+name="viewport"/i,
  /^<meta\s+name="robots"/i,
  /^<title[\s>]/i,
  /^<meta\s+name="description"/i,
  /^<meta\s+property="og:/i,
  /^<meta\s+name="twitter:/i,
  /^<meta\s+name="apple-mobile-web-app-title"/i,
  /^<link\s+rel="(?:icon|apple-touch-icon|manifest|canonical|alternate)"/i,
  /^<!--/,
];

const HEAD_NODE =
  /<!--[\s\S]*?-->|<style\b[^>]*>[\s\S]*?<\/style\b[^>]*>|<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>|<title\b[^>]*>[\s\S]*?<\/title\b[^>]*>|<(?:meta|link|base)\b[^>]*>/gi;

/** Visible text of a fragment: everything outside `<...>`. Used for comparisons only, never emitted. */
function textOf(html: string): string {
  let out = '';
  let inTag = false;
  for (const ch of html) {
    if (ch === '<') inTag = true;
    else if (ch === '>') inTag = false;
    else if (!inTag) out += ch;
  }
  return out.trim();
}

function fail(message: string): never {
  throw new Error(`revolutionHome: ${message}`);
}

function between(html: string, open: string, close: string, from = 0): [number, number] {
  const a = html.indexOf(open, from);
  if (a < 0) fail(`preview has no ${open}`);
  const start = a + open.length;
  const end = html.indexOf(close, start);
  if (end < 0) fail(`preview has no ${close}`);
  return [start, end];
}

/** `assets/`, `fonts/`, `vendor/` -> `/revolution/…`, in attributes, url() and JS strings. */
function absolutizeAssets(html: string): string {
  return html.replace(/(["'`(])(assets|fonts|vendor)\//g, `$1${BASE}/$2/`);
}

function mapHref(href: string): string | null {
  const [path, hash = ''] = href.split(/(?=#)/);
  const bare = path.replace(/^\.\//, '');
  if (bare in PAGE_LINKS) return PAGE_LINKS[bare] + hash;
  const sub = PREVIEW_SUBPAGE.exec(bare + hash);
  if (sub) return `${BASE}/${sub[1]}/${sub[2]}.html${sub[3] ?? ''}`;
  return null;
}

/** `foo.html` links -> absolute page URLs. Unknown ones fail the build. */
function absolutizePageLinks(html: string): string {
  return html.replace(/\bhref="([^"]+)"/g, (whole, href: string) => {
    if (!/\.html(#|$)/.test(href) || /^(https?:)?\/\//.test(href)) return whole;
    const next = mapHref(href);
    if (next === null) fail(`no target for the preview link href="${href}"; add it to PAGE_LINKS`);
    return `href="${next}"`;
  });
}

/**
 * The preview marks every locale it has no translation for as "Soon". Those
 * translations exist on the live site (the existing /pl/, /de/ … homes), so the
 * entries become real links to them. `localeHomes` comes from `homeAlternates`.
 */
function linkLocales(html: string, localeHomes: Map<string, string>): string {
  let linked = 0;
  // Language pill popover: <span class="soon" lang="pl" aria-disabled="true"><b>PL</b><span>Polski</span><em>Soon</em></span>
  let out = html.replace(
    /<span class="soon" lang="([\w-]+)" aria-disabled="true">(<b>[A-Z]{2}<\/b><span>[^<]*<\/span>)<em>Soon<\/em><\/span>/g,
    (whole, lang: string, inner: string) => {
      const path = localeHomes.get(lang);
      if (!path) return whole;
      linked += 1;
      return `<a href="${path}" hreflang="${lang}" lang="${lang}" data-lang="${path.replace(/\//g, '')}">${inner}<em></em></a>`;
    },
  );
  // Language row in the menu: <span lang="pl" title="Polski · Soon" aria-disabled="true">PL</span>
  out = out.replace(
    /<span lang="([\w-]+)" title="([^"]*?) · Soon" aria-disabled="true">([A-Z]{2})<\/span>/g,
    (whole, lang: string, name: string, code: string) => {
      const path = localeHomes.get(lang);
      if (!path) return whole;
      linked += 1;
      return `<a href="${path}" hreflang="${lang}" lang="${lang}" data-lang="${path.replace(/\//g, '')}" title="${name}">${code}</a>`;
    },
  );
  if (linked === 0) fail('found no "Soon" language entries to link; the preview language markup changed');
  if (/class="soon"|aria-disabled="true"><b>|Soon<\/em>/.test(out)) {
    fail('a language entry is still marked "Soon"; homeAlternates has no home for it');
  }
  return out;
}

/**
 * The preview's page curtain only runs for links matching a `*.html` pattern.
 * Links are absolute now, so the pattern follows them and the curtain still
 * plays on page links (hash links and external links stay excluded, as before).
 */
function keepPageCurtain(html: string): string {
  const old = String.raw`/^(\.\.\/)?([a-z]{2}\/)?[\w-]+\.html(#.*)?$/`;
  const count = html.split(old).length - 1;
  if (count !== 1) fail(`expected the page-curtain link pattern once, found ${count}`);
  return html.replace(old, String.raw`/^\/[\w\/-]*(\.html)?(#.*)?$/`);
}

/**
 * Tag the booking and newsletter CTAs for the shared click tracking
 * (ConsentAnalytics.astro). Labels and locations follow the site header and
 * CTA band: header, mobile_nav, cta_band. Where the preview has no counterpart
 * the link is left untagged rather than invented.
 */
function tagCtas(body: string): string {
  const at = (needle: string) => {
    const i = body.indexOf(needle);
    if (i < 0) fail(`preview body has no ${needle}`);
    return i;
  };
  const main = at('<main');
  const book = at('id="book"');
  const bk = at('id="bk"');
  const menu = at('id="mn"');
  if (!(main < book && book < bk && bk < menu)) {
    fail('preview landmarks changed order (expected main < #book < #bk < #mn)');
  }
  const location = (pos: number): string => {
    if (pos < main) return 'header';
    if (pos >= menu) return 'mobile_nav';
    if (pos >= book && pos < bk) return 'cta_band';
    return fail(`a "Book a call" link sits outside the header, footer band and menu (offset ${pos})`);
  };

  let booking = 0;
  let espresso = 0;
  // One pass over the original string, so every offset above stays valid.
  const out = body.replace(/<a\b([^>]*)>([\s\S]*?)<\/a\b[^>]*>/g, (whole, attrs: string, inner: string, pos: number) => {
    const text = textOf(inner);
    if (/\bhref="#book"/.test(attrs) && /^book a call/i.test(text)) {
      booking += 1;
      return `<a${attrs} data-mp-cta="Book a call" data-mp-location="${location(pos)}">${inner}</a>`;
    }
    // Newsletter link in the menu, named "AI Espresso" like the site's mobile nav.
    // Matched by target, not label: the preview has called it both "Newsletter"
    // and "AI Espresso".
    if (/\bhref="newsletter\.html"/.test(attrs) && pos >= menu && text !== '') {
      espresso += 1;
      return `<a${attrs} data-mp-cta="AI Espresso" data-mp-location="mobile_nav">${inner}</a>`;
    }
    return whole;
  });
  if (booking === 0) fail('found no "Book a call" links to tag');
  if (espresso === 0) fail('found no newsletter link in the menu to tag');
  return out;
}

/** Relative URLs that would 404 at `/` are a build error, not a surprise in production. */
function assertNoRelativeUrls(html: string, where: string): void {
  const bad = new Set<string>();
  for (const m of html.matchAll(/\b(?:src|href|poster|data-src|data-poster)="([^"]*)"/g)) {
    const v = m[1];
    if (v === '' || /^(\/|#|https?:|mailto:|tel:|data:|javascript:|blob:)/.test(v)) continue;
    // Template placeholders inside script text, e.g. href="'+u+'".
    if (/^['"+\s]/.test(v) || /['"]$/.test(v)) continue;
    bad.add(v);
  }
  for (const m of html.matchAll(/\bsrcset="([^"]*)"/g)) {
    for (const part of m[1].split(',')) {
      const v = part.trim().split(/\s+/)[0];
      if (v && !/^(\/|https?:|data:)/.test(v)) bad.add(`srcset ${v}`);
    }
  }
  for (const m of html.matchAll(/url\(\s*(['"]?)([^)'"]+)\1\s*\)/g)) {
    const v = m[2];
    // %23 is an encoded "#": a fragment reference inside an inline SVG data URI.
    if (/^(\/|#|%23|https?:|data:)/.test(v)) continue;
    bad.add(`url(${v})`);
  }
  if (bad.size) fail(`${where} still has relative URLs: ${[...bad].slice(0, 8).join(', ')}`);
}

export function buildRevolutionHome(preview: string, alternates: HomeAlternate[]): RevolutionHome {
  const localeHomes = new Map<string, string>();
  for (const { lang, href } of alternates) {
    if (lang === 'x-default' || lang === 'en') continue;
    localeHomes.set(lang, new URL(href).pathname);
  }

  const [headStart, headEnd] = between(preview, '<head>', '</head>');
  const head = preview.slice(headStart, headEnd);
  const [bodyStart, bodyEnd] = between(preview, '<body>', '</body>', headEnd);

  const nodes: string[] = [];
  let cursor = 0;
  for (const m of head.matchAll(HEAD_NODE)) {
    // Anything between two recognised nodes that is not whitespace is unknown content.
    if (head.slice(cursor, m.index).trim() !== '') {
      fail('the preview <head> has content this module does not recognise');
    }
    nodes.push(m[0]);
    cursor = (m.index ?? 0) + m[0].length;
  }
  if (head.slice(cursor).trim() !== '') {
    fail('the preview <head> has content this module does not recognise');
  }
  const keptHead = nodes.filter((n) => !DROP_FROM_HEAD.some((re) => re.test(n.trimStart())));
  const kept = keptHead.join('\n');
  // What the preview's head must never contribute: SEOHead owns these for `/`.
  const headWithoutStyles = keptHead.filter((n) => !/^<(?:style|script)\b/i.test(n)).join('\n');
  if (/noindex|rel="canonical"|hreflang|<base\b/i.test(headWithoutStyles)) {
    fail('the preview <head> carries a noindex, canonical, hreflang or <base> that would leak into `/`');
  }

  let body = preview.slice(bodyStart, bodyEnd);
  body = tagCtas(body);
  body = linkLocales(body, localeHomes);
  body = absolutizePageLinks(body);
  body = keepPageCurtain(body);

  const headHtml = absolutizeAssets(kept);
  const bodyHtml = absolutizeAssets(body);

  assertNoRelativeUrls(headHtml, 'head');
  assertNoRelativeUrls(bodyHtml, 'body');
  if (/\sdata-mp-cta=/.test(bodyHtml) === false) fail('no CTA was tagged');

  return { headHtml, bodyHtml };
}
