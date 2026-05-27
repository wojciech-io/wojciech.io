# Security audit — wojciech.io

**Date:** 2026-05-27
**Scope:** GitHub repo (`wojciech-io/wojciech.io`), full git history, live domains (`wojciech.io`, `app.wojciech.io`), CI/CD, secrets handling, private-content leakage.
**Verdict:** **Strong.** No credential leaks in working tree or history. Three minor items below; none is a live credential exposure.

---

## Passed checks

| Area | Result |
|---|---|
| Secrets in tracked files | Clean — scanned `phx_`, `sk_live/test_`, `re_`, `AKIA`, `ghp_`, `AIza`, PEM private keys |
| Secrets in **full git history** (all commits, all branches) | Clean — no real key values ever committed |
| `.env` / `.dev.vars` / `*.tfstate` / `*.tfvars` | Never committed (confirmed via history) |
| `.gitignore` coverage | Comprehensive: `docs/**` (with explicit public-safe whitelist), `.env*`, `.dev.vars*`, terraform state/vars, `HANDOFF*.md`, agent state/reports, `public/images/_raw/` |
| NDA-client guard (`scripts/content-guard.sh`) | Blocks all NDA client codenames + Stripe key patterns; runs pre-commit and in CI |
| Branch protection on `main` | Required status checks: **Secret scan (gitleaks)**, **Dependency audit**, Build & type-check, Unit tests, commitlint |
| Live security headers (`wojciech.io`) | HSTS `max-age=31536000; includeSubDomains; preload`; CSP with `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `upgrade-insecure-requests`; `X-Frame-Options: DENY`; `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`; `Permissions-Policy` locks camera/mic/geo/FLoC/topics/payment |
| `app.wojciech.io` | Auth-gated (HTTP 403 unauthenticated); Cloudflare WAF challenges bot requests |
| `public/` deployable dir | Only standard assets + `_headers`/`_redirects`/manifest; no `_raw`, no private folders; `robots.txt` clean |
| Server-side GA4 key (`apps/growthhub`) | RSA key read from passed-in service-account object (env/secret), **not hardcoded** |
| Pasted credentials (PostHog key, Framer password) from chat | **Not present** anywhere in repo or history |

---

## Findings to action

### 1. MEDIUM — `HANDOFF.md` lives in git history
- Commit `5a64ae1` ("docs: HANDOFF.md — complete session context") committed an internal handoff doc; later removed from `HEAD` (now gitignored), but **still retrievable from public history**.
- Content exposes **auth architecture** (server-side Pages Functions gate, `APP_PASSWORD` plaintext approach, `COOKIE_SECRET`, 30-day session design) — *names and design, no credential values.*
- **Risk:** architectural information disclosure, not a credential leak.
- **Fix options:** (a) accept — no secrets exposed; or (b) rewrite history (`git filter-repo`) + force-push + rotate `COOKIE_SECRET` as hygiene. Decide before the guru review if you want zero internal docs in history.

### 2. LOW — CSP allows `'unsafe-inline'`
- `script-src` and `style-src` include `'unsafe-inline'`, which weakens XSS defense.
- **Fix:** migrate inline scripts/styles to nonces or hashes. (Already queued as a Codex task.)

### 3. NO ACTION — employer name intentionally published
- A former employer's name + URL appears in `src/components/pages/AboutContent.astro`, `src/data/cv.ts`, and `apps/app/src/lib/cv-data.ts` as standard work-history.
- Confirmed by the site owner (2026-05-27) as **intentional employment history**, kept on the site. It is **not** in the content-guard NDA banned list, which is correct.
- No confidential client-engagement material (NDAs, invoices, project docs) is published — only the employer name, role, and dates.

---

## Notes
- Other subdomains (`gh.wojciech.io` referenced in CSP `frame-src`) not header-tested here; extend if more subdomains are live.
- Secret-scanning/Dependabot alert API returned no read access via current token scope — confirm these are enabled in repo Settings → Security.
