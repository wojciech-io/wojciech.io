# Security Headers Checker

Claude Code plugin that audits HTTP security headers on any URL. Checks CSP, HSTS, X-Frame-Options, Permissions-Policy, Referrer-Policy, and CORP/COEP. Reports what is missing, what is weak, and what to fix.

## Install

```bash
# From this repo
claude plugins install ./bites/security-headers-checker

# Or copy the skills/ folder into your project's .claude/skills/
```

## Skills

| Command | What it does |
|---|---|
| `/check-headers <url>` | Fetch headers from a URL and audit against best practices |
| `/csp-audit <url>` | Deep-dive on Content-Security-Policy: unsafe directives, missing sources, overly permissive rules |
| `/hsts-check <url>` | Verify HSTS: max-age, includeSubDomains, preload eligibility |

## Output

Each skill writes a markdown report with:
- Current header value (or "MISSING")
- Severity (critical / warning / info)
- Recommended fix with copy-paste header value
- Links to relevant MDN documentation

## License

MIT
