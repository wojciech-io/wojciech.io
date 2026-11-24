/* Home Apps index: the chosen tool is shown whole on the right on a wide screen and opens in place on a phone.
   Hover and focus choose on a wide screen, a tap or click chooses everywhere (a second tap closes it on a phone).
   Without script every screen stays open. */
(function () {
  "use strict";
  var sec = document.getElementById("apps");
  if (!sec || !sec.classList.contains("ap")) { return; }
  var items = Array.prototype.slice.call(sec.querySelectorAll(".ap__li"));
  var wide = window.matchMedia("(min-width: 901px)");

  function select(i, toggle) {
    items.forEach(function (li, k) {
      var on = k === i && !(toggle && li.classList.contains("on") && !wide.matches);
      li.classList.toggle("on", on);
      li.querySelector(".ap__bt").setAttribute("aria-expanded", on ? "true" : "false");
    });
  }

  items.forEach(function (li, k) {
    var bt = li.querySelector(".ap__bt");
    bt.addEventListener("click", function () { select(k, true); });
    bt.addEventListener("mouseenter", function () { if (wide.matches) { select(k); } });
    bt.addEventListener("focus", function () { if (wide.matches) { select(k); } });
  });
  /* leaving the wide layout keeps one screen open, never none */
  wide.addEventListener("change", function (e) { if (e.matches && !sec.querySelector(".ap__li.on")) { select(0); } });
  sec.classList.add("js");
  select(0);

  /* fetch the screens of the closed rows once the page is idle, so a choice never waits on an image */
  function warm() { sec.querySelectorAll(".ap__d img").forEach(function (im) { im.loading = "eager"; }); }
  if ("requestIdleCallback" in window) { window.addEventListener("load", function () { requestIdleCallback(warm); }); }
  else { window.addEventListener("load", function () { setTimeout(warm, 1500); }); }
})();
