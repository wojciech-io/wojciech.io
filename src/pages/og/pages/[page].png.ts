import type { APIRoute } from 'astro';
import { OG_PAGES } from '../../../data/og-pages';
import { ogPngResponse, renderOgImage } from '../../../lib/ogImage';

export function getStaticPaths() {
  return Object.keys(OG_PAGES).map((page) => ({ params: { page } }));
}

export const GET: APIRoute = async ({ params }) => {
  const page = params.page as string;
  const meta = OG_PAGES[page];
  if (!meta) return new Response('Not found', { status: 404 });

  return ogPngResponse(await renderOgImage(meta));
};
