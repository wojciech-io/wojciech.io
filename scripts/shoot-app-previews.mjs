// Builds the portfolio preview thumbnails in apps/app/public/previews/<id>.webp
//
// Run: npm run previews:shoot
//
// Three kinds of source, one output format so the row of thumbnails reads as a set:
//   { url }     — live app, screenshotted here.
//   { from }    — a single image already in the repo, re-encoded.
//   { compose } — several images tiled side by side into one landscape thumb.
//                 For native/mobile apps whose screens are portrait and would
//                 otherwise letterbox into a 16:10 tile.
//
// Every preview is normalised to the SAME geometry (1280x800 capture -> 720x450
// webp, 16:10, top-anchored). Standardising the frame is the only standardising
// that's honest: the apps genuinely look different, and pretending otherwise
// would mean faking screenshots.
//
// Import '@playwright/test' (declared), never bare 'playwright' — see
// the worktree module-resolution note in scripts/README or the repo memory.

import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, writeFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('apps/app/public/previews');
const W = 1280;
const H = 800;
const THUMB_W = 720;
const THUMB_H = 450; // locked 16:10 so every tile crops identically

// `prepare` runs before the shot, for apps whose demo sits one click past a gate.
// It may ONLY use public, no-credential affordances (a "browse as guest" button).
// Never log in, never type a password.
//
// Deliberately absent:
//   hireme — private recruitment tracker. Never list it, never shoot it.
const targets = [
  // SabiSzop is a phone-first PWA: a single portrait screen letterboxes into a
  // landscape tile (big empty margins). Shoot the guest-mode app at phone size
  // across its bottom-nav screens and tile them side by side, same fix as kade.
  {
    id: 'sabiszop',
    mobile: {
      url: 'https://sabiszop.netlify.app/listy',
      background: '#0b1220',
      prepare: async (page) => {
        await page.getByText('Obejrzyj bez logowania', { exact: false }).first().click({ timeout: 8000 });
        await page.waitForTimeout(2800);
      },
    },
  },
  { id: 'an-projekt', url: 'https://anprojekt.com.pl/' },
  { id: 'ciryam', url: 'https://ciryam.lovable.app/' },
  { id: 'camper-rental', url: 'https://camper-rental-weld.vercel.app/' },
  { id: 'relora', url: 'https://relora-jet.vercel.app/' },

  // ads-assistant is login-only in the browser (no guest mode). A real dashboard
  // screenshot ships with the case study, but it shows the dark side-nav AND a
  // real client account name in the header. Crop to the metrics area only: drops
  // the nav (per request) and, critically, the client name (active dispute, must
  // never appear on the public site).
  {
    id: 'ads-assistant',
    from: 'public/images/work/ads-assistant-preview.jpg',
    crop: { left: 240, top: 168, width: 1558, height: 700 },
  },

  // Kade: use the macOS dashboard capture on its own (desktop-only, per request).
  { id: 'kade', from: 'public/images/kade/dashboard.png' },

  // NotchCue: screenshot its actual product landing page (notch.wojciech.io
  // 301s to wojciech.io/apps/notch/), not the stock composite.
  { id: 'notchcue', url: 'https://notch.wojciech.io' },

  // Brand composite, NOT an app screenshot: growthhub's raw dashboard reads badly
  // at thumbnail size, so use the case-study art. Swap for { url } if a real
  // capture ever lands.
  { id: 'growthhub', from: 'public/images/work/growthhub.webp' },
  { id: 'klaro', from: 'public/images/work/klaro.webp' },
  { id: 'wojciech-coach', from: 'public/images/work/wojciech-coach.webp' },
  { id: 'academy', from: 'public/images/work/academy.webp' },

  // Open-source repo: the GitHub page is the artifact, but it renders as GitHub
  // chrome rather than as the work. Use the case-study art instead.
  { id: 'gtm-starter-pack', from: 'public/images/work/gtm-starter-pack.webp' },
];

await mkdir(OUT, { recursive: true });

const toThumb = (buf) =>
  sharp(buf).resize(THUMB_W, THUMB_H, { fit: 'cover', position: 'top' }).webp({ quality: 82 }).toBuffer();

// Tile N images across one landscape thumb: each pane gets an equal slice, is
// scaled to fit (never cropped, so no screen loses its edges), and sits on a
// shared background with a hairline gutter between panes.
async function composeThumb(sources, background = '#101010') {
  const GAP = 2;
  const paneW = Math.floor((THUMB_W - GAP * (sources.length - 1)) / sources.length);
  const panes = [];
  for (let i = 0; i < sources.length; i++) {
    const src = path.resolve(sources[i]);
    await access(src);
    const buf = await sharp(src)
      .resize(paneW, THUMB_H, { fit: 'contain', background })
      .toBuffer();
    panes.push({ input: buf, left: i * (paneW + GAP), top: 0 });
  }
  return sharp({ create: { width: THUMB_W, height: THUMB_H, channels: 3, background } })
    .composite(panes)
    .webp({ quality: 82 })
    .toBuffer();
}

// Same tiling, but from in-memory PNG buffers (live mobile captures) rather than
// files on disk.
async function composeThumbBuffers(buffers, background = '#101010') {
  const GAP = 2;
  const n = buffers.length;
  const paneW = Math.floor((THUMB_W - GAP * (n - 1)) / n);
  const panes = [];
  for (let i = 0; i < n; i++) {
    const buf = await sharp(buffers[i]).resize(paneW, THUMB_H, { fit: 'contain', background }).toBuffer();
    panes.push({ input: buf, left: i * (paneW + GAP), top: 0 });
  }
  return sharp({ create: { width: THUMB_W, height: THUMB_H, channels: 3, background } })
    .composite(panes)
    .webp({ quality: 82 })
    .toBuffer();
}

const results = [];
const shots = targets.filter((t) => t.url);
const locals = targets.filter((t) => t.from);
const composites = targets.filter((t) => t.compose);

// --- local images -----------------------------------------------------------
for (const t of locals) {
  try {
    const src = path.resolve(t.from);
    await access(src);
    // Optional crop (e.g. to remove chrome or a client name) before thumbnailing.
    const input = t.crop ? await sharp(src).extract(t.crop).toBuffer() : src;
    const webp = await toThumb(input);
    await writeFile(path.join(OUT, `${t.id}.webp`), webp);
    results.push({ id: t.id, src: t.crop ? 'repo:crop' : 'repo', ok: true, kb: Math.round(webp.length / 1024) });
  } catch (err) {
    results.push({ id: t.id, src: 'repo', ok: false, err: String(err).split('\n')[0].slice(0, 80) });
  }
}

// --- composed tiles ---------------------------------------------------------
for (const t of composites) {
  try {
    const webp = await composeThumb(t.compose, t.background);
    await writeFile(path.join(OUT, `${t.id}.webp`), webp);
    results.push({ id: t.id, src: `compose:${t.compose.length}`, ok: true, kb: Math.round(webp.length / 1024) });
  } catch (err) {
    results.push({ id: t.id, src: 'compose', ok: false, err: String(err).split('\n')[0].slice(0, 80) });
  }
}

// --- live shots -------------------------------------------------------------
const browser = await chromium.launch();
for (const t of shots) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  try {
    await page.goto(t.url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(2500);
    await page.evaluate(() => {
      ['[id*="cookie" i]', '[class*="cookie" i]', '[id*="consent" i]', '[class*="consent" i]'].forEach((sel) =>
        document.querySelectorAll(sel).forEach((e) => {
          const r = e.getBoundingClientRect();
          if (r.width > 200 && r.height > 60) e.remove();
        }),
      );
    });
    await page.waitForTimeout(300);
    if (t.prepare) await t.prepare(page);

    const png = await page.screenshot({ type: 'png' });
    const webp = await toThumb(png);
    await writeFile(path.join(OUT, `${t.id}.webp`), webp);
    results.push({ id: t.id, src: 'live', ok: true, kb: Math.round(webp.length / 1024) });
  } catch (err) {
    results.push({ id: t.id, src: 'live', ok: false, err: String(err).split('\n')[0].slice(0, 80) });
  } finally {
    await page.close();
  }
}

// --- mobile trios -----------------------------------------------------------
const mobiles = targets.filter((t) => t.mobile);
for (const t of mobiles) {
  const m = t.mobile;
  const page = await browser.newPage({
    viewport: { width: 402, height: 874 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const buffers = [];
  try {
    await page.goto(m.url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
      ['[id*="cookie" i]', '[class*="cookie" i]', '[id*="consent" i]', '[class*="consent" i]'].forEach((sel) =>
        document.querySelectorAll(sel).forEach((e) => {
          const r = e.getBoundingClientRect();
          if (r.width > 150 && r.height > 40) e.remove();
        }),
      );
    });
    await page.waitForTimeout(300);
    if (m.prepare) await m.prepare(page);
    buffers.push(await page.screenshot({ type: 'png' }));

    // Heading of the current screen, used to keep only DISTINCT screens (clicking
    // the already-active tab would otherwise duplicate a pane).
    const headingOf = () =>
      page.evaluate(() =>
        (document.querySelector('h1, h2, [class*="title" i]')?.textContent || document.title || '').trim().slice(0, 40),
      );
    const seen = new Set([await headingOf()]);

    // Bottom-nav tabs, content screens first (lists / receipts / recipes / spend)
    // ahead of profile and the add button.
    let tabs = await page.$$(
      'nav a, nav button, [class*="bottom" i] a, [class*="bottom" i] button, [class*="tabbar" i] a, [role="tablist"] [role="tab"]',
    );
    const scored = [];
    for (const tab of tabs) {
      const txt = ((await tab.textContent().catch(() => '')) || '').toLowerCase();
      const good = /list|paragon|przepis|wydatk|pulpit|profil/.test(txt) ? 0 : 1;
      scored.push({ tab, good });
    }
    scored.sort((a, b) => a.good - b.good);

    for (const { tab } of scored) {
      if (buffers.length >= 3) break;
      try {
        await tab.scrollIntoViewIfNeeded({ timeout: 1500 });
        await tab.click({ timeout: 3000 });
        await page.waitForTimeout(1200);
        const h = await headingOf();
        if (seen.has(h)) continue; // same screen, don't duplicate a pane
        seen.add(h);
        buffers.push(await page.screenshot({ type: 'png' }));
      } catch { /* skip flaky tab */ }
    }
    // If the nav gave us nothing extra, a scrolled variant still beats one lone
    // portrait floating in a wide tile.
    if (buffers.length < 2) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(700);
      buffers.push(await page.screenshot({ type: 'png' }));
    }

    const webp = await composeThumbBuffers(buffers.slice(0, 3), m.background);
    await writeFile(path.join(OUT, `${t.id}.webp`), webp);
    results.push({ id: t.id, src: `mobile:${buffers.length}`, ok: true, kb: Math.round(webp.length / 1024) });
  } catch (err) {
    results.push({ id: t.id, src: 'mobile', ok: false, err: String(err).split('\n')[0].slice(0, 80) });
  } finally {
    await page.close();
  }
}

await browser.close();

console.table(results);
const files = await readdir(OUT);
console.log(`\n${files.length} previews in apps/app/public/previews/ (all ${THUMB_W}x${THUMB_H})`);
const failed = results.filter((r) => !r.ok);
if (failed.length) {
  console.log(`FAILED: ${failed.map((f) => `${f.id} (${f.err})`).join('; ')}`);
  process.exitCode = 1;
}
