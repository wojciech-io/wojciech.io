/* g22: phone helpers. Library shows 12 notes then a button; carousels get dots. Nothing runs above 767 px. */
(function () {
  "use strict";
  var phone = window.matchMedia("(max-width:767px)");
  var STEP = 12;

  function initLibrary() {
    var grid = document.getElementById("notesg");
    if (!grid) { return; }
    var limit = STEP;
    var busy = false;
    var more = document.createElement("button");
    more.type = "button";
    more.className = "g22-more";
    grid.parentNode.insertBefore(more, grid.nextSibling);

    function apply() {
      busy = true;
      var shown = 0;
      var hiddenCount = 0;
      Array.prototype.forEach.call(grid.children, function (card) {
        if (card.hasAttribute("hidden")) { card.removeAttribute("data-g22x"); return; }
        shown += 1;
        if (phone.matches && shown > limit) {
          card.setAttribute("data-g22x", "");
          hiddenCount += 1;
        } else {
          card.removeAttribute("data-g22x");
        }
      });
      more.hidden = hiddenCount === 0;
      more.textContent = "Show " + Math.min(STEP, hiddenCount) + " more";
      busy = false;
    }

    more.addEventListener("click", function () { limit += STEP; apply(); });
    new MutationObserver(function () { if (!busy) { limit = STEP; apply(); } })
      .observe(grid, { attributes: true, attributeFilter: ["hidden"], subtree: true, childList: true });
    phone.addEventListener("change", apply);
    apply();
  }

  function initCarousels() {
    Array.prototype.forEach.call(document.querySelectorAll(".crs"), function (crs) {
      var track = crs.querySelector(".crs__tr");
      if (!track || track.children.length < 2) { return; }
      var dots = document.createElement("div");
      dots.className = "g22-dots";
      Array.prototype.forEach.call(track.children, function (card, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Show card " + (i + 1));
        b.addEventListener("click", function () {
          track.scrollTo({ left: track.scrollLeft + card.getBoundingClientRect().left - track.getBoundingClientRect().left, behavior: "smooth" });
        });
        dots.appendChild(b);
      });
      crs.appendChild(dots);

      function sync() {
        var idx = 0;
        var best = Infinity;
        Array.prototype.forEach.call(track.children, function (card, i) {
          var d = Math.abs(card.getBoundingClientRect().left - track.getBoundingClientRect().left);
          if (d < best) { best = d; idx = i; }
        });
        Array.prototype.forEach.call(dots.children, function (b, i) {
          if (i === idx) { b.setAttribute("aria-current", "true"); } else { b.removeAttribute("aria-current"); }
        });
      }
      track.addEventListener("scroll", sync, { passive: true });
      sync();
    });
  }

  initLibrary();
  initCarousels();
}());
