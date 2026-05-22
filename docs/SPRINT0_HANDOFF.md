# Sprint 0 — Handoff (agent infrastructure)

**Data:** 2026-05-22. Autor: Claude Code (sesja `distracted-wescoff-337d45`).
**Dla:** Codex lub świeża sesja Claude Code, jeśli pierwszej zabraknie kontekstu/tokenów.
**Cel:** Zbudować szkielet infrastruktury agentowej dla wojciech.io (dokumentacja + config + GitHub Actions + cron stubs). **Zero zmian w `src/`. Zero deployu na prod. Nic destrukcyjnego.**

> ⚠️ NIE myl tego pliku z `/HANDOFF.md` (root) — tamten to handoff sesji 2026-05-19 i jest **nietykalny**. Ten plik dotyczy WYŁĄCZNIE Sprint 0.

---

## TL;DR dla przejmującego

Budujesz ~22 nowe pliki: dokumentację procesu, definicje 2 agentów, strukturę stanu agentów, 5–6 GitHub Actions workflows, i config (CODEOWNERS, renovate, permission allowlist). Wszystko nowe pliki. **Nie dotykasz `src/`.** Commit w logicznych slice'ach. Na końcu otwierasz PR do `main` (NIE mergujesz, NIE włączasz branch protection).

Status realizacji śledzisz w sekcji **"Progress tracker"** na dole tego pliku — aktualizuj ją po każdym chunku.

---

## Kontekst — jak tu doszliśmy (decyzje użytkownika, LOCKED)

Użytkownik (Wojciech) zaakceptował budowę "Sprint 0" — fundamentu pod multi-agentowy workflow dla wojciech.io. Ustalenia z rozmowy, wszystkie potwierdzone:

### Dashboard / observability
- **Subdomena dashboardu:** `dev.wojciech.io` (NIE ops/agents — user wybrał `dev`).
- **Dostęp:** tylko dla użytkownika, "zajebiście trudny do zhackowania". Cloudflare Access (Zero Trust) + Google OAuth + WebAuthn passkey + WAF rate limit + audit log.
- **OAuth provider:** Google.
- **Geo restriction:** NIE (user podróżuje, dostęp globalny).
- Dashboard sam w sobie buduje się w **Sprint 1**, nie teraz. W Sprint 0 tylko **spec** w `docs/security/access-policy.md` + `docs/observability.md`.

### Digest / powiadomienia
- **Daily digest:** email TYLKO, bez Slacka.
- **Adres email:** `w.luszczynski@gmail.com`.
- **Godzina:** 8:00 (cron).
- W Sprint 0 cron jest **wyłączony** (workflow ma `on: workflow_dispatch`). Pierwszy mail puszczamy ręcznie po merge, potem włączamy cron świadomie.
- Urgent escalation (Security HIGH/CRITICAL, prod down) → drugi mail `[URGENT]` + opcjonalnie SMS przez Better Stack. To Sprint 1+, NIE Sprint 0.

### Branch / worktree / proces
- Konwencja nazw worktree (tylko dla NOWYCH, istniejących nie ruszamy):
  - `claude/<task>` — manualna praca z Claude Code
  - `codex/<task>` — manualna praca z Codex
  - `agent/<rola>-<task>` — cron-fired agent
- **Branch protection na `main`:** włączamy DOPIERO po Twoim ACK, jako ostatni krok, w Sprint 2. NIE w tym PR.
- Migracja stopniowa: merge Sprint 0 → manual smoke test agentów → cron Security (niedz. 22:00) → cron daily digest → branch protection.
- Rollback całości: `git revert` PR-a Sprint 0 + `schedule --delete-all`. Nic destrukcyjnego.

### Reguły deploy (z pamięci, KRYTYCZNE)
- `wojciech.io`: push do `main` swobodnie.
- `app.wojciech.io`: branch/preview only, prod deploy tylko z greenlight.
- Dodanie sekretu do CF Pages wymaga RĘCZNEGO Deployments → Retry (nie auto-redeploy).

---

## ⚠️ Gotchas wykryte w repo (przeczytaj zanim zaczniesz pisać)

1. **`.github/workflows/ci.yml` JUŻ ISTNIEJE** (709 B). NIE nadpisuj. Przeczytaj go i albo rozszerz, albo nowe workflowy nazwij osobno (`security.yml`, `release-please.yml`, `smoke-prod.yml`, `rollback.yml`, `daily-digest.yml`). Już istnieją też `backup-pages.yml` i `failover-monitor.yml`.
2. **Root `/HANDOFF.md` jest nietykalny** — to handoff innej sesji.
3. **`AGENTS.md` istnieje w root** (2310 B) — przeczytaj, może już definiuje konwencje agentów których trzeba się trzymać.
4. **Repo to monorepo** (turbo.json, packages/, apps/, workers/, functions/, terraform/). Sprint 0 dotyczy root-level orchestracji, nie pojedynczego pakietu.
5. **8+ aktywnych worktree** — inne sesje mogą pracować równolegle. Twój worktree: `distracted-wescoff-337d45`. Nie ruszaj cudzych branchy.
6. **Już jest `sentry.client.config.js`** w root — observability częściowo istnieje, uwzględnij w `docs/observability.md`.

---

## Pełna lista plików do utworzenia (~22)

### Dokumentacja (11)
- [ ] `docs/agent-ownership.md` — mapa kto edytuje co (ownership map; pierwsza linia obrony przed kolizjami)
- [ ] `docs/agent-comms.md` — protokół wiadomości (inbox/outbox, threads, eskalacja)
- [ ] `docs/agent-session-lifecycle.md` — startup/shutdown checklist każdego agenta
- [ ] `docs/sprint/playbook.md` — rytm tygodniowy, role, ceremonie
- [ ] `docs/codex-handoff-protocol.md` — kiedy i jak deleguje się do Codex
- [ ] `docs/deployment/pipeline.md` — staged rollout, bramki, owners
- [ ] `docs/deployment/rollback-runbook.md` — krok po kroku jak cofnąć
- [ ] `docs/versioning.md` — semver policy, conventional commits
- [ ] `docs/observability.md` — Sentry + CF Analytics + Better Stack (decision log: czemu nie Grafana)
- [ ] `docs/security/baseline-checklist.md` — co Security Auditor sprawdza w Sprint 0
- [ ] `docs/security/access-policy.md` — Cloudflare Access dla `dev.wojciech.io`, Google OAuth, WebAuthn, NO geo restriction, audit log

### Definicje agentów (2)
- [ ] `.claude/agents/tech-lead.md`
- [ ] `.claude/agents/security-auditor.md`

### Struktura stanu (stuby + .gitkeep)
- [ ] `.agent-state/tech-lead/inbox/.gitkeep`
- [ ] `.agent-state/tech-lead/outbox/.gitkeep`
- [ ] `.agent-state/tech-lead/state.md`
- [ ] `.agent-state/tech-lead/open-threads.md`
- [ ] `.agent-state/security-auditor/inbox/.gitkeep`
- [ ] `.agent-state/security-auditor/outbox/.gitkeep`
- [ ] `.agent-state/security-auditor/state.md`
- [ ] `.agent-state/security-auditor/open-threads.md`
- [ ] `.agent-reports/.gitkeep`
- [ ] `.codex-tasks/.gitkeep`

### GitHub Actions (5–6; UWAGA na istniejący ci.yml)
- [ ] `.github/workflows/security.yml` — gitleaks, npm audit, semgrep (blocking)
- [ ] `.github/workflows/release-please.yml` — auto CHANGELOG + tag
- [ ] `.github/workflows/smoke-prod.yml` — Playwright smoke na prod po deploy
- [ ] `.github/workflows/rollback.yml` — manual trigger via `gh workflow run`
- [ ] `.github/workflows/daily-digest.yml` — cron 8:00 (na start `workflow_dispatch`), mail → `w.luszczynski@gmail.com`
- [ ] ci.yml — rozszerz istniejący jeśli trzeba (lint, typecheck, build, unit tests), NIE nadpisuj na ślepo

### Config (3)
- [ ] `CODEOWNERS` — zdefiniowany, NIE enforced dopóki branch protection wyłączone
- [ ] `renovate.json` — auto dep updates, grouped weekly
- [ ] `.claude/settings.local.json` — permission allowlist per agent (Security Auditor NIE może `gh pr merge`, tylko Tech Lead). UWAGA: jeśli plik istnieje, merge zamiast nadpisać.

---

## Czego ten PR NIE robi (świadomie)
- NIE włącza branch protection na `main`.
- NIE tworzy GitHub Project boardu (komendy `gh project create` idą do PR description, do uruchomienia ręcznie po merge).
- NIE konfiguruje Cloudflare Access (user robi w CF dashboard wg `docs/security/access-policy.md`).
- NIE uruchamia żadnego crona (`on: workflow_dispatch` na start).
- NIE wysyła pierwszego maila.
- NIE zmienia produkcji. NIE dotyka `src/`.

## Po merge — checklist użytkownika (3 manualne kroki)
1. `gh project create` (komenda w PR description).
2. Włącz Cloudflare Access dla `dev.wojciech.io` wg `docs/security/access-policy.md`.
3. Zatwierdź włączenie cron daily-digest: `gh workflow run daily-digest.yml` raz ręcznie, sprawdź mail, potem włącz cron.

---

## Plan commitów (logiczne slice'y)
1. `docs(sprint0): handoff + process docs` — ten plik + 11 docs
2. `feat(agents): tech-lead + security-auditor definitions`
3. `chore(agents): agent state scaffold (inbox/outbox/state)`
4. `ci(sprint0): security, release, smoke, rollback, daily-digest workflows`
5. `chore(sprint0): CODEOWNERS, renovate, agent permission allowlist`

Na końcu: `gh pr create` do `main`. Tytuł krótki, body z checklistą użytkownika + komendami `gh project create`.

---

## Progress tracker (AKTUALIZUJ PO KAŻDYM CHUNKU)

| Slice | Status | Commit |
|---|---|---|
| 0. SPRINT0_HANDOFF.md | ✅ done | (ten commit) |
| 1. process docs (11) | ⬜ todo | |
| 2. agent definitions (2) | ⬜ todo | |
| 3. agent state scaffold | ⬜ todo | |
| 4. workflows (5–6) | ⬜ todo | |
| 5. config (3) | ⬜ todo | |
| PR otwarty | ⬜ todo | |

**Ostatnia aktualizacja:** 2026-05-22, handoff utworzony jako pierwszy plik. Reszta Sprint 0 do wyprodukowania.
