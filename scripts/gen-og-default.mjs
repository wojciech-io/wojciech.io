/**
 * The fallback social card: what gets shared when a page declares no card of
 * its own. It used to be hand-written SVG on a navy palette with Arial, left
 * over from a design the site no longer uses. This draws it with the same
 * fonts, colours and signet as every other card the site renders.
 *
 *   node scripts/gen-og-default.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const root = process.cwd();
const fontRegular = readFileSync(resolve(root, 'public/fonts/Geist-Regular.ttf'));
const fontBold = readFileSync(resolve(root, 'public/fonts/Geist-Bold.ttf'));

const W = 1200;
const H = 630;
const BG = '#0b0a07';
const ACCENT = '#ebff00';   // the dark-surface accent, as the other cards use
const TEXT = '#f4f0e7';
const MUTED = '#8f8a7d';

const div = (style, children) => ({ type: 'div', props: { style, children } });

async function main() {
  // The card is dark, so it takes the inverted signet: an ink tile on this
  // background is a square nobody can see. resvg decodes PNG, not SVG, so the
  // mark ships rasterised.
  const signet = await sharp(resolve(root, 'public/brand/signet-inverse.svg'), { density: 288 })
    .resize(128, 128)
    .png()
    .toBuffer();
  const signetSrc = `data:image/png;base64,${signet.toString('base64')}`;

  const svg = await satori(
    div(
      {
        width: `${W}px`,
        height: `${H}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: BG,
        padding: '72px 80px',
        fontFamily: 'Geist',
      },
      [
        div({ display: 'flex', alignItems: 'center', gap: '20px' }, [
          { type: 'img', props: { src: signetSrc, width: 64, height: 64 } },
          div(
            {
              display: 'flex',
              color: MUTED,
              fontSize: '22px',
              fontWeight: 400,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            },
            'wojciech.io',
          ),
        ]),

        div({ display: 'flex', flexDirection: 'column', gap: '22px' }, [
          div(
            { display: 'flex', color: TEXT, fontSize: '66px', fontWeight: 700, letterSpacing: '-0.03em' },
            'Wojciech Luszczynski',
          ),
          div({ display: 'flex', color: ACCENT, fontSize: '27px', fontWeight: 700, letterSpacing: '-0.01em' },
            'GTM Architect · Growth Operator'),
          div(
            { display: 'flex', color: MUTED, fontSize: '26px', fontWeight: 400, lineHeight: 1.45, maxWidth: '880px' },
            'Growth systems for B2B SaaS: GTM, CRM, automation and AI in one operating model.',
          ),
        ]),

        div({ display: 'flex', alignItems: 'center', gap: '14px' }, [
          div({ display: 'flex', width: '9px', height: '9px', borderRadius: '9px', background: ACCENT }, []),
          div({ display: 'flex', color: MUTED, fontSize: '21px', letterSpacing: '0.05em' }, 'GTM · Marketing · Growth'),
        ]),
      ],
    ),
    {
      width: W,
      height: H,
      fonts: [
        { name: 'Geist', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Geist', data: fontBold, weight: 700, style: 'normal' },
      ],
    },
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
  writeFileSync(resolve(root, 'public/og-default.png'), png);
  console.log(`  og-default.png  ${(png.length / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
