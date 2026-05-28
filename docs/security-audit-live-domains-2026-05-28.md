# Live domain security audit - 2026-05-28

## Summary

- Date: 2026-05-28
- Scope: `wojciech.io` and public custom subdomains detected from DNS, repo config, and live HTTP probes.
- Hosts tested: `wojciech.io`, `www.wojciech.io`, `app.wojciech.io`, `academy.wojciech.io`, `gh.wojciech.io`, `subscribe.wojciech.io`, `notch.wojciech.io`.
- Inactive hostnames checked: `dev.wojciech.io`, `akademia.wojciech.io`, `coach.wojciech.io`.
- Overall verdict: no critical live exposure found. TLS, HSTS, clickjacking protection, content sniffing protection, secret scanning, and content guards are in place. The main gaps are operational hardening: branch protection does not require all security checks, subdomain headers are inconsistent, CSP is still too permissive, Cloudflare WAF/Access rules are not documented as policy evidence, and email DNS should be hardened.

## Host inventory

| Host | DNS/live status | HTTP behavior | Verdict |
|---|---|---|---|
| `wojciech.io` | Active via Cloudflare A/AAAA | `200` | Strong baseline. |
| `www.wojciech.io` | Active via Cloudflare A/AAAA | `200` | Works, but not redirected to apex. |
| `app.wojciech.io` | Active via Cloudflare A/AAAA | `401` on `/` and `/login` | Gated. Good if Cloudflare Access is intentional. |
| `academy.wojciech.io` | Active via Cloudflare A/AAAA | `200` | Good baseline, weaker headers than root. |
| `gh.wojciech.io` | Active via Cloudflare A/AAAA | `/` redirects to `/login` | Gated, but weaker headers than root. |
| `subscribe.wojciech.io` | Active via Cloudflare A/AAAA | `200` | Good baseline, CSP broader than needed. |
| `notch.wojciech.io` | Active via Cloudflare A/AAAA | `200` | Good baseline, CSP broader than needed. |
| `dev.wojciech.io` | NXDOMAIN | Not reachable | No dangling CNAME observed. |
| `akademia.wojciech.io` | NXDOMAIN | Not reachable | No dangling CNAME observed. |
| `coach.wojciech.io` | NXDOMAIN | Not reachable | Referenced in content, but no DNS record. |

## Checks performed

- DNS: `A`, `AAAA`, `NS`, `SOA`, `CAA`, `MX`, `TXT`, `_dmarc`.
- TLS: certificate chain, TLS 1.2, TLS 1.3, legacy TLS rejection.
- HTTP: status, redirect behavior, core security headers, cache headers, CSP, COOP/CORP/COEP.
- HTTP methods: `TRACE` and `OPTIONS`.
- Discovery files: `/.well-known/security.txt`, `robots.txt`, sitemap endpoint.
- CORS preflight on public API surfaces with hostile and allowed origins.
- Repo-side controls: content guard, gitleaks, tracked internal paths, branch protection, code scanning alerts, GitHub secrets inventory names.

## Passed controls

| Area | Status | Evidence |
|---|---|---|
| TLS certificates | Pass | All active hosts present valid Google Trust Services certificates via Cloudflare. |
| TLS versions | Pass | TLS 1.2 and 1.3 work; TLS 1.1 is rejected with protocol-version alert. |
| HSTS on root | Pass | `wojciech.io` sends `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`. |
| Clickjacking defense | Pass | Active hosts send `X-Frame-Options: DENY` and/or `frame-ancestors 'none'`. |
| MIME sniffing defense | Pass | Active hosts send `X-Content-Type-Options: nosniff`. |
| Referrer policy | Pass | Active hosts send `Referrer-Policy: strict-origin-when-cross-origin`. |
| TRACE method | Pass | `TRACE` returns `405` on active hosts. |
| Bot/WAF signal | Pass | Scanner-style requests are blocked with `x-wojciech-bot-guard: blocked-scanner-user-agent`. |
| Security contact | Pass | `https://wojciech.io/.well-known/security.txt` exists for browser-like user agents and covers all subdomains. |
| Secrets in repo | Pass | `scripts/content-guard.sh` and `gitleaks detect --source . --no-git --redact --verbose` passed. |
| Internal paths | Pass | No tracked `.agent-*`, `.claude`, `.codex-tasks`, handoff, prompt, template, or internal archive paths found. |
| Academy CORS contact endpoint | Pass | Hostile origin gets no `Access-Control-Allow-Origin`; `https://academy.wojciech.io` gets expected preflight headers. |

## Findings

### P1 - Branch protection does not require all security checks

Current `main` protection requires only:

- Build & type-check
- Unit tests (Vitest)
- Validate conventional commits
- Secret scan (gitleaks)
- Dependency audit

It does not require CodeQL, Content guard, Sensitive path guard, SAST, Security headers, or E2E.

Risk: a PR can be mergeable while privacy guard, path guard, CodeQL, Semgrep, E2E, or header checks are red.

Action: add these required checks to branch protection:

- Analyze (JavaScript/TypeScript)
- CodeQL
- Privacy + quality scan
- Block internal tooling dirs
- SAST (semgrep)
- Security headers
- E2E (Playwright)

### P1 - Header policy is inconsistent across subdomains

`wojciech.io`, `subscribe.wojciech.io`, and `notch.wojciech.io` send the strongest set:

- HSTS with `preload`
- CSP with `upgrade-insecure-requests`
- COOP, CORP, COEP

`academy.wojciech.io` and `gh.wojciech.io` do not send COOP/CORP/COEP, and their HSTS omits `preload`.

Risk: not a direct break, because root HSTS includes subdomains, but policy drift makes future changes harder to reason about and leaves gated apps less consistently hardened.

Action: normalize `_headers` across `apps/academy`, `apps/growthhub`, and root where the apps do not need weaker cross-origin behavior.

### P1 - CSP is functional but too permissive

Observed issues:

- `script-src` and `style-src` still use `'unsafe-inline'`.
- Root, subscribe, and notch CSP include Cal.com, GA, Mixpanel, PostHog, Sentry, Cloudflare Insights, YouTube, Gravatar, and Simple Icons.
- Subscribe and Notch appear to inherit a broader root policy than they need.
- Academy uses `img-src 'self' data: https:`, which is intentionally broad but should be narrowed if possible.
- No app-level CSP `report-uri` or `report-to` endpoint is configured in the app headers.

Risk: broader XSS blast radius and weaker third-party supply-chain control.

Action:

1. Add CSP reporting first in report-only mode.
2. Split per-app CSP policies so each subdomain has only the third-party origins it needs.
3. Replace inline scripts/styles with hashed or nonced strategy where practical.

### P1 - Cloudflare WAF and Access rules are live but not documented as policy evidence

Live traffic shows Cloudflare bot guard behavior, and `app.wojciech.io` is gated with `401`. Repo config does not include a public-safe inventory of WAF, Access, and rate-limit rules.

Risk: security posture depends on dashboard state that reviewers cannot verify from code.

Action: export or document a public-safe rule inventory with rule name, purpose, protected host/path, expected response, and owner. Keep sensitive token values out of repo.

### P1 - Email DNS is not fully hardened

Observed DNS:

- SPF: `v=spf1 include:mx.ovh.ca include:mx.ovh.com ~all`
- DMARC: `p=quarantine; pct=100`
- No CAA records observed.
- No DKIM TXT record observed for common selectors checked.

Risk: weaker domain-abuse controls and less explicit certificate issuance control.

Action:

1. Add CAA for the actual certificate authorities used.
2. Verify OVH DKIM selector and publish DKIM if mail is active.
3. Move SPF from `~all` to `-all` after confirming all senders.
4. Move DMARC from `quarantine` to `reject` after monitoring.

### P2 - `robots.txt`, sitemap, and `security.txt` are blocked for scanner-style user agents

With a scanner/curl-like user agent, these paths return `403` and `x-wojciech-bot-guard: blocked-scanner-user-agent`:

- `/.well-known/security.txt`
- `/robots.txt`
- `/sitemap-index.xml`

With a browser-like user agent, they return correctly.

Risk: some legitimate security scanners, uptime checks, SEO tools, or simple audits may get false negatives.

Action: exempt `/.well-known/security.txt`, `/robots.txt`, `/sitemap-index.xml`, and `/sitemap-*.xml` from scanner user-agent blocking.

### P2 - `www.wojciech.io` serves a duplicate `200`

`www.wojciech.io` is live and returns `200`, not a `301` to `https://wojciech.io/`.

Risk: mostly SEO and operational clarity, not a direct security issue.

Action: add a Cloudflare redirect rule or Pages redirect from `www` to apex unless there is a deliberate reason to serve both.

### P2 - Inactive or unresolved subdomains are referenced

`coach.wojciech.io` is referenced in content but does not resolve. `dev.wojciech.io` and `akademia.wojciech.io` also do not resolve.

Risk: no dangling CNAME takeover was observed, but broken references reduce trust and can confuse monitoring.

Action: either create the intended DNS record or remove/update public references.

### P2 - CodeQL has open alerts in tests and scripts

Open alerts include test-only high-severity URL/string checks and low-risk unused-local-variable findings.

Risk: likely not production exploitable, but open high-severity alerts train reviewers to ignore red security signals.

Action: fix or dismiss with rationale in GitHub code scanning.

### P3 - API preflight on root/subscribe returns wildcard CORS on 405/static responses

`OPTIONS` to `/api/subscribe` returns `405` with `Access-Control-Allow-Origin: *`. This was not observed as credentialed API exposure, and academy contact CORS behaves correctly.

Risk: low, but the default can confuse audits.

Action: return explicit API preflight responses or remove wildcard CORS from API-like 405 surfaces if Cloudflare Pages allows it cleanly.

## Priority order

1. Require all security-relevant GitHub checks before merge.
2. Normalize security headers on `academy` and `gh`.
3. Split and tighten CSP per subdomain, starting with report-only telemetry.
4. Document Cloudflare WAF, Access, and rate-limit rules.
5. Harden DNS/email: CAA, DKIM, SPF hard fail, DMARC reject.
6. Exempt discovery files from aggressive bot blocking.
7. Redirect `www` to apex if duplicate serving is not intentional.
8. Fix or dismiss CodeQL test/script alerts with rationale.
9. Resolve or remove inactive subdomain references.

## Commands used

The audit used non-destructive probes only:

- `dig` for DNS records.
- `curl` and Node HTTPS requests for status, redirects, headers, CORS, and methods.
- `openssl s_client` and `curl --tls-max` for TLS checks.
- `gh api` and `gh secret list` for GitHub posture without reading secret values.
- `bash scripts/content-guard.sh`.
- `gitleaks detect --source . --no-git --redact --verbose`.
