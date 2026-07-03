import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Bespoke OG cards for the three lens pages (/gtm /marketing /growth). Same visual
// language as the /subscribe card (photo right dissolving into the page bg, content
// left), but the right column previews the lens itself: its promise plus the three
// things it ships. resvg decodes PNG/JPEG only, so the lens hero backdrops ship as
// JPEGs pre-converted from public/images/lens/{lens}-hero.webp.
const fontRegular = readFileSync(resolve(process.cwd(), 'public/fonts/Geist-Regular.ttf'));
const fontBold = readFileSync(resolve(process.cwd(), 'public/fonts/Geist-Bold.ttf'));

const OG_W = 1200;
const OG_H = 630;
const ACCENT = '#ebff00';
const BG = '#0b0a07';
const ESPRESSO = '#17130e';

export type LensKey = 'gtm' | 'marketing' | 'growth';

interface LensCard {
  eyebrow: string;
  kicker: string;
  headline: string;
  meta: string;
  pillars: string[];
  photoPos: string;
}

const LENSES: Record<LensKey, LensCard> = {
  gtm: {
    eyebrow: 'GTM',
    kicker: 'Go-to-market, as a system',
    headline: 'Pipeline that compounds. Not four dashboards.',
    meta: 'CRM · outbound · paid · RevOps',
    pillars: ['Pipeline architecture', 'RevOps and attribution', 'Outbound that lands'],
    photoPos: '50% 30%',
  },
  marketing: {
    eyebrow: 'Marketing',
    kicker: 'Distribution, as infrastructure',
    headline: 'Marketing that produces pipeline. Not impressions.',
    meta: 'positioning · demand · brand',
    pillars: ['Positioning that bites', 'Demand, not impressions', 'Brand that compounds'],
    photoPos: '50% 28%',
  },
  growth: {
    eyebrow: 'Growth',
    kicker: 'Growth, as an operating system',
    headline: 'Experiments that ship. Measured in revenue.',
    meta: 'experiments · activation · retention · lifecycle',
    pillars: ['Experiments that ship', 'Activation and retention', 'Lifecycle that runs itself'],
    photoPos: '50% 30%',
  },
};

export const LENS_KEYS = Object.keys(LENSES) as LensKey[];

export async function renderLensOgImage(lens: LensKey) {
  const cfg = LENSES[lens];
  const heroJpg = readFileSync(resolve(process.cwd(), `public/images/og/lens-${lens}.jpg`));
  const heroSrc = `data:image/jpeg;base64,${heroJpg.toString('base64')}`;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: `${OG_W}px`,
          height: `${OG_H}px`,
          display: 'flex',
          position: 'relative',
          background: BG,
          fontFamily: 'Geist',
          overflow: 'hidden',
        },
        children: [
          // Grid texture.
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
                backgroundSize: '44px 44px',
              },
            },
          },
          // Lime glow behind the wordmark, top-left.
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: '-180px',
                top: '-240px',
                width: '660px',
                height: '660px',
                backgroundImage:
                  'radial-gradient(circle at center, rgba(235,255,0,0.16), rgba(235,255,0,0) 66%)',
              },
            },
          },
          // Warm espresso glow, bottom-left, to seat the card.
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: '-160px',
                bottom: '-280px',
                width: '640px',
                height: '640px',
                backgroundImage:
                  'radial-gradient(circle at center, rgba(190,140,60,0.12), rgba(190,140,60,0) 70%)',
              },
            },
          },
          // Photo, right side, dissolving left into the page bg (mirrors the page hero).
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '560px',
                display: 'flex',
                overflow: 'hidden',
              },
              children: [
                {
                  type: 'img',
                  props: {
                    src: heroSrc,
                    style: {
                      position: 'absolute',
                      inset: 0,
                      width: '560px',
                      height: `${OG_H}px`,
                      objectFit: 'cover',
                      objectPosition: cfg.photoPos,
                    },
                  },
                },
                // Left seam only: a narrow blend so the photo meets the dark content
                // column without a hard vertical line. The photo stays full colour —
                // the lens subject sits on the right of each frame, past the seam.
                {
                  type: 'div',
                  props: {
                    style: {
                      position: 'absolute',
                      inset: 0,
                      backgroundImage:
                        `linear-gradient(to right, ${BG} 0%, rgba(11,10,7,0.72) 9%, rgba(11,10,7,0) 30%)`,
                    },
                  },
                },
              ],
            },
          },
          // Content column, left.
          {
            type: 'div',
            props: {
              style: {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '680px',
                height: `${OG_H}px`,
                padding: '58px 60px',
              },
              children: [
                // Lens lockup: accent badge + kicker.
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', gap: '16px' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            background: ACCENT,
                            color: '#0a0a0a',
                            fontSize: '17px',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            padding: '8px 16px',
                            borderRadius: '6px',
                          },
                          children: cfg.eyebrow,
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
                                style: { width: '22px', height: '3px', borderRadius: '2px', background: ACCENT },
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: {
                                  color: '#b9b4a7',
                                  fontSize: '14px',
                                  fontWeight: 700,
                                  letterSpacing: '0.12em',
                                  textTransform: 'uppercase',
                                },
                                children: cfg.kicker,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                // Headline.
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      color: '#fafafa',
                      fontSize: '52px',
                      fontWeight: 700,
                      lineHeight: 1.04,
                      letterSpacing: '-0.02em',
                      maxWidth: '520px',
                    },
                    children: cfg.headline,
                  },
                },
                // What the lens ships: three pillars on an espresso panel.
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      width: '540px',
                      background: ESPRESSO,
                      border: '1px solid rgba(235,255,0,0.28)',
                      borderRadius: '16px',
                      padding: '22px 26px',
                      gap: '14px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            color: '#cfc8ba',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                          },
                          children: 'What it ships',
                        },
                      },
                      ...cfg.pillars.map((p) => ({
                        type: 'div',
                        props: {
                          style: { display: 'flex', alignItems: 'center', gap: '13px' },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  width: '7px',
                                  height: '7px',
                                  borderRadius: '999px',
                                  background: ACCENT,
                                },
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: { color: '#f0ede5', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.01em' },
                                children: p,
                              },
                            },
                          ],
                        },
                      })),
                    ],
                  },
                },
                // Footer: wordmark + path, meta line on the right.
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
                    children: [
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
                                style: { color: ACCENT, fontSize: '19px', fontWeight: 700 },
                                children: '.io',
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: { color: '#6b6b6b', fontSize: '19px', fontWeight: 400 },
                                children: `/${lens}`,
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { color: '#6b6b6b', fontSize: '14px', letterSpacing: '0.04em' },
                          children: cfg.meta,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: OG_W,
      height: OG_H,
      fonts: [
        { name: 'Geist', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Geist', data: fontBold, weight: 700, style: 'normal' },
      ],
    },
  );

  return new Resvg(svg).render().asPng();
}
