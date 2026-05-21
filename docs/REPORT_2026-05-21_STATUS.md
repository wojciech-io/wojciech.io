# Raport Codex — wojciech.io i subdomeny

Data: 2026-05-21  
Repo: `/Users/wojciech/wojciech.io`

## Co zrobiłem samodzielnie

- Domknąłem audyt wszystkich aktualnych subdomen i projektów Cloudflare Pages.
- Naprawiłem lokalną instalację workspace przez `npm install`, bo `build:app`
  nie widział symlinku `@wojciech/tokens`. Kod był poprawny; brakowało lokalnych
  linków w `node_modules`.
- Uruchomiłem pełny zestaw buildów: `npm run build`, `build:app`,
  `build:subscribe`, `build:notch`, `build:growthhub`, `build:academy`.
- Ręcznie redeploynąłem projekty direct-upload:
  - `subscribe-wojciech-io`
  - `notch-wojciech-io`
  - `gh-wojciech-io`
  - `academy-v2-wojciech-io`
- Utworzyłem DNS dla GrowthHub:
  `gh.wojciech.io` → `gh-wojciech-io.pages.dev`, CNAME proxied ON.
- Sprawdziłem hasło GrowthHub przez `/api/auth`; bramka działa.
- Spróbowałem dodać Cloudflare WAF/rate limit `/api/*`, ale aktualny token nie
  ma uprawnień do Rulesets/WAF. DNS API działa, Rulesets API zwraca
  `Authentication error`.
- Zaktualizowałem handoffy:
  - `docs/CODEX_HANDOFF.md`
  - `docs/HANDOFF_SECOND_CODEX.md`

## Status live

- `https://wojciech.io/` — działa, HTTP 200.
- `https://app.wojciech.io/` — działa jako gated app, HTTP 401 bez sesji.
- `https://subscribe.wojciech.io/` — działa, HTTP 200.
- `https://notch.wojciech.io/` — działa, HTTP 200.
- `https://gh-wojciech-io.pages.dev/demo/` — działa, HTTP 200.
- `https://gh.wojciech.io/` — CNAME utworzony, custom domain active. Publiczne
  resolvery widzą rekord, a test z wymuszonym świeżym DNS daje HTTP 200.
  Lokalny resolver może jeszcze przez chwilę trzymać stary NXDOMAIN.
- `https://academy-v2-wojciech-io.pages.dev/` — działa, HTTP 200.
- `https://academy-v2-wojciech-io.pages.dev/cohort` — działa, flow rezerwacji
  bez płatności jest aktywny.
- `https://academy-v2-wojciech-io.pages.dev/app` — poprawnie odsyła do loginu
  bez sesji.
- `https://academy.wojciech.io/` — nadal stara wersja. Nie przepinałem bez zgody.

## Deploymenty wykonane teraz

- GrowthHub: `https://9be7f714.gh-wojciech-io.pages.dev`
- Academy v2: `https://72669ecc.academy-v2-wojciech-io.pages.dev`
- Subscribe: `https://082ad2c0.subscribe-wojciech-io.pages.dev`
- Notch: `https://54183586.notch-wojciech-io.pages.dev`

## Co zostaje naprawdę po Twojej stronie

1. Cloudflare WAF `/api/*`
   - Dashboard: Security → WAF → Rate limiting rules.
   - Reguła: path starts with `/api/`, limit około 20 requestów/min/IP,
     akcja `Managed Challenge` albo `Block`.
   - Alternatywa: token Cloudflare z uprawnieniem WAF/Rulesets edit.

2. Decyzja o `academy.wojciech.io`
   - Nowa Academy v2 działa na preview.
   - Stara produkcja nadal żyje.
   - Cutover robić dopiero po Twojej akceptacji.

3. Stary rollback `wojciech-app.pages.dev`
   - GitHub repo jest zarchiwizowane.
   - CF Pages project nadal istnieje jako rollback.
   - Cloudflare nie ma opcji archive dla Pages; można tylko zostawić albo usunąć.

4. Płatności Academy
   - Zostawione na koniec, zgodnie z Twoją decyzją.
   - Nie są blockerem dla obecnego polishu i subdomen.

## Rekomendowana kolejność

1. Dodać WAF `/api/*` w dashboardzie Cloudflare.
2. Obejrzeć Academy v2 na desktopie i telefonie.
3. Jeśli wizualnie jest OK, dopiero wtedy przepiąć `academy.wojciech.io`.
4. Płatności zostawić jako ostatnie dodatkowe zadanie.
