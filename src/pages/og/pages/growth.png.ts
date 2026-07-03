import type { APIRoute } from 'astro';
import { ogPngResponse } from '../../../lib/ogImage';
import { renderLensOgImage } from '../../../lib/lensOgImage';

// Bespoke lens share card. A dedicated static route so it wins precedence over the
// generic [page].png.ts (which has no 'growth' entry in OG_PAGES).
export const GET: APIRoute = async () => {
  return ogPngResponse(await renderLensOgImage('growth'));
};
