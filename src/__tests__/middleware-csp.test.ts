import { describe, expect, it } from 'vitest';
import { PUBLIC_SECURITY_HEADERS } from '../../functions/_middleware';

describe('public middleware CSP', () => {
  const csp = PUBLIC_SECURITY_HEADERS['content-security-policy'];

  it('allows the Cal.com embedded scheduler (inline on contact, popup on CTAs)', () => {
    expect(csp).toMatch(/script-src[^;]*https:\/\/app\.cal\.com/);
    expect(csp).toMatch(/frame-src[^;]*https:\/\/app\.cal\.com/);
    expect(csp).toMatch(/connect-src[^;]*https:\/\/app\.cal\.com/);
    expect(csp).toMatch(/img-src[^;]*https:\/\/app\.cal\.com/);
  });

  it('allows external media used by public pages', () => {
    expect(csp).toMatch(/img-src[^;]*https:\/\/i\.ytimg\.com/);
    // simpleicons CDN: tech-logo chips on the /stack overview page
    expect(csp).toMatch(/img-src[^;]*https:\/\/cdn\.simpleicons\.org/);
  });

  it('allows PostHog EU product analytics (consent-gated)', () => {
    expect(csp).toMatch(/connect-src[^;]*https:\/\/eu\.i\.posthog\.com/);
    expect(csp).toMatch(/script-src[^;]*https:\/\/eu-assets\.i\.posthog\.com/);
  });

  it('allows pagefind web workers, webmanifest, and WASM compilation', () => {
    expect(csp).toMatch(/worker-src[^;]*'self'/);
    expect(csp).toMatch(/manifest-src[^;]*'self'/);
    // Pagefind compiles a WebAssembly module at runtime; without this Safari refuses it.
    expect(csp).toMatch(/script-src[^;]*'wasm-unsafe-eval'/);
  });

  it('allows Sentry client-side error reporting', () => {
    expect(csp).toMatch(/connect-src[^;]*https:\/\/o4511411558678528\.ingest\.de\.sentry\.io/);
  });

  it('does not allow Mixpanel, which only the subscribe subdomain loads', () => {
    // subscribe.wojciech.io ships its own CSP from apps/subscribe, so the root
    // never needed these. Keeping them widened script-src for a script no page
    // here loads. Re-add only if a root page actually starts using Mixpanel.
    expect(csp).not.toMatch(/mxpnl\.com/);
    expect(csp).not.toMatch(/mixpanel\.com/);
  });

  it('sets cross-origin isolation headers without breaking third-party embeds', () => {
    expect(PUBLIC_SECURITY_HEADERS['cross-origin-opener-policy']).toBe('same-origin-allow-popups');
    expect(PUBLIC_SECURITY_HEADERS['cross-origin-resource-policy']).toBe('same-origin');
    expect(PUBLIC_SECURITY_HEADERS['cross-origin-embedder-policy']).toBe('unsafe-none');
  });

  it('X-Frame-Options is DENY, consistent with frame-ancestors none in CSP', () => {
    // frame-ancestors 'none' in CSP is the modern directive; X-Frame-Options DENY
    // covers legacy browsers that do not support CSP Level 2+.
    expect(PUBLIC_SECURITY_HEADERS['x-frame-options']).toBe('DENY');
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it('Permissions-Policy opts out of FLoC and Topics API', () => {
    const pp = PUBLIC_SECURITY_HEADERS['permissions-policy'];
    expect(pp).toContain('interest-cohort=()');
    expect(pp).toContain('browsing-topics=()');
  });
});
