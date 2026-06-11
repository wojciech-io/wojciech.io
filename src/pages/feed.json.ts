import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { SITE } from '../data/site';

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection('insights', ({ data }) => !data.draft)).sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );

  const origin = (site ?? new URL('https://wojciech.io/')).origin;
  const feedUrl = `${origin}/feed.json`;

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Wojciech Łuszczyński · Insights',
    home_page_url: `${origin}/`,
    feed_url: feedUrl,
    description:
      'Articles on growth, AI systems, GTM architecture, and building revenue systems for B2B SaaS.',
    language: 'en-US',
    authors: [
      {
        name: 'Wojciech Łuszczyński',
        url: `${origin}/about/`,
        avatar: `${origin}/images/wojciech-avatar-384.webp`,
      },
    ],
    items: posts.map((post) => {
      const id = post.id.replace(/\.mdx?$/, '');
      // Localized posts live at /{locale}/insights/{slug}/, not /insights/{locale}/{slug}/.
      const localeMatch = id.match(/^([a-z]{2})\/(.+)$/);
      const slug = localeMatch ? localeMatch[2] : id;
      const url = localeMatch
        ? `${origin}/${localeMatch[1]}/insights/${slug}/`
        : `${origin}/insights/${slug}/`;
      const ogImage = post.data.ogImage
        ? `${origin}${post.data.ogImage}`
        : `${origin}/og/${slug}.png`;

      return {
        id: url,
        url,
        title: post.data.title,
        summary: post.data.description,
        content_text: post.data.description,
        image: ogImage,
        language: localeMatch ? localeMatch[1] : 'en',
        date_published: post.data.publishedAt.toISOString(),
        ...(post.data.updatedAt
          ? { date_modified: post.data.updatedAt.toISOString() }
          : {}),
        authors: [{ name: 'Wojciech Łuszczyński' }],
        tags: [
          ...(post.data.category ? [post.data.category] : []),
          ...post.data.tags,
        ].filter((v, i, a) => a.indexOf(v) === i),
      };
    }),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'content-type': 'application/feed+json; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
