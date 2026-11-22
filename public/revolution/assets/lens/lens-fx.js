/* Lens pages: layered hero motion. Pointer and scroll move the layers marked data-d (depth) and data-s (scroll).
   Nothing moves under prefers-reduced-motion, and the loop only runs while the hero is on screen. */
(function () {
  "use strict";
  var heroes = document.querySelectorAll("[data-fx]");
  if (!heroes.length) { return; }
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }
  var coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  Array.prototype.forEach.call(heroes, function (hero) {
    var layers = Array.prototype.slice.call(hero.querySelectorAll("[data-d],[data-s]"));
    var tx = 0, ty = 0, cx = 0, cy = 0, p = 0, raf = 0, visible = true;

    function frame() {
      raf = 0;
      var r = hero.getBoundingClientRect();
      p = clamp(-r.top / Math.max(r.height, 1), 0, 1);
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      layers.forEach(function (el) {
        var d = parseFloat(el.getAttribute("data-d") || "0");
        var s = parseFloat(el.getAttribute("data-s") || "0");
        var x = cx * d * 26;
        var y = cy * d * 16 + p * s * 160;
        el.style.setProperty("--px", x.toFixed(1) + "px");
        el.style.setProperty("--py", y.toFixed(1) + "px");
      });
      if (visible && (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002)) { raf = requestAnimationFrame(frame); }
    }
    function kick() { if (!raf && visible) { raf = requestAnimationFrame(frame); } }

    if (!coarse) {
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        tx = clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5) * 2;
        ty = clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5) * 2;
        kick();
      }, { passive: true });
      hero.addEventListener("pointerleave", function () { tx = 0; ty = 0; kick(); }, { passive: true });
    }
    window.addEventListener("scroll", kick, { passive: true });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) { kick(); }
      }).observe(hero);
    }
    kick();
  });
})();
