---
name: check-headers
description: Audit HTTP security headers on any URL against current best practices
allowed-tools: [Bash, Write]
---

# Check Security Headers

Fetch HTTP response headers from the provided URL and audit them against security best practices.

## Input
The user provides a URL (e.g., `https://example.com`).

## Process

1. Run `curl -sI <url>` to fetch headers
2. Check each of these headers:

| Header | Expected | Severity if missing |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Critical |
| `Content-Security-Policy` | Present, no `unsafe-inline` in script-src | Critical |
| `X-Frame-Options` | `DENY` or `SAMEORIGIN` | Warning |
| `X-Content-Type-Options` | `nosniff` | Warning |
| `Referrer-Policy` | `strict-origin-when-cross-origin` or stricter | Warning |
| `Permissions-Policy` | Present, denies camera/microphone/geolocation by default | Info |
| `Cross-Origin-Opener-Policy` | `same-origin` | Info |
| `Cross-Origin-Resource-Policy` | `same-origin` or `same-site` | Info |

3. For each header, report:
   - Current value or "MISSING"
   - Pass / Fail / Warning
   - If failing: recommended value with rationale

## Output

Write a markdown report to `SECURITY-HEADERS.md` in the current directory with:
- Summary table (header, status, severity)
- Detailed findings per header
- Copy-paste fix values for failing headers
- Score: X/8 headers passing
