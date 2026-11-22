/* Shared UI layer for /revolution. Loads motion.css and ui.css when the page lacks them, then draws the reading progress line.
   Add with: <script src="assets/motion/ui.js" defer></script> (path relative to the page). No dependencies, no layout work in scroll. */
(function () {
  'use strict';
  var me = document.currentScript, base = me && me.src ? me.src.replace(/ui\.js(\?.*)?$/, '') : null;
  function css(name) {
    if (!base || document.querySelector('link[href*="motion/' + name + '"]')) return;
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = base + name; document.head.appendChild(l);
  }
  css('motion.css'); css('ui.css');

  var root = document.documentElement, bar, on = false, tick = false, max = 0;
  function measure() { max = Math.max(0, root.scrollHeight - innerHeight); }
  function paint() {
    tick = false;
    var p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    bar.style.setProperty('--p', p.toFixed(4));
    var show = scrollY > 120 && max > innerHeight * 2.5;
    if (show !== on) { on = show; bar.classList.toggle('is-on', on); }
  }
  function ask() { if (!tick) { tick = true; requestAnimationFrame(paint); } }
  function init() {
    if (document.querySelector('.m-prog')) return;
    bar = document.createElement('i'); bar.className = 'm-prog'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    measure(); paint();
    addEventListener('scroll', ask, { passive: true });
    addEventListener('resize', function () { measure(); ask(); }, { passive: true });
    addEventListener('load', function () { measure(); ask(); });
    if ('ResizeObserver' in window) new ResizeObserver(function () { measure(); ask(); }).observe(document.body);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
