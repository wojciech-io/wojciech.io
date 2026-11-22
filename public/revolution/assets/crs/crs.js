/* References carousel: native scroll snap for swipe, a CSS animation as the autoplay clock.
   Hover, focus and touch hold the clock. Reduced motion turns the autoplay off. */
(function () {
  "use strict";
  var root = document.querySelector("[data-rc]");
  if (!root) { return; }
  var vp = root.querySelector(".rc__vp");
  var cards = Array.prototype.slice.call(root.querySelectorAll(".rc__c"));
  var dots = Array.prototype.slice.call(root.querySelectorAll(".rc__dots button"));
  var bar = root.querySelector(".rc__bar i");
  var count = root.querySelector(".rc__n");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var current = 0;
  var touched = false;

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function go(i, smooth) {
    var n = (i + cards.length) % cards.length;
    var left = cards[n].offsetLeft - cards[0].offsetLeft;
    vp.scrollTo({ left: left, behavior: smooth && !reduce ? "smooth" : "auto" });
  }

  function mark(i) {
    current = i;
    cards.forEach(function (c, k) { c.classList.toggle("on", k === i); });
    dots.forEach(function (d, k) { d.setAttribute("aria-current", k === i ? "true" : "false"); });
    if (count) { count.textContent = pad(i + 1) + " / " + pad(cards.length); }
    restart();
  }

  function restart() {
    root.classList.remove("play");
    if (reduce || touched || !bar) { return; }
    void bar.offsetWidth;
    root.classList.add("play");
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio > 0.6) {
          var k = cards.indexOf(e.target);
          if (k !== current) { mark(k); }
        }
      });
    }, { root: vp, threshold: [0.61] });
    cards.forEach(function (c) { io.observe(c); });
  }

  if (bar) {
    bar.addEventListener("animationend", function () { go(current + 1, true); });
  }
  root.querySelectorAll("[data-rc-prev]").forEach(function (b) { b.addEventListener("click", function () { go(current - 1, true); }); });
  root.querySelectorAll("[data-rc-next]").forEach(function (b) { b.addEventListener("click", function () { go(current + 1, true); }); });
  dots.forEach(function (d, k) { d.addEventListener("click", function () { go(k, true); }); });

  function hold(on) { root.classList.toggle("hold", on); }
  root.addEventListener("pointerenter", function () { hold(true); });
  root.addEventListener("pointerleave", function () { hold(false); });
  root.addEventListener("focusin", function () { hold(true); });
  root.addEventListener("focusout", function () { hold(false); });
  vp.addEventListener("touchstart", function () { touched = true; root.classList.remove("play"); }, { passive: true });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      hold(!entries[0].isIntersecting);
    }).observe(root);
  }
  mark(0);
})();
