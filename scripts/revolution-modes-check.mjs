// /revolution light and dark modes: 32 pages x 2 modes x 2 widths.
// Checks per combination: html[data-mode] matches the stored choice, no horizontal scroll, axe color-contrast has no violations.
// usage: node scripts/revolution-modes-check.mjs [base] [--json out.json]   (base defaults to http://localhost:8871/revolution/)
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const jsonAt = args.indexOf('--json');
const jsonOut = jsonAt >= 0 ? args.splice(jsonAt, 2)[1] : null;
const base = args[0] || 'http://localhost:8871/revolution/';
const root = path.resolve(new URL('../public/revolution', import.meta.url).pathname);
const walk = (d, pre = '') => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() && ['apps', 'insights', 'work'].includes(e.name) && !pre ? walk(path.join(d, e.name), e.name + '/') : e.isFile() && e.name.endsWith('.html') ? [pre + e.name.slice(0, -5)] : []);
const pages = walk(root).sort();
const widths = [390, 1440];
const modes = ['dark', 'light'];
const jobs = pages.flatMap((p) => modes.flatMap((m) => widths.map((w) => ({ p, m, w }))));
const browser = await chromium.launch();
const results = [];
let next = 0;

async function run({ p, m, w }) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript((mode) => { try { localStorage.setItem('wl-mode', mode); localStorage.setItem('v4theme', mode); } catch (e) {} }, m);
  const pg = await ctx.newPage();
  const out = { p, m, w, mode: false, hscroll: false, contrast: 0, nodes: [] };
  try {
    await pg.goto(`${base}${p}.html`, { waitUntil: 'load', timeout: 45000 });
    await pg.waitForTimeout(2600);
    const h = await pg.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < Math.min(h, 30000); y += 600) { await pg.evaluate((yy) => scrollTo(0, yy), y); await pg.waitForTimeout(40); }
    await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(500);
    out.mode = (await pg.evaluate(() => document.documentElement.dataset.mode)) === m;
    out.hscroll = await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    const ax = await new AxeBuilder({ page: pg }).withRules(['color-contrast']).analyze();
    for (const v of ax.violations) for (const n of v.nodes) { out.contrast++; if (out.nodes.length < 4) out.nodes.push(`${n.target.join(' ')} :: ${(n.any[0]?.message || '').replace(/Element has insufficient color contrast of /, '')}`.slice(0, 220)); }
  } catch (e) { out.error = String(e.message || e).slice(0, 160); }
  await ctx.close();
  return out;
}
await Promise.all(Array.from({ length: 4 }, async () => { while (next < jobs.length) { const j = jobs[next++]; results.push(await run(j)); } }));
await browser.close();

const key = (p, m, w) => results.find((r) => r.p === p && r.m === m && r.w === w);
const cell = (r) => (!r ? '?' : r.error ? 'ERR' : r.mode && !r.hscroll && r.contrast === 0 ? 'ok' : `${!r.mode ? 'M ' : ''}${r.hscroll ? 'H ' : ''}${r.contrast ? 'C' + r.contrast : ''}`.trim());
console.log('| page | dark 390 | dark 1440 | light 390 | light 1440 |\n|---|---|---|---|---|');
for (const p of pages) console.log(`| ${p} | ${[['dark', 390], ['dark', 1440], ['light', 390], ['light', 1440]].map(([m, w]) => cell(key(p, m, w))).join(' | ')} |`);
const bad = results.filter((r) => r.error || !r.mode || r.hscroll || r.contrast);
const okN = results.length - bad.length;
console.log(`\n${okN}/${results.length} combinations pass (M = mode not applied, H = horizontal scroll, Cn = n contrast failures).`);
for (const r of bad) console.log(`- ${r.p} ${r.m} ${r.w}: ${r.error || ''} ${r.nodes.join(' | ')}`);
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(results, null, 1));
process.exit(bad.length ? 1 : 0);
