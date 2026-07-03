import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { insightSlug, isLocalePost, sortInsights } from '../../lib/insights';
import { escapeXml } from '../../utils/xml';

// Polish-only RSS feed. The main /rss.xml stays English (isLocalePost('en'));
// this splits the PL articles into their own feed at /pl/rss.xml so Polish
// readers get a native-language subscription. Items link to /pl/insights/{slug}/.
export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection('insights', isLocalePost('pl'))).sort(sortInsights);

  const origin = site ?? new URL('https://wojciech.io/');
  const feedUrl = new URL('/pl/rss.xml', origin).href;
  const lastBuildDate = posts[0]?.data.publishedAt.toUTCString() ?? new Date().toUTCString();
  const items = posts
    .map((post) => {
      const slug = insightSlug(post);
      const url = new URL(`/pl/insights/${slug}/`, origin).href;
      const categories = [
        ...(post.data.category ? [post.data.category] : []),
        ...post.data.tags,
      ].filter((v, i, a) => a.indexOf(v) === i);

      return `
        <item>
          <title>${escapeXml(post.data.title)}</title>
          <description>${escapeXml(post.data.description)}</description>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <pubDate>${post.data.publishedAt.toUTCString()}</pubDate>
          <author>hello@wojciech.io (Wojciech Łuszczyński)</author>
          ${categories.map((c) => `<category>${escapeXml(c)}</category>`).join('\n          ')}
        </item>`;
    })
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Wojciech Łuszczyński · Spostrzeżenia</title>
    <description>Artykuły o systemach AI, architekturze GTM i budowaniu systemów przychodowych dla B2B SaaS.</description>
    <link>${new URL('/pl/insights/', origin).href}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <language>pl-pl</language>
    <managingEditor>hello@wojciech.io (Wojciech Łuszczyński)</managingEditor>
    <webMaster>hello@wojciech.io (Wojciech Łuszczyński)</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
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
