// Sentry is the heaviest script on a first load (about 53 KB over the wire, 156 KB parsed) and nothing on
// a marketing page needs it before the page is usable. On a throttled phone it competes with the
// stylesheet and the hero image for bandwidth, so it loads once the page has finished loading and the
// main thread is idle. Errors raised before then are kept and reported when it arrives.
if (import.meta.env.PROD) {
  const missed = [];
  const keep = (event) => {
    if (missed.length < 20) missed.push(event);
  };
  addEventListener('error', keep);
  addEventListener('unhandledrejection', keep);

  const start = async () => {
    try {
      const lazy = await import('./sentry.lazy.js');
      lazy.start();
      for (const event of missed) {
        lazy.capture(event.reason ?? event.error ?? new Error(event.message || 'Unknown error'));
      }
    } catch {
      // A blocked or failed download must not raise an error of its own.
    } finally {
      removeEventListener('error', keep);
      removeEventListener('unhandledrejection', keep);
      missed.length = 0;
    }
  };

  const later = () => {
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 4000 });
    else setTimeout(start, 2000);
  };
  if (document.readyState === 'complete') later();
  else addEventListener('load', later, { once: true });
}
