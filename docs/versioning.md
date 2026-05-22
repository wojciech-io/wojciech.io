# Versioning policy

Semantic versioning + conventional commits, automated via release-please.

## Conventional commits

Format: `type(scope): summary`

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `perf`, `style`, `build`.

- `feat:` → minor bump
- `fix:` → patch bump
- `feat!:` or `BREAKING CHANGE:` footer → major bump
- `docs/chore/ci/test` → no release bump

This repo already uses conventional commits (see git log: `feat(i18n)`, `fix(academy)`, `feat(seo)`).

## SemVer

`MAJOR.MINOR.PATCH`. For a personal site, MAJOR is reserved for full redesigns / IA overhauls (e.g. v2). MINOR for new pages/sections, PATCH for fixes and copy tweaks.

## Automation (release-please)

`release-please.yml` watches `main`, maintains a release PR that:
- accumulates a CHANGELOG from conventional commits,
- bumps the version,
- tags on merge.

The release tag is what `rollback.yml` and `smoke-prod.yml` reference.

## Rules

- One logical change per commit; don't bundle unrelated work.
- No `chore: wip` on `main`.
- Breaking changes must be flagged explicitly so the major bump is intentional, not accidental.
