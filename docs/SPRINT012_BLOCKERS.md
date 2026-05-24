# Sprint 0 + 1 + 2 — Wojciech blockers

**Single source of truth.** Refreshed 2026-05-24 after autonomous content rolls (PR #29, #32, #33, #34).

Ordered by **highest-leverage / lowest-time first**.

---

## ✅ Resolved autonomously since last refresh

- **B5a** — name = **Tablica** (default-picked after Crewly failed due-diligence; override-able with `name = X`)
- **T1 partial** — 3 existing testimonials migrated to `src/content/testimonials/` collection (Robert Sikorski/GetResponse, Dariusz Gołębiewski/mBank, Mike Zoladkowski/Type2Sell). Pełna curacja więcej — pending Wojciech if wanted.
- **Dead `src/i18n/`** — removed (zero imports anywhere)
- **Voice audit** — confirmed site is voice-conformant, zero anti-pattern rewrites needed
- **2 new Codex closed tasks** — data-pl/it attribute sweep, sitemap+redirects audit
- **Future planning docs** — `FUTURE_CULTURAL_LOCALIZATION.md` + `FUTURE_REDESIGN_WITH_LOVABLE.md`

---

## 🔴 Wysoki priorytet (Twój input wymagany)

### S0-1 — Cloudflare Access for `dev.wojciech.io`
**Czas:** 5-7 min.
**Co odblokuje:** PR #21 (dashboard) ready+merge.
**Akcja:** Cloudflare Zero Trust dashboard → Access → Applications → setup `dev.wojciech.io` z Google OAuth + WebAuthn passkey, allow tylko Twój email.
**Sygnał gotowości:** napisz "CF Access done".
**Issue:** [#10](https://github.com/wojciechluszczynski/wojciech-io/issues/10)

---

## 🟡 Średni priorytet (każde ~10 min, w dowolnej kolejności)

### M1 — Metrics validation dla 7 work entries
**Czas:** 10-15 min.
**Co odblokuje:** `/work` page renderuje ProjectCards z proof metrics zamiast pustymi miejscami.
**Akcja:** Paste w chat:

```
== METRICS FILL ==

ad-assistant (AdsAI / Ad Assistant)
- label: ___ value: ___    (3-5 wpisów; "TBD" jak brak validated number)

gtm-starter-pack (Claude Code GTM Agent Starter Pack)
- label: ___ value: ___

hireme (HireMe)
- label: ___ value: ___

kamperownia (Camper Rental Booking Engine)
- label: ___ value: ___

mini-apps (Działka+, Paczka+, Resume+)
- label: ___ value: ___

notch (NotchCue)
- label: ___ value: ___

relora (Relora)
- label: ___ value: ___
```

**Hard rule:** każdy `value` to realny number ALBO `"TBD"` per CLAUDE.md. Zero invent.
**Output:** jeden PR z 7 .json files updated.

### S1-1 — Otwórz Codex session na 5 closed tasks
**Czas:** 10 min start, potem async.
**Co odblokuje:** Pierwszy realny Codex↔Claude Code orchestration cycle.
**5 closed tasks gotowych** (Codex może wziąć równolegle albo sekwencyjnie):

1. `.codex-tasks/2026-05-22-seo-foundations-review.md` — SEO audit baseline (oryginalny)
2. `.codex-tasks/2026-05-23-visual-regression-baseline-capture.md` — Tier 5a baselines
3. `.codex-tasks/2026-05-23-testimonialslider-migrate-to-collection.md` — single source of truth
4. `.codex-tasks/2026-05-24-data-pl-it-attribute-sweep.md` — ~200 dead attrs cleanup
5. `.codex-tasks/2026-05-24-sitemap-and-redirects-audit.md` — Sprint 2 SEO fallout fix

**Akcja:** odpal Codex w drugiej karcie, daj mu pierwszy task lub "wybierz i wykonuj po kolei".
**Sygnał:** Codex PR pojawi się → ja review+merge.

### T1+ — Więcej testimonials (opcjonalne)
**Czas:** ~10 min/quote.
**Akcja:** Paste per testimonial:

```
== TESTIMONIAL ==
quote: "<full quote>"
author: <full name>
role: <job title>
company: <company>
href: <LinkedIn URL or blank>
claimTightness: specific-numbers | specific-outcome | generic
voiceFit: high | medium | low
featured: true | false
tags: [<tag1>, <tag2>]
```

---

## 🟢 Niski priorytet (async)

| ID | Co | Czas |
|---|---|---|
| S1-2 | Better Stack monitor account ([betterstack.com](https://betterstack.com/)) | ~10 min |
| S1-3 | Renovate GitHub App install ([github.com/apps/renovate](https://github.com/apps/renovate)) | ~5 min |
| S2-Linear | Decision: "wire Linear" / "stay GitHub" / "defer" | 2 min |

---

## 🔮 Future (czekają na trigger)

### Cultural localization sprints
**Plan:** `docs/FUTURE_CULTURAL_LOCALIZATION.md` — pełna strategia transcreation per market.
**Order:** PL → EN-International polish → EN-US → IT → DE → JP → DK/NO.
**Trigger:** "start cultural sprint <market>".

### Redesign z Lovable
**Plan:** `docs/FUTURE_REDESIGN_WITH_LOVABLE.md` — handoff protocol.
**Rekomendacja:** NIE zaczynaj przed Sprint 2 content lock.
**Trigger:** podziel się pierwszym Lovable URL.

### Branch protection na main
**Plan:** włączyć po 2 tyg clean CI history (zaczęło dziś).
**Trigger:** "enable branch protection".

### Release Manager v0.1.0 dry-run
**Plan:** manual workflow_dispatch release-please.yml → review CHANGELOG → ACK → merge.
**Trigger:** "cut v0.1.0".

---

## Summary

| ID | Item | Czas | Priorytet |
|---|---|---|---|
| S0-1 | CF Access setup | 5-7 min | 🔴 |
| M1 | Paste metrics dla 7 entries | 10-15 min | 🟡 |
| S1-1 | Otwórz Codex session (5 tasks queued) | 10 min start | 🟡 |
| T1+ | Więcej testimonials (opcjonalne) | per quote | 🟡 |
| S1-2 | Better Stack | ~10 min | 🟢 |
| S1-3 | Renovate install | ~5 min | 🟢 |
| S2-Linear | Decision | 2 min | 🟢 |

**Total focused time na 🔴+🟡:** ~30-40 min.
**Critical path do "Sprint 2 cluster #2 publishable":** S0-1 + M1 + S1-1 (Codex SEO task) = ~30 min.

---

## Heartbeat

Daily digest mail (pon-pt 08:00 UTC). Workflow failure emails OFF od 2026-05-24 (Wojciech odznaczył w GitHub notification settings). Cloudflare bot comments — opcjonalnie OFF w CF dashboard → Workers & Pages → Settings → Build & deployments → "Comment on pull requests".
