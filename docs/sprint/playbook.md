# Sprint playbook

Weekly rhythm, roles, and ceremonies for the wojciech.io agent-assisted workflow. Lightweight — one human, several agents.

## Cadence

| Day/time | Event | Output |
|---|---|---|
| Mon–Fri 8:00 | Daily digest (mail) | What needs your decision today |
| Sun 22:00 | Security Auditor cron run | Security report + any CVE PRs |
| Fri 14:00 | Sprint review + next-sprint proposal (Sprint 3+) | Retro + proposed backlog |
| Mon | Approved sprint backlog → agents start | — |

(Cron times are targets; everything starts as `workflow_dispatch` and is enabled deliberately, day by day.)

## Roles

- **Human (Wojciech)** — accepts/rejects, sets priorities, approves deploys. Single source of decisions.
- **Tech Lead agent** — orchestration, CI/workflow ownership, the only agent allowed to merge PRs, delegates closed tasks to Codex.
- **Security Auditor agent** — secrets/deps/SAST scans, files CVE PRs, cannot merge.
- **Codex** — independent review + closed implementation tasks on separate branches.

## Sprint states (Kanban)

`Backlog → Proposed → Approved → In Progress → In Review → Done` (+ `Blocked`).

- Agents may move items `Backlog → Proposed` (suggest work) but not `Proposed → Approved` (human-only gate).
- `Approved → In Progress` only after human approval.

## Definition of done

Inherits `AGENTS.md` "Definition of done for any page" plus: CI green, security gate green, conventional-commit history, docs and implementation agree.
