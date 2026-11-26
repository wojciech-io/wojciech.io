/* Insights proof scenes. Each section.proof[data-proof] already holds its first state as HTML; entrances come from the shared motion layer.
   This script adds the one control and tweens the result. Native buttons and a textarea, so it works from the keyboard. */
(function () {
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(r, s) { return r.querySelector(s); }
  function $$(r, s) { return Array.prototype.slice.call(r.querySelectorAll(s)); }
  function ease(t) { return 1 - Math.pow(1 - t, 4); }
  function tween(el, to) {
    var from = parseFloat(el.textContent.replace(/[^\d.]/g, "")) || 0;
    if (reduce || from === to) { el.textContent = to; return; }
    var t0 = performance.now(), d = 800;
    (function step(now) {
      var k = Math.min(1, (now - t0) / d);
      el.textContent = Math.round(from + (to - from) * ease(k));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  function roll(np, on) { $$(np, ".np__roll").forEach(function (r) { r.dataset.i = on ? "1" : "0"; }); }
  function toggle(np, btn, extra) {
    np.classList.add("is-live");
    btn.addEventListener("click", function () {
      var on = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      np.dataset.state = on ? "b" : "a";
      roll(np, on);
      $$(np, ".np__n").forEach(function (n) { n.removeAttribute("data-m"); tween(n, +n.dataset[on ? "b" : "a"]); });
      if (extra) extra(on);
    });
  }
  var init = {
    approval: function (np) {
      var ta = $(np, ".np__ta"), ap = $(np, ".np__act .np__ctl"), chk = $(np, ".np__chk"), res = $(np, ".np__out");
      var word = $(np, ".np__word .np__roll"), ver = $(np, ".np__rv");
      var bw = word.querySelectorAll("b"), bv = ver.querySelectorAll("b");
      var v = 3, dirty = false, base = ta.value;
      np.classList.add("is-live");
      ta.addEventListener("input", function () {
        if (ta.value === base && !dirty) return;
        if (!dirty) { dirty = true; v += 1; }
        bv[1].textContent = "v" + v; word.dataset.i = "1"; ver.dataset.i = "1";
        ap.hidden = false; ap.textContent = "Approve v" + v; chk.classList.add("is-off");
        res.textContent = "The edit made version " + v + ". The old approval does not carry over, so nothing is written to the CRM.";
      });
      ap.addEventListener("click", function () {
        bw[0].textContent = "Approved"; bv[0].textContent = "v" + v;
        word.dataset.i = "0"; ver.dataset.i = "0"; ap.hidden = true; dirty = false; base = ta.value; chk.classList.remove("is-off");
        res.textContent = "Version " + v + " is approved for one action: the CRM note. The approval and its result are logged.";
      });
    },
    late: function (np) { toggle(np, $(np, ".np__ctl"), function (on) { $$(np, ".np__cell").slice(1).forEach(function (c) { c.classList.toggle("is-late", on); }); }); },
    funnel: function (np) { toggle(np, $(np, ".np__ctl")); },
    handoff: function (np) { toggle(np, $(np, ".np__ctl")); },
    cohort: function (np) { toggle(np, $(np, ".np__ctl")); },
    overlap: function (np) { toggle(np, $(np, ".np__ctl")); },
    scan: function (np) {
      var btn = $(np, ".np__ctl"), body = $(np, "tbody"), n = 1, res = $(np, ".np__out");
      np.classList.add("is-live");
      btn.addEventListener("click", function () {
        n += 1;
        var d = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        ["How does [option A] compare with [option B]?", "How do I [do the job] step by step?", "What does [service] cost?"].forEach(function (q, i) {
          var tr = body.insertRow(); tr.className = "is-new";
          tr.innerHTML = "<td></td><td></td><td><span class=\"np__pill\"></span></td><td><span class=\"np__pill\"></span></td><td><span class=\"np__pill\"></span></td>";
          tr.cells[0].textContent = q; tr.cells[1].textContent = "Run " + n + " · " + d;
          Array.prototype.forEach.call(tr.cells, function (c) { c.style.animationDelay = (i * 90) + "ms"; });
        });
        res.textContent = "Run " + n + " added: the same three questions, to be filled in under the same conditions.";
      });
    }
  };
  document.querySelectorAll("section.proof[data-proof]").forEach(function (s) {
    var np = $(s, ".np"), f = init[s.dataset.proof];
    if (np && f) f(np);
  });
})();
