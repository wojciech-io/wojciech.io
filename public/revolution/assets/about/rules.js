/* About, "Four rules I keep": list items become tabs, the screens next to them become tab panels. Arrows, Home and End move between rules. */
(function () {
  "use strict";
  var root = document.querySelector("[data-rr]");
  if (!root) { return; }
  var scope = root.parentElement;
  var tabs = Array.prototype.slice.call(root.querySelectorAll(".rr__l > li"));
  var panels = Array.prototype.slice.call(scope.querySelectorAll(".rr__s"));
  var cap = scope.querySelector(".rr__f figcaption");
  var list = root.querySelector(".rr__l");
  if (tabs.length < 2 || tabs.length !== panels.length) { return; }
  list.setAttribute("role", "tablist");
  list.setAttribute("aria-label", "Four rules I keep");
  var cur = 0;
  function show(i, focus) {
    cur = (i + tabs.length) % tabs.length;
    tabs.forEach(function (t, k) {
      var on = k === cur;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      panels[k].classList.toggle("is-on", on);
      panels[k].setAttribute("aria-hidden", on ? "false" : "true");
    });
    if (cap) { cap.textContent = panels[cur].getAttribute("data-cap") || ""; }
    if (focus) { tabs[cur].focus(); }
  }
  tabs.forEach(function (t, k) {
    t.setAttribute("role", "tab");
    t.id = "rr-t" + k;
    t.setAttribute("aria-controls", "rr-p" + k);
    panels[k].id = "rr-p" + k;
    panels[k].setAttribute("role", "tabpanel");
    panels[k].setAttribute("aria-labelledby", t.id);
    t.addEventListener("click", function () { show(k, false); });
    t.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
      if (e.key === "Home") { e.preventDefault(); show(0, true); }
      else if (e.key === "End") { e.preventDefault(); show(tabs.length - 1, true); }
      else if (d) { e.preventDefault(); show(cur + d, true); }
    });
  });
  root.classList.add("rr--js");
  show(0, false);
})();
