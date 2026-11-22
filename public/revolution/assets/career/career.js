/* Career: the active role is copied into the panel on desktop and opens in place on a phone. */
(function () {
  "use strict";
  var sec = document.querySelector(".crb");
  if (!sec) { return; }
  var items = Array.prototype.slice.call(sec.querySelectorAll(".crb__li"));
  var panel = sec.querySelector(".crb__pn");
  var wide = window.matchMedia("(min-width: 901px)");

  function select(i) {
    items.forEach(function (li, k) {
      var on = k === i;
      li.classList.toggle("on", on);
      li.querySelector(".crb__bt").setAttribute("aria-expanded", on ? "true" : "false");
    });
    if (panel) { panel.innerHTML = "<div class=\"crb__d\">" + items[i].querySelector(".crb__d").innerHTML + "</div>"; }
  }

  items.forEach(function (li, k) {
    var bt = li.querySelector(".crb__bt");
    bt.addEventListener("click", function () { select(k); });
    bt.addEventListener("mouseenter", function () { if (wide.matches) { select(k); } });
    bt.addEventListener("focus", function () { if (wide.matches) { select(k); } });
  });
  sec.classList.add("js");
  var start = items.findIndex(function (li) { return li.hasAttribute("data-start"); });
  select(start < 0 ? 0 : start);
})();
