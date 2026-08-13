/**
 * PostHog product analytics: wojciech.io
 *
 * EU data residency: events + config go to eu.i.posthog.com (assets on
 * eu-assets.i.posthog.com). The project key is a PUBLIC, write-only ingestion
 * token inlined at build time from PUBLIC_POSTHOG_KEY. Production is built in
 * GitHub Actions (.github/workflows/deploy.yml), not by Cloudflare, so the value
 * has to be a GitHub Actions secret. A Cloudflare Pages environment variable of
 * the same name is runtime-only and never reaches the bundle: setting it there
 * looks like a fix and changes nothing.
 * Absent locally -> init() is a no-op, so dev/test never talk to PostHog.
 *
 * Consent gate: opt_out_capturing_by_default keeps everything silent until
 * initAfterConsent() opts in (called once cookie-consent === 'accepted', via
 * the shared analytics consent chokepoint). Cookieless: persistence stays in
 * localStorage (no cookies). No session recording or surveys on
 * the public marketing site: autocapture + pageviews only.
 */

import posthog from 'posthog-js';

const RAW_KEY = import.meta.env.PUBLIC_POSTHOG_KEY as string | undefined;

/**
 * PostHog project keys are `phc_` followed by a long opaque string. Anything
 * else is a placeholder, and a placeholder is worse than nothing here: init
 * succeeds, a distinct_id persists, sessions start, and every request to /e/
 * comes back `200 {"status":"Ok"}` because that endpoint accepts the payload
 * and validates the key later. The events are then dropped and the dashboard
 * stays empty while the browser shows a perfectly healthy integration.
 *
 * Production shipped with this key set to the single character "-" and looked
 * fine from every angle except the one that matters. The old guard was
 * `if (!KEY)`, and "-" is truthy.
 */
export function isValidProjectKey(key: unknown): key is string {
  return typeof key === 'string' && /^phc_[A-Za-z0-9]{20,}$/.test(key.trim());
}

const KEY_LOOKS_REAL = isValidProjectKey(RAW_KEY);
const KEY = KEY_LOOKS_REAL ? (RAW_KEY as string).trim() : undefined;

if (import.meta.env.PROD && RAW_KEY && !KEY_LOOKS_REAL) {
  // Loud on purpose: silent analytics is the failure this exists to prevent.
  console.warn(
    `[posthog] PUBLIC_POSTHOG_KEY is set but does not look like a project key ` +
      `(expected phc_…, got ${JSON.stringify(RAW_KEY)}). Refusing to init: ` +
      `PostHog would accept the events and discard them.`,
  );
}

let initialised = false;

function init() {
  if (initialised || !KEY) return;
  posthog.init(KEY, {
    api_host: 'https://eu.i.posthog.com',
    ui_host: 'https://eu.posthog.com',
    persistence: 'localStorage',          // GDPR: no cookies
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
