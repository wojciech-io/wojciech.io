// Side-by-side dark|light screenshots of /revolution pages (preview tooling, not shipped).
// usage: node scripts/revolution-modes-shots.mjs <outDir> [base] [page,page,...]
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';

const out = process.argv[2] || '.';
const base = process.argv[3] || 'http://localhost:8871/revolution/';
const pages = (process.argv[4] || 'index,gtm,about,work,apps/adsai,insights/measure-mature-cohorts').split(',');
const widths = [390, 1440];
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const p of pages) {
  for (const w of widths) {
    const frames = [];
    for (const mode of ['dark', 'light']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      await ctx.addInitScript((m) => { try { localStorage.setItem('wl-mode', m); localStorage.setItem('v4theme', m); } catch (e) {} }, mode);
      const pg = await ctx.newPage();
      await pg.goto(`${base}${p}.html`, { waitUntil: 'load' }).catch(() => {});
      await pg.waitForTimeout(w === 1440 ? 2500 : 1800);
      // trigger lazy content
      const h = await pg.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < Math.min(h, 14000); y += 700) { await pg.evaluate((yy) => scrollTo(0, yy), y); await pg.waitForTimeout(90); }
      await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(400);
      const buf = await pg.screenshot({ fullPage: true, type: 'jpeg', quality: 70 });
      frames.push(buf);
      await ctx.close();
    }
    const cap = w === 390 ? 7000 : 6500;
    const imgs = [];
    for (const b of frames) {
      const m = await sharp(b).metadata();
      imgs.push(await sharp(b).extract({ left: 0, top: 0, width: Math.min(m.width, w), height: Math.min(m.height, cap) }).toBuffer());
    }
    const metas = await Promise.all(imgs.map((i) => sharp(i).metadata()));
    const H = Math.max(...metas.map((m) => m.height));
    const gap = 24;
    const name = `${out}/${p.replace(/\//g, '-')}-${w}.jpg`;
    await sharp({ create: { width: w * 2 + gap, height: H, channels: 3, background: '#888' } })
      .composite([{ input: imgs[0], left: 0, top: 0 }, { input: imgs[1], left: w + gap, top: 0 }])
      .jpeg({ quality: 70 }).toFile(name);
    process.stdout.write([name, w * 2 + gap, H].join(' ') + '\n');
  }
}
await browser.close();
