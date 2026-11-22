// Captures first-screen thumbnails (390 and 1440 px) of the ten model pages for system.html.
// Run from the repo root with the preview served from public/: node public/revolution/assets/system/build-thumbs.mjs http://127.0.0.1:PORT
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const base = process.argv[2] || 'http://127.0.0.1:8800';
const pages = {
  home: 'index.html', lens: 'gtm.html', about: 'about.html', work: 'work.html', case: 'work/content-studio.html',
  insights: 'insights.html', article: 'article.html', app: 'apps/adsai.html', newsletter: 'newsletter.html', legal: 'privacy.html',
};
const sizes = [[390, 844, 192], [1440, 900, 720]];
const out = new URL('./thumbs/', import.meta.url).pathname;
const browser = await chromium.launch();
for (const [id, file] of Object.entries(pages)) {
  for (const [w, h, tw] of sizes) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'dark' });
    const p = await ctx.newPage();
    await p.goto(`${base}/revolution/${file}`, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(1800);
    await p.addStyleTag({ content: '#ld,.ld{display:none!important}' });
    const png = await p.screenshot();
    let q = 60, buf;
    do { buf = await sharp(png).resize({ width: tw }).webp({ quality: q }).toBuffer(); q -= 8; } while (buf.length > 40000 && q > 10);
    await sharp(buf).toFile(`${out}${id}-${w}.webp`);
    console.log(id, w, buf.length);
    await ctx.close();
  }
}
await browser.close();
