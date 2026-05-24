# Morning checklist — odblokowanie reszty Sprint 0/1/2

**Cel:** w 30-45 min porannego skupienia rozwiąć wszystko, co blokuje sprint zamknięcia.
**Kontekst:** stan repo zfreezowany 2026-05-24 wieczorem. Wszystko poniżej to Twoje klicki/paste'y. Tech-lead reaguje na każdy w 5-10 min jednym PR-em.

Otwórz tę listę, idź od góry do dołu. Każdy item ma jeden konkretny output ode mnie po Twoim sygnale.

---

## 1. 🔴 CF Access dla `dev.wojciech.io` (10-12 min, najwyższa wartość)

**Co odblokuje:** PR #21 dashboard ready+merge + pierwsza weryfikacja end-to-end agent dashboarda na `dev.wojciech.io`.

**Pre-check (zrobiony za Ciebie 2026-05-24):** `dig dev.wojciech.io` zwrócił PUSTO. Musisz najpierw dodać DNS, potem dopiero ustawić Access.

### Krok A — DNS (2 min)

Cloudflare dashboard → wybierz `wojciech.io` → **DNS → Records → Add record:**

| Pole | Wartość |
|---|---|
| Type | `CNAME` |
| Name | `dev` |
| Target | `wojciech-io.pages.dev` |
| Proxy status | **Proxied** (orange cloud ON) |
| TTL | Auto |

Save.

### Krok B — CF Pages project dla dev (3 min)

Cloudflare → **Workers & Pages → Create application → Pages → Connect to Git:**

| Pole | Wartość |
|---|---|
| Repository | `wojciechluszczynski/wojciech-io` |
| Project name | `wojciech-io-dev` |
| Production branch | `main` |
| Build command | `npm run build:dev` |
| Build output directory | `apps/dev/dist` |
| Root directory | `/` |

Save and Deploy. Czekasz ~2 min na pierwszy build.

Po pierwszym deploy: **Custom domains → Set up a custom domain → `dev.wojciech.io`** → Activate.

### Krok C — Access policy (5 min)

Cloudflare → **Zero Trust → Access → Applications → Add an application → Self-hosted:**

| Pole | Wartość |
|---|---|
| Application name | `dev.wojciech.io dashboard` |
| Session duration | `24h` |
| Subdomain | `dev` |
| Domain | `wojciech.io` |
| Path | (puste) |

**Identity providers:** zaznacz **Google** (jeśli brak, najpierw **Zero Trust → Settings → Authentication → Login methods → Add → Google**, oraz **One-time PIN** jako fallback).

**Add a policy:**

| Pole | Wartość |
|---|---|
| Policy name | `Allow Wojciech with passkey` |
| Action | **Allow** |
| Include | Selector: **Emails** → Value: `w.luszczynski@gmail.com` |
| Require | Selector: **Authentication method** → Value: **WebAuthn** |

Save → Add application.

### Test

Incognito → `https://dev.wojciech.io` → Google login → passkey → 404 (dashboard scaffold istnieje ale PR #21 jeszcze DRAFT — to spodziewane).

### Twój sygnał

Napisz w czat: **`CF Access done`**

### Mój output

PR #21 → mark Ready → merge → curl test → confirm w czat + screenshot homepage dashboardu.

---

## 2. 🟡 M1 metrics dla 7 work entries (10-15 min)

**Co odblokuje:** `/work` page renderuje ProjectCards z proof metrics (dziś wszystkie `metrics: []`).

### Skopiuj poniżej + wypełnij + wklej w czat

**Hard rule:** każdy `value` to realna liczba ALBO dosłownie `TBD`. Nie wymyślaj — jak nie wiesz, wpisz `TBD`. Tech-lead nigdy nie invent metryki per CLAUDE.md.

```
== METRICS FILL ==

ad-assistant (AdsAI / Ad Assistant)
- label:                              value: 
- label:                              value: 
- label:                              value: 

gtm-starter-pack (Claude Code GTM Agent Starter Pack)
- label:                              value: 
- label:                              value: 
- label:                              value: 

hireme (HireMe)
- label:                              value: 
- label:                              value: 
- label:                              value: 

kamperownia (Camper Rental Booking Engine)
- label:                              value: 
- label:                              value: 
- label:                              value: 

mini-apps (Działka+, Paczka+, Resume+)
- label:                              value: 
- label:                              value: 
- label:                              value: 

notch (NotchCue)
- label:                              value: 
- label:                              value: 
- label:                              value: 

relora (Relora)
- label:                              value: 
- label:                              value: 
- label:                              value: 
```

### Przykład wypełnienia żeby zobaczyć shape

```
ad-assistant
- label: Cost per agent run    value: $2-8
- label: Setup time            value: <1 day
- label: Active campaigns      value: TBD
```

### Mój output

Po Twoim paste: jeden PR z 7 .json files updated, auto-merge gdy CI green. ~5 min.

---

## 3. 🟡 Codex session — 5 closed tasks queued (10 min start, async run)

**Co odblokuje:** pierwszy realny Codex↔Claude Code orchestration cycle. To zamknie "9-agent system" z teorii w praktykę.

### Otwórz Codex w drugiej karcie. Wklej dosłownie:

```
Read .codex-tasks/2026-05-22-seo-foundations-review.md in
wojciechluszczynski/wojciech-io repo. Execute per the acceptance criteria.

Branch: codex/seo-foundations-review
Open PR when done.
Write result file at .codex-tasks/2026-05-22-seo-foundations-review-result.md.

After that task is complete and PR opened, pick the next from this list
and repeat (separate branch + separate result file per task):

1. .codex-tasks/2026-05-24-sitemap-and-redirects-audit.md
2. .codex-tasks/2026-05-23-testimonialslider-migrate-to-collection.md
3. .codex-tasks/2026-05-23-visual-regression-baseline-capture.md
4. .codex-tasks/2026-05-24-data-pl-it-attribute-sweep.md

Each task has clear acceptance criteria and hard boundaries. Don't merge to
main (tech-lead Claude Code handles merges). Don't touch other agent's
.agent-state. Ask for clarification if any spec is ambiguous.
```

### Mój output

Każdy Codex PR pojawi się → ja review + merge w 5-10 min per PR. Pierwszy (SEO foundations) najważniejszy — zamknie SEO Sprint 2 fallout.

Możesz zostawić Codex sesję działającą i wrócić za 2-4 godziny.

---

## 4. 🟢 Better Stack monitor (~10 min, low urgency)

**Co odblokuje:** urgent escalation channel (SMS + 2nd email) dla SECURITY HIGH/CRITICAL + prod down events.

### Kroki

1. https://betterstack.com/ → Sign up (free tier wystarcza)
2. **Uptime → Create monitor**
3. Pole `URL or IP`: `https://wojciech.io/`
4. Check interval: 1-3 min
5. **Alert channels → SMS + Email** (do `w.luszczynski@gmail.com`)
6. Test alert (one-click w UI)

### Twój sygnał

Napisz: **`BetterStack ready, token = <YOUR_API_TOKEN>`**

(token znajdziesz w **Settings → API tokens** w Better Stack)

### Mój output

Wiruję `BETTERSTACK_TOKEN` secret w GitHub Actions, wiruje workflow który auto-pinguje BetterStack przy security HIGH+. Jeden PR.

---

## 5. 🟢 Renovate GitHub App install (~5 min)

**Co odblokuje:** automated dependency PRs co poniedziałek 9:00 Europe/Warsaw (per istniejący `renovate.json`).

### Kroki

1. https://github.com/apps/renovate
2. **Install** (lub Configure jeśli już masz konto)
3. Wybierz **only `wojciechluszczynski/wojciech-io`** (NIE All repositories)
4. Grant permissions
5. Wait ~5 min → onboarding PR titled "Configure Renovate" pojawi się
6. Merge onboarding PR (config już jest w repo, Renovate sam dopasuje)

### Twój sygnał

Nie trzeba sygnalizować — Renovate sam zacznie. Wystarczy że potwierdzisz w czat: **`Renovate installed`**.

### Mój output

Sprawdzam pierwszy `gh pr list --search "author:app/renovate"`, weryfikuję czy dependency dashboard issue powstał.

---

## 6. 🟢 Linear integration decision (2 min)

**Co odblokuje:** zamyka pytanie z 2026-05-22.

### Wybierz jedno

- **`wire Linear`** → ja drafuję integration plan (digest pulls Linear assigned-to-me, critical agent events mirror do Linear)
- **`stay GitHub`** → zamykam w memory permanently (GitHub Issues = single source of truth)
- **`defer`** → status quo, wracamy za 2-4 tyg

### Mój output

Po Twoim słowie:
- "wire" → jeden PR z scaffolding `.github/workflows/linear-sync.yml` stub + memory update
- "stay" → memory note update + close consideration permanently
- "defer" → memory note timestamp update

---

## ⚠️ Po wszystkich 6: następne autonomous moves

Po Twoim CF Access + M1 + Codex pierwszy PR:

- Branch protection na main (po 2 tyg clean CI; możesz przyspieszyć po Codex pierwszym merge)
- Release Manager v0.1.0 dry-run (manual `gh workflow run release-please.yml` → review CHANGELOG → ACK)
- Sprint 2 → Sprint 3 transition doc (po Codex tasks closed)

Sygnał dla każdego: `enable branch protection` / `cut v0.1.0` / `start sprint 3`.

---

## Heartbeat

- Daily digest mail (pon-pt 08:00 UTC) — automatyczny, zero akcji
- Security scan automatyczny w niedzielę 22:00 UTC
- Lighthouse weekly cron w poniedziałek 06:00 UTC

Jeśli kiedykolwiek dziwne — sprawdź `.agent-state/tech-lead/state.md` najpierw.

---

## Tech-lead session pickup (dla mnie jutro)

Read order na cold start:
1. To file (`docs/MORNING_CHECKLIST.md`)
2. `.agent-state/tech-lead/state.md`
3. `gh pr list --state open`
4. `gh issue list --state open --search "is:open"`
5. Last `.agent-reports/<date>-*.md` jeśli istnieje

Sprint 0/1/2 are CLOSED z agent infrastructure perspective. Sprint 2 content = w toku, czeka na Wojciech inputs powyżej. Sprint 3 (claude-code-vs-clay migration + cultural localization start) — Wojciech triggered.
