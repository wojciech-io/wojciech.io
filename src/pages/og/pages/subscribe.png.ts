import type { APIRoute } from 'astro';
import { ogPngResponse } from '../../../lib/ogImage';
import { renderSubscribeOgImage } from '../../../lib/subscribeOgImage';

// Bespoke AI Espresso share card. A dedicated static route so it wins precedence
// over the generic [page].png.ts (which has no 'subscribe' entry in OG_PAGES).
export const GET: APIRoute = async () => {
  return ogPngResponse(await renderSubscribeOgImage());
};
