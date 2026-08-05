/**
 * Analytics facade: wojciech.io
 *
 * Product analytics live here: PostHog (EU region, eu.i.posthog.com). This module
 * is the only place that sends them. The site is anonymous: no .identify() here.
 * Autocapture + pageviews come from the PostHog init; the named events below are
 * explicit captures so dashboards keep a stable, structured event vocabulary.
 *
 * Not the only tag on the page, despite the name. Layout.astro also boots GA4
 * (pageviews only: gtag js + config, no events, no send_to, no Ads conversion
 * linking) behind the same consent check, and Sentry ships error reporting via
 * the Astro integration. Cloudflare Insights is wired but dormant: its script
 * is guarded on PUBLIC_CF_BEACON_TOKEN, which is unset, so no beacon is emitted.
 *
 * Everything analytics-related is consent-gated through one chokepoint shared by
 * CookieBanner, Layout, and the article page. Before consent the page ships no
 * gtag, no PostHog, no beacon. Keep it that way.
 *
 * Snake_case property names are kept for continuity with existing reports.
 */

import * as posthog from './posthog';

/**
 * Call once the user has given consent. Safe to call multiple times.
 */
export function initAfterConsent() {
  posthog.initAfterConsent();
}

/** Call when the user declines or revokes consent. */
export function optOut() {
  posthog.optOut();
}

// ─── Core events ───────────────────────────────────────────────────────────

export function trackPageViewed(props: {
  path: string;
  title: string;
  referrer?: string;
}) {
  posthog.capture('page_viewed', {
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
  posthog.capture('article_viewed', props);
}

/**
 * Fires at 25 / 50 / 75 / 100 % scroll depth on article pages.
 * Call once per depth milestone: caller is responsible for deduplication.
 */
export function trackArticleScrollDepth(props: {
  slug: string;
  depth_pct: 25 | 50 | 75 | 100;
}) {
  posthog.capture('article_scroll_depth', props);
}

export function trackCtaClicked(props: {
  label: string;
  href: string;
  location: string; // e.g. 'hero', 'footer', 'cta_band', 'article_end'
}) {
  posthog.capture('cta_clicked', props);
}

export function trackNewsletterCtaClicked(props: { location: string }) {
  posthog.capture('newsletter_cta_clicked', props);
}

export function trackOutboundClicked(props: {
  href: string;
  original_href?: string;
  label?: string;
  destination_host?: string;
  source_host?: string;
  path?: string;
}) {
  posthog.capture('outbound_clicked', props);
}
