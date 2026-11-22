/* GTM pipeline rail: the lit step moves along the line on its own and follows the pointer on hover.
   Presentation only: the list reads the same without it. Not started under reduced motion. */
(function () {
  "use strict";
  var rail = document.querySelector(".gt-st");
  if (!rail || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) { return; }
  var items = Array.prototype.slice.call(rail.children);
  if (items.length < 2) { return; }
  var cur = 0;
  var timer = 0;
  var held = false;
  var seen = false;
  function light(i) {
    cur = i;
    items.forEach(function (li, k) { li.classList.toggle("is-lit", k === cur); });
    rail.style.setProperty("--i", String(cur));
  }
  function tick() {
    if (!held && seen) { light((cur + 1) % items.length); }
  }
  items.forEach(function (li, k) {
    li.addEventListener("pointerenter", function () { held = true; light(k); });
    li.addEventListener("pointerleave", function () { held = false; });
  });
  rail.classList.add("is-live");
  light(0);
  timer = window.setInterval(tick, 1700);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { seen = en[0].isIntersecting; }, { threshold: 0.4 }).observe(rail);
  } else {
    seen = true;
  }
  window.addEventListener("pagehide", function () { window.clearInterval(timer); });
})();
