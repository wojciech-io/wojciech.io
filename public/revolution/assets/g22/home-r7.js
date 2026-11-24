/* Home R7, hero: depth and motion. No dependencies. Pairs with home-r7.css.
   What it does, in order of what the eye catches:
   1. the claims are split into letters inside a mask and enter when the loader lifts (left half rises, right half drops, with a small overshoot)
   2. the tool map draws after the loader, and data packets run from a tool, along its branch and trunk, into the hub behind him (the hub flashes)
   3. one loop moves six layers by different amounts: pointer on a mouse, a slow drift on touch (no gyroscope), scroll on both
   Everything here is transform, translate or opacity. Reduced motion: no split, no loop, no packets, the hero is the still picture the CSS draws. */
(function () {
  'use strict';
  var hero = document.querySelector('.hero');
  if (!hero) { return; }
  var root = document.documentElement;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = matchMedia('(hover: none)').matches;
  var phone = matchMedia('(max-width: 599px)');
  var sv = hero.querySelector('.hero__sk.tm');
  var NS = 'http://www.w3.org/2000/svg';
  var hw = hero.querySelector('.hw');

  /* ---- a second, nearer layer of contour lines (the existing canvas is the far one) ---- */
  (function nearContours() {
    if (!hw || typeof window.field !== 'function' || typeof window.contour !== 'function') { return; }
    try {
      var s = document.createElementNS(NS, 'svg');
      s.setAttribute('class', 'hw__ct');
      s.setAttribute('viewBox', '0 0 1600 1000');
      s.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      s.setAttribute('aria-hidden', 'true');
      var lv = [];
      for (var l = -1.1; l <= 1.1; l += 0.55) { lv.push(l); }
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', window.contour(window.field(71), 1600, 1000, 64, 40, lv));
      s.appendChild(p);
      hw.insertBefore(s, hw.firstChild);
    } catch (e) { /* the far layer alone is fine */ }
  })();

  function go() {
    if (hero.classList.contains('hw-go')) { return; }
    hero.classList.add('hw-go');
    if (RM) { hero.classList.add('hw-live'); } else { setTimeout(function () { hero.classList.add('hw-live'); }, 2600); }
    if (!RM) { startLoop(); }
  }

  if (RM) { go(); return; }
  root.classList.add('hw-js');

  /* ---- 1. the claims, letter by letter ---- */
  (function split() {
    var spans = hero.querySelectorAll('.hh>span');
    if (!spans.length) { return; }
    var lineNo = 0;
    spans.forEach(function (sp, si) {
      var host = sp.querySelector('em') || sp;
      var lines = [[]];
      Array.prototype.slice.call(host.childNodes).forEach(function (n) {
        if (n.nodeName === 'BR') { lines.push([]); } else { lines[lines.length - 1].push(n); }
      });
      host.textContent = '';
      lines.forEach(function (nodes, li) {
        var ln = document.createElement('span');
        ln.className = 'hw-ln';
        /* the right half starts a beat after the left half has landed */
        ln.style.setProperty('--ld', String((si ? 3.6 : 0) + li));
        var ci = 0;
        nodes.forEach(function (n) {
          var text = n.textContent || '';
          text.split(/(\s+)/).forEach(function (part) {
            if (!part) { return; }
            if (/^\s+$/.test(part)) { ln.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span');
            w.className = 'hw-w';
            part.split('').forEach(function (ch) {
              var c = document.createElement('span');
              c.className = 'hw-c';
              c.style.setProperty('--ci', String(ci++));
              c.textContent = ch;
              w.appendChild(c);
            });
            ln.appendChild(w);
          });
        });
        host.appendChild(ln);
        lineNo++;
      });
    });
    root.classList.add('hw-split');
  })();

  /* ---- when the loader lifts ---- */
  (function whenLoaderLifts() {
    var ld = document.getElementById('ld');
    setTimeout(go, 7000); /* never leave the hero unrevealed */
    if (!ld || ld.classList.contains('out')) {
      if (document.readyState === 'complete') { setTimeout(go, 60); } else { addEventListener('load', function () { setTimeout(go, 60); }); }
      return;
    }
    var mo = new MutationObserver(function () {
      if (ld.classList.contains('out') || !document.body.contains(ld)) { mo.disconnect(); setTimeout(go, 220); }
    });
    mo.observe(ld, { attributes: true, attributeFilter: ['class'] });
  })();

  /* ---- 3. layers: far to near. ax, ay: px at full pointer travel (negative = moves with the pointer); sk: px of lag per px scrolled ---- */
  var layers = [];
  function layer(el, ax, ay, sk, skPhone) {
    if (el) { layers.push({ el: el, ax: ax, ay: ay, sk: sk, skp: skPhone === undefined ? sk : skPhone, v: '' }); }
  }
  layer(hero.querySelector('canvas.contours'), 4, 3, 0.3);
  layer(hero.querySelector('.hw__ct'), 10, 6, 0.22);
  layer(hero.querySelector('.hw__glow'), 9, 6, 0.16);
  layer(sv, -5, -3, 0.08);
  layer(hero.querySelector('.hero__me'), 18, 10, 0, 0);
  layer(hero.querySelector('.hh'), 32, 18, -0.14, 0); /* on a phone GSAP already moves the claims on scroll */
  layer(hero.querySelector('.hw__fg--a'), 60, 40, -0.35);
  layer(hero.querySelector('.hw__fg--b'), 90, 55, -0.5);
  layer(hero.querySelector('.hw__fg--c'), 45, 30, -0.3);

  var cur = { h: 0, v: 0 };
  var tgt = { h: 0, v: 0 };
  var lastMove = 0;
  var heroH = hero.offsetHeight || innerHeight;
  addEventListener('resize', function () { heroH = hero.offsetHeight || innerHeight; }, { passive: true });
  hero.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') { return; }
    var r = hero.getBoundingClientRect();
    tgt.h = ((e.clientX - r.left) / r.width - 0.5) * 2;
    tgt.v = ((e.clientY - r.top) / r.height - 0.5) * 2;
    lastMove = performance.now();
  }, { passive: true });
  hero.addEventListener('pointerleave', function () { lastMove = 0; });

  /* ---- 2. data packets ---- */
  var pk = null;
  var groups = [];
  var packets = [];
  var hitEl = hero.querySelector('.hw__hit');
  var nextSpawn = 0;
  var goAt = 0;
  if (sv) {
    pk = document.createElementNS(NS, 'g');
    pk.setAttribute('class', 'hw__pk');
    sv.appendChild(pk);
    groups = [].slice.call(sv.querySelectorAll('.tm__c')).map(function (g) {
      return { g: g, tr: sv.querySelector('.tm__tr[data-k="' + g.dataset.k + '"]'), nodes: [].slice.call(g.querySelectorAll('.tm__n')) };
    }).filter(function (G) { return G.tr; });
  }
  var TR = /translate\(\s*(-?[\d.]+)[\s,]+(-?[\d.]+)\s*\)/;
  function ease(u) { return (1 - Math.cos(Math.PI * u)) / 2; }
  function circle(cls, r, o) {
    var c = document.createElementNS(NS, 'circle');
    c.setAttribute('class', cls);
    c.setAttribute('r', r);
    if (o) { c.setAttribute('opacity', o); }
    return c;
  }
  function spawn(now) {
    var G = groups[(Math.random() * groups.length) | 0];
    var open = G.nodes.filter(function (n) { return n.style.display !== 'none'; });
    if (!open.length) { return; }
    var n = open[(Math.random() * open.length) | 0];
    var br = n.querySelector('.tm__br');
    var gl = n.querySelector('.tm__g');
    if (!br) { return; }
    var el = document.createElementNS(NS, 'g');
    var parts = [circle('h', 10), circle('t', 1.5, 0.22), circle('t', 2.1, 0.4), circle('t', 2.7, 0.65), circle('t', 3.4)];
    parts.forEach(function (c) { el.appendChild(c); });
    el.setAttribute('opacity', '0');
    pk.appendChild(el);
    var lb = br.getTotalLength(), lt = G.tr.getTotalLength();
    packets.push({ G: G, br: br, el: el, parts: parts, t0: now, d1: 520 + lb * 3.2, d2: 900 + lt * 1.7, lb: lb, lt: lt, hist: [] });
    if (gl) {
      gl.classList.remove('pi');
      setTimeout(function () { gl.classList.add('pi'); setTimeout(function () { gl.classList.remove('pi'); }, 800); }, 20);
    }
  }
  function pos(p, now) {
    var e = now - p.t0, x, y, pt;
    if (e < p.d1) {
      var m = TR.exec(p.G.g.getAttribute('transform') || '') || [0, 0, 0];
      pt = p.br.getPointAtLength(p.lb * (1 - ease(e / p.d1)));
      x = pt.x + +m[1]; y = pt.y + +m[2];
    } else {
      pt = p.G.tr.getPointAtLength(p.lt * ease(Math.min(1, (e - p.d1) / p.d2)));
      x = pt.x; y = pt.y;
    }
    return [x, y];
  }
  function hit() {
    if (!hitEl || !sv || !groups.length) { return; }
    var tr = groups[0].tr, end = tr.getPointAtLength(tr.getTotalLength()), m = sv.getScreenCTM(), r = hero.getBoundingClientRect();
    if (!m) { return; }
    hitEl.style.left = (m.a * end.x + m.c * end.y + m.e - r.left).toFixed(1) + 'px';
    hitEl.style.top = (m.b * end.x + m.d * end.y + m.f - r.top).toFixed(1) + 'px';
    if (hitEl.animate) {
      hitEl.animate(
        [{ opacity: 0, transform: 'scale(.45)' }, { opacity: 1, transform: 'scale(1)', offset: 0.2 }, { opacity: 0, transform: 'scale(1.45)' }],
        { duration: 1000, easing: 'cubic-bezier(.2,.7,.1,1)' }
      );
    }
  }
  function clearPackets() { packets.forEach(function (p) { p.el.remove(); }); packets = []; }

  /* ---- the loop: runs only while the hero is on screen ---- */
  var raf = 0, onScreen = true, last = 0;
  new IntersectionObserver(function (es) {
    onScreen = es[0].isIntersecting;
    if (!onScreen) { cancelAnimationFrame(raf); raf = 0; clearPackets(); last = 0; } else if (hero.classList.contains('hw-go') && !raf) { raf = requestAnimationFrame(frame); }
  }, { rootMargin: '60px' }).observe(hero);

  function startLoop() { goAt = performance.now(); nextSpawn = goAt + 2500; if (onScreen && !raf) { raf = requestAnimationFrame(frame); } }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    var dt = Math.min(64, last ? now - last : 16);
    last = now;
    var small = phone.matches;

    /* reads first */
    var arrived = 0;
    var ready = sv && sv.classList.contains('in');
    var pts = [];
    for (var i = 0; i < packets.length; i++) {
      var p = packets[i];
      if (now - p.t0 >= p.d1 + p.d2) { arrived++; p.dead = true; continue; }
      pts.push(pos(p, now));
    }

    /* the pointer, the drift, the scroll */
    if (coarse) { tgt.h = Math.sin(now / 2100) * 0.8; tgt.v = Math.cos(now / 2700) * 0.6; }
    else if (!lastMove || now - lastMove > 2400) { tgt.h = Math.sin(now / 2600) * 0.22; tgt.v = Math.cos(now / 3300) * 0.16; }
    var k = 1 - Math.exp(-dt / 190);
    cur.h += (tgt.h - cur.h) * k;
    cur.v += (tgt.v - cur.v) * k;
    var sy = Math.min(Math.max(0, window.scrollY), heroH);
    var amp = small ? 0.8 : 1;
    for (var j = 0; j < layers.length; j++) {
      var L = layers[j];
      var v = (-cur.h * L.ax * amp).toFixed(2) + 'px ' + (-cur.v * L.ay * amp + sy * (small ? L.skp : L.sk)).toFixed(2) + 'px';
      if (v !== L.v) { L.v = v; L.el.style.translate = v; }
    }

    /* packets */
    var q = 0;
    for (var a = packets.length - 1; a >= 0; a--) {
      if (packets[a].dead) { packets[a].el.remove(); packets.splice(a, 1); }
    }
    for (var b = 0; b < packets.length; b++) {
      var P = packets[b], pt = pts[q++];
      if (!pt) { continue; }
      P.hist.push(pt);
      if (P.hist.length > 12) { P.hist.shift(); }
      var hl = P.hist.length;
      var idx = [hl - 1, Math.max(0, hl - 4), Math.max(0, hl - 7), Math.max(0, hl - 10)];
      var u = (now - P.t0) / (P.d1 + P.d2);
      P.el.setAttribute('opacity', (u < 0.06 ? u / 0.06 : u > 0.9 ? Math.max(0, (1 - u) / 0.1) : 1).toFixed(2));
      var h0 = P.hist[idx[0]];
      P.parts[0].setAttribute('cx', h0[0].toFixed(1)); P.parts[0].setAttribute('cy', h0[1].toFixed(1));
      for (var t = 1; t <= 3; t++) { var hp = P.hist[idx[4 - t]]; P.parts[t].setAttribute('cx', hp[0].toFixed(1)); P.parts[t].setAttribute('cy', hp[1].toFixed(1)); }
      P.parts[4].setAttribute('cx', h0[0].toFixed(1)); P.parts[4].setAttribute('cy', h0[1].toFixed(1));
    }
    if (arrived) { hit(); }
    if (ready && pk && now > nextSpawn && packets.length < (small ? 4 : 7) && !document.hidden) {
      spawn(now);
      nextSpawn = now + (small ? 650 + Math.random() * 450 : 380 + Math.random() * 380);
    }
  }
})();
