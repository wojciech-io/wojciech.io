/* Lens hero screens: three tabs, a cross-fade, and a slow autoplay that shows its progress inside the active tab.
   Without JS the first screen shows and the tabs stay hidden. Autoplay stops at the first click or key press,
   pauses on hover, focus, touch and when the hero is off screen, and never starts under reduced motion. */
(function () {
  "use strict";
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var figs = document.querySelectorAll("[data-lh]");
  Array.prototype.forEach.call(figs, function (fig) {
    var bar = fig.querySelector(".lh__tabs");
    var tabs = Array.prototype.slice.call(fig.querySelectorAll(".lh__tab"));
    var slides = Array.prototype.slice.call(fig.querySelectorAll(".lh__s"));
    var cap = fig.querySelector("figcaption");
    if (!bar || tabs.length < 2 || tabs.length !== slides.length) { return; }
    var cur = 0;
    function show(i, focus) {
      cur = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, k) {
        var on = k === cur;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        slides[k].classList.toggle("is-on", on);
      });
      if (cap) { cap.textContent = tabs[cur].getAttribute("data-cap") || ""; }
      if (focus) { tabs[cur].focus(); }
    }
    function manual() { fig.classList.add("is-manual"); }
    tabs.forEach(function (t, k) {
      t.addEventListener("click", function () { manual(); show(k, false); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (e.key === "Home") { e.preventDefault(); manual(); show(0, true); }
        else if (e.key === "End") { e.preventDefault(); manual(); show(tabs.length - 1, true); }
        else if (d) { e.preventDefault(); manual(); show(cur + d, true); }
      });
      t.querySelector("i").addEventListener("animationend", function () {
        if (k === cur && !fig.classList.contains("is-manual")) { show(cur + 1, false); }
      });
    });
    bar.hidden = false;
    fig.classList.add("lh-js");
    if (!reduce) {
      fig.classList.add("is-auto");
      var pause = function (on) { fig.classList.toggle("is-paused", on); };
      fig.addEventListener("pointerenter", function () { pause(true); });
      fig.addEventListener("pointerleave", function () { pause(false); });
      fig.addEventListener("focusin", function () { pause(true); });
      fig.addEventListener("focusout", function () { pause(false); });
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (en) { fig.classList.toggle("is-off", !en[0].isIntersecting); }, { threshold: 0.35 }).observe(fig);
      }
    }
  });
})();
