/* About career index: opens a role in place (one at a time), puts each role's headline result on its row,
   counts the number up when a role opens, and reveals the rows once. Pointer only lights a row; it never moves the layout. */
(function () {
  "use strict";
  var sec = document.getElementById("roles");
  if (!sec) { return; }
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = Array.prototype.slice.call(sec.querySelectorAll(".crb__li"));
  items.forEach(function (li, i) {
    li.style.setProperty("--i", i);
    var b = li.querySelector(".crb__rs b");
    if (b) { var x = document.createElement("span"); x.className = "crb__x"; var lab = li.querySelector(".crb__rs span"); x.innerHTML = "<b></b><small></small>"; x.firstChild.textContent = b.textContent; x.lastChild.textContent = lab ? lab.textContent : ""; x.setAttribute("aria-hidden", "true"); li.querySelector(".crb__bt").insertBefore(x, null); }
  });
  function count(el, final) {
    var m = final.match(/^([^\d]*)(\d+)(.*)$/);
    if (!m || calm) { el.textContent = final; return; }
    var to = parseInt(m[2], 10), t0 = null;
    function step(t) {
      if (t0 === null) { t0 = t; }
      var k = Math.min(1, (t - t0) / 800), e = 1 - Math.pow(1 - k, 3);
      el.textContent = m[1] + Math.round(to * e) + m[3];
      if (k < 1) { requestAnimationFrame(step); } else { el.textContent = final; }
    }
    requestAnimationFrame(step);
  }
  function select(i, user) {
    items.forEach(function (li, k) {
      var on = k === i && !(user && li.classList.contains("on"));
      li.classList.toggle("on", on);
      li.querySelector(".crb__bt").setAttribute("aria-expanded", on ? "true" : "false");
      if (on) { var rb = li.querySelector(".crb__rs b"); if (rb) { count(rb, rb.dataset.final || (rb.dataset.final = rb.textContent)); } }
    });
  }
  items.forEach(function (li, k) { li.querySelector(".crb__bt").addEventListener("click", function () { select(k, true); }); });
  sec.classList.add("js");
  var start = items.findIndex(function (li) { return li.hasAttribute("data-start"); });
  select(start < 0 ? 0 : start, false);
  if (calm || !("IntersectionObserver" in window)) { sec.classList.add("tl-in"); return; }
  var io = new IntersectionObserver(function (es) {
    if (es.some(function (e) { return e.isIntersecting; })) { sec.classList.add("tl-in"); io.disconnect(); }
  }, { threshold: 0.12 });
  io.observe(sec);
})();
