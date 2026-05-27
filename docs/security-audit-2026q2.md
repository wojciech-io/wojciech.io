# Security audit - 2026 Q2

## Summary

- Date: 2026-05-27
- Scope: `wojciech.io` main branch, public Cloudflare Pages surfaces, repo-managed Pages Functions, and Wrangler deploy configuration.
- Methodology: [OWASP ASVS v4.0.3 Level 1](https://owasp.org/www-project-application-security-verification-standard/), scoped to a mostly static Astro site with a small set of Cloudflare Pages Functions.
- Overall: 21 pass / 13 partial / 0 fail / 2 N/A across 36 scoped checks.

Main status: the static site has a strong baseline: security headers, secret scanning, content privacy guard, SAST, dependency audit, CodeQL, and deploy-by-CI are in place. The remaining work is mostly operational evidence and tightening: Cloudflare WAF/Access rules are not version-controlled, CSP still needs `unsafe-inline`, CSP reporting is not wired, and CodeQL has open findings in test code that should be triaged.

## V1: Architecture, Design and Threat Modeling

| # | Control | Status | Evidence | Action |
|---|---|---|---|---|
| V1.1 | Public-safe security rules exist for AI and human contributors. | ✅ Pass | `CLAUDE.md` lines 18-28 | |
| V1.2 | Threat model exists for the public site and gated apps. | ⚠️ Partial | Security rules exist in `CLAUDE.md`, but there is no public-safe threat model document. | Add a short threat model covering public site, academy, GrowthHub, third-party analytics, and Cloudflare controls. |
| V1.14 | Security checks are part of normal delivery. | ✅ Pass | `.github/workflows/security.yml`, `.github/workflows/codeql.yml`, `.github/workflows/content-guard.yml` | |

## V2: Authentication

| # | Control | Status | Evidence | Action |
|---|---|---|---|---|
| V2.1 | Public marketing pages do not require authentication. | N/A | Main Astro pages are static and public. | |
| V2.2 | Gated apps use server-side authentication. | ⚠️ Partial | `apps/academy/functions/_middleware.ts` lines 19-32; `apps/growthhub/functions/_middleware.ts` lines 68-90 | Run a separate focused auth audit for academy and GrowthHub before treating them as production-grade apps. |
| V2.16 | Authentication endpoints have brute-force protection. | ✅ Pass | `apps/academy/functions/api/auth.ts` lines 15-17; `apps/growthhub/functions/api/auth.ts` lines 22-24 | |

## V3: Session Management

| # | Control | Status | Evidence | Action |
|---|---|---|---|---|
| V3.1 | Session cookies are signed, HttpOnly, Secure, and SameSite. | ✅ Pass | `apps/academy/functions/api/auth.ts` lines 79-90; `apps/growthhub/functions/api/auth.ts` lines 43-50 | |
| V3.3 | Session invalidation and expiry are explicit. | ⚠️ Partial | Academy magic links are one-time and sessions expire after 30 days; GrowthHub cookies are signed and expire. No central session revocation exists. | Decide whether academy/GrowthHub need server-side session revocation or shorter max age. |

## V4: Access Control

| # | Control | Status | Evidence | Action |
|---|---|---|---|---|
| V4.1 | Protected app routes are gated by middleware. | ✅ Pass | `apps/academy/functions/_middleware.ts` lines 19-32; `apps/growthhub/functions/_middleware.ts` lines 72-90 | |
| V4.2 | Cloudflare Access and WAF policy evidence is maintained. | ⚠️ Partial | Repo has Wrangler app configs, but not Cloudflare Access/WAF exports. | Export a public-safe policy summary or keep a private runbook with rule IDs, owners, and expected behavior. |

## V5: Validation, Sanitization and Encoding

| # | Control | Status | Evidence | Action |
|---|---|---|---|---|
| V5.1 | Content frontmatter is schema-validated. | ✅ Pass | `src/content.config.ts` lines 4-72 | |
| V5.3 | Database access uses parameter binding. | ✅ Pass | `apps/academy/functions/api/auth.ts` lines 38-41 and 104-114; `apps/academy/functions/api/webhook.ts` lines 32-39 | |
| V5.5 | User-controlled values are consistently encoded before HTML insertion. | ⚠️ Partial | Magic link email HTML escapes attributes in `apps/academy/functions/api/auth.ts` lines 129-140; webhook email escapes fewer characters at `apps/academy/functions/api/webhook.ts` lines 162-166. | Centralize HTML attribute escaping for all transactional email templates. |

## V6: Stored Cryptography

| # | Control | Status | Evidence | Action |
|---|---|---|---|---|
| V6.1 | Application-managed stored cryptography. | N/A | Static site has no app-managed stored secrets or encrypted user data. D1/KV are Cloudflare-managed services. | Revisit in a separate academy audit if sensitive user data expands. |

## V7: Error Handling and Logging

| # | Control | Status | Evidence | Action |
|---|---|---|---|---|
| V7.1 | Error responses avoid stack traces and sensitive details. | ✅ Pass | `apps/academy/functions/api/auth.ts` lines 19-31 and 54-76; `apps/growthhub/functions/api/auth.ts` lines 30-38 | |
| V7.2 | Security-relevant logging and retention are documented. | ⚠️ Partial | Production smoke exists in `.github/workflows/smoke-prod.yml`; there is no log retention or incident evidence policy. | Document where Cloudflare, Sentry, BetterStack, and GitHub logs live and how long they are retained. |

## V8: Data Protection

| # | Control | Status | Evidence | Action |
|---|---|---|---|---|
| V8.1 | Secrets are kept out of source control. | ✅ Pass | `CLAUDE.md` lines 18-28; `.gitignore`; `.github/workflows/security.yml` lines 15-27 | |
| V8.3 | Public repo content is guarded against private context leaks. | ✅ Pass | `.github/workflows/content-guard.yml`; `.github/workflows/sensitive-path-guard.yml` | |
| V8.8 | Public-by-design tokens are explicitly triaged. | ✅ Pass | `.gitleaks.toml` lines 21-37 | |

## V9: Communications

| # | Control | Status | Evidence | Action |
|---|---|---|---|---|
| V9.1 | HTTPS is enforced with HSTS. | ✅ Pass | `public/_headers` lines 39-48 | |
| V9.2 | Third-party network destinations are allowlisted. | ⚠️ Partial | CSP allowlist in `public/_headers` line 48 includes analytics, Cal.com, Sentry, and embeds. | Add a quarterly third-party allowlist review covering purpose, owner, and removal criteria. |
| V9.3 | CSRF risk is addressed for cookie-backed endpoints. | ⚠️ Partial | Auth cookies use SameSite=Lax in `apps/academy/functions/api/auth.ts` lines 84-90 and `apps/growthhub/functions/api/auth.ts` lines 45-50. | Add explicit CSRF review for non-idempotent Pages Functions, especially DELETE/logout and team actions. |

## V10: Malicious Code

| # | Control | Status | Evidence | Action |
|---|---|---|---|---|
| V10.1 | SAST, secret scanning, and dependency audit run in CI. | ✅ Pass | `.github/workflows/security.yml`; `.github/workflows/codeql.yml`; `.github/dependabot.yml` | |
| V10.2 | Open scanner findings are triaged. | ⚠️ Partial | GitHub code scanning currently reports open CodeQL findings in test files. | Fix or explicitly dismiss the test-only CodeQL alerts with documented rationale. |

## V11: Business Logic

| # | Control | Status | Evidence | Action |
|---|---|---|---|---|
| V11.1 | Payment webhook processing is idempotent. | ✅ Pass | `apps/academy/functions/api/webhook.ts` lines 32-44 | |
| V11.2 | Business rules for paid access, teams, and seats are fully verified. | ⚠️ Partial | Team creation and seat limit derivation exist in `apps/academy/functions/api/webhook.ts` lines 98-135. | Add tests around team limits, invites, membership expiry, and duplicate webhook paths. |

## V12: Files and Resources

| # | Control | Status | Evidence | Action |
|---|---|---|---|---|
| V12.1 | User file upload is not exposed on the public site. | ✅ Pass | No upload endpoints found in repo-managed public surfaces. | |
| V12.2 | Sensitive internal resource paths are blocked from PRs. | ✅ Pass | `.github/workflows/sensitive-path-guard.yml` | |
| V12.3 | Static resource caching is explicit. | ✅ Pass | `public/_headers` lines 1-37 | |

## V13: API and Web Service

| # | Control | Status | Evidence | Action |
|---|---|---|---|---|
| V13.1 | Webhooks authenticate source messages. | ✅ Pass | Stripe signature verification in `apps/academy/functions/api/webhook.ts` lines 21-57 | |
| V13.2 | JSON API responses set no-store where relevant. | ✅ Pass | `apps/academy/functions/api/auth.ts` lines 143-147; `apps/academy/functions/api/webhook.ts` lines 178-182 | |
| V13.4 | API rate limiting is enforced. | ⚠️ Partial | `apps/academy/functions/_utils/ratelimit.ts` and `apps/growthhub/functions/_utils/ratelimit.ts` fail open when KV is absent. | Confirm KV bindings in Cloudflare production and add a deployment check for required bindings. |

## V14: Configuration

| # | Control | Status | Evidence | Action |
|---|---|---|---|---|
| V14.1 | Secure headers are configured for the public site. | ✅ Pass | `public/_headers` lines 39-48 | |
| V14.2 | CSP is restrictive and monitored. | ⚠️ Partial | CSP exists in `public/_headers` line 48 but uses `unsafe-inline` and has no reporting endpoint. | Add CSP report-only/reporting first, then remove or hash inline script/style usage where practical. |
| V14.3 | Production deploys run from CI with secret-scoped credentials. | ✅ Pass | `.github/workflows/deploy.yml` lines 35-39, 60-64, 85-89, 110-114 | |
| V14.4 | Cloudflare WAF and Access rules are versioned or audited. | ⚠️ Partial | Wrangler app bindings exist in `apps/academy/wrangler.toml`, `apps/growthhub/wrangler.toml`, and `workers/failover/wrangler.toml`; WAF/Access rules are not represented. | Export Cloudflare rules into a private runbook or add public-safe rule summaries to this repo. |

## Next steps

1. Export or document Cloudflare WAF and Access policies with owner, purpose, and expected behavior.
2. Add CSP reporting, then reduce `unsafe-inline` in scripts and styles.
3. Triage open CodeQL findings in test files: fix real issues, dismiss false positives with rationale.
4. Run a focused academy/GrowthHub auth and session audit, including CSRF, session revocation, team seats, and invite flows.
5. Add a production binding check for required KV/D1/secrets before Pages Functions deploys.
6. Create a short public-safe threat model for static site, gated apps, analytics, Cal.com, Sentry, and Cloudflare.
7. Review third-party CSP destinations quarterly and remove any unused services.
