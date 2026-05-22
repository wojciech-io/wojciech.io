# Security baseline checklist

What the Security Auditor agent verifies. Drives `security.yml` (CI) and the Sunday cron run.

## Automated gates (`security.yml`, blocking on PR)

- [x] **Secrets** — gitleaks scan; no secrets in diff or history. Build output must contain no secrets. (Suppression: `.gitleaksignore` for known FPs; top-level `[[allowlists]]` in `.gitleaks.toml` proved ineffective against findings from extended default rules — see PR #6.)
- [x] **Dependencies** — `npm audit` (fail on high/critical); Renovate keeps deps current.
- [x] **SAST** — semgrep with default + JS/TS rulesets; no high-severity findings. (Suppression: inline `// nosemgrep: <rule-id>` directly above the match; must be on the line immediately preceding the matched expression — see PR #4.)
- [x] **Headers** — assert CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy on each subdomain. Blocking for public surfaces; warning for known gaps (currently: `app.wojciech.io/login` — see follow-up triage).

## Manual / periodic (Sunday cron)

- [ ] Review new/changed deps for supply-chain risk.
- [ ] Check CF Pages build logs for leaked env vars.
- [ ] Confirm `security.txt` present and current (already shipped — see git log `feat(seo): ... add security.txt`).
- [ ] Verify `dev.wojciech.io` is behind Cloudflare Access and not in any sitemap.
- [ ] Review `.gitleaksignore` and inline `// nosemgrep` annotations — any still valid? Any expired suppressions to remove?

## Known gaps (open, tracked separately)

- **`app.wojciech.io/login` lacks security headers.** `login.html` is served as a static asset and bypasses `Layout.astro` (where the header middleware lives). Headers check is `warning`-mode for this URL until fixed. Fix: emit headers from the Pages Function middleware, or render login through Layout. See follow-up PR.

## CVE response SLA

- **CRITICAL/HIGH** → patch PR within 24h; escalate via `[URGENT]` path.
- **MEDIUM** → next sprint.
- **LOW** → batched into Renovate weekly group.

## Agent boundaries

Security Auditor may open PRs (CVE patches, header fixes) but **cannot merge** — only Tech Lead merges (enforced via permission allowlist in `.claude/settings.local.json`). Findings go to `.agent-reports/` (append-only) and high-priority items to Tech Lead's inbox.
