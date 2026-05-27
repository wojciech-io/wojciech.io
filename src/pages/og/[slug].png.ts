import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { insightSlug, isLocalePost } from '../../lib/insights';
import { ogPngResponse, renderOgImage } from '../../lib/ogImage';

export async function getStaticPaths() {
  const posts = await getCollection('insights', isLocalePost('en'));
  return posts.map((p) => ({ params: { slug: insightSlug(p) }, props: { post: p } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getCollection<'insights'>>>[number] };
  const title = post.data.title;
  const category = post.data.category ?? 'Insights';
  const tags = post.data.tags.slice(0, 3).join(' · ');

  return ogPngResponse(
    await renderOgImage({
      title,
      eyebrow: category,
      description: post.data.description,
      meta: tags || 'wojciech.io',
    }),
  );
};
