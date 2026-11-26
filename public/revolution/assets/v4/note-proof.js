/* Insights proof blocks. Each section.proof[data-proof] already holds its first state as HTML.
   This script adds the one control and swaps what the result shows. Works from keyboard: native buttons and a textarea. */
(function () {
  "use strict";
  function $(r, s) { return r.querySelector(s); }
  function toggle(np, btn, labels) {
    np.classList.add("is-live");
    btn.addEventListener("click", function () {
      var on = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      np.dataset.state = on ? "b" : "a";
      if (labels) btn.firstChild.nodeValue = on ? labels[1] : labels[0];
    });
  }
  var init = {
    approval: function (np) {
      var ta = $(np, ".np__ta"), badge = $(np, ".np__badge"), ap = $(np, ".np__ap button"), res = $(np, ".np__out");
      var v = 3, dirty = false, base = ta.value;
      np.classList.add("is-live");
      ta.addEventListener("input", function () {
        if (ta.value === base && !dirty) return;
        if (!dirty) { dirty = true; v += 1; }
        badge.textContent = "Needs approval · v" + v;
        badge.classList.add("is-warn");
        ap.hidden = false; ap.textContent = "Approve v" + v;
        res.textContent = "The edit made version " + v + ". The old approval does not carry over, so nothing is written to the CRM.";
      });
      ap.addEventListener("click", function () {
        badge.textContent = "Approved · v" + v + " · CRM note";
        badge.classList.remove("is-warn");
        ap.hidden = true; dirty = false; base = ta.value;
        res.textContent = "Version " + v + " is approved for one action: the CRM note. The approval and its result are logged.";
      });
    },
    late: function (np) { toggle(np, $(np, ".np__ctl"), null); },
    funnel: function (np) { toggle(np, $(np, ".np__ctl"), null); },
    handoff: function (np) { toggle(np, $(np, ".np__ctl"), null); },
    cohort: function (np) { toggle(np, $(np, ".np__ctl"), null); },
    overlap: function (np) { toggle(np, $(np, ".np__ctl"), null); },
    scan: function (np) {
      var btn = $(np, ".np__ctl"), body = $(np, "tbody"), n = body.rows.length, res = $(np, ".np__out");
      np.classList.add("is-live");
      btn.addEventListener("click", function () {
        n += 1;
        var d = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
        var qs = ["How does [option A] compare with [option B]?", "How do I [do the job] step by step?", "What does [service] cost?"];
        for (var i = 0; i < qs.length; i++) {
          var tr = body.insertRow();
          tr.className = "is-new";
          tr.innerHTML = "<td></td><td></td><td><i>empty</i></td><td><i>empty</i></td><td><i>empty</i></td>";
          tr.cells[0].textContent = qs[i];
          tr.cells[1].textContent = "Run " + n + " · " + d;
        }
        res.textContent = "Run " + n + " added: the same three questions, to be filled in under the same conditions.";
      });
    }
  };
  document.querySelectorAll("section.proof[data-proof]").forEach(function (s) {
    var np = $(s, ".np"), f = init[s.dataset.proof];
    if (np && f) f(np);
  });
})();
