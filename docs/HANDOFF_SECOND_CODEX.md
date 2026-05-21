# Handoff dla drugiego konta Codex

Data: 2026-05-21  
Repo: `/Users/wojciech/wojciech.io`  
Aktualny kierunek: iść szybko do przodu z Academy/GrowthHub, **nie zaczynać od płatności**.

## Najważniejsze

- `main` po ostatnich pracach ma Academy v2 na `academy-v2-wojciech-io.pages.dev`.
- `academy.wojciech.io` nadal pokazuje starą stronę. Nie przepinać bez zgody Wojtka.
- Płatności/Stripe są teraz **ostatnim dodatkowym zadaniem w backlogu**, nie blockerem i nie następnym frontem.
- Nie ruszać `workers/failover/package-lock.json`; to zastany nieśledzony plik.
- Nie commitować sekretów ani linków magic-login.
- Zero wzmianek o Kadromierz w GrowthHub.

## Co jest live

- `wojciech.io` — public site.
- `app.wojciech.io` — gated workspace.
- `subscribe.wojciech.io` — newsletter/double opt-in.
- `notch.wojciech.io` — NotchCue.
- `gh-wojciech-io.pages.dev/demo` — GrowthHub demo; `gh.wojciech.io` DNS nie jest ustawiony.
- `academy-v2-wojciech-io.pages.dev` — Academy v2 preview.

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
   - `gh.wojciech.io`: Cloudflare DNS CNAME `gh` → `gh-wojciech-io.pages.dev`, proxy ON, potem Custom domain w Pages.
   - WAF `/api/*` wymaga dashboardu lub tokenu Zone edit.

4. Academy cutover.
   - Dopiero po akceptacji Wojtka.
   - Nie przepinać samodzielnie.

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
Priorytet to Academy v2 polish względem starego PDF:
/Users/wojciech/Downloads/screencapture-academy-wojciech-io-2026-05-21-14_24_54.pdf
Styl ma być bogaty, interfejsowy, ludzki, nie płaski. Nie przepinaj academy.wojciech.io bez zgody. Nie ruszaj workers/failover/package-lock.json.
```
