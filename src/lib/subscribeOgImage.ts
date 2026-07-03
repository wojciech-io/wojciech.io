import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { editions } from '../data/newsletterEditions';

// Bespoke OG card for /subscribe (AI Espresso). Unlike the generic renderOgImage,
// this one composes the real hero photo, the AI Espresso wordmark, and a faithful
// mini render of the latest issue — so the share card sells the newsletter, not
// just the page. resvg decodes PNG/JPEG (not webp), so the photo ships as a JPEG
// pre-converted from wojciech-hero-loft.webp; the cup is an 8-bit PNG copy.
const fontRegular = readFileSync(resolve(process.cwd(), 'public/fonts/Geist-Regular.ttf'));
const fontBold = readFileSync(resolve(process.cwd(), 'public/fonts/Geist-Bold.ttf'));

const heroJpg = readFileSync(resolve(process.cwd(), 'public/images/og/subscribe-hero.jpg'));
const cupPng = readFileSync(resolve(process.cwd(), 'public/images/og/espresso-cup.png'));
const heroSrc = `data:image/jpeg;base64,${heroJpg.toString('base64')}`;
const cupSrc = `data:image/png;base64,${cupPng.toString('base64')}`;

const OG_W = 1200;
const OG_H = 630;
const ACCENT = '#ebff00';
const BG = '#0b0a07';
const ESPRESSO = '#17130e';

const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function shortDate(iso: string): string {
  const [, m, d] = iso.split('-').map(Number);
  return `${EN_MONTHS[m - 1]} ${d}`;
}
function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;
}

export async function renderSubscribeOgImage() {
  const latest = editions[0];

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
                      objectPosition: '50% 16%',
                    },
                  },
                },
                // Left fade: the tonal dissolve into the background.
                {
                  type: 'div',
                  props: {
                    style: {
                      position: 'absolute',
                      inset: 0,
                      backgroundImage:
                        `linear-gradient(to right, ${BG} 0%, rgba(11,10,7,0.74) 24%, rgba(11,10,7,0.32) 54%, rgba(11,10,7,0) 82%)`,
                    },
                  },
                },
                // Bottom fade to seat the frame.
                {
                  type: 'div',
                  props: {
                    style: {
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: '150px',
                      backgroundImage: `linear-gradient(to top, ${BG} 0%, rgba(11,10,7,0) 100%)`,
                    },
                  },
                },
                // Top fade.
                {
                  type: 'div',
                  props: {
                    style: {
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      height: '110px',
                      backgroundImage: `linear-gradient(to bottom, ${BG} 0%, rgba(11,10,7,0) 100%)`,
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
                width: '660px',
                height: `${OG_H}px`,
                padding: '58px 60px',
              },
              children: [
                // Brand lockup.
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', gap: '16px' },
                    children: [
                      {
                        type: 'img',
                        props: {
                          src: cupSrc,
                          style: { width: '52px', height: '52px', borderRadius: '12px' },
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column' },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  color: '#fafafa',
                                  fontSize: '36px',
                                  fontWeight: 700,
                                  letterSpacing: '-0.02em',
                                  lineHeight: 1,
                                },
                                children: 'AI Espresso',
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', alignItems: 'center', gap: '9px', marginTop: '9px' },
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
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        letterSpacing: '0.16em',
                                        textTransform: 'uppercase',
                                      },
                                      children: 'Daily newsletter',
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
                // Headline.
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      color: '#fafafa',
                      fontSize: '46px',
                      fontWeight: 700,
                      lineHeight: 1.05,
                      letterSpacing: '-0.02em',
                      maxWidth: '470px',
                    },
                    children: 'A day of AI, in one sip.',
                  },
                },
                // Faithful mini render of the latest issue.
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      width: '520px',
                      background: ESPRESSO,
                      border: '1px solid rgba(235,255,0,0.28)',
                      borderRadius: '16px',
                      padding: '20px 24px',
                    },
                    children: [
                      // Card header.
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', alignItems: 'center', gap: '10px' },
                                children: [
                                  {
                                    type: 'img',
                                    props: {
                                      src: cupSrc,
                                      style: { width: '24px', height: '24px', borderRadius: '7px' },
                                    },
                                  },
                                  {
                                    type: 'div',
                                    props: {
                                      style: { color: '#f5f3ec', fontSize: '15px', fontWeight: 700 },
                                      children: 'AI Espresso',
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: { color: 'rgba(245,243,236,0.6)', fontSize: '13px' },
                                children: shortDate(latest.date),
                              },
                            },
                          ],
                        },
                      },
                      // Briefing label.
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' },
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
                                  color: '#cfc8ba',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  letterSpacing: '0.12em',
                                  textTransform: 'uppercase',
                                },
                                children: 'Operator briefing',
                              },
                            },
                          ],
                        },
                      },
                      // Issue title.
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            color: '#f5f3ec',
                            fontSize: '24px',
                            fontWeight: 700,
                            lineHeight: 1.16,
                            letterSpacing: '-0.01em',
                            marginTop: '11px',
                          },
                          children: latest.title,
                        },
                      },
                      // Issue lead (truncated to keep the card tidy).
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            color: '#b3ab9c',
                            fontSize: '14px',
                            lineHeight: 1.5,
                            marginTop: '9px',
                            maxWidth: '470px',
                          },
                          children: truncate(latest.lead, 128),
                        },
                      },
                    ],
                  },
                },
                // Footer: wordmark + terms.
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
                                children: '/subscribe',
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { color: '#6b6b6b', fontSize: '14px', letterSpacing: '0.04em' },
                          children: 'Free · under 3 minutes',
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
