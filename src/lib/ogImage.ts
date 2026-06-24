import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const fontRegular = readFileSync(resolve(process.cwd(), 'public/fonts/Geist-Regular.ttf'));
const fontBold = readFileSync(resolve(process.cwd(), 'public/fonts/Geist-Bold.ttf'));
// IBM Plex Sans Arabic (OFL) for Arabic OG cards. Converted from the shipped
// woff2 to ttf because Satori cannot decode woff2.
const fontArRegular = readFileSync(resolve(process.cwd(), 'public/fonts/IBMPlexSansArabic-400.ttf'));
const fontArBold = readFileSync(resolve(process.cwd(), 'public/fonts/IBMPlexSansArabic-700.ttf'));

export interface OgImageInput {
  title: string;
  eyebrow: string;
  description?: string;
  meta?: string;
  /** When 'ar', render RTL with the Arabic font + the /ar/ gold accent. */
  lang?: 'en' | 'ar';
}

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export async function renderOgImage({ title, eyebrow, description, meta, lang }: OgImageInput) {
  const titleSize = title.length > 70 ? '48px' : title.length > 55 ? '54px' : '64px';
  const isAr = lang === 'ar';
  // /ar/ brand is metallic gold; everything else keeps the lime accent.
  const accent = isAr ? '#d4af37' : '#ebff00';
  const accentGlow = isAr ? 'rgba(212,175,55,0.20)' : 'rgba(235,255,0,0.20)';
  const fontFamily = isAr ? 'PlexAr' : 'Geist';
  const dir = isAr ? 'rtl' : 'ltr';
  const tagline = isAr ? 'مهندس GTM · باني أنظمة قائمة على الذكاء الاصطناعي' : 'GTM ARCHITECT · AI-NATIVE BUILDER';
  const secondary = description || meta || (isAr ? 'أنظمة إيراد قائمة على الذكاء الاصطناعي لشركات B2B SaaS.' : 'AI-native revenue systems for B2B SaaS.');

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: `${OG_IMAGE_WIDTH}px`,
          height: `${OG_IMAGE_HEIGHT}px`,
          background: '#0a0a0b',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '68px',
          fontFamily,
          direction: dir,
          position: 'relative',
        },
        children: [
          // Grid texture (soft).
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '44px 44px',
              },
            },
          },
          // Lime glow, top-right. radial-gradient = soft falloff (satori has no blur).
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                right: '-200px',
                top: '-260px',
                width: '720px',
                height: '720px',
                backgroundImage:
                  'radial-gradient(circle at center, rgba(235,255,0,0.20), rgba(235,255,0,0) 68%)',
              },
            },
          },
          // Cool depth glow, bottom-left, to balance the frame.
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: '-220px',
                bottom: '-300px',
                width: '700px',
                height: '700px',
                backgroundImage:
                  'radial-gradient(circle at center, rgba(120,160,255,0.10), rgba(120,160,255,0) 70%)',
              },
            },
          },
          // Edge vignette for depth.
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'radial-gradient(120% 120% at 50% 40%, rgba(10,10,11,0) 55%, rgba(10,10,11,0.85) 100%)',
              },
            },
          },
          // Header: eyebrow badge + meta with a lime tick.
          {
            type: 'div',
            props: {
              style: {
                position: 'relative',
                display: 'flex',
                flexDirection: isAr ? 'row-reverse' : 'row',
                justifyContent: isAr ? 'flex-end' : 'flex-start',
                alignItems: 'center',
                gap: '16px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      background: accent,
                      color: '#0a0a0a',
                      fontSize: '14px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '7px 15px',
                      borderRadius: '5px',
                    },
                    children: eyebrow,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', gap: '9px' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '6px',
                            height: '6px',
                            borderRadius: '999px',
                            background: accent,
                          },
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { color: '#7a7a7a', fontSize: '14px', letterSpacing: '0.04em', direction: 'ltr' },
                          children: meta || 'wojciech.io',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // Title + lead, with a lime accent rule above the title.
          {
            type: 'div',
            props: {
              style: {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isAr ? 'flex-end' : 'flex-start',
                gap: '22px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { width: '54px', height: '4px', borderRadius: '2px', background: accent },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#fafafa',
                      fontSize: titleSize,
                      fontWeight: 700,
                      lineHeight: 1.06,
                      letterSpacing: '-0.015em',
                      maxWidth: '1000px',
                    },
                    children: title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#a6a6a6',
                      fontSize: '23px',
                      lineHeight: 1.4,
                      maxWidth: '880px',
                    },
                    children: secondary,
                  },
                },
              ],
            },
          },
          // Footer: square mark + wordmark, tagline on the right.
          {
            type: 'div',
            props: {
              style: {
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #242424',
                paddingTop: '26px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', gap: '12px', direction: 'ltr' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            background: accent,
                            color: '#0a0a0a',
                            fontSize: '20px',
                            fontWeight: 700,
                          },
                          children: 'W',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', alignItems: 'center' },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: { color: '#fafafa', fontSize: '19px', fontWeight: 700 },
                                children: 'wojciech',
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: { color: accent, fontSize: '19px', fontWeight: 700 },
                                children: '.io',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { color: '#6b6b6b', fontSize: '15px', letterSpacing: '0.06em' },
                    children: tagline,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      fonts: [
        { name: 'Geist', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Geist', data: fontBold, weight: 700, style: 'normal' },
        { name: 'PlexAr', data: fontArRegular, weight: 400, style: 'normal' },
        { name: 'PlexAr', data: fontArBold, weight: 700, style: 'normal' },
      ],
    },
  );

  return new Resvg(svg).render().asPng();
}

export function ogPngResponse(png: Uint8Array) {
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
