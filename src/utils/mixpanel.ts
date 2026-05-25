/**
 * Mixpanel analytics helper — wojciech.io
 *
 * EU data residency: events go to api-eu.mixpanel.com
 * Project: https://eu.mixpanel.com/project/4027656
 *
 * Consent gate: initializes only when cookie-consent === 'accepted'.
 * All events use snake_case property names (Mixpanel is case-sensitive).
 * Anonymous tracking only on the marketing site — no .identify() call here.
 * Academy / app subdomains: call mp.identify(user_id) after login.
 */

import mixpanel from 'mixpanel-browser';

const TOKEN = 'efa47f584d961f6fdbe3857da52daf9a';
let initialised = false;

function init() {
  if (initialised) return;
  mixpanel.init(TOKEN, {
    api_host: 'https://api-eu.mixpanel.com',
    track_pageview: false,       // we fire page_viewed manually for full control
    persistence: 'localStorage', // avoid cookie classification under GDPR
    ignore_dnt: false,
    ip: false,                   // don't collect raw IP
    batch_requests: true,
  });
  initialised = true;
}

/** Call once the user has given consent. Safe to call multiple times. */
export function initAfterConsent() {
  init();
  mixpanel.opt_in_tracking();
}

/** Call when user declines or revokes consent. */
export function optOut() {
  if (!initialised) return;
  mixpanel.opt_out_tracking();
}

/** Convenience wrapper — no-ops if not initialised. */
function track(event: string, props?: Record<string, unknown>) {
  if (!initialised) return;
  // Omit undefined/null values — Mixpanel doesn't benefit from explicit nulls
  const clean = props
    ? Object.fromEntries(Object.entries(props).filter(([, v]) => v != null))
    : undefined;
  mixpanel.track(event, clean);
}

// ─── Core events ───────────────────────────────────────────────────────────

export function trackPageViewed(props: {
  path: string;
  title: string;
  referrer?: string;
}) {
  track('page_viewed', {
    path: props.path,
    title: props.title,
    referrer: props.referrer || document.referrer || undefined,
  });
}

export function trackArticleViewed(props: {
  slug: string;
  title: string;
  category?: string;
  tags?: string[];
  read_time_min?: number;
}) {
  track('article_viewed', props);
}

/**
 * Fires at 25 / 50 / 75 / 100 % scroll depth on article pages.
 * Call once per depth milestone — caller is responsible for deduplication.
 */
export function trackArticleScrollDepth(props: {
  slug: string;
  depth_pct: 25 | 50 | 75 | 100;
}) {
  track('article_scroll_depth', props);
}

export function trackCtaClicked(props: {
  label: string;
  href: string;
  location: string; // e.g. 'hero', 'footer', 'cta_band', 'article_end'
}) {
  track('cta_clicked', props);
}

export function trackNewsletterCtaClicked(props: { location: string }) {
  track('newsletter_cta_clicked', props);
}

export function trackOutboundClicked(props: { href: string; label?: string }) {
  track('outbound_clicked', props);
}
