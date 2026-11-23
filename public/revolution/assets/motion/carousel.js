/* Shared carousel quality layer for /revolution. Loaded by ui.js on every page that has a sideways scroller.
   Adds, without touching page markup: keyboard arrows, mouse drag with snap, a labelled focusable region, a progress line where the
   scroller has no controls of its own, and 44 px hit areas for small dots and arrows. Swipe stays native scroll snap. */
(function () {
  "use strict";
  var SEL = ".rc__vp,.crs__tr,.rs__rail,.mk-strip,.rl__vp";
  var OWN_PROGRESS = ".rc__vp,.crs__tr";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  var fine = window.matchMedia && window.matchMedia("(hover:hover) and (pointer:fine)");

  function label(track) {
    var sec = track.closest("section");
    var h = sec && sec.querySelector("h2,h1");
    return (h ? h.textContent.replace(/\s+/g, " ").trim() + ", " : "") + "scrolls sideways";
  }

  function a11y(track) {
    if (!track.hasAttribute("tabindex")) { track.setAttribute("tabindex", "0"); }
    if (!track.hasAttribute("role") && !track.hasAttribute("aria-label") && !track.hasAttribute("aria-labelledby")) {
      track.setAttribute("role", "region");
      track.setAttribute("aria-label", label(track));
    }
  }

  function step(track) {
    var kids = track.children.length === 1 ? track.firstElementChild.children : track.children;
    if (!kids[0]) { return track.clientWidth * 0.8; }
    var gap = parseFloat(getComputedStyle(kids[0].parentElement).columnGap) || 0;
    return Math.max(120, kids[0].getBoundingClientRect().width + gap);
  }

  function keys(track) {
    track.addEventListener("keydown", function (e) {
      if (e.defaultPrevented || e.target !== track) { return; }
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) { return; }
      e.preventDefault();
      track.scrollBy({ left: d * step(track), behavior: reduce && reduce.matches ? "auto" : "smooth" });
    });
  }

  function drag(track) {
    var x0 = 0, s0 = 0, id = null, moved = false;
    track.classList.add("m-grab");
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0 || !fine.matches) { return; }
      if (e.target.closest("button,input,select,textarea")) { return; }
      id = e.pointerId; x0 = e.clientX; s0 = track.scrollLeft; moved = false;
    });
    window.addEventListener("pointermove", function (e) {
      if (id === null || e.pointerId !== id) { return; }
      var dx = e.clientX - x0;
      if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add("m-drag"); track.style.scrollSnapType = "none"; track.style.scrollBehavior = "auto"; }
      if (moved) { track.scrollLeft = s0 - dx; }
    });
    function end(e) {
      if (id === null || (e && e.pointerId !== id)) { return; }
      id = null;
      if (!moved) { return; }
      track.classList.remove("m-drag");
      track.style.scrollBehavior = "";
      track.style.scrollSnapType = "";
    }
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    track.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    track.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }

  function progress(track) {
    if (track.matches(OWN_PROGRESS)) { return; }
    var wrap = document.createElement("i"), bar = document.createElement("b");
    wrap.className = "m-cp"; wrap.setAttribute("aria-hidden", "true"); wrap.appendChild(bar);
    track.parentNode.insertBefore(wrap, track.nextSibling);
    var busy = false;
    function paint() {
      busy = false;
      var max = track.scrollWidth - track.clientWidth;
      wrap.hidden = max < 8;
      var vis = track.clientWidth / track.scrollWidth;
      bar.style.setProperty("--w", vis.toFixed(4));
      bar.style.setProperty("--p", (max > 0 ? track.scrollLeft / max : 0).toFixed(4));
    }
    function ask() { if (!busy) { busy = true; requestAnimationFrame(paint); } }
    track.addEventListener("scroll", ask, { passive: true });
    addEventListener("resize", ask, { passive: true });
    paint();
  }

  function hits() {
    var btns = document.querySelectorAll(".rc button,.crs button,.g22-dots button,.c3h button,.rs button,.mk-strip button");
    Array.prototype.forEach.call(btns, function (b) {
      var r = b.getBoundingClientRect();
      if (!r.width || !r.height) { return; }
      var hx = Math.max(0, (44 - r.width) / 2), hy = Math.max(0, (44 - r.height) / 2);
      if (hx < 0.5 && hy < 0.5) { b.classList.remove("m-hit"); return; }
      if (getComputedStyle(b).position === "static") { b.style.position = "relative"; }
      b.classList.add("m-hit");
      b.style.setProperty("--m-hx", hx.toFixed(1) + "px");
      b.style.setProperty("--m-hy", hy.toFixed(1) + "px");
    });
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll(SEL), function (t) {
      if (t.hasAttribute("data-m-car")) { return; }
      t.setAttribute("data-m-car", "");
      a11y(t); keys(t); drag(t); progress(t);
    });
    hits();
    var t = 0;
    addEventListener("resize", function () { clearTimeout(t); t = setTimeout(hits, 200); }, { passive: true });
    addEventListener("load", hits);
  }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
