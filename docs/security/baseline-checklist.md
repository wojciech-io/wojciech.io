# Security baseline checklist

What the Security Auditor agent verifies. Drives `security.yml` (CI) and the Sunday cron run.

## Automated gates (`security.yml`, blocking on PR)

- [ ] **Secrets** — gitleaks scan; no secrets in diff or history. Build output must contain no secrets.
- [ ] **Dependencies** — `npm audit` (fail on high/critical); Renovate keeps deps current.
- [ ] **SAST** — semgrep with default + JS/TS rulesets; no high-severity findings.

## Manual / periodic (Sunday cron)

- [ ] Review new/changed deps for supply-chain risk.
- [ ] Check CF Pages build logs for leaked env vars.
- [ ] Verify security headers live: HSTS, CSP, X-Content-Type-Options, Referrer-Policy.
- [ ] Confirm `security.txt` present and current (already shipped — see git log `feat(seo): ... add security.txt`).
- [ ] Verify `dev.wojciech.io` is behind Cloudflare Access and not in any sitemap.

## CVE response SLA

- **CRITICAL/HIGH** → patch PR within 24h; escalate via `[URGENT]` path.
- **MEDIUM** → next sprint.
- **LOW** → batched into Renovate weekly group.

## Agent boundaries

Security Auditor may open PRs (CVE patches, header fixes) but **cannot merge** — only Tech Lead merges (enforced via permission allowlist in `.claude/settings.local.json`). Findings go to `.agent-reports/` (append-only) and high-priority items to Tech Lead's inbox.
