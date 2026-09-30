/**
 * Draws the wojciech.io signet as geometry and renders every icon the site
 * declares. The mark is the `.io` of the domain set in an ink tile: the same
 * pairing the header badge uses, so the browser tab and the page agree.
 *
 * Everything below is authored on a 32 unit grid and scaled, so a 16px tab
 * icon and a 512px install icon come from one description instead of six
 * hand-tuned files that drift apart.
 *
 *   node scripts/gen-brand-icons.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const PUBLIC = resolve(process.cwd(), 'public');

/* Tokens, copied from src/styles/tokens.css. Kept literal because an icon file
 * cannot read a custom property. */
const INK = '#0d0d0b';
const LIME = '#eaff00';

/* --- geometry, 32 unit grid -------------------------------------------- */

const G = 32;
const W = 3.6;          // stem width and ring thickness
const RADIUS = 6;       // corners any rounder lose pixels at 16px
const XHEIGHT = 12.4;
const TITTLE_GAP = 1.3;
const OVERSHOOT = 0.25;  // the round `o` breaks the baseline, as type does

/* The mark is centred on its true extent: the tittle at the top, the `o`
 * overshooting the baseline at the bottom. Centring on the baseline alone
 * leaves the whole thing sitting a quarter unit low. */
const INK_H = TITTLE_GAP + W + XHEIGHT + OVERSHOOT;
const XTOP = (G - INK_H) / 2 + W + TITTLE_GAP;
const BASELINE = XTOP + XHEIGHT;

/* Letterspacing is tight on purpose: at 16px an open gap reads as a break in
 * the mark rather than as space between glyphs. */
const GAP_DOT = 1.6;
const GAP_STEM = 1.4;
const INK_W = W + GAP_DOT + W + GAP_STEM + XHEIGHT + OVERSHOOT * 2;
const DOT_X = (G - INK_W) / 2;
const STEM_X = DOT_X + W + GAP_DOT;
const RING_X = STEM_X + W + GAP_STEM;
const RING_D = XHEIGHT + OVERSHOOT * 2;
const RING_R = RING_D / 2;
const RING_CX = RING_X + RING_R;
const RING_CY = XTOP - OVERSHOOT + RING_R;
const RING_RI = RING_R - W;

const n = (v) => Number(v.toFixed(3));

/** The `o`: one path with a hole, so the mark works on any background. */
const ring = () => {
  const o = `M${n(RING_CX - RING_R)} ${n(RING_CY)}a${n(RING_R)} ${n(RING_R)} 0 1 0 ${n(RING_D)} 0a${n(RING_R)} ${n(RING_R)} 0 1 0 ${n(-RING_D)} 0Z`;
  const i = `M${n(RING_CX - RING_RI)} ${n(RING_CY)}a${n(RING_RI)} ${n(RING_RI)} 0 1 0 ${n(RING_RI * 2)} 0a${n(RING_RI)} ${n(RING_RI)} 0 1 0 ${n(-RING_RI * 2)} 0Z`;
  return `${o}${i}`;
};

/** The `.io` glyphs, as one colour. `scale` shrinks them about the centre for
 *  masked contexts (Android adaptive icons, the iOS home screen). */
function glyphs(fill, scale = 1) {
  const t = scale === 1 ? '' : ` transform="translate(${n(G / 2)} ${n(G / 2)}) scale(${scale}) translate(${n(-G / 2)} ${n(-G / 2)})"`;
  return `<g fill="${fill}" fill-rule="evenodd"${t}>`
    + `<rect x="${n(DOT_X)}" y="${n(BASELINE - W)}" width="${n(W)}" height="${n(W)}" rx=".6"/>`
    + `<rect x="${n(STEM_X)}" y="${n(XTOP)}" width="${n(W)}" height="${n(XHEIGHT)}"/>`
    + `<rect x="${n(STEM_X)}" y="${n(XTOP - TITTLE_GAP - W)}" width="${n(W)}" height="${n(W)}" rx=".6"/>`
    + `<path d="${ring()}"/>`
    + `</g>`;
}

/** Rounded tile, transparent outside. Browser tabs and the favicon.
 *  On a light surface the tile is ink; on a dark one it inverts, because an
 *  ink tile on a dark page is a square you cannot see. */
const tile = (inverse = false) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${G} ${G}" role="img" aria-label="wojciech.io">`
  + `<rect width="${G}" height="${G}" rx="${RADIUS}" fill="${inverse ? LIME : INK}"/>`
  + glyphs(inverse ? INK : LIME)
  + `</svg>`;

/** Square to the edges, glyphs inside the mask safe area. Home screens crop. */
const fullBleed = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${G} ${G}" role="img" aria-label="wojciech.io">`
  + `<rect width="${G}" height="${G}" fill="${INK}"/>`
  + glyphs(LIME, 0.84)
  + `</svg>`;

/** Glyphs only, for the wordmark lockup and anywhere the tile is already there. */
const bare = (fill) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${G} ${G}" role="img" aria-label="wojciech.io">`
  + glyphs(fill)
  + `</svg>`;

/* --- rasterising -------------------------------------------------------- */

const png = (svg, size) =>
  sharp(Buffer.from(svg), { density: Math.max(72, Math.ceil((size / G) * 72)) })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();

/** A multi-size .ico, built by hand: sharp writes no ICO and the container is
 *  a header plus one directory entry per embedded PNG. */
function ico(entries) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = head.length + dir.length;
  entries.forEach(({ size, data }, i) => {
    const at = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, at);
    dir.writeUInt8(size >= 256 ? 0 : size, at + 1);
    dir.writeUInt8(0, at + 2);
    dir.writeUInt8(0, at + 3);
    dir.writeUInt16LE(1, at + 4);
    dir.writeUInt16LE(32, at + 6);
    dir.writeUInt32LE(data.length, at + 8);
    dir.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });

  return Buffer.concat([head, dir, ...entries.map((e) => e.data)]);
}

const out = (rel, data) => {
  const file = resolve(PUBLIC, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
  console.log(`  ${rel}  ${(data.length / 1024).toFixed(1)} KB`);
};

const written = [];
async function main() {
  console.log('signet:');
  out('favicon.svg', `${tile()}\n`);
  out('brand/signet.svg', `${tile()}\n`);
  out('brand/signet-inverse.svg', `${tile(true)}\n`);
  out('brand/signet-glyphs.svg', `${bare(LIME)}\n`);
  out('brand/signet-glyphs-ink.svg', `${bare(INK)}\n`);

  for (const size of [16, 32, 64, 192, 512]) {
    out(`favicon-${size}x${size}.png`, await png(tile(), size));
  }
  out('apple-touch-icon.png', await png(fullBleed(), 180));
  out('favicon-maskable-512x512.png', await png(fullBleed(), 512));

  const sizes = [16, 32, 48];
  const entries = [];
  for (const size of sizes) entries.push({ size, data: await png(tile(), size) });
  out('favicon.ico', ico(entries));
  written.push(...sizes);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
