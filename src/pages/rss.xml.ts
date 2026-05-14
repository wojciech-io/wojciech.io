import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const escapeXml = (value: string) =>
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
  const items = posts
    .map((post) => {
      const slug = post.id.replace(/\.mdx?$/, '');
      const url = new URL(`/insights/${slug}/`, origin).href;

      return `
        <item>
          <title>${escapeXml(post.data.title)}</title>
          <description>${escapeXml(post.data.description)}</description>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${post.data.publishedAt.toUTCString()}</pubDate>
        </item>`;
    })
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>Wojciech Łuszczyński - Insights</title>
          <description>Articles on growth, AI systems, GTM architecture, and building revenue systems.</description>
          <link>${new URL('/insights/', origin).href}</link>
          ${items}
        </channel>
      </rss>`,
    {
      headers: {
        'content-type': 'application/rss+xml; charset=utf-8',
      },
    },
  );
};
