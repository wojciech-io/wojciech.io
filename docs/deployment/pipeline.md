# Deployment pipeline

Staged rollout, gates, and owners for wojciech.io (and the stricter app.wojciech.io rule).

## Repos and deploy rules

| Repo | Branch → target | Rule |
|---|---|---|
| `wojciech.io` | `main` → Cloudflare Pages | Push to `main` freely |
| `app.wojciech.io` | `main` → CF Pages | Branch/preview only; **prod deploy needs explicit greenlight** |

Source of truth: memory `feedback_deploy_authorization.md`. Do not deploy app prod without greenlight.

## Gates (in order)

1. **CI** (`ci.yml`) — build + type-check. Must be green.
2. **Security** (`security.yml`) — gitleaks, `npm audit`, semgrep. Blocking.
3. **Merge to `main`** — Tech Lead only (once branch protection on).
4. **Cloudflare Pages build** — auto on `main` push.
5. **Smoke test** (`smoke-prod.yml`) — Playwright against prod after deploy.
6. **Watch** — Sentry + CF Analytics for errors (see `observability.md`).

## Cloudflare Pages secrets

Adding/changing a Pages secret does **NOT** auto-redeploy. After setting a secret you must manually go **Deployments → Retry** on the latest deployment. (Memory: `feedback_cloudflare_pages_secret_redeploy.md`.)

## Owners

- Pipeline / workflows: Tech Lead.
- Security gate content: Security Auditor.
- Go/no-go on app.wojciech.io prod: human only.

If smoke test fails after deploy → see `rollback-runbook.md`.
