# Release Manager — state

- **Last run:** never (Sprint 1 scaffold)
- **Health:** OK (idle — no release cut yet)
- **Trigger:** disabled (target: push to `main`, enabled deliberately after first ACK'd dry-run)

## Current
- **Last released tag:** _(none — pre-v0.1.0)_
- **Open release PR:** _(none — release-please not yet triggered)_
- **Smoke status:** N/A
- **Last rollback:** never

## Pending
- First dry-run: manual `gh workflow run release-please.yml` after Sprint 1 lands, to verify the action proposes a sensible v0.1.0 PR from existing conventional-commit history.
- Editorial pass on auto-generated CHANGELOG before first real release.

## Notes
Initialized in Sprint 1 (Tier 5b). Scope: `docs/versioning.md` + `docs/deployment/pipeline.md`. Release-please workflow exists from Sprint 0 but trigger is `workflow_dispatch` only — flipping to `push: main` happens AFTER first manual dry-run is ACK'd by Wojciech.
