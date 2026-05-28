# Cloudflare WAF rules

Apply these in Cloudflare Dashboard or convert them to Terraform after importing
the existing zone ruleset. Do not let Terraform create a second unmanaged ruleset
without checking the live zone first.

## Baseline managed rules

- Enable **Cloudflare Managed Ruleset** in simulate/log mode first.
- Enable **Cloudflare OWASP Core Ruleset** with paranoia level 1.
- After 48 hours without false positives, switch high-confidence rules to block.

## Custom rules

### Block obvious scanner traffic

Expression:

```text
(http.request.uri.path contains "/wp-admin")
or (http.request.uri.path contains "/wp-login.php")
or (http.request.uri.path contains "/.env")
or (http.request.uri.path contains "/vendor/phpunit")
or (http.request.uri.path contains "/xmlrpc.php")
```

Action: `Block`

### Challenge suspicious API bursts

Expression:

```text
(http.request.uri.path contains "/api/")
and not cf.client.bot
```

Action: `Managed Challenge`

Rate limit:

- Characteristics: `IP`, `colo`
- Period: `60s`
- Threshold: `120 requests`
- Mitigation timeout: `60s`

### Protect authenticated surfaces

Expression:

```text
(http.host eq "app.wojciech.io" or http.host eq "academy.wojciech.io")
and not cf.client.bot
```

Action: `Managed Challenge`

Exception: allow Cloudflare Access, Pages Functions auth endpoints, and expected
payment/webhook providers only if those endpoints are public.

## Rule inventory (policy evidence)

Public-safe inventory of the live WAF, rate-limit, and Access rules so reviewers can
verify posture from the repo without dashboard access. No tokens, zone IDs, or
incident details belong here.

| Rule | Purpose | Protected host / path | Expected response | Owner |
|---|---|---|---|---|
| Scanner path block | Block common exploit/probe paths | All hosts · `/wp-admin`, `/wp-login.php`, `/.env`, `/vendor/phpunit`, `/xmlrpc.php` | `403` | Wojciech |
| Scanner user-agent guard | Block scanner/curl-style agents | All hosts | `403` + `x-wojciech-bot-guard: blocked-scanner-user-agent` | Wojciech |
| API burst challenge | Challenge non-bot API bursts | All hosts · `/api/*` | Managed Challenge | Wojciech |
| API rate limit | Cap request bursts per client | All hosts · `/api/*` · IP+colo, 120/60s | `429` | Wojciech |
| Protect gated surfaces | Challenge non-bot traffic to gated apps | `app.wojciech.io`, `academy.wojciech.io` | Managed Challenge (auth/webhook endpoints exempt) | Wojciech |
| Cloudflare Access (app) | Identity gate on private workspace | `app.wojciech.io` · `/*` | `401` until authenticated | Wojciech |

### Planned exemption — discovery files

The scanner user-agent guard currently also blocks legitimate security scanners,
uptime checks, and SEO tools from reading discovery files. Add an exemption so the
following are served regardless of user agent (audit 2026-05-28, finding P2 #6):

- `/.well-known/security.txt`
- `/robots.txt`
- `/sitemap-index.xml`
- `/sitemap-*.xml`

## Deployment guardrail

WAF changes should be rolled out as:

1. Log/simulate for 24-48h.
2. Managed challenge for broad heuristics.
3. Block only for scanner paths and confirmed abuse.

Never paste Cloudflare API tokens, zone IDs from private dashboards, or incident
details into this public repository.
