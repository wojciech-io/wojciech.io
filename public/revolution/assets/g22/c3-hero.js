/* C3 home hero: screens carousel driven by the "What do you want fixed?" chips, and the agent/me seam. */
(function () {
  'use strict';
  var root = document.getElementById('c3h');
  if (!root) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var track = root.querySelector('.c3h__track');
  var slides = Array.prototype.slice.call(root.querySelectorAll('.c3h__p'));
  var row = root.querySelector('.c3h__chips');
  var chips = Array.prototype.slice.call(row.querySelectorAll('button'));
  var count = root.querySelector('.c3h__n b');
  var bar = root.querySelector('.c3h__bar i');
  var pair = root.querySelector('.c3h__pair');
  var seam = root.querySelector('.c3h__seam');
  var cur = -1;

  function setSeam(v) {
    v = Math.max(20, Math.min(80, Math.round(v)));
    root.style.setProperty('--seam', v);
    if (seam) seam.setAttribute('aria-valuenow', String(v));
  }

  function mark(i) {
    if (i === cur) return;
    cur = i;
    var s = slides[i];
    count.textContent = (i < 9 ? '0' : '') + (i + 1);
    bar.style.width = ((i + 1) / slides.length * 100) + '%';
    chips.forEach(function (c) {
      var on = slides[+c.dataset.go].dataset.g === s.dataset.g;
      c.setAttribute('aria-pressed', String(on));
      if (on && row.scrollWidth > row.clientWidth) row.scrollTo({ left: c.offsetLeft - row.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
    });
    setSeam(+s.dataset.s);
  }

  function go(i) {
    i = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
    mark(i);
  }

  function nearest() {
    var x = track.scrollLeft, best = 0, d = Infinity;
    slides.forEach(function (s, i) { var dd = Math.abs(s.offsetLeft - slides[0].offsetLeft - x); if (dd < d) { d = dd; best = i; } });
    return best;
  }

  var t;
  track.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(function () { mark(nearest()); }, 90); }, { passive: true });
  chips.forEach(function (c) { c.addEventListener('click', function () { go(+c.dataset.go); }); });
  Array.prototype.forEach.call(root.querySelectorAll('.c3h__ar'), function (b) {
    b.addEventListener('click', function () { go(nearest() + (+b.dataset.d)); });
  });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(nearest() + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(nearest() - 1); }
  });

  /* mouse drag on the track (touch scrolls natively) */
  var dx = null, sx = 0, moved = false;
  track.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    dx = e.clientX; sx = track.scrollLeft; moved = false;
    track.classList.add('is-drag');
  });
  window.addEventListener('pointermove', function (e) {
    if (dx === null) return;
    if (Math.abs(e.clientX - dx) > 4) moved = true;
    track.scrollLeft = sx - (e.clientX - dx);
  });
  window.addEventListener('pointerup', function (e) {
    if (dx === null) return;
    var delta = e.clientX - dx;
    dx = null;
    track.classList.remove('is-drag');
    var i = nearest();
    if (Math.abs(delta) > 40) i = delta < 0 ? Math.max(i, cur + 1) : Math.min(i, cur - 1);
    go(Math.max(0, Math.min(slides.length - 1, i)));
  });
  track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  /* the seam: drag, arrows, Home/End */
  if (pair && seam) {
    var drag = false;
    var at = function (e) { var r = pair.getBoundingClientRect(); setSeam((e.clientX - r.left) / r.width * 100); };
    seam.addEventListener('pointerdown', function (e) { drag = true; root.classList.add('is-drag'); seam.setPointerCapture(e.pointerId); at(e); });
    seam.addEventListener('pointermove', function (e) { if (drag) at(e); });
    var end = function () { drag = false; root.classList.remove('is-drag'); };
    seam.addEventListener('pointerup', end);
    seam.addEventListener('pointercancel', end);
    seam.addEventListener('keydown', function (e) {
      var v = +seam.getAttribute('aria-valuenow');
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setSeam(v - 4); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setSeam(v + 4); }
      if (e.key === 'Home') { e.preventDefault(); setSeam(20); }
      if (e.key === 'End') { e.preventDefault(); setSeam(80); }
    });
  }

  mark(0);
})();
