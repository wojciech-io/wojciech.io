/**
 * PostHog product analytics: wojciech.io
 *
 * EU data residency: events + config go to eu.i.posthog.com (assets on
 * eu-assets.i.posthog.com). The project key is a PUBLIC, write-only ingestion
 * token injected at build from PUBLIC_POSTHOG_KEY (set in Cloudflare Pages env).
 * Absent locally -> init() is a no-op, so dev/test never talk to PostHog.
 *
 * Consent gate: opt_out_capturing_by_default keeps everything silent until
 * initAfterConsent() opts in (called once cookie-consent === 'accepted', via
 * the same chokepoint as Mixpanel). Cookieless: persistence stays in
 * localStorage to match the Mixpanel setup. No session recording or surveys on
 * the public marketing site: autocapture + pageviews only.
 */

import posthog from 'posthog-js';

const KEY = import.meta.env.PUBLIC_POSTHOG_KEY as string | undefined;
let initialised = false;

function init() {
  if (initialised || !KEY) return;
  posthog.init(KEY, {
    api_host: 'https://eu.i.posthog.com',
    ui_host: 'https://eu.posthog.com',
    persistence: 'localStorage',          // GDPR: no cookies, mirrors Mixpanel
    person_profiles: 'identified_only',   // anonymous marketing site: no profile for anon events
    autocapture: true,
    capture_pageview: true,               // MPA: one pageview per full load
    capture_pageleave: true,
    disable_session_recording: true,      // no screen recording on the public site
    disable_surveys: true,
    opt_out_capturing_by_default: true,   // nothing leaves until consent
    respect_dnt: true,
  });
  initialised = true;
}

/** Call once the user has given consent. Safe to call multiple times. */
export function initAfterConsent() {
  init();
  if (initialised) posthog.opt_in_capturing();
}

/** Call when the user declines or revokes consent. */
export function optOut() {
  if (!initialised) return;
  posthog.opt_out_capturing();
}

/**
 * Send a named event. No-ops until init/consent. Strips undefined/null props
 * so the payload stays lean.
 */
export function capture(event: string, props?: Record<string, unknown>) {
  if (!initialised) return;
  const clean = props
    ? Object.fromEntries(Object.entries(props).filter(([, v]) => v != null))
    : undefined;
  posthog.capture(event, clean);
}
