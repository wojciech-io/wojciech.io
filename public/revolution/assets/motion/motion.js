/* Shared motion layer for /revolution. Load in <head> next to motion.css (it must set html.m-on before first paint).
   Hooks, all opt-in with data-m:
     rise      one block fades up when it scrolls in
     stagger   the children of a block fade up one after another
     depth     an app screen with glass cards: cards arrive in sequence, no parallax, optional hot spots
     count     a number counts up once
     bar, barv a bar draws once (horizontal, vertical)
   Nothing is hidden without JS. With prefers-reduced-motion nothing moves; hot spots still answer to hover, focus and tap. */
(function () {
  "use strict";
  var root = document.documentElement;
  function mq(q) { return !!(window.matchMedia && window.matchMedia(q).matches); }
  var reduce = mq("(prefers-reduced-motion: reduce)");
  var hasIO = "IntersectionObserver" in window;
  root.classList.add("m-js");
  if (!reduce && hasIO) { root.classList.add("m-on"); }
  var live = root.classList.contains("m-on");
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  /* ---- numbers ---- */
  function parseCount(el) {
    if (el.children.length) { return null; }
    var t = el.textContent;
    if (/\d[\s ]\d{3}/.test(t)) { return null; }
    var m = t.match(/\d+(?:[.,]\d+)?/);
    if (!m) { return null; }
    var raw = m[0];
    var at = raw.search(/[.,]/);
    return {
      full: t,
      pre: t.slice(0, m.index),
      post: t.slice(m.index + raw.length),
      val: parseFloat(raw.replace(",", ".")),
      dec: at > -1 ? raw.length - at - 1 : 0,
      sep: raw.indexOf(",") > -1 ? "," : "."
    };
  }
  function runCount(el) {
    var c = parseCount(el);
    if (!c || !live || c.val < 2) { return; }
    var w = el.getBoundingClientRect().width;
    var dur = 1100;
    var t0 = 0;
    var done = false;
    el.style.minWidth = w + "px";
    function finish() {
      if (done) { return; }
      done = true;
      el.textContent = c.full;
      el.style.minWidth = "";
    }
    function step(now) {
      if (done) { return; }
      if (!t0) { t0 = now; }
      var k = clamp((now - t0) / dur, 0, 1);
      var e = 1 - Math.pow(1 - k, 3);
      var s = (c.val * e).toFixed(c.dec);
      if (c.sep === ",") { s = s.replace(".", ","); }
      el.textContent = c.pre + s + c.post;
      if (k < 1) { requestAnimationFrame(step); } else { finish(); }
    }
    el.textContent = c.pre + (0).toFixed(c.dec).replace(".", c.sep) + c.post;
    requestAnimationFrame(step);
    setTimeout(finish, dur + 600);
  }

  /* ---- depth: one shared loop for every screen on the page ---- */
  var figs = [];
  var px = 0;
  var py = 0;
  var raf = 0;
  function frame() {
    raf = 0;
    var busy = false;
    var vh = window.innerHeight;
    figs.forEach(function (f) {
      if (!f.vis) { return; }
      var r = f.el.getBoundingClientRect();
      var ms = clamp((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
      if (!f.init) { f.init = true; f.cs = ms; }
      f.cx += (px - f.cx) * 0.07;
      f.cy += (py - f.cy) * 0.07;
      f.cs += (ms - f.cs) * 0.2;
      if (Math.abs(px - f.cx) > 0.002 || Math.abs(py - f.cy) > 0.002 || Math.abs(ms - f.cs) > 0.002) { busy = true; }
      f.el.style.setProperty("--mx", f.cx.toFixed(3));
      f.el.style.setProperty("--my", f.cy.toFixed(3));
      f.el.style.setProperty("--ms", f.cs.toFixed(3));
    });
    if (busy) { raf = requestAnimationFrame(frame); }
  }
  function kick() { if (!raf) { raf = requestAnimationFrame(frame); } }
  function initDepth(el) {
    var f = { el: el, vis: false, init: false, cx: 0, cy: 0, cs: 0 };
    figs.push(f);
    new IntersectionObserver(function (entries) {
      f.vis = entries[0].isIntersecting;
      if (f.vis) { el.setAttribute("data-m-live", ""); kick(); } else { el.removeAttribute("data-m-live"); }
    }, { rootMargin: "120px 0px" }).observe(el);
  }

  /* ---- hot spots: hover, focus or tap highlights a part of the screen and shows its note ---- */
  function initHot(fig) {
    var stage = fig.querySelector(".m-stage");
    if (!stage) { return null; }
    var spots = Array.prototype.slice.call(stage.querySelectorAll(".m-hot"));
    if (!spots.length) { return null; }
    var tip = document.createElement("div");
    var tt = document.createElement("b");
    var tb = document.createElement("span");
    tip.className = "m-tip";
    tip.setAttribute("aria-hidden", "true");
    tip.appendChild(tt);
    tip.appendChild(tb);
    stage.appendChild(tip);
    var base = null;
    spots.forEach(function (s) { if (s.hasAttribute("data-base")) { base = s; } });
    var cur = null;
    var tourOn = false;
    var timer = 0;

    function show(s) {
      var was = tip.classList.contains("is-on");
      cur = s;
      spots.forEach(function (o) { o.classList.toggle("is-on", o === s); });
      tt.textContent = s.getAttribute("data-t") || "";
      tb.textContent = s.getAttribute("data-b") || "";
      var w = tip.offsetWidth;
      var h = tip.offsetHeight;
      var sw = stage.clientWidth;
      var sh = stage.clientHeight;
      var cx = s.offsetLeft + s.offsetWidth / 2;
      var cy = s.offsetTop + s.offsetHeight / 2;
      var left = clamp(cx - w / 2, 4, Math.max(4, sw - w - 4));
      var ty = parseFloat(s.getAttribute("data-ty"));
      var top;
      var side;
      if (!isNaN(ty)) {
        top = ty / 100 * sh;
        side = top + h <= cy ? "above" : "below";
      } else if (cy < sh * 0.5) {
        top = s.offsetTop + s.offsetHeight + 10;
        side = "below";
      } else {
        top = s.offsetTop - h - 10;
        side = "above";
      }
      top = clamp(top, 4, Math.max(4, sh - h - 4));
      tip.classList.toggle("is-jump", was);
      tip.style.left = left.toFixed(1) + "px";
      tip.style.top = top.toFixed(1) + "px";
      tip.style.setProperty("--ax", clamp(cx - left, 14, Math.max(14, w - 14)).toFixed(1) + "px");
      tip.setAttribute("data-side", side);
      if (!was) { tip.getBoundingClientRect(); }
      tip.classList.add("is-on");
    }
    function hide() {
      if (base) { show(base); return; }
      cur = null;
      tip.classList.remove("is-on");
      spots.forEach(function (o) { o.classList.remove("is-on"); });
    }
    function stopTour() { tourOn = false; clearTimeout(timer); }
    function tour() {
      var i = 0;
      tourOn = true;
      (function next() {
        if (!tourOn) { return; }
        if (i >= spots.length) { tourOn = false; hide(); return; }
        show(spots[i]);
        i += 1;
        timer = setTimeout(next, 950);
      })();
    }

    spots.forEach(function (s) {
      s.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { stopTour(); show(s); } });
      s.addEventListener("focus", function () { stopTour(); show(s); });
      s.addEventListener("click", function () { stopTour(); show(s); });
    });
    stage.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse" && !tourOn) { hide(); } });
    stage.addEventListener("focusout", function (e) { if (!e.relatedTarget || !stage.contains(e.relatedTarget)) { hide(); } });
    document.addEventListener("pointerdown", function (e) { if (cur && !stage.contains(e.target)) { stopTour(); hide(); } });
    window.addEventListener("resize", function () { if (cur) { show(cur); } });

    return function start() {
      var delay = live ? 1500 : 0;
      setTimeout(function () {
        if (base) { show(base); } else if (live && stage.hasAttribute("data-tour") && !cur) { tour(); }
      }, delay);
    };
  }

  /* ---- wiring ---- */
  function enter(el) {
    el.classList.add("m-in");
    var kind = el.getAttribute("data-m");
    if (kind === "count") { runCount(el); }
    if (kind === "depth" && el.__mStart) { el.__mStart(); }
  }
  function boot() {
    each(document.querySelectorAll('[data-m="stagger"]'), function (el) {
      each(el.children, function (kid, i) { kid.style.setProperty("--i", String(i)); });
    });
    each(document.querySelectorAll("[data-m-delay]"), function (el) { el.style.setProperty("--m-delay", el.getAttribute("data-m-delay")); });
    var targets = document.querySelectorAll('[data-m="rise"],[data-m="stagger"],[data-m="depth"],[data-m="bar"],[data-m="barv"],[data-m="count"]');
    each(document.querySelectorAll('[data-m="depth"]'), function (fig) {
      fig.__mStart = initHot(fig);
      if (live) { initDepth(fig); }
    });
    if (!live) {
      each(targets, enter);
      return;
    }
    var alive = false;
    var io = new IntersectionObserver(function (entries) {
      alive = true;
      entries.forEach(function (en) {
        if (en.isIntersecting) { io.unobserve(en.target); enter(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    each(targets, function (el) { io.observe(el); });
    setTimeout(function () { if (!alive) { root.classList.remove("m-on"); live = false; } }, 3000);
    /* no pointer or scroll parallax: screens stay still, only the entrance moves */
  }
  function ready(fn) {
    if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", fn); } else { fn(); }
  }
  ready(function () {
    try { boot(); } catch (err) {
      root.classList.remove("m-on");
      if (window.console && window.console.warn) { window.console.warn("motion layer stopped", err); }
    }
  });
})();
