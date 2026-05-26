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

## Deployment guardrail

WAF changes should be rolled out as:

1. Log/simulate for 24-48h.
2. Managed challenge for broad heuristics.
3. Block only for scanner paths and confirmed abuse.

Never paste Cloudflare API tokens, zone IDs from private dashboards, or incident
details into this public repository.
