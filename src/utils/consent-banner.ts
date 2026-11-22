/**
 * Behaviour of the analytics consent banner, shared by both skins of it:
 * components/ui/CookieBanner.astro (site layout) and
 * components/revolution/ConsentBar.astro (standalone home page).
 *
 * Markup contract: #cookie-banner (its data-state flips between "hidden" and
 * "shown"), #cookie-accept, #cookie-decline. The choice lives in localStorage
 * under `cookie-consent` as "accepted" or "declined". GA4 and PostHog stay off
 * until it says "accepted"; ConsentAnalytics.astro reads the same key.
 */

const COOKIE_KEY = 'cookie-consent';

async function initAnalytics() {
  const { initAfterConsent } = await import('./analytics');
  initAfterConsent();
}

export function initConsentBanner(): void {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  if (!banner) return;

  const hideBanner = () => {
    banner.dataset.state = 'hidden';
  };

  const showBanner = () => {
    // Small delay so it slides in after the page has settled.
    setTimeout(() => {
      banner.dataset.state = 'shown';
    }, 1000);
  };

  const consent = localStorage.getItem(COOKIE_KEY);

  if (consent === 'accepted') {
    initAnalytics();
  } else if (!consent) {
    showBanner();
  }

  acceptBtn?.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    hideBanner();
    initAnalytics();
    window.dispatchEvent(new Event('analytics-consent-accepted'));
  });

  declineBtn?.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    hideBanner();
  });
}
