import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const fontRegular = readFileSync(resolve(process.cwd(), 'public/fonts/Geist-Regular.ttf'));
const fontBold = readFileSync(resolve(process.cwd(), 'public/fonts/Geist-Bold.ttf'));

interface PageMeta {
  title: string;
  eyebrow: string;
  description: string;
}

const pages: Record<string, PageMeta> = {
  about: {
    title: 'Fractional GTM Architect & AI Systems Builder',
    eyebrow: 'About',
    description: 'Growth operator building AI-native revenue systems for B2B SaaS.',
  },
  work: {
    title: 'GTM Systems & Case Studies',
    eyebrow: 'Work',
    description: 'AI-native GTM, CRM, automation, and shipped products.',
  },
  'ai-systems': {
    title: 'AI Systems · Workflows, Agents & Operating Leverage',
    eyebrow: 'AI Systems',
    description: 'Claude Code, MCP, and automation built for real production GTM.',
  },
  contact: {
    title: 'Build, Fix, or Review the System',
    eyebrow: 'Contact',
    description: '30-minute call for GTM audits, AI workflow design, and CRM architecture.',
  },
  insights: {
    title: 'AI & GTM Insights · Operator Notes',
    eyebrow: 'Insights',
    description: 'Field notes on AI systems, GTM architecture, and revenue design.',
  },
  now: {
    title: "What I'm Working On Now",
    eyebrow: 'Now',
    description: 'Current focus: systems, clients, reading, and thinking.',
  },
};

export function getStaticPaths() {
  return Object.keys(pages).map((page) => ({ params: { page } }));
}

export const GET: APIRoute = async ({ params }) => {
  const page = params.page as string;
  const meta = pages[page];
  if (!meta) return new Response('Not found', { status: 404 });

  const { title, eyebrow, description } = meta;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          background: '#0f0f10',
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
