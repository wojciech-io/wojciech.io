import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const fontRegular = readFileSync(resolve(process.cwd(), 'public/fonts/Geist-Regular.ttf'));
const fontBold = readFileSync(resolve(process.cwd(), 'public/fonts/Geist-Bold.ttf'));

export interface OgImageInput {
  title: string;
  eyebrow: string;
  description?: string;
  meta?: string;
}

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export async function renderOgImage({ title, eyebrow, description, meta }: OgImageInput) {
  const titleSize = title.length > 70 ? '46px' : title.length > 55 ? '52px' : '62px';
  const secondary = description || meta || 'AI-native revenue systems for B2B SaaS.';

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: `${OG_IMAGE_WIDTH}px`,
          height: `${OG_IMAGE_HEIGHT}px`,
          background: '#0f0f10',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          fontFamily: 'Geist',
          position: 'relative',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                right: '-120px',
                top: '-180px',
                width: '520px',
                height: '520px',
                borderRadius: '999px',
                background: 'rgba(235,255,0,0.10)',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      background: '#ebff00',
                      color: '#0a0a0a',
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '6px 14px',
                      borderRadius: '4px',
                    },
                    children: eyebrow,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { color: '#747474', fontSize: '13px', letterSpacing: '0.04em' },
                    children: meta || 'wojciech.io',
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#f5f5f5',
                      fontSize: titleSize,
                      fontWeight: 700,
                      lineHeight: 1.08,
                      maxWidth: '980px',
                    },
                    children: title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#a0a0a0',
                      fontSize: '22px',
                      lineHeight: 1.4,
                      maxWidth: '860px',
                    },
                    children: secondary,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #262626',
                paddingTop: '24px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', gap: '8px' },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: { color: '#f5f5f5', fontSize: '18px', fontWeight: 700 },
                          children: 'wojciech',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            background: '#ebff00',
                            color: '#0a0a0a',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '3px',
                          },
                          children: '.io',
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { color: '#666666', fontSize: '14px', letterSpacing: '0.06em' },
                    children: 'GTM ARCHITECT · AI-NATIVE BUILDER',
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
