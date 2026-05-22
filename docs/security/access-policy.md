# Access policy — dev.wojciech.io

Security model for the agent dashboard. User requirement: access for the owner only, "extremely hard to hack." Configured in the Cloudflare dashboard after Sprint 0 merge — this doc is the spec.

## Summary of locked decisions

- Subdomain: **dev.wojciech.io**
- Access: **owner only** via Cloudflare Access (Zero Trust)
- OAuth provider: **Google**
- Second factor: **WebAuthn passkey** (Touch ID / YubiKey / iCloud Keychain)
- Geo restriction: **NONE** (user travels — global access)
- Digest delivery is separate (email to `w.luszczynski@gmail.com`); the dashboard is pull-only.

## Layers

### 1. Cloudflare Access (Zero Trust)
- Application = `dev.wojciech.io`, policy **Allow** only identity `w.luszczynski@gmail.com`.
- Everyone else → 403, no login screen shown.
- Session: 15 min idle timeout, 8h max, then re-auth.
- Free tier (<50 users) → 0 cost.

### 2. Multi-factor (WebAuthn passkey)
- Login = Google OAuth **+ mandatory passkey**.
- No passkey → no entry, even with a valid Google password. Kills phishing / credential-stuffing / leaked-password vectors.

### 3. Network
- Cloudflare proxy (orange cloud) — origin IP never exposed.
- WAF: rate limit 30 req/min per IP; Bot Fight Mode on.
- HSTS preload, strict CSP, no inline scripts.
- **No** geo restriction (user travels).

### 4. Attack surface ≈ zero
- Static Astro page, no API, no forms, no secret-bearing JS.
- Entire site (incl. `/sitemap.xml`) behind Access.
- Subdomain absent from sitemaps and unlinked from main site.
- Build logs behind Access; secrets never in build output (Security Auditor checks in CI).

### 5. Audit
- Cloudflare Access logs every visit: who/when/where/success-fail.
- Logpush → R2 for after-the-fact review.
- Alert on new device/location attempt.

## Deliberately NOT done (overkill)
- mTLS client certs (marginal gain vs setup cost).
- WireGuard/Tailscale-only (breaks mobile/travel access).
- Custom IP allowlist (user's IP changes while traveling).

## Setup checklist (user, post-merge)
1. CF dashboard → Zero Trust → Access → Add application `dev.wojciech.io`.
2. Identity provider: Google.
3. Policy: Allow, email = `w.luszczynski@gmail.com`, require WebAuthn.
4. Session 15 min idle / 8h max.
5. WAF rate limit 30/min + Bot Fight Mode.
6. Enable Logpush → R2.
7. Confirm subdomain is excluded from all sitemaps.
