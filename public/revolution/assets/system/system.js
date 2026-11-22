/* Library behaviour: mode toggle, tabs with #hash, live token reader, copy buttons, motion demos. No dependencies. */
(function () {
  var d = document, root = d.documentElement;
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }

  /* mode */
  var mb = $('.sy-mode');
  function syncMode() {
    var m = root.dataset.mode;
    mb.setAttribute('aria-pressed', m === 'light' ? 'true' : 'false');
    mb.setAttribute('aria-label', m === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  }
  mb.addEventListener('click', function () {
    var m = root.dataset.mode === 'light' ? 'dark' : 'light';
    root.dataset.mode = m; root.style.colorScheme = m;
    try { localStorage.setItem('wl-mode', m); } catch (e) {}
    syncMode();
  });
  syncMode();

  /* tabs */
  var tabs = $$('[role=tab]'), panels = $$('[role=tabpanel]');
  function show(id, focus) {
    var t = tabs.filter(function (x) { return x.dataset.t === id; })[0] || tabs[0];
    tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; });
    panels.forEach(function (p) { p.hidden = p.id !== 'p-' + t.dataset.t; });
    if (focus) t.focus();
    if (t.scrollIntoView) t.scrollIntoView({ inline: 'center', block: 'nearest' });
    if (t.dataset.t === 'tokens') loadTokens();
    if (t.dataset.t === 'motion') motion();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { history.replaceState(null, '', '#' + t.dataset.t); show(t.dataset.t); });
    t.addEventListener('keydown', function (e) {
      var n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (n === undefined) return;
      e.preventDefault(); n = (n + tabs.length) % tabs.length;
      history.replaceState(null, '', '#' + tabs[n].dataset.t); show(tabs[n].dataset.t, true);
    });
  });
  window.addEventListener('hashchange', function () { show(location.hash.slice(1)); });
  /* tokens, read from the real stylesheets */
  var tokensDone = false;
  var SRC = [
    ['g22.css', 'assets/g22/g22.css', 'Shared layer, loaded on all 32 pages'],
    ['v4.css', 'assets/v4/v4.css', 'Content templates (19 pages: apps, insights, work)'],
    ['motion.css', 'assets/motion/motion.css', 'Motion layer'],
    ['system.css', 'assets/system/system.css', 'This page shell']
  ];
  function blocks(css) {
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    var out = [], i = 0, n = css.length;
    while (i < n) {
      var o = css.indexOf('{', i); if (o < 0) break;
      var sel = css.slice(i, o).trim(), dep = 1, j = o + 1;
      while (j < n && dep) { var c = css[j++]; if (c === '{') dep++; else if (c === '}') dep--; }
      if (sel[0] !== '@') out.push([sel, css.slice(o + 1, j - 1)]);
      i = j;
    }
    return out;
  }
  function decls(body) {
    var m, r = {}, re = /(--[\w-]+)\s*:\s*([^;]+);?/g;
    while ((m = re.exec(body))) r[m[1]] = m[2].trim();
    return r;
  }
  function swatch(v) {
    if (/^#[0-9a-f]{3,8}$/i.test(v) || /^(rgb|hsl)a?\(/i.test(v)) return v;
    if (/^\d+ \d+ \d+$/.test(v)) return 'rgb(' + v + ')';
    return null;
  }
  function cell(text) {
    var c = d.createElement('td'), sw = text && swatch(text);
    if (sw) { var s = d.createElement('span'); s.className = 'sy-sw'; s.style.background = sw; c.appendChild(s); }
    var k = d.createElement('code'); k.textContent = text || ''; c.appendChild(k);
    return c;
  }
  function loadTokens() {
    if (tokensDone) return; tokensDone = true;
    var host = $('#tok-out'); host.textContent = 'Reading stylesheets…';
    Promise.all(SRC.map(function (s) {
      return fetch(s[1]).then(function (r) { return r.text(); }).catch(function () { return ''; });
    })).then(function (txt) {
      host.textContent = ''; var total = 0;
      SRC.forEach(function (s, k) {
        var base = {}, light = {};
        blocks(txt[k]).forEach(function (b) {
          b[0].split(',').forEach(function (x) {
            x = x.trim();
            if (x === ':root') Object.assign(base, decls(b[1]));
            else if (/^html\[data-mode=["']?light["']?\]$/.test(x)) Object.assign(light, decls(b[1]));
          });
        });
        var names = Object.keys(base);
        Object.keys(light).forEach(function (x) { if (names.indexOf(x) < 0) names.push(x); });
        if (!names.length) return;
        total += names.length;
        var h = d.createElement('h3'); h.textContent = s[0] + ' · ' + names.length + ' tokens'; host.appendChild(h);
        var p = d.createElement('p'); p.className = 'sy-cap';
        p.textContent = s[2] + '. Dark/default is the :root value; Light is the html[data-mode="light"] override.';
        host.appendChild(p);
        var w = d.createElement('div'); w.className = 'sy-scroll';
        var t = d.createElement('table'); t.className = 'sy-tbl';
        t.innerHTML = '<thead><tr><th>Token</th><th>Dark / default</th><th>Light</th></tr></thead>';
        var tb = d.createElement('tbody');
        names.forEach(function (x) {
          var tr = d.createElement('tr'), n = d.createElement('td'), nc = d.createElement('code');
          nc.textContent = x; n.appendChild(nc); tr.appendChild(n);
          tr.appendChild(cell(base[x])); tr.appendChild(cell(light[x]));
          tb.appendChild(tr);
        });
        t.appendChild(tb); w.appendChild(t); host.appendChild(w);
      });
      $('#tok-count').textContent = total;
    });
  }

  /* copy */
  $$('.sy-copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var src = b.parentNode.querySelector('template');
      var t = src ? src.innerHTML.trim() : '';
      var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1400); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, done); else done();
    });
  });
  $$('.sy-chip[data-tg]').forEach(function (c) {
    c.addEventListener('click', function () { c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') !== 'true'); });
  });

  /* motion demos: the box travels with each duration/easing; reduced motion shows the end state only */
  var mdone = false;
  function motion() {
    if (mdone) return; mdone = true;
    var rm = matchMedia('(prefers-reduced-motion: reduce)');
    $$('.sy-mo [data-dur]').forEach(function (cellEl) {
      var box = $('.box', cellEl), trk = $('.trk', cellEl), btn = $('button', cellEl);
      btn.addEventListener('click', function () {
        var w = trk.clientWidth - 16 - 56;
        if (rm.matches) { box.style.translate = box.style.translate === '0px 0px' || !box.style.translate ? w + 'px 0' : '0 0'; return; }
        box.style.transition = 'none'; box.style.translate = '0 0'; void box.offsetWidth;
        box.style.transition = 'translate ' + cellEl.dataset.dur + 'ms ' + cellEl.dataset.ease;
        box.style.translate = w + 'px 0';
      });
    });
  }
  show(location.hash.slice(1));
})();
