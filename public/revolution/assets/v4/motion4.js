// v4 micro-interactions. Plain JS so the mockups stay light; on the site the same moves map onto GSAP and ScrollTrigger,
// which /revolution already loads. With ?still=1 or reduced motion nothing animates and every state is the final one.
(() => {
  const STILL = new URLSearchParams(location.search).has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const tickDoc = (doc, now) => $$('li', doc).forEach((li, i) => setTimeout(() => li.classList.add('tick'), now ? 0 : 500 + i * 320));

  if (STILL) { $$('.doc').forEach((d) => tickDoc(d, true)); return; }
  document.documentElement.classList.add('mo');

  // 1. things arrive as you reach them, siblings one after another
  const groups = ['.hero__grid>*', '.hero__obj', '.trk__intro', '.sl', '.prod__tx', '.prod__a', '.spl__img', '.spl__half', '.doc', '.lm__tx', '.cell', '.fc', '.vc',
    '.cvr__in', '.cmp>div', '.feat__tx', '.feat__m', '.mtr>div', '.big>*', '.built__cv', '.take', '.demo__win', '.demo__ft', '.gal__hd>*', '.rel>h2', '.built__grid>*', '.art__hd>*:not(.nav):not(svg)', '.ftr__pn>*:not(svg)'];
  const seen = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; e.target.classList.add('in'); seen.unobserve(e.target);
    if (e.target.classList.contains('doc')) tickDoc(e.target);
    e.target.dispatchEvent(new CustomEvent('arrive'));
  }), { threshold: .16, rootMargin: '0px 0px -6% 0px' });
  groups.forEach((g) => $$(g).forEach((el) => {
    const i = [...el.parentElement.children].filter((c) => c.matches(g.split('>').pop().trim() === '*' ? '*' : g.split(' ').pop().split('>').pop())).indexOf(el);
    el.classList.add('rv'); el.style.setProperty('--d', Math.min(Math.max(i, 0), 5) * 80 + 'ms'); seen.observe(el);
  }));

  // 2. statements light up word by word as they cross the screen
  const sts = $$('.st').map((st) => {
    [...st.childNodes].forEach((n) => {
      if (n.nodeType === 3) { const f = document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach((t) => { if (!t) return; if (/^\s+$/.test(t)) return f.appendChild(document.createTextNode(t)); const w = document.createElement('span'); w.className = 'w'; w.textContent = t; f.appendChild(w); }); n.replaceWith(f); }
      else if (n.nodeType === 1 && n.tagName !== 'BR') n.classList.add('w');
    });
    return [st, $$('.w', st)];
  });
  const light = () => sts.forEach(([st, ws]) => { const r = st.getBoundingClientRect(), p = (innerHeight * .88 - r.top) / (innerHeight * .42 + r.height * .5); ws.forEach((w, i) => w.classList.toggle('lit', i / ws.length < p)); });
  addEventListener('scroll', light, { passive: true }); addEventListener('resize', light); light();

  // 3. the track really slides: arrows, drag or swipe, and the bar and counter follow
  $$('.trk').forEach((trk) => {
    const sl = trk.querySelector('.trk__sl'), slides = $$('.sl', trk), bar = trk.querySelector('.trk__bar i'), cnt = trk.querySelector('.trk__ctl .cap'), arr = $$('.arr', trk);
    const step = () => slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : sl.clientWidth, idx = () => Math.min(slides.length - 1, Math.round(sl.scrollLeft / step()));
    const sync = () => { const i = idx(); bar.style.width = (i + 1) / slides.length * 100 + '%'; cnt.textContent = (i + 1) + ' / ' + slides.length; arr[0] && arr[0].classList.toggle('off', i === 0); arr[1] && arr[1].classList.toggle('off', i === slides.length - 1); };
    sl.addEventListener('scroll', sync, { passive: true }); sync();
    arr.forEach((a, k) => a.addEventListener('click', () => sl.scrollTo({ left: (idx() + (k ? 1 : -1)) * step(), behavior: 'smooth' })));
    let down = null; sl.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') down = [e.clientX, sl.scrollLeft]; });
    addEventListener('pointermove', (e) => { if (down) sl.scrollLeft = down[1] - (e.clientX - down[0]); });
    addEventListener('pointerup', () => { if (down) { down = null; sl.scrollTo({ left: idx() * step(), behavior: 'smooth' }); } });
  });

  // 4. the cover leans after the pointer
  $$('.cv--lg').forEach((cv) => cv.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); cv.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3)); cv.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3)); }));

  // 5. Content Studio types its one sentence, then the app proposes the rest
  $$('.hero__obj').forEach((host) => host.addEventListener('arrive', async () => {
    const big = host.querySelector('.u-big'); if (!big) return; const txt = big.textContent; host.classList.add('typing');
    big.style.minHeight = big.offsetHeight + 'px'; big.textContent = ''; await wait(500);
    for (let i = 1; i <= txt.length; i++) { big.textContent = txt.slice(0, i); await wait(i % 9 ? 16 : 46); }
    host.classList.remove('typing'); host.classList.add('typed');
  }));

  // 6. AdsAI works through today's priorities by itself: a pointer goes to each action and presses it
  $$('.demo__shot').forEach((host) => (host.closest('.rv') || host).addEventListener('arrive', async () => {
    const ui = host.querySelector('.ui'), btns = $$('.u-row .u-btn', ui); if (!btns.length) return;
    const done = ['Paused', 'Optimized', 'Analyzed'], was = btns.map((b) => b.textContent);
    const cur = document.createElement('i'); cur.className = 'u-cur'; ui.appendChild(cur);
    const go = (b) => { const u = ui.getBoundingClientRect(), r = b.getBoundingClientRect(), k = u.width / ui.offsetWidth; cur.style.left = ((r.left + r.width / 2 - u.left) / k) + 'px'; cur.style.top = ((r.top + r.height / 2 - u.top) / k) + 'px'; };
    for (;;) {
      for (const [i, b] of btns.entries()) { go(b); cur.classList.add('on'); await wait(900); cur.classList.add('dn'); b.classList.add('hit'); b.textContent = done[i] || 'Done'; b.closest('.u-row').classList.add('hit'); await wait(260); cur.classList.remove('dn'); await wait(1100); }
      await wait(1800); cur.classList.remove('on'); btns.forEach((b, i) => { b.classList.remove('hit'); b.textContent = was[i]; b.closest('.u-row').classList.remove('hit'); }); await wait(1400);
    }
  }));
})();
