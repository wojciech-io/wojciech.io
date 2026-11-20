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
const MENU = [['Home', 'index.html', 'assets/menu/home-companies.webp', 'Revenue systems for B2B SaaS, built and run.'], ['Work', 'work.html', 'assets/menu/work-apps.webp', 'Apps, demos and repos with sample data.'], ['GTM', 'gtm.html', 'assets/menu/lens-gtm.webp', 'Pipeline, RevOps and outbound in one model.'], ['Marketing', 'marketing.html', 'assets/menu/lens-marketing.webp', 'Positioning, content and paid, traced to pipeline.'], ['Growth', 'growth.html', 'assets/menu/lens-growth.webp', 'Experiments, activation and lifecycle.'], ['Insights', 'insights.html', 'assets/menu/insights-covers.webp', 'Notes and talks on AI and go to market.'], ['About', 'about.html', 'assets/crowd.webp', 'Twenty years, ten roles, talks and references.']];
// quick links shown in the menu panel (kept in step with content.json by hand)
const QUICK = {"work": [["Apps", [["Team task board", "apps/team-task-board.html"], ["Marketing performance hub", "apps/marketing-performance-hub.html"], ["Inbound lead review agent", "apps/inbound-lead-review-agent.html"], ["AdsAI", "apps/adsai.html"], ["Service growth analytics", "apps/service-growth-analytics.html"]]], ["Cases", [["Content Studio", "work/content-studio.html"], ["Multichannel data engine", "work/multichannel-data-engine.html"], ["Form-to-CRM handoff", "work/form-to-crm-handoff.html"], ["Website migration and redirect QA", "work/website-migration.html"], ["Ecommerce funnel diagnosis", "work/ecommerce-funnel-diagnosis.html"], ["Industry landing pages and measurement", "work/industry-landing-pages.html"], ["Lifecycle interventions from customer signals", "work/lifecycle-intervention-design.html"]]]], "insights": [["New notes", [["Put a review step before an AI-driven CRM update", "insights/ai-review-before-crm-write.html"], ["Design dashboards for the day an input is late", "insights/dashboard-with-late-data.html"], ["Measure activation with a mature denominator", "insights/measure-mature-cohorts.html"], ["Find the ecommerce step worth testing", "insights/find-ecommerce-friction.html"], ["Build email segments a reviewer can audit", "insights/overlap-safe-email-audiences.html"], ["Measure AI search visibility with repeatable questions", "insights/evaluate-ai-search-visibility.html"], ["Keep the next action visible through a handoff", "insights/keep-ownership-through-handoffs.html"]]]]};
const SOC = [['LinkedIn', 'https://www.linkedin.com/in/wojciech-luszczynski/', "<svg class=\"si\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z\"/></svg>"], ['GitHub', 'https://github.com/wojciechluszczynski', "<svg class=\"si\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12\"/></svg>"], ['Newsletter', BASE + 'newsletter.html', "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\"><rect x=\"2.5\" y=\"4.5\" width=\"19\" height=\"15\" rx=\"2.5\"/><path d=\"m3.5 6.5 8.5 6.5 8.5-6.5\"/></svg>"]];
const MODEI = {"dark": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5 8.6 8.6 0 1 0 20.5 14.6z\"/></svg>", "light": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"5\"/><path d=\"M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>"};
const LANGS = ['EN', 'PL', 'DE', 'ES', 'IT', 'DK', 'NO', 'JP', 'AR'];
document.querySelectorAll('[data-nav]').forEach((el) => {
  const here = location.pathname.replace(/\/+$/, '').split('/').pop();
  el.outerHTML = `<div class="nav"><a class="logo" href="${BASE}index.html">Wojciech<i>Luszczynski</i></a><div class="r"><a class="btn" href="${BOOK}">Book a call <i>→</i></a><button class="menu" type="button" aria-expanded="false" aria-controls="v4menu" aria-label="Menu"><i></i></button></div></div>
    <div class="mnu${LIGHT ? ' mnu--lt' : ''}" id="v4menu" role="dialog" aria-modal="true" aria-label="Menu" hidden><svg class="mnu__ct" aria-hidden="true"></svg><div class="mnu__top"><a class="logo" href="${BASE}index.html">Wojciech<i>Luszczynski</i></a><button class="mnu__x" type="button" aria-label="Close menu"><i></i></button></div>
      <nav class="mnu__nav" aria-label="Pages">${MENU.map(([t, h, im, d], i) => `<a href="${BASE}${h}" data-k="${h.replace('.html', '')}" data-im="${BASE}${im}" data-d="${d}"${h === here ? ' aria-current="page"' : ''}><span>0${i + 1}</span>${t}</a>`).join('')}</nav>
      <div class="mnu__ph" aria-hidden="true"><div class="mnu__pv"><img src="${BASE}${MENU[0][2]}" alt=""><div class="mnu__pc"><b>${MENU[0][0]}</b><span>${MENU[0][3]}</span></div><div class="mnu__q"></div></div></div>
      <div class="mnu__bar"><a class="btn" href="${BOOK}">Book a call <i>→</i></a><div class="mnu__set"><div class="mnu__lg" role="group" aria-label="Language">${LANGS.map((l) => l === 'EN' ? `<a href="${BASE}index.html" aria-current="true" lang="en" title="English">EN</a>` : `<span title="Soon" aria-disabled="true">${l}</span>`).join('')}</div><div class="mnu__th" role="group" aria-label="Colour mode"><button type="button" data-th="dark" aria-pressed="${!LIGHT}">${MODEI.dark}Dark</button><button type="button" data-th="light" aria-pressed="${LIGHT}">${MODEI.light}Light</button></div></div><div class="mnu__so">${SOC.map(([t, h, ic]) => `<a href="${h}"${h.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${ic}${t}</a>`).join('')}</div></div></div>`;
});
document.querySelectorAll('.menu').forEach((b) => {
  const m = document.getElementById(b.getAttribute('aria-controls')); document.body.append(m); const x = m.querySelector('.mnu__x');
  const img = m.querySelector('.mnu__pv img'), pt = m.querySelector('.mnu__pc b'), pd = m.querySelector('.mnu__pc span');
  const qs = m.querySelector('.mnu__q');
  const preview = (a) => {
    if (!a) return; pt.textContent = a.lastChild.textContent; pd.textContent = a.dataset.d; if (img.getAttribute('src') !== a.dataset.im) img.src = a.dataset.im;
    const groups = QUICK[a.dataset.k] || [];
    qs.replaceChildren(...groups.map(([h, items]) => { const d = document.createElement('div'); const t = document.createElement('h6'); t.textContent = h; d.append(t); items.forEach(([n, u]) => { const l = document.createElement('a'); l.href = BASE + u; l.textContent = n; d.append(l); }); return d; }));
    m.querySelector('.mnu__ph').classList.toggle('has-q', groups.length > 0);
  };
  m.querySelectorAll('.mnu__nav a').forEach((a) => { a.addEventListener('mouseenter', () => preview(a)); a.addEventListener('focus', () => preview(a)); });
  const set = (open) => {
    m.hidden = !open; b.setAttribute('aria-expanded', String(open)); document.documentElement.classList.toggle('mnu-open', open);
    if (open) { const c = m.querySelector('.mnu__ct'); contours(c, innerWidth, innerHeight, 71, LIGHT ? 'rgba(40,44,32,.13)' : 'rgba(244,244,237,.1)'); const cur = (/\/(apps|work)\//.test(location.pathname) ? 'work' : /\/insights\//.test(location.pathname) ? 'insights' : '');
      const t = m.querySelector('.mnu__nav a[data-k="' + (cur || 'index') + '"]'); preview(t); t.focus(); } else b.focus();
  };
  b.addEventListener('click', () => set(m.hidden));
  x.addEventListener('click', () => set(false));
  m.querySelectorAll('[data-th]').forEach((t) => t.addEventListener('click', () => { const v = t.dataset.th; if ((v === 'light') === LIGHT) return; try { localStorage.setItem('v4theme', v); } catch (e) {} const u = new URL(location.href); u.searchParams.set('theme', v); location.href = u.href; }));
  document.addEventListener('keydown', (e) => {
    if (m.hidden) return;
    if (e.key === 'Escape') set(false);
    if (e.key === 'Tab') { const f = [...m.querySelectorAll('a[href],button')]; const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
  });
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
