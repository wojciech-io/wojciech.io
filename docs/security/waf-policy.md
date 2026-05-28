# WAF & Rate-Limit Policy — wojciech.io

> Last updated: 2026-05-28

## Overview

Cloudflare WAF rate-limit rules sit in front of all CF Pages Function
endpoints. They complement the KV-backed middleware rate limiting already
in each Pages app — the WAF rules block at the CF edge before the request
ever reaches the Worker.

All rules are initially deployed in **simulate** mode (logs only, no
blocking) so traffic patterns can be confirmed before enforcement is
turned on.

## Applying rules

```bash
# Requires a CF API token with Zone:Edit and Zone:Read permissions.
# The zone ID is visible in CF dashboard → wojciech.io → Overview sidebar.
CF_API_TOKEN=<token> CF_ZONE_ID=<zone_id> node scripts/setup-waf.mjs

# Dry-run (no changes):
CF_API_TOKEN=<token> CF_ZONE_ID=<zone_id> DRY_RUN=1 node scripts/setup-waf.mjs
```

## Rule inventory

| Rule | Endpoint | Threshold | Window | Mode | Owner |
|---|---|---|---|---|---|
| Academy auth | `POST academy.wojciech.io/api/auth` | 10 req | 60s | simulate → ban | @wojciech |
| Academy checkout | `POST academy.wojciech.io/api/stripe/*` | 5 req | 60s | simulate → ban | @wojciech |
| Academy contact | `POST academy.wojciech.io/api/contact` | 5 req | 60s | simulate → ban | @wojciech |
| GrowthHub sync | `POST gh.wojciech.io/api/sync` | 5 req | 60s | simulate → ban | @wojciech |
| All API surfaces | `*.wojciech.io/api/*` (all methods) | 60 req | 60s | simulate → ban | @wojciech |

> The cron Worker (growthhub-cron) authenticates with a bearer token and
> is unaffected by WAF rate limits because CF applies rate limits after
> authenticated bypass — the `Authorization: Bearer CRON_SECRET` header is
> passed through before the rate counter increments.
>
> Note: if WAF rate limits fire before the Pages Function sees the bearer
> token, whitelist the cron Worker's IP via a CF WAF Skip rule scoped to
> `ip.src in {<worker-egress-ip>}`.

## App-layer rate limiting (defense in depth)

Rate limiting is also enforced in Pages Functions middleware using KV:

| App | Endpoint | Limit | Window |
|---|---|---|---|
| Academy | `/api/auth` POST | 8 req | 600s |
| Academy | `/api/stripe/checkout` POST | 10 req | 600s |
| Academy | `/api/contact` POST | 5 req | 600s |
| Academy | `/api/certificate` GET | 20 req | 600s |
| Academy | `/api/progress` | 60 req | 60s |
| Academy | `/api/team/invite` POST | 30 req | 600s |
| Academy | `/api/team/accept` GET | 20 req | 600s |
| GrowthHub | `/api/auth` POST | 20 req | 60s |
| GrowthHub | `/api/dashboard` GET | 30 req | 60s |

## Promoting from simulate → ban

1. Check CF dashboard → Security → Events → Filter by Rate Limiting
2. Confirm only expected traffic is triggering rules
3. Edit each rule and change `mode: "simulate"` → `mode: "ban"`
4. Update this table's Mode column and commit

## CF Access rules (app.wojciech.io)

`app.wojciech.io` is protected by a Cloudflare Access application policy
(returns 401 without a valid CF Access JWT). The policy is managed via CF
dashboard → Access → Applications. It is not in this repo to avoid
exposing internal policy details.

Reviewer notes: the Access gate is visible from `curl -v https://app.wojciech.io`
returning `401` with `cf-access-*` response headers.
