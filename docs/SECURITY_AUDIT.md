# Security audit — wojciech.io + subdomains

Date: 2026-05-21. Scope: wojciech.io, app.wojciech.io, gh.wojciech.io,
academy(.v2), subscribe.wojciech.io, notch.wojciech.io.

## Summary

Posture is solid for a static-first edge stack. Auth uses HMAC-signed
HttpOnly/Secure/SameSite cookies, no secrets in the repo, parameterised D1
queries (no SQL injection surface), and CORS is locked on the one open
endpoint. This pass fixed a token-expiry bug and added the missing security
headers (HSTS + CSP) across every property.

Severity legend: 🔴 high · 🟠 medium · 🟡 low · 🟢 informational

## Findings + status

### 🟠 FIXED — GrowthHub auth token never expired server-side
`apps/growthhub/functions/_middleware.ts` called `verifyToken(token, secret)`
with two args; the function signature is `(token, secret, maxAgeMs)`. With
`maxAgeMs` undefined the age check (`Date.now() - ts > undefined`) is always
false, so a leaked/copied cookie token was replayable indefinitely (client
cookie Max-Age is 30d, but the token value itself never expired server-side).
**Fix:** pass `maxAgeMs` (30-day default via `COOKIE_MAX_AGE_DAYS`), matching
the root middleware. Deployed.

### 🟠 FIXED — Missing security headers on every property
No property sent `Strict-Transport-Security` or `Content-Security-Policy`.
Gated apps (app.wojciech.io, gh) sent **no** custom headers at all, and
growthhub/academy/notch had no `_headers` file.
**Fix:** added a baseline to all six `_headers` files:
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy` (per-app connect/frame/font allowlists)
- (X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy already
  present on most; filled gaps)
CSP allowlists were verified against real usage: Google Fonts (academy),
Resend (academy/subscribe contact), cal.com + YouTube/Loom iframes
(wojciech.io insights), Sentry ingest (future-proofed; DSN not currently set).

Note: `_headers` apply to **static asset** responses. Responses generated
*inside* middleware (302 redirects, login.html via `ASSETS.fetch`) do not
inherit them — acceptable, since those are redirects/login shells.

### 🟡 PARTIALLY FIXED — Rate-limiting on auth / contact / subscribe endpoints
**Update 2026-05-21:** added app-level KV-backed rate limiting (defense-in-depth):
gh `/api/auth` 10/min/IP, academy `/api/contact` 5/10min/IP, subscribe
`/api/subscribe` 5/10min/IP. Verified live (10×401 → 429). Turnstile wired on
academy forms (gated on env keys). **Still recommended:** the platform-level
Cloudflare WAF rate-limit rule on `/api/*` across the zone — needs a token
with `zone:edit` or a dashboard action (current automation token is read-only
for zones). Original finding below for context.


`/api/auth` (password), `/api/contact` (academy, sends email), and
`/api/subscribe` have no app-level rate limit or bot challenge.
- `/api/auth`: brute-force is impractical (16-char high-entropy password,
  constant-time compare) but a lockout/limit is good hygiene.
- `/api/contact`: **unauthenticated email vector** — CORS is locked but CORS
  doesn't stop a direct `curl` POST. Could be used to spam hello@wojciech.io.
- `/api/subscribe`: double-opt-in (KV token + Resend) limits damage but a
  flood could burn Resend quota.
**Recommendation:** add a Cloudflare Rate Limiting rule (e.g. 10 req/min/IP on
`/api/*`) and/or Cloudflare Turnstile on the contact + subscribe forms.
Cheapest win: one WAF Rate Limiting rule in the dashboard, no code change.

### 🟡 OPEN — CSP uses `script-src 'unsafe-inline'`
The inline theme-detection script and Astro `is:inline` blocks require it.
This still blocks external script injection, but doesn't stop inline XSS if a
reflected/stored injection ever lands. The sites are static with no
user-generated HTML, so the realistic XSS surface is near zero.
**Recommendation (low priority):** move to nonce/hash-based CSP if dynamic
content is ever introduced. Not worth the effort for the current static stack.

### 🟢 GOOD — verified clean
- **No secrets in repo:** grep for `sk_live/sk_test/re_*/AIza/PEM/api_token`
  found nothing; `.gitignore` covers `.env*` and `.dev.vars*`.
- **Cookie flags:** `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age` on both
  auth issuers. HMAC-SHA256 signing, constant-time signature compare.
- **SQL injection:** all D1 queries use `.bind()`; no string interpolation of
  user input into SQL.
- **Open redirect:** middleware login redirect target is hard-coded `/login`,
  not derived from a `?next=`/`returnTo` param.
- **SSRF:** GA4/Pipedrive adapters build fetch URLs from env vars (trusted),
  not from request input.
- **Input validation:** subscribe + contact validate email with regex, trim,
  lowercase before use.
- **CORS:** `/api/contact` locks `Access-Control-Allow-Origin` to
  academy.wojciech.io + the preview origin (not `*`).

## Recommended next actions (for Wojtek, dashboard-side)

1. **Cloudflare Rate Limiting rule** on `/api/*` across the zone (10-20
   req/min/IP). One rule, no code. Highest ROI.
2. **Turnstile** on `/api/contact` + subscribe form (free, ~15 min wiring).
3. **GrowthHub password — ROTATED 2026-05-21.** The original auto-generated
   value was printed in an earlier revision of this doc and is therefore
   treated as compromised; it has been rotated via
   `wrangler pages secret put APP_PASSWORD --project-name=gh-wojciech-io`.
   The new value is not stored in the repo. To set a memorable one, run the
   same command again. (Old value verified rejected: 401; new value: 200.)
4. **HSTS preload** (optional): once comfortable, add `; preload` and submit
   to hstspreload.org. Currently omitted to keep it reversible.
5. **Verify CSP on live wojciech.io** after this deploy: open DevTools console,
   confirm no CSP violations on home / an insights article with a video embed /
   the contact page with the cal.com embed.
