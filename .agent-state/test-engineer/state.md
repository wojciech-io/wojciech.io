# Test Engineer — Working State

> Persistent memory across sessions. Updated at shutdown, read at startup.

## What I know about the world

Sprint 1 just started. No tests exist in repo yet. Building from scratch.

## Current sprint

Sprint: 1
My active tasks: scaffolding Playwright + smoke + a11y + visual baseline
WIP: 1 / 2

## Recent decisions

- Playwright base URL: local Astro preview (`npm run preview`) for PR CI, real prod URL for `smoke-prod.yml`. Deferred from Sprint 1 brief — adopted recommendation from HANDOFF.
- A11y in Sprint 1: warning-mode (don't block PRs). Flip to blocking in Sprint 2 once baseline is clean.
- Visual regression: Playwright native (`toHaveScreenshot()`) — not Percy/Chromatic. Revisit if cross-browser flakiness becomes painful.

## Things I'm waiting on

- User decision on whether to enable Playwright in `ci.yml` blocking-mode from day 1 or warning-mode for first week.
- First merge of Sprint 1 baseline → then I can start running on every PR.

## Known issues / flakes

(None yet.)
