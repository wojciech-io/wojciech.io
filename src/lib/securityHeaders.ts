/* Security headers applied to every wojciech.io response.
 *
 * This lives here rather than in functions/_middleware.ts because two tests
 * assert that it agrees with public/_headers, and importing it from the
 * middleware pulled a file full of Cloudflare Workers globals into the
 * build-time TypeScript project. The constant itself is plain data and needs
 * neither runtime.
 */

// Security headers applied to every wojciech.io response.
// PostHog uses EU endpoints (eu.i.posthog.com). Sentry tunnel not used on public site.
export const PUBLIC_SECURITY_HEADERS: Record<string, string> = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'cross-origin-opener-policy': 'same-origin-allow-popups',
  'cross-origin-resource-policy': 'same-origin',
  'cross-origin-embedder-policy': 'unsafe-none',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=(), payment=()',
  // Middleware wins over Pages _headers wherever Functions run; _headers covers
  // the rest, so both carry the same policy. Agreement is enforced by
  // src/__tests__/headers-sources-agree.test.ts rather than by remembering.
  // unsafe-inline required for Astro's is:inline scripts and Tailwind utilities.
  // gh.wojciech.io is for LiveEmbed demos.
  'content-security-policy': [
    "default-src 'self'",
    // wasm-unsafe-eval: Pagefind search compiles a WebAssembly module at runtime.
    // app.cal.com: embedded scheduler (inline on contact, popup on booking CTAs)
    "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://eu-assets.i.posthog.com https://app.cal.com",
    "style-src 'self' 'unsafe-inline'",
    // cdn.simpleicons.org: tech-logo chips on the /stack overview page
    "img-src 'self' data: https://www.gravatar.com https://img.youtube.com https://i.ytimg.com https://cdn.simpleicons.org https://app.cal.com https://cal.com",
    // *.google-analytics.com, not just www: GA4 sends hits to a regional
    // endpoint (region1.google-analytics.com for EU traffic, other regionN
    // elsewhere). Listing only www silently blocked every hit at connect-src.
    "connect-src 'self' https://*.google-analytics.com https://analytics.google.com https://cloudflareinsights.com https://o4511411558678528.ingest.de.sentry.io https://eu.i.posthog.com https://eu-assets.i.posthog.com https://app.cal.com",
    "font-src 'self'",
    // worker-src: pagefind search uses web workers served from same origin
    "worker-src 'self'",
    // manifest-src: webmanifest served from same origin
    "manifest-src 'self'",
    "frame-src https://gh.wojciech.io https://app.cal.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join('; '),
};
