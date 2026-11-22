/* Direction C hero: the seam between the agent and me moves with a pointer, a finger or the arrow keys.
   A chip moves the seam first, then follows its link. No motion with prefers-reduced-motion. */
(function () {
  'use strict';
  var sec = document.getElementById('c3h');
  if (!sec) { return; }
  var seam = sec.querySelector('.c3h__seam');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vertical = function () { return window.matchMedia('(max-width: 767px)').matches; };
  var value = 50;
  var set = function (v) {
    value = Math.max(20, Math.min(80, v));
    sec.style.setProperty('--seam', value.toFixed(1));
    seam.setAttribute('aria-valuenow', String(Math.round(value)));
  };
  var from = function (e) {
    var r = sec.getBoundingClientRect();
    return vertical() ? (e.clientY - r.top) / r.height * 100 : (e.clientX - r.left) / r.width * 100;
  };
  var drag = false;
  seam.addEventListener('pointerdown', function (e) {
    drag = true;
    sec.classList.add('is-drag');
    seam.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  seam.addEventListener('pointermove', function (e) {
    if (drag) { set(from(e)); }
  });
  var end = function () {
    drag = false;
    sec.classList.remove('is-drag');
  };
  seam.addEventListener('pointerup', end);
  seam.addEventListener('pointercancel', end);
  seam.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k === 'ArrowLeft' || k === 'ArrowUp') { set(value - 4); e.preventDefault(); }
    if (k === 'ArrowRight' || k === 'ArrowDown') { set(value + 4); e.preventDefault(); }
    if (k === 'Home') { set(20); e.preventDefault(); }
    if (k === 'End') { set(80); e.preventDefault(); }
  });
  Array.prototype.forEach.call(sec.querySelectorAll('.c3h__chips a'), function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      Array.prototype.forEach.call(sec.querySelectorAll('.c3h__chips a'), function (x) { x.classList.toggle('on', x === a); });
      set(Number(a.getAttribute('data-s')) || 50);
      if (still || e.metaKey || e.ctrlKey) { return; }
      e.preventDefault();
      window.setTimeout(function () {
        if (href.charAt(0) === '#') {
          var t = document.querySelector(href);
          if (t) { t.scrollIntoView({ behavior: 'smooth' }); }
        } else {
          window.location.href = href;
        }
      }, 420);
    });
  });
  set(50);
  sec.classList.add('is-ready');
}());
