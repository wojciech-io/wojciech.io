# Security Auditor — TRIAGE-002 (2026-05-22, run #26297234363)

**Trigger:** Manual re-run of `security.yml` on `main` after Sprint 0 merge.
**Result:** ❌ FAIL — 6 blocking semgrep findings (2 rules, 3 file locations).
**Assessment:** All findings are **FALSE POSITIVES**. No code is vulnerable.

---

## Finding TRIAGE-002a — `replaceAll` HTML/XML escape (5 occurrences, 1 file)

- **Rule:** `javascript.audit.detect-replaceall-sanitization`
- **File:** `src/pages/rss.xml.ts:4-10`
- **Pattern:**
  ```ts
  const escapeXml = (value: string) =>
    value
      .replaceAll('&', '&amp;')      // & must be first
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');
  ```
- **Context:** Function escapes Astro content collection data (`post.data.title`, `post.data.description`) before injecting into RSS XML output. Data source is Wojciech's MDX files (validated by `src/content.config.ts` schema), not user input.

### Why this is a false positive

- The 5 character sequence is **complete and correct** for XML 1.0 predefined entities (`&`, `<`, `>`, `"`, `'`).
- Order matters and is correct: `&` → `&amp;` first to avoid double-escaping.
- Semgrep's rule is designed for HTML output (which has script/style/URL contexts requiring stronger escaping). This is XML, not HTML.
- Source data is internal (MDX authored by site owner), not user-controlled input.

### Recommended fix options

Three paths — pick one based on tradeoff:

**Option A — Inline `nosem` annotation (minimal, fastest, zero behavior change)**
```ts
const escapeXml = (value: string) =>
  // nosemgrep: javascript.audit.detect-replaceall-sanitization.detect-replaceall-sanitization
  value
    .replaceAll('&', '&amp;')
    ...
```
- Pros: 1-line change, zero risk, gate passes, clear documentation of the FP decision at the call site.
- Cons: Annotation accumulates if more FPs surface later.

**Option B — Switch to `@astrojs/rss` (proper refactor, removes hand-rolled escaping entirely)**
- Replace whole file with `@astrojs/rss` package usage (already compatible with Astro 6.x).
- Pros: Battle-tested escaping, cleaner code, removes the FP at the source.
- Cons: New dep (~50KB to install), small code change in `src/pages/`, needs PR + review. Adds ~5-10 minutes of work + verification.

**Option C — Raise semgrep severity threshold in `security.yml`**
- Change `semgrep ci --config auto` → `semgrep ci --config auto --severity ERROR` (skip audit-tier).
- Pros: Removes whole class of audit-tier FPs in one shot.
- Cons: Lose the audit-tier signal entirely (some audit-tier findings ARE worth knowing).

---

## Finding TRIAGE-002b — `new RegExp` with template literal (2 file locations)

- **Rule:** `javascript.lang.security.audit.detect-non-literal-regexp`
- **Files:**
  - `apps/academy/functions/_middleware.ts:11`
  - `apps/growthhub/functions/_middleware.ts:50`
- **Pattern:**
  ```ts
  const COOKIE_NAME = 'academy_auth';  // or 'wapp_auth'
  // ...
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  ```

### Why this is a false positive

- The substituted variable `${COOKIE_NAME}` is a **hardcoded constant** defined in the same file.
- No user input flows into the regex.
- ReDoS risk: zero (regex pattern is bounded — `[^;]+` matches until `;` or end-of-string).

### Recommended fix options

**Option A — Inline regex (recommended, removes the `new RegExp` entirely)**
```ts
// Was: new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`)
// Now: literal regex, escaping COOKIE_NAME hard-coded value
const match = cookie.match(/(?:^|;\s*)academy_auth=([^;]+)/);
```
- Pros: Removes the rule trigger at the source, simpler code, faster (no regex compilation per call).
- Cons: If `COOKIE_NAME` ever changes, two places to update. Mitigation: comment pointing to the constant.

**Option B — `nosem` annotation**
- Same pattern as TRIAGE-002a.

---

## Auditor recommendation

**Apply Option A (inline `nosem`) for TRIAGE-002a + Option A (literal regex) for TRIAGE-002b.**

Rationale:
- Smallest change (4 lines edited across 3 files)
- Zero behavior change
- Clear comments at each site explaining the FP decision
- Gate becomes green
- No new deps, no semgrep config drift
- Refactor to `@astrojs/rss` can come later as a clean-up task (not blocking)

**Risk assessment:** LOW. None of the changes touch authentication, authorization, or data-flow logic. The cookie regex change is functionally identical (just literal instead of dynamic-but-constant).

**Files affected:**
- `src/pages/rss.xml.ts` (+1 comment line)
- `apps/academy/functions/_middleware.ts` (1 line modified)
- `apps/growthhub/functions/_middleware.ts` (1 line modified)

**Estimated review effort:** 5 minutes for a human reviewer.

---

## Status

- TRIAGE-002a: PROPOSED FIX (awaiting user approval)
- TRIAGE-002b: PROPOSED FIX (awaiting user approval)
- Security gate: BLOCKED until fix applied

## Escalation

Created as part of Sprint 0 day-1 follow-up smoke run. No CVE, no user data exposure. Does not require URGENT escalation. Standard PR flow.
