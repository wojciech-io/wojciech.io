// v4 helpers for the real pages. Generated pages set <html data-base="../"> (the path back to the site root).
const BASE = document.documentElement.dataset.base || '';
const SRC = {
  t: (n) => BASE + 'assets/tools/' + n + '.webp',
  i: (n) => '/images/insights/' + n + '.webp',
  l: (n) => BASE + 'assets/logos/ico/' + n + '.svg',
  r: (n) => BASE + 'assets/real/' + n + '.webp',
};
// Light is the default (Wojtek, 20.11.2026), dark is the variant: ?theme=dark, or the switch in the menu (remembered).
let THEME = new URLSearchParams(location.search).get('theme');
try { if (!THEME) THEME = localStorage.getItem('v4theme'); else localStorage.setItem('v4theme', THEME); } catch (e) {}
const LIGHT = THEME !== 'dark';
// The markup is authored dark; light flips it: olive blocks turn cream and the other way round, statements stay dark, interfaces go light.
if (LIGHT) {
  document.documentElement.dataset.theme = 'light';
  document.querySelectorAll('.sec').forEach((sec) => { const c = sec.classList; if (c.contains('stm')) return; if (c.contains('olive')) c.replace('olive', 'cream'); else if (c.contains('cream')) c.replace('cream', 'olive'); else if (c.contains('black')) c.replace('black', 'paper'); });
}
document.querySelectorAll('.curve,.demo').forEach((sec) => { const prev = sec.previousElementSibling; if (prev) sec.style.setProperty('--from', getComputedStyle(prev).backgroundColor); });
document.querySelectorAll('[data-img]').forEach((el) => { const [k, n] = el.dataset.img.split(':'); el.src = SRC[k](n); });

// nav and footer follow what /revolution ships: two-line brand, footer with the portrait and one Book a call button
const REAL = BASE + 'assets/real/';
const BOOK = 'https://wojciech.io/contact/';
const PAGES = [['GTM', 'gtm.html'], ['Marketing', 'marketing.html'], ['Growth', 'growth.html'], ['Work', 'work.html'], ['Insights', 'insights.html'], ['About', 'about.html']];
document.querySelectorAll('[data-nav]').forEach((el) => {
  el.outerHTML = `<div class="nav"><a class="logo" href="${BASE}index.html">Wojciech<i>Luszczynski</i></a><div class="r"><a class="btn" href="${BOOK}">Book a call <i>→</i></a><button class="menu" type="button" aria-expanded="false" aria-controls="v4menu" aria-label="Menu"><i></i></button></div>
    <nav class="mnu" id="v4menu" aria-label="Pages" hidden>${PAGES.map(([t, h]) => `<a href="${BASE}${h}">${t}</a>`).join('')}<button type="button" class="mnu__th">${LIGHT ? 'Dark mode' : 'Light mode'}</button></nav></div>`;
});
document.querySelectorAll('.menu').forEach((b) => {
  const m = document.getElementById(b.getAttribute('aria-controls'));
  b.addEventListener('click', () => { const open = m.hidden; m.hidden = !open; b.setAttribute('aria-expanded', String(open)); });
  m.querySelector('.mnu__th').addEventListener('click', () => { try { localStorage.setItem('v4theme', LIGHT ? 'dark' : 'light'); } catch (e) {} const u = new URL(location.href); u.searchParams.set('theme', LIGHT ? 'dark' : 'light'); location.href = u.href; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !m.hidden) { m.hidden = true; b.setAttribute('aria-expanded', 'false'); b.focus(); } });
});
document.querySelectorAll('[data-ftr]').forEach((el) => {
  el.outerHTML = `<footer class="ftr"><div class="ftr__pn"><svg class="ct" data-seed="53"></svg>
    <span class="cap ftr__eb">Book a call</span>
    <h2 class="st">Is there a <span class="s">system</span><br>worth <span class="s">fixing</span>?</h2>
    <p class="ftr__sub">Thirty minutes on your pipeline. You get a written next step the same day.</p>
    <div class="ftr__row">
      <div class="ftr__lk"><h6>Pages</h6>${PAGES.map(([t, h]) => `<a href="${BASE}${h}">${t}</a>`).join('')}</div>
      <div class="ftr__me"><img src="${REAL}loft-head.webp" alt=""><a class="btn ftr__lap" href="${BOOK}">Book a call <i>→</i></a></div>
      <div class="ftr__lk r"><h6>Follow on</h6><a href="https://www.linkedin.com/in/wojciech-luszczynski/" target="_blank" rel="noopener">LinkedIn</a><a href="https://github.com/wojciechluszczynski" target="_blank" rel="noopener">GitHub</a><a href="${BASE}newsletter.html">Newsletter</a></div>
    </div>
  </div></footer>`;
});

// markup from our own templates goes in through a <template> (no insertAdjacentHTML: semgrep blocks it)
const put = (el, how, html) => { const t = document.createElement('template'); t.innerHTML = html; el[how](t.content); };

// contour lines (own generator: concentric wobbly rings)
function contours(svg, w, h, seed, stroke) {
  let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const u = Math.max(w, 700) / 1440;
  const centers = [[w * .16, h * .3, 7, 46 * u, 30], [w * .86, h * .7, 8, 44 * u, 24], [w * .5, h * 1.04, 6, 52 * u, 40]];
  let out = '';
  centers.forEach(([cx, cy, n, step, base]) => {
    const ph = [r() * 6.28, r() * 6.28, r() * 6.28];
    for (let k = 1; k <= n; k++) {
      const rad = base + k * step, N = 16, pts = [];
      for (let i = 0; i < N; i++) {
        const a = i * 6.2832 / N, wob = 1 + .28 * Math.sin(a * 2 + ph[0] + k * .07) + .16 * Math.sin(a * 3 + ph[1]) + .08 * Math.sin(a * 5 + ph[2]);
        pts.push([cx + Math.cos(a) * rad * wob * 1.25, cy + Math.sin(a) * rad * wob]);
      }
      let d = '';
      for (let i = 0; i < N; i++) {
        const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
        if (!i) d += `M${p1[0].toFixed(1)},${p1[1].toFixed(1)}`;
        d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
      }
      out += `<path d="${d}Z"/>`;
    }
  });
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.setAttribute('preserveAspectRatio', 'none');
  svg.innerHTML = `<g fill="none" stroke="${stroke}" stroke-width="1.2">${out}</g>`;
}

// cut-corner outline for a cell; the notch is sized to its label
const NOTCH = (W, H, nw) => `M12,0H${W - 12}Q${W},0 ${W},12V${H - 44}Q${W},${H - 32} ${W - 12},${H - 32}H${W - nw + 34}C${W - nw + 20},${H - 32} ${W - nw + 16},${H} ${W - nw},${H}H12Q0,${H} 0,${H - 12}V12Q0,0 12,0Z`;

// data-uim names a simpler screen for the phone (a portrait instead of a cropped full screen)
document.querySelectorAll('[data-ui]').forEach((h) => { const m = innerWidth <= 760 && h.dataset.uim; if (m) { h.dataset.m = ''; h.dataset.d = ''; } put(h, 'append', U[m || h.dataset.ui]()); });
// skin: data-skin on the host wins (dk, lt, bl, gr, lm); otherwise the page theme decides
document.querySelectorAll('[data-ui]').forEach((h) => { const el = h.querySelector('.ui'), sk = h.dataset.skin; if (sk === 'lt' || (!sk && LIGHT)) el.classList.add('lt'); else if (sk && sk !== 'dk') el.classList.add('sk-' + sk); });
// scale a redrawn screen into its host: data-d / data-m = "zoom,panX%,panY%,fit(w|h)"
function fitUI() {
  const mob = innerWidth <= 760;
  document.querySelectorAll('[data-ui]').forEach((h) => {
    const el = h.querySelector('.ui'), bw = el.offsetWidth, bh = el.offsetHeight;
    const [z = 1, x = 0, y = 0, fit = 'w'] = ((mob && h.dataset.m) || h.dataset.d || '').split(',');
    const k = (fit === 'h' ? h.clientHeight / bh : h.clientWidth / bw) * (+z || 1);
    el.style.transform = `translate(${-x / 100 * bw * k}px,${-y / 100 * bh * k}px) scale(${k})`;
  });
}

function draw() {
  fitUI();
  document.querySelectorAll('svg.ct').forEach((svg) => {
    const sec = svg.parentElement, light = sec.closest('.cream,.paper,.lime') && !sec.classList.contains('ftr__pn');
    contours(svg, sec.clientWidth, sec.clientHeight, +svg.dataset.seed || 7, light ? 'rgba(17,17,18,.13)' : 'rgba(178,199,58,.15)');
  });
  document.querySelectorAll('.cell').forEach((c) => {
    const W = c.clientWidth, H = c.clientHeight, lab = c.querySelector('.cell__lab');
    const nw = Math.min(W - 40, (lab ? lab.offsetWidth : 150) + 52);
    put(c, 'prepend', `<svg class="o" viewBox="0 0 ${W} ${H}"><path d="${NOTCH(W, H, nw)}"/></svg>`);
  });
  document.documentElement.dataset.ready = '1';
}
const imgs = [...document.images].map((im) => im.complete ? 0 : new Promise((ok) => { im.onload = im.onerror = ok; }));
Promise.all([document.fonts.ready, ...imgs]).then(draw);
