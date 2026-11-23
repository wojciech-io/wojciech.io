/* MODES R3, v4 pages: the same light/dark switch as the older pages.
   The head script has already set html[data-mode] and v4theme. v4.js builds light/dark by rewriting the markup,
   so a change here stores both keys and reloads once, keeping the scroll position. */
(() => {
  const root = document.documentElement;
  const KEY = 'wl-mode';
  const mode = () => (root.dataset.mode === 'light' ? 'light' : 'dark');
  const SVG = '<svg class="mi" viewBox="0 0 24 24" aria-hidden="true"><mask id="mimk4"><rect x="-6" y="-6" width="36" height="36" fill="#fff"/><circle class="mi__m" cx="17.5" cy="6.5" r="5.6" fill="#000"/></mask><circle class="mi__c" cx="12" cy="12" r="5.2" mask="url(#mimk4)"/><path class="mi__r" d="M12 1.6v2.3M12 20.1v2.3M1.6 12h2.3M20.1 12h2.3M4.65 4.65l1.6 1.6M17.75 17.75l1.6 1.6M4.65 19.35l1.6-1.6M17.75 6.25l1.6-1.6"/></svg>';
  const go = (m) => {
    try { localStorage.setItem(KEY, m); localStorage.setItem('v4theme', m); sessionStorage.setItem('wl-scroll', String(scrollY)); } catch (e) {}
    const u = new URL(location.href); u.searchParams.delete('theme'); location.href = u.href;
  };
  const sync = (b) => { const l = mode() === 'light'; b.setAttribute('aria-pressed', String(l)); b.setAttribute('aria-label', l ? 'Switch to dark mode' : 'Switch to light mode'); };
  document.querySelectorAll('.nav .r').forEach((r) => {
    if (r.querySelector('[data-mode-toggle]')) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'mode'; b.setAttribute('data-mode-toggle', ''); b.title = 'Light or dark'; b.innerHTML = SVG;
    sync(b); b.addEventListener('click', () => go(mode() === 'light' ? 'dark' : 'light'));
    r.insertBefore(b, r.querySelector('.menu'));
  });
  try { const y = sessionStorage.getItem('wl-scroll'); if (y) { sessionStorage.removeItem('wl-scroll'); addEventListener('load', () => scrollTo(0, +y)); } } catch (e) {}
  matchMedia('(prefers-color-scheme: light)').addEventListener?.('change', (e) => { let s = null; try { s = localStorage.getItem(KEY); } catch (x) {} if (!s) go(e.matches ? 'light' : 'dark'); });
})();
