# Raport Codex — wojciech.io, subdomeny i Academy v2

Data: 2026-05-21  
Repo: `/Users/wojciech/wojciech.io`  
Ostatni commit na `main`: `6a038cb feat(academy): add outcome dashboard section`

## Status ogólny

- `wojciech.io` — działa.
- `app.wojciech.io` — działa jako gated app.
- `subscribe.wojciech.io` — działa.
- `notch.wojciech.io` — działa.
- `gh-wojciech-io.pages.dev/demo` — działa; `gh.wojciech.io` nie jest jeszcze podpięte.
- `academy-v2-wojciech-io.pages.dev` — działa jako nowa Academy v2.
- `academy.wojciech.io` — nadal pokazuje starą wersję; nie przepinałem bez zgody.

## Co zrobiłem

### Academy v2 — visual polish

Dodałem kolejną warstwę, żeby strona bardziej wyglądała jak produkt/system pracy, a nie płaski landing:

- nowa sekcja `OutcomeBoard`,
- przed/po: co zmienia się po odcinku,
- mockup dashboardu `growth-os / weekly-review`,
- signal inbox,
- next actions,
- mini terminal,
- doprecyzowane hero copy.

### Academy cohort

Zgodnie z decyzją użytkownika płatności są przesunięte na koniec backlogu:

- publiczny cohort nie prowadzi już do Stripe Checkout,
- flow jest jako wstępna rezerwacja bez płatności,
- pricing i login kierują do rezerwacji, nie do checkoutu.

### Handoffy

Zaktualizowane:

- `docs/CODEX_HANDOFF.md`
- `docs/HANDOFF_SECOND_CODEX.md`

W obu dokumentach jasno zaznaczone jest, że płatności są ostatnim dodatkowym zadaniem, a nie następnym głównym frontem.

## Weryfikacja

Sprawdzone:

- `npm run build:academy` — przechodzi.
- Deploy Academy v2 — przeszedł.
- Playwright desktop/mobile — brak poziomego scrolla.
- Console warnings — 0.
- `/app` bez sesji dalej redirectuje do loginu.

## Czego nie ruszałem

- Nie przepinałem `academy.wojciech.io` na v2.
- Nie usuwałem starego `wojciech-app.pages.dev` rollbacku.
- Nie ruszałem `workers/failover/package-lock.json`.
- Nie wracałem do płatności/Stripe poza przeniesieniem ich do backlogu.

## Punkty wymagające decyzji Wojtka

1. **Academy cutover**  
   Czy przepinać `academy.wojciech.io` na nową Academy v2, czy jeszcze polerować?

2. **GrowthHub DNS**  
   Żeby działało `gh.wojciech.io`, trzeba w Cloudflare dodać:
   `CNAME gh → gh-wojciech-io.pages.dev`, proxy ON.  
   Potem w Pages dodać custom domain `gh.wojciech.io`.

3. **Cloudflare WAF `/api/*`**  
   Jeśli ma być druga warstwa ochrony poza app-level rate limitingiem, trzeba dodać WAF/rate limit w dashboardzie Cloudflare albo dać token z Zone edit.

4. **Stary rollback**  
   Czy zostawić `wojciech-app.pages.dev` jako rollback, czy usunąć stary CF Pages project?

5. **Płatności Academy — na końcu**  
   Ostatnie dodatkowe zadanie, nie blocker teraz.  
   Do pełnej automatyzacji będą potrzebne:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `RESEND_API_KEY`

## Rekomendowana kolejność

1. Obejrzeć Academy v2 na telefonie i desktopie.
2. Jeśli wizualnie jest OK — przepiąć `academy.wojciech.io`.
3. Potem ogarnąć `gh.wojciech.io` DNS.
4. Płatności zostawić na sam koniec.

Link do nowej Academy v2:  
https://academy-v2-wojciech-io.pages.dev

