# Academy rebuild — repositioning + Astro migration

Created: 2026-05-20. Owner: Wojtek. Target: ship in 4-5 working days.

## Mission

Repozycjonowanie `academy.wojciech.io` z konsumenckiego "Akademia AI 249 PLN"
na **B2B operacyjne narzędzie dla zespołów GTM** — odpowiednik formatu
Sellwise / Szymona Negacza, ale wokół AI w operacji rewenue (nie sales technique).
Migracja źródła do monorepo (`apps/academy/`) na Astro z zachowaniem estetyki,
audio, certyfikatów i Stripe.

## Current state recap

Akademia żyje na `academy.wojciech.io` (CF Pages: `akademia-wojciech-io`,
**direct upload, brak Git source**). Pobrałem snapshot do `/tmp/akademia-snapshot/`
(101 KB index.html + 62 KB style.css). Architektura:

- Single-page landing — Inter + JetBrains Mono, dark theme, `--orange` accent
- Sekcje: hero · workflow · program (36 odc) · pricing · opinie · CTA
- Audio assets: `/audio/s1e01.mp3` … (36 plików, hostowane na CF)
- Routes: `/register.html?plan=all|single&serie=N`, `/login.html` (oba dziś
  zwracają 0 bytes — pewnie chronione middleware-em albo wyłączone)
- Vault: 100+ plików downloadable (PDF, prompty, blueprinty)
- Certyfikat: PDF + LinkedIn link, generowany po zaliczeniu quizów

**Pricing dziś (B2C, do podmiany):**
| Tier | Cena | Co zawiera |
|---|---|---|
| Free | 0 PLN | 1 odc demo (S1E01) |
| Pojedyncza seria | 97 PLN | 12 odc + Vault danej serii |
| Wszystkie serie | 249 PLN | 36 odc + 100+ plików + cert |

## Sellwise / Negacz benchmark

Format jaki musimy dobić (z mojej wiedzy o rynku — Wojtek zweryfikuje liczby):

| Aspekt | Sellwise (B2C/B2B) | Negacz mentoring | Nasz target |
|---|---|---|---|
| Format flagship | Live cohort 6-8 tyg | 1-on-1 / partner | Cohort + on-demand |
| Średnia cena indywidualna | 2-4k PLN | 50-100k PLN/rok | **1500-2500 PLN** |
| Team license | rzadko | n/a | **7-12k PLN** (5-10 os.) |
| Enterprise | Negocjacje | tak | **30-60k PLN** |
| ICP | B2B sales mgrs, founders | growth/sales exec | B2B SaaS GTM/marketing |
| Tone | Anty-mainstream, ekspercki | Operator, surowy | Operator, anty-vendor |
| Proof | Cases klientów, podcast | Książka, podcast | Cases z `/work` + portfolio |

Kluczowe insight: **Sellwise i Negacz NIE konkurują głównie ceną. Konkurują POZYCJĄ
EKSPERCKĄ + komunity.** Repositioning musi to wziąć — mamy `wojciech.io` proof
architecture (case studies, apps, insights) jako naturalny moat.

## Proposed B2B repositioning

### Tytuł roboczy
> **AI Growth OS — operacyjna akademia AI dla zespołów B2B SaaS**

Nie "naucz się AI". To: "wdrażaj AI w GTM/marketing/sales bez wpadania w hype".

### ICP shift
- Z: indywidualni marketingowcy 249 PLN
- Do: Head of Growth / CMO / Head of Marketing / Founder w B2B SaaS 15-200 os.

### Tiers proposition (do akceptacji)

| Tier | Cena netto | Format | Komu |
|---|---|---|---|
| **Free** | 0 zł | 1 odc + lead magnet | Akwizycja |
| **Individual** | 1 900 zł | 36 odc on-demand · Vault · cert · 1 cohort review/rok | Indywidualny operator |
| **Team** | 9 900 zł | 5-10 seatów · team dashboard · shared Vault · 1 hour Q&A z Wojtkiem | Zespół GTM 5-10 os. |
| **Cohort** | 4 900 zł / osoba | 6 tyg live · 36 odc · case-work · community · cert | Mid-level w B2B SaaS |
| **Enterprise / Private** | 39 900 zł+ | Custom curriculum · onsite/zdalnie · konsultacja architektury · NDA | 50+ os. B2B SaaS |

Stary content (36 odcinków) zostaje. Zmienia się: framing każdej serii pod
team-operating, dorobione case-studies-bridge, team dashboard view (kto z teamu
zrobił quizy / co odsłuchał), enterprise content modules dla custom delivery.

### Tone / messaging

Z `docs/10-tone-of-voice.md` — Sadowski base + Flanagan edge. Operator-first,
bez marketing-brochure, bez "lifetime access dożywotni" framingu (to B2C).
B2B mówi językiem ROI / SQL velocity / pipeline / coverage / team enablement.

## Tech architecture (Astro w monorepo)

Mirror wzorca `apps/growthhub/`:

```
apps/academy/
├── public/
│   ├── audio/                    # 36 plików (zostają, hostujemy z CF Pages)
│   ├── vault/                    # 100+ PDFs / prompts / blueprints
│   ├── og-default.png
│   └── favicon, login.html (jeśli zostaje gated)
├── functions/
│   ├── _middleware.ts            # gate dla /app/* (członkowie po loginie)
│   ├── api/auth.ts               # email + magic link → Resend
│   ├── api/webhook.ts            # Stripe events → D1 (Stripe endpoint URL: /api/webhook)
│   └── api/stripe/checkout.ts    # tworzy Checkout Session
├── src/
│   ├── layouts/Layout.astro
│   ├── components/{Pricing,SeriesCard,EpisodeRow,ProofRow}.astro
│   ├── pages/
│   │   ├── index.astro           # landing (publiczna)
│   │   ├── pricing.astro         # B2B pricing table z calculatorem team
│   │   ├── enterprise.astro      # custom delivery + form
│   │   ├── cohort.astro          # next cohort + waitlist
│   │   ├── app/                  # gated po loginie
│   │   │   ├── index.astro       # team dashboard
│   │   │   ├── episode/[id].astro
│   │   │   └── vault.astro
│   │   └── thanks.astro          # po Stripe checkout
│   └── lib/{stripe,d1,episodes,cohorts}.ts
└── astro.config.mjs              # site: academy.wojciech.io, port 4326
```

Data store: **CF D1** osobna db `academy-db`. Tabele:
- `customers` — id, email, stripe_customer_id, plan, team_id, created_at
- `teams` — id, name, seat_limit, owner_email
- `progress` — customer_id, episode_id, listened_at, quiz_score
- `certificates` — customer_id, series_id, issued_at, pdf_url

Stripe: 5 products (Individual, Team-5, Team-10, Cohort, Enterprise — last
manual invoice). Webhook handler → D1 sync.

CF Pages project: `akademia-wojciech-io` (istnieje, direct upload). Deploy z
monorepo via wrangler tak jak growthhub. Custom domena `academy.wojciech.io`
jest przypięta. Cutover do nowej Academy v2 wykonany 2026-05-21.

## 4-5 day plan

Każdy dzień = jeden push, deployable end-of-day. Zakładamy że Wojtek robi
review + akceptuje wartości pricing po dniu 1.

### Day 1 — scaffold + landing (B2B copy)
- [x] `apps/academy/` workspace (mirror growthhub setup)
- [x] Layout + global.css (port z akademia style.css, zachowane Inter / JetBrains
      Mono / --orange palette)
- [x] `/` landing — przepisana sekcja po sekcji pod B2B copy (operator tone)
- [x] Hero + 4-tile proof (lat marketingu / B2B SaaS / GTM / shipped)
- [x] Workflow section (jak działa AI Growth OS w teamie)
- [x] Audio podcast — sample/player restored with old-deploy media fallback
- [x] Build pass + dev preview
- **Deliverable:** `apps/academy/dist` builduje, landing widać

### Day 2 — pricing + cohort/enterprise pages
- [x] `pricing.astro` — gated Individual/Team, cohort visible at 2900 zł/os
- [x] `cohort.astro` — waitlist/rezerwacja bez daty i bez payment-first flow
- [x] Enterprise/team inquiry flow via contact endpoint
- [x] Meta SEO for `academy.wojciech.io`
- **Deliverable:** wszystkie publiczne strony deployowalne

### Day 3 — Stripe + auth
- [x] CF D1 `academy-db` provisioning + migracje
- [x] Stripe product/price/payment link on existing live account
- [x] `functions/api/stripe/checkout.ts` — tworzy Session when
      `STRIPE_SECRET_KEY` exists; otherwise returns configured cohort Payment
      Link
- [x] `functions/api/webhook.ts` — `checkout.session.completed` →
      D1 `customers` row + Resend magic-link email (Stripe endpoint URL: `/api/webhook`)
- [x] `functions/api/auth.ts` — magic link verify + cookie
- [x] `functions/_middleware.ts` — gate `/app/*`
- [ ] Stripe Dashboard webhook endpoint + `STRIPE_WEBHOOK_SECRET`
- **Deliverable:** test purchase flow end-to-end on live Payment Link

### Day 4 — member area (gated)
- [x] `/app` team dashboard — lista odcinków, progress, vault link
- [x] `/app/episode/[id]` player + quiz + transcript stub
- [x] `/app/vault` — protected file list
- [ ] Certificate generation hook (PDF gen via @resvg/resvg-js, już mamy w stacku)
- **Deliverable:** member area dla single customer

### Day 5 — team / enterprise + polish + cutover
- [ ] Team license flow — owner zaprasza seatów (`teams` table → invite emails)
- [ ] Audio scrape + upload — wszystkie 36 plików z `akademia-wojciech-io.pages.dev/audio/*`
      do `apps/academy/public/audio/` (lub R2 jeśli za duże dla Pages)
- [ ] Vault scrape (100+ files)
- [ ] Live test purchase z prawdziwym kontem Stripe (real card, jeden tier)
- [x] Cutover: deploy do `akademia-wojciech-io` CF Pages project,
      domena `academy.wojciech.io` przepina się automatycznie
- [x] Dodać deploy scripts do root package.json (`deploy:academy`, `deploy:academy:prod`)
- **Deliverable:** academy.wojciech.io żyje z nowego źródła, B2B copy live,
      płatności zaparkowane jako ostatni opcjonalny backlog

## Open decisions — need Wojtek before kickoff

Te BLOCKUJĄ start. Bez nich Day 1 nie ruszy.

1. **Pricing tiers — akceptacja proposition** w sekcji powyżej (1 900 / 9 900 /
   4 900 / 39 900+)? Jeśli inne — które?
2. **Cohort start date** — kiedy pierwszy live cohort (Day 1 trzeba pisać "next
   cohort: DATE")? Proponuję 2026-06-15 (3 tygodnie od dziś).
3. **Stripe konto** — masz aktywne konto biznesowe na Stripe na `wojciech.io`
   czy używamy istniejącego z akademii?
4. **Audio rights** — wszystkie 36 odcinków są Twoje na 100%? Jeśli któryś
   ma gościa z osobnymi prawami → wykluczyć / podmienić.
5. **Cutover risk** — czy istniejący kupujący (B2C 249 PLN) zostają z dostępem
   po cutover? Jeśli tak → ich emails muszę przemigrować do D1 jako legacy tier.
   Jeśli akademia była "limited drop" i nikt nic nie kupił, problem znika.
6. **Domain** — `academy.wojciech.io` zostaje, czy chcesz krótsze (np.
   `gh.wojciech.io` jak GrowthHub)? Domyślnie zostawiam.
7. **Content lock** — czy 36 odcinków zostaje co do tytułów i kolejności,
   tylko reframe sekcji wokół B2B? Albo coś do wycięcia / przepisania?

## Risks

- **Audio file size** — 36 × ~10-30 MB każdy ≈ 0.5-1 GB. CF Pages ma 25 MB
  per file limit i 20k files / project. Trzeba R2 albo CF Stream.
- **Existing customers** — jeśli ktoś już kupił, migracja danych z aktualnej
  bazy (gdzie?) do D1 = osobny tasking.
- **Stripe webhook reliability** — pierwsze tygodnie monitorować w Stripe
  dashboardzie, fallback: skrypt nightly co replays missed events.
- **Cohort delivery** — live cohort = Wojtek prowadzi 6 tyg po godzinie/tydz.
  To realny czas. Jeśli nie ma czasu, drop tier "Cohort" w v1, wraca w v2.

## Out of scope (v2 backlog)

- Community feature (Discord / Circle / private Slack) — odłożone
- Native mobile app (Notch-pattern dla audio) — odłożone
- Multi-język (EN/IT) — v1 PL only, zgodnie z resztą stacku
- Affiliate / referral program
- Coupon codes (poza prostym Stripe coupon)

## Next step

Wojtek odpowiada na 7 open decisions → Day 1 startuje tego samego dnia.
Jeśli wszystko default + zostawione na moją interpretację, ruszam pod
proponowanym pricing i defauItami. Każdy push idzie na `main` i jest
widoczny w `/status` na app.wojciech.io.
