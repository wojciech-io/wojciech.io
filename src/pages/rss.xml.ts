import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// Canonical XML 1.0 entity escape (5 predefined entities: & < > " ').
// Used on internal MDX content validated by src/content.config.ts. Output
// context is XML element/attribute text, not HTML.
const escapeXml = (value: string) =>
  // nosemgrep: javascript.audit.detect-replaceall-sanitization.detect-replaceall-sanitization
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection('insights', ({ data }) => !data.draft)).sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured) || b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );

  const origin = site ?? new URL('https://wojciech.io/');
  const feedUrl = new URL('/rss.xml', origin).href;
  const items = posts
    .map((post) => {
      const slug = post.id.replace(/\.mdx?$/, '');
      const url = new URL(`/insights/${slug}/`, origin).href;

      return `
        <item>
          <title>${escapeXml(post.data.title)}</title>
          <description>${escapeXml(post.data.description)}</description>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <pubDate>${post.data.publishedAt.toUTCString()}</pubDate>
          <author>hello@wojciech.io (Wojciech Łuszczyński)</author>
        </item>`;
    })
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Wojciech Łuszczyński · Insights</title>
    <description>Articles on growth, AI systems, GTM architecture, and building revenue systems for B2B SaaS.</description>
    <link>${new URL('/insights/', origin).href}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <managingEditor>hello@wojciech.io (Wojciech Łuszczyński)</managingEditor>
    <webMaster>hello@wojciech.io (Wojciech Łuszczyński)</webMaster>
    <ttl>1440</ttl>
    ${items}
  </channel>
</rss>`,
    {
      headers: {
        'content-type': 'application/rss+xml; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    },
  );
};
