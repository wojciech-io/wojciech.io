---
task: sprint4/security-headers
branch_hint: codex/security-headers
created: 2026-05-26
author: tech-lead (Claude Code)
acceptance:
  - public/_headers exists with Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
  - CSP allows: self, cdn.jsdelivr.net (pagefind), sentry CDN, mixpanel, google analytics, gtm, cal.com iframe (contact page)
  - X-Frame-Options: SAMEORIGIN
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: camera=(), microphone=(), geolocation=()
  - public/security.txt exists at /.well-known/security.txt with contact + expires fields
  - npm run build passes
  - No console CSP errors on homepage, about, ai-systems, insights/[slug] pages
---

# Codex task — Security headers + security.txt

## Context

The site is deployed on Cloudflare Pages. CF Pages respects a `public/_headers` file for HTTP response headers. No security headers are set currently.

## Files to create

- `public/_headers` — CF Pages header rules
- `public/.well-known/security.txt` — security disclosure contact

## _headers format

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://browser.sentry-cdn.com https://js.sentry-cdn.com https://www.googletagmanager.com https://www.google-analytics.com https://api-eu.mixpanel.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api-eu.mixpanel.com https://www.google-analytics.com https://*.sentry.io https://ingest.de.sentry.io; frame-src https://cal.com; object-src 'none'; base-uri 'self'
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## security.txt

Use contact: mailto:hello@wojciech.io, expires: 2027-01-01T00:00:00.000Z

## Validation

After build, verify no CSP violations appear in browser console by loading key pages. If violations found, adjust the CSP directives. Do NOT use `unsafe-eval` unless absolutely required.
