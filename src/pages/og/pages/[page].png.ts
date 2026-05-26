import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { OG_PAGES } from '../../../data/og-pages';

const fontRegular = readFileSync(resolve(process.cwd(), 'public/fonts/Geist-Regular.ttf'));
const fontBold = readFileSync(resolve(process.cwd(), 'public/fonts/Geist-Bold.ttf'));

export function getStaticPaths() {
  return Object.keys(OG_PAGES).map((page) => ({ params: { page } }));
}

export const GET: APIRoute = async ({ params }) => {
  const page = params.page as string;
  const meta = OG_PAGES[page];
  if (!meta) return new Response('Not found', { status: 404 });

  const { title, eyebrow, description } = meta;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          background: '#0a0a0b',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          fontFamily: 'Geist',
          position: 'relative',
        },
        children: [
          // Top area: eyebrow badge
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '16px' },
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
                    style: { color: '#444444', fontSize: '13px', letterSpacing: '0.04em' },
                    children: 'wojciech.io',
                  },
                },
              ],
            },
          },

          // Middle: title + description
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '20px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#f5f5f5',
                      fontSize: title.length > 55 ? '50px' : '60px',
                      fontWeight: 700,
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      maxWidth: '980px',
                    },
                    children: title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#666666',
                      fontSize: '22px',
                      lineHeight: 1.4,
                      maxWidth: '860px',
                    },
                    children: description,
                  },
                },
              ],
            },
          },

          // Bottom bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #222222',
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
                    style: { color: '#555555', fontSize: '14px', letterSpacing: '0.06em' },
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
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Geist', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Geist', data: fontBold, weight: 700, style: 'normal' },
      ],
    }
  );

  const png = new Resvg(svg).render().asPng();
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
