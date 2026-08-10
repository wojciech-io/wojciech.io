import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const DIST = join(process.cwd(), 'dist');

/** Fail loudly rather than skip: a missing build must not read as green. */
export function requireDist(): void {
  if (!existsSync(DIST)) {
    throw new Error(
      'dist/ not found. These checks read the built site: run `npm run build` first.',
    );
  }
}

/** Read the built HTML for a site path ("/", "/de/about/"). */
export function html(path: string): string {
  const rel = path.replace(/^\/+/, '').replace(/\/+$/, '');
  const file = join(DIST, rel, 'index.html');
  if (!existsSync(file)) {
    throw new Error(`No built page for "${path}" (looked for ${file})`);
  }
  return readFileSync(file, 'utf8');
}

/** Read a built file verbatim ("/robots.txt", "/sitemap-index.xml"). */
export function text(urlPath: string): string {
  const file = join(DIST, urlPath.replace(/^\/+/, ''));
  if (!existsSync(file)) throw new Error(`Not built: ${urlPath} (${file})`);
  return readFileSync(file, 'utf8');
}

/** All parsed JSON-LD blocks on a page. */
export function jsonLd(doc: string): unknown[] {
  const out: unknown[] = [];
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  for (const [, body] of doc.matchAll(re)) {
    try {
      const parsed = JSON.parse(body);
      out.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch {
      /* malformed blocks are caught by their own assertion */
    }
  }
  return out;
}

/** schema.org @type values present on a page. */
export function schemaTypes(doc: string): Set<string> {
  const types = new Set<string>();
  for (const item of jsonLd(doc)) {
    const t = (item as Record<string, unknown>)?.['@type'];
    if (typeof t === 'string') types.add(t);
  }
  return types;
}

/** True when a file exists in dist at the given site-absolute path. */
export function assetExists(urlPath: string): boolean {
  const clean = urlPath.split(/[?#]/)[0].replace(/^\/+/, '');
  return existsSync(join(DIST, clean));
}

/** Value of a <link rel="..."> href. */
export function linkHref(doc: string, rel: string): string | null {
  const m = doc.match(new RegExp(`<link[^>]*rel="${rel}"[^>]*>`, 'i'));
  return m ? (m[0].match(/href="([^"]*)"/i)?.[1] ?? null) : null;
}

/** Value of a <meta property|name="..."> content attribute. */
export function meta(doc: string, key: string): string | null {
  const re = new RegExp(`<meta[^>]*(?:property|name)="${key}"[^>]*>`, 'i');
  const tag = doc.match(re);
  return tag ? (tag[0].match(/content="([^"]*)"/i)?.[1] ?? null) : null;
}

/** All [hreflang, href] pairs, in document order. */
export function alternates(doc: string): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  const re = /<link[^>]*rel="alternate"[^>]*>/gi;
  for (const [tag] of doc.matchAll(re)) {
    const lang = tag.match(/hreflang="([^"]*)"/i)?.[1];
    const href = tag.match(/href="([^"]*)"/i)?.[1];
    if (lang && href) out.push([lang, href]);
  }
  return out;
}

/** The <html lang="..."> attribute. */
export function htmlLang(doc: string): string | null {
  return doc.match(/<html[^>]*\slang="([^"]*)"/i)?.[1] ?? null;
}
