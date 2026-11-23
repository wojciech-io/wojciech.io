// /revolution tap check: is every visible link, button and input the element a finger actually hits?
// For each a, button, [role=button], input in view it scrolls the element to the middle of the screen and asks
// document.elementFromPoint at its centre. Anything that is not the element or its descendant is an interception
// (a decorative layer, a sticky bar, a sibling that overflows). At 390 px it also lists targets under 44 px.
// usage: node scripts/revolution-tap-check.mjs [base] [--json out.json]   (base defaults to http://localhost:8871/revolution/)
import { chromium } from 'playwright';
import fs from 'node:fs';

const args = process.argv.slice(2);
const jsonAt = args.indexOf('--json');
const jsonOut = jsonAt >= 0 ? args.splice(jsonAt, 2)[1] : null;
const base = args[0] || 'http://localhost:8871/revolution/';
const pages = (process.env.PAGES || 'index,gtm,marketing,growth,about,work,newsletter').split(',');
const widths = [390, 1440];
const modes = ['dark', 'light'];
const jobs = pages.flatMap((p) => modes.flatMap((m) => widths.map((w) => ({ p, m, w }))));
const browser = await chromium.launch();
const results = [];
let next = 0;

async function run({ p, m, w }) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 }, reducedMotion: 'reduce', hasTouch: w === 390 });
  await ctx.addInitScript((mode) => {
    try { localStorage.setItem('wl-mode', mode); localStorage.setItem('v4theme', mode); localStorage.setItem('wl-consent', 'denied'); } catch (e) {}
  }, m);
  const pg = await ctx.newPage();
  const out = { p, m, w, total: 0, hits: [], small: [], textUnder12: [] };
  try {
    await pg.goto(`${base}${p}.html`, { waitUntil: 'load', timeout: 45000 });
    await pg.waitForTimeout(2600);
    const h = await pg.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < Math.min(h, 30000); y += 600) { await pg.evaluate((yy) => scrollTo(0, yy), y); await pg.waitForTimeout(40); }
    await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(400);
    const r = await pg.evaluate(async (narrow) => {
      const frame = () => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
      const label = (el) => {
        if (!el) return 'null';
        const c = typeof el.className === 'string' ? el.className : el.getAttribute('class') || '';
        return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (c ? '.' + c.trim().split(/\s+/).slice(0, 3).join('.') : '');
      };
      const name = (el) => (el.getAttribute('aria-label') || el.textContent || el.value || el.placeholder || el.type || '').replace(/\s+/g, ' ').trim().slice(0, 40);
      const hidden = (el) => el.closest('[aria-hidden="true"],[inert],[hidden],dialog:not([open]),.bk,.mn:not(.on)') || el.type === 'hidden';
      const els = [...document.querySelectorAll('a[href],button,[role=button],input,select,textarea')].filter((el) => !hidden(el));
      const hits = [], small = [];
      let total = 0;
      for (const el of els) {
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        let b = el.getBoundingClientRect();
        if (b.width < 2 || b.height < 2) continue;
        el.scrollIntoView({ block: 'center', inline: 'nearest' });
        await frame();
        // reveal animations start from opacity 0 and a scaled box: give them time to land before measuring
        if (+cs.opacity < 1 || (el.style.transform && el.style.transform !== 'none')) await new Promise((res) => setTimeout(res, 900));
        if (+getComputedStyle(el).opacity === 0) continue;
        // collapsed panels (opacity 0 or a zero-height clipped box up the tree) hold no tap target
        let gone = false;
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const ac = getComputedStyle(a);
          if (+ac.opacity === 0 || ac.visibility === 'hidden' || (ac.overflow !== 'visible' && a.getBoundingClientRect().height < 2)) { gone = true; break; }
        }
        if (gone) continue;
        b = el.getBoundingClientRect();
        const x = b.left + b.width / 2, y = b.top + b.height / 2;
        if (x < 0 || x > innerWidth || y < 0 || y > innerHeight) continue;
        total++;
        const mine = (t) => t && (t === el || el.contains(t) || (el.labels && [...el.labels].some((l) => l.contains(t))));
        const top = document.elementFromPoint(x, y);
        if (!mine(top)) {
          // a card in a fan may sit under the next card (the finger lands on another link: a layout choice).
          // A layer with no link or button under the finger is never fine: that is what this script hunts.
          const other = top && top.closest('a[href],button,[role=button],input,label');
                    if (!other) hits.push({ el: label(el), name: name(el), by: label(top), byParent: label(top && top.parentElement) });
        }
        const lab = el.labels && el.labels[0] && el.labels[0].getBoundingClientRect();
        const bb = lab && lab.height >= b.height ? lab : b;
        if (narrow && (bb.height < 44 || bb.width < 44)) {
          const inline = cs.display === 'inline' && el.closest('p,li') && !el.closest('nav,.links,.legal,.flc,.rc__nm,label');
          if (!inline) small.push({ el: label(el), name: name(el), w: Math.round(bb.width), h: Math.round(bb.height) });
        }
      }
      const textUnder12 = [];
      for (const t of document.querySelectorAll('body *')) {
        if (t.closest('[aria-hidden="true"],svg,script,style,.bk,.mn:not(.on)')) continue;
        const own = [...t.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!own) continue;
        const cs = getComputedStyle(t);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const fs = parseFloat(cs.fontSize);
        if (fs < 12) textUnder12.push({ el: label(t), text: t.textContent.trim().slice(0, 20), fs });
      }
      return { total, hits, small, textUnder12: textUnder12.slice(0, 20) };
    }, w === 390);
    Object.assign(out, r);
    out.overflowX = await pg.evaluate(() => [...document.querySelectorAll('p,h1,h2,h3')].filter((e) => { const b = e.getBoundingClientRect(); return b.width && (b.right > innerWidth + 0.5 || b.left < -0.5) && !e.closest('[aria-hidden="true"],.mq2,.mq'); }).map((e) => e.textContent.trim().slice(0, 30)).slice(0, 5));
  } catch (e) { out.error = String(e.message || e).slice(0, 160); }
  await ctx.close();
  return out;
}
await Promise.all(Array.from({ length: 4 }, async () => { while (next < jobs.length) { const j = jobs[next++]; results.push(await run(j)); } }));
await browser.close();

const o = (t) => process.stdout.write(t + '\n');
const key = (p, m, w) => results.find((r) => r.p === p && r.m === m && r.w === w);
o('| page | mode | width | targets | intercepted | < 44 px | text < 12 px |\n|---|---|---|---|---|---|---|');
for (const p of pages) for (const m of modes) for (const w of widths) {
  const r = key(p, m, w);
  o(`| ${p} | ${m} | ${w} | ${r.error ? 'ERR' : r.total} | ${r.hits.length} | ${w === 390 ? r.small.length : '-'} | ${r.textUnder12.length} |`);
}
const seen = new Set();
o('\nInterceptions:');
for (const r of results) for (const h of r.hits) { const k = `${r.p}|${h.el}|${h.by}`; if (seen.has(k)) continue; seen.add(k); o(`- ${r.p} ${r.m} ${r.w}: ${h.el} "${h.name}" covered by ${h.by} (in ${h.byParent})`); }
o('\nUnder 44 px at 390:');
const seen2 = new Set();
for (const r of results) for (const s of r.small) { const k = `${r.p}|${s.el}|${s.name}`; if (seen2.has(k)) continue; seen2.add(k); o(`- ${r.p}: ${s.el} "${s.name}" ${s.w}x${s.h}`); }
o('\nText under 12 px:');
const seen3 = new Set();
for (const r of results) for (const s of r.textUnder12) { const k = `${r.p}|${r.w}|${s.el}`; if (seen3.has(k)) continue; seen3.add(k); o(`- ${r.p} ${r.w}: ${s.el} "${s.text}" ${s.fs}px`); }
o('\nOverflowing text:');
for (const r of results) if (r.overflowX?.length) o(`- ${r.p} ${r.m} ${r.w}: ${r.overflowX.join(' / ')}`);
for (const r of results) if (r.error) o(`- ERROR ${r.p} ${r.m} ${r.w}: ${r.error}`);
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(results, null, 1));
const bad = results.some((r) => r.error || r.hits.length || (r.w === 390 && r.small.length));
process.exit(bad ? 1 : 0);
