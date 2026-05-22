# Rollback runbook

Step-by-step recovery when a prod deploy goes bad. wojciech.io is static on Cloudflare Pages, so rollback is fast and non-destructive.

## Decide: rollback or roll-forward?

- **Rollback** if: smoke test fails, visible breakage, or Sentry error spike within minutes of deploy.
- **Roll-forward** if: the issue is tiny, well understood, and a fix is faster than a rollback.

## Cloudflare Pages rollback (fastest)

1. Cloudflare dashboard → Pages → project → **Deployments**.
2. Find the last known-good deployment.
3. **⋯ → Rollback to this deployment**. Takes effect in seconds.
4. Confirm prod is healthy (load site, check `smoke-prod.yml` re-run).

## Git rollback (source of truth)

1. Identify the bad commit/PR on `main`.
2. `git revert <sha>` (NOT reset/force-push on `main`).
3. Push → CF Pages auto-builds the reverted state.
4. Re-run smoke test.

## Workflow-triggered rollback

`rollback.yml` is a manual `workflow_dispatch` that reverts the last release tag and re-deploys. Use when you want an auditable, button-press rollback:
`gh workflow run rollback.yml -f target=<tag-or-sha>`

## After any rollback

1. Open an incident note in `.agent-reports/<date>-incident-<slug>.md`.
2. File an inbox message to Tech Lead with root cause + follow-up.
3. Do NOT re-deploy the bad commit until the cause is fixed and reviewed.

## Never

- `git reset --hard` / force-push on `main`.
- Skip the post-rollback incident note.
