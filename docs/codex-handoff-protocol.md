# Codex handoff protocol

When and how the Tech Lead delegates closed, reviewable tasks to Codex. Complements `AGENTS.md` (Codex = independent review + closed implementation).

## When to delegate to Codex

- Closed, well-specified tasks with clear acceptance criteria.
- Independent review of a Claude Code PR (SEO, redirects, a11y, schema, canonical URLs).
- QA / Lighthouse / performance checklists.
- Work that benefits from a second, independent model.

## When NOT to

- Open-ended exploration or positioning (that's the human + strategic reviewer).
- Anything touching `src/**` without a frozen spec.
- Cross-boundary edits not yet agreed in docs.

## Handoff mechanism

Tech Lead writes a task spec to `.codex-tasks/<ISO8601>-<slug>.md`:

```markdown
---
task: review/seo-foundations
branch_hint: codex/seo-foundations
created: 2026-05-22
acceptance:
  - canonical URLs correct on all subdomains
  - OG tags present and valid
  - sitemap references resolve
---

Context, scope, files in play, deep-links, what "done" means.
```

Codex picks it up, works on a `codex/<task>` worktree/branch, opens a PR, and writes results back to `.codex-tasks/` as a `*-result.md` companion. Tech Lead (or human) reviews and merges.

## Boundaries

Codex never merges to `main` and never edits another agent's `.agent-state/`. Tasks must be closed enough that Codex doesn't need to invent metrics or change IA (forbidden per `AGENTS.md`).
