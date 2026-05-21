# Handoff dla drugiego konta Codex

Data: 2026-05-21  
Repo: `/Users/wojciech/wojciech.io`  
Aktualny kierunek: iść szybko do przodu z Academy/GrowthHub, **nie zaczynać od płatności**.

## Najważniejsze

- `main` po ostatnich pracach ma Academy v2 na `academy.wojciech.io` oraz preview na `academy-v2-wojciech-io.pages.dev`.
- Cutover `academy.wojciech.io` został wykonany 2026-05-21 przez deploy do projektu `akademia-wojciech-io`.
- Płatności/Stripe są teraz **ostatnim dodatkowym zadaniem w backlogu**, nie blockerem i nie następnym frontem.
- Nie ruszać `workers/failover/package-lock.json`; to zastany nieśledzony plik.
- Nie commitować sekretów ani linków magic-login.
- Zero wzmianek o Kadromierz w GrowthHub.

## Co jest live

- `wojciech.io` — public site.
- `app.wojciech.io` — gated workspace.
- `subscribe.wojciech.io` — newsletter/double opt-in.
- `notch.wojciech.io` — NotchCue.
- `gh-wojciech-io.pages.dev/demo` — GrowthHub demo; `gh.wojciech.io` CNAME został utworzony 2026-05-21 i custom domain ma status active. Jeśli lokalnie nie działa, to najpewniej cache NXDOMAIN.
- `academy.wojciech.io` — Academy v2 production.
- `academy-v2-wojciech-io.pages.dev` — Academy v2 preview/staging.

## Academy v2: stan

Zrobione:

- Rich landing: hero, CodeScene, ranking modeli, tool marquee, audio sample/player, flow nauki, sekcja „Co dostajesz”, OutcomeBoard, StackFlow, EpisodeBrowser.
- Cennik gated, cohort 2900 zł/os, brak daty, waitlist.
- `/app` member area, `/login` magic-link, D1 `academy-db`.
- Publiczny cohort ma teraz rezerwację/listę zamiast Stripe-first checkout.

Referencja starej strony:

`/Users/wojciech/Downloads/screencapture-academy-wojciech-io-2026-05-21-14_24_54.pdf`

Wojtek chce klimat starej wersji: bogato, interfejsowo, nowocześnie, z flow i mockupami. Unikać płaskiego, generycznego SaaS copy.

## Co robić dalej

1. Academy visual/copy polish.
   - Więcej konkretu, mniej generycznych haseł.
   - Polskie znaki wszędzie.
   - Sprawdzać mobile, horizontal scroll, console warnings.

2. Login/entry UX.
   - „Mam dostęp” → magic-link.
   - „Zarezerwuj cohort” → reservation form.
   - „Cennik dla zespołu” → pricing request.

3. GrowthHub / Cloudflare ops.
   - `gh.wojciech.io`: DNS CNAME już utworzony, custom domain active. Jeśli lokalnie nie działa, sprawdzić publiczny resolver (`dig @1.1.1.1 gh.wojciech.io A`) przed proszeniem Wojtka.
   - WAF `/api/*` wymaga dashboardu albo tokenu z `Zone › Rulesets › Edit`. Token wrangler ma `pages:write` ale tylko `zone:read`. App-level KV rate-limit jest aktywny (auth 8/10min, checkout 10/10min, contact 5/10min) — WAF to dodatkowa warstwa, nie brakująca ochrona.
   - Stary projekt `wojciech-app` (rollback) USUNIĘTY 2026-05-21 za zgodą Wojtka. Nie miał custom domeny.
   - Academy SEO domknięte: per-page canonical + OG/Twitter meta + branded `og-cover.png` 1200×630, wdrożone na produkcję.

4. Academy cutover.
   - Wykonany 2026-05-21.
   - Produkcyjny projekt `akademia-wojciech-io` ma D1 `academy-db`, KV `RATE_LIMIT`, `AUTH_SECRET`, `ACADEMY_ADMIN_TOKEN`, `ACADEMY_BASE_URL` i istniejący `RESEND_API_KEY`.
   - Dalej pracować już z założeniem, że `academy.wojciech.io` jest produkcją.

5. Płatności.
   - Tylko jeśli Wojtek wróci do tematu.
   - Brakuje: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`.

## Komendy

```bash
cd /Users/wojciech/wojciech.io
git status --short
git log --oneline -8

npm run build:academy
npm run deploy:academy

npm run build:growthhub
npm run deploy:growthhub
```

## Startowy prompt do drugiego Codexa

```text
Pracujemy w /Users/wojciech/wojciech.io. Przeczytaj docs/CODEX_HANDOFF.md i docs/HANDOFF_SECOND_CODEX.md.
Najważniejsze: płatności zostawiamy na koniec jako dodatkowy backlog. Nie zaczynaj od Stripe.
Priorytet to Academy polish względem starego PDF:
/Users/wojciech/Downloads/screencapture-academy-wojciech-io-2026-05-21-14_24_54.pdf
Styl ma być bogaty, interfejsowy, ludzki, nie płaski. academy.wojciech.io jest już na v2 po cutoverze. Nie ruszaj workers/failover/package-lock.json.
```
