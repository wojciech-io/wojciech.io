# Codex handoff — wojciech.io monorepo

Last update: 2026-05-21. Latest commit on `main`: see `git log --oneline -10`.

## TL;DR

Monorepo with public `wojciech.io` at repo root plus subdomain apps in
`apps/*`: `app`, `subscribe`, `notch`, `growthhub`, `academy`. Main
`wojciech.io` and `app.wojciech.io` deploy from Git-connected Cloudflare
Pages projects. `subscribe`, `notch`, `growthhub`, `academy-v2`, and
`akademia-wojciech-io` are direct-upload Cloudflare Pages projects deployed via
wrangler scripts.

Current live state verified 2026-05-21:
- `wojciech.io` — live from `origin/main`.
- `app.wojciech.io` — gated, custom domain on `app-wojciech-io`.
- `subscribe.wojciech.io` — live, direct-upload from `apps/subscribe`.
- `notch.wojciech.io` — live, direct-upload from `apps/notch`.
- `gh-wojciech-io.pages.dev/demo` — live GrowthHub demo. `gh.wojciech.io`
  CNAME was created 2026-05-21 and the Pages custom domain is active; allow for
  local resolver caches to expire if one machine still sees NXDOMAIN.
- `academy.wojciech.io` — production cutover completed 2026-05-21. It now runs
  the new Academy v2 from `akademia-wojciech-io` with reservation/waitlist
  flow, D1-backed magic-link auth, and gated `/app` member area.
- `academy-v2-wojciech-io.pages.dev` — still available as the preview/staging
  project for Academy v2.

**You should read this whole doc before touching anything.**

---

## Layout

```
wojciech-io/
├── apps/
│   ├── app/                # app.wojciech.io — gated workspace
│   ├── subscribe/          # subscribe.wojciech.io — newsletter signup with double-opt-in (KV + Resend)
│   ├── notch/              # notch.wojciech.io — NotchCue product site
│   ├── growthhub/          # gh-wojciech-io.pages.dev — gated GrowthHub + public /demo
│   └── academy/            # academy.wojciech.io prod + academy-v2 preview
│       ├── public/         # _headers, robots.txt, login.html, wojciech-photo.png
│       ├── src/
│       │   ├── components/Footer.astro      # app-specific footer (mirrors wojciech.io)
│       │   ├── layouts/Layout.astro          # header + nav + footer wrapper
│       │   ├── pages/{apps,cv,stack,timeline,contact,status}.astro
│       │   └── styles/global.css             # ~1600 lines, all tokens + components
│       │
│       │   # NOTE: /status auto-generates from `git log` at build time.
│       │   # It calls execSync('git log -80 ...') in the page frontmatter,
│       │   # groups commits by date, classifies them by conventional-commit
│       │   # prefix (feat/fix/chore/docs/refactor/style/test → coloured badges).
│       │   # CF Pages does a shallow clone by default; the page calls
│       │   # `git fetch --unshallow` first if needed.
│       │   # The page is behind the same auth gate as everything else in apps/app.
│       ├── package.json    # @wojciech/app
│       └── astro.config.mjs
├── packages/
│   ├── tokens/             # @wojciech/tokens — design tokens + global.css
│   ├── ui/                 # @wojciech/ui — shared Astro components
│   └── mdx-components/     # @wojciech/mdx-components — insights MDX
├── functions/              # CF Pages Functions — used by both deploys
│   ├── _middleware.ts      # gates app.wojciech.io ONLY (hostname check)
│   ├── _utils/crypto.ts    # HMAC-SHA256 signed cookies
│   ├── api/auth.ts         # POST validates APP_PASSWORD, issues cookie
│   ├── api/cal/*, api/subscribe.ts   # wojciech.io public endpoints
│   └── styleguide.ts       # wojciech.io
├── src/                    # wojciech.io public site
├── public/                 # llms.txt, humans.txt, robots.txt, _headers
├── docs/                   # this file + audits + sprint plans
└── package.json            # workspaces: ["apps/*", "packages/*"]
```

### Build commands

```bash
npm install                                   # one-time, hoists workspaces
npx astro build                               # build wojciech.io → dist/
npm run build:app                             # build apps/app       → apps/app/dist/
npm run build:subscribe                       # build apps/subscribe → apps/subscribe/dist/
npm run build:notch                           # build apps/notch     → apps/notch/dist/
npm run build:growthhub                       # build apps/growthhub → apps/growthhub/dist/
npm run build:academy                         # build apps/academy   → apps/academy/dist/
```

Dev ports (in `.claude/launch.json`):
- wojciech.io: 4399
- app.wojciech.io: 4322
- subscribe.wojciech.io: 4323
- notch.wojciech.io: 4324
- gh.wojciech.io: 4325
- academy.wojciech.io: 4326

---

## CF Pages deploys (both auto-deploy on push to main)

### wojciech.io project
- Root directory: empty (= repo root)
- Build command: `npm run build` (which is `astro build`)
- Build output: `dist`
- Custom domain: `wojciech.io`
- Functions: served from repo `functions/` — but auth middleware
  passes through for this hostname (see `functions/_middleware.ts` →
  `isGatedHost()`).

### app-wojciech-io project
- Root directory: empty
- Build command: `npm run build:app`
- Build output: `apps/app/dist`
- Custom domain: `app.wojciech.io` (or `app-wojciech-io.pages.dev` for previews)
- Functions: same `functions/` directory; middleware activates because
  hostname matches `app.wojciech.io` or `*.app-wojciech-io.pages.dev`.
- Secrets required (CF dashboard → Variables and Secrets):
  - `APP_PASSWORD` (Secret) — the password that unlocks the gate
  - `COOKIE_SECRET` (Secret) — 32+ random bytes for HMAC. Rotating
    invalidates every session.
  - `COOKIE_MAX_AGE_DAYS` (Plaintext, optional) — defaults to 30.

### How auth works

1. Browser hits `app.wojciech.io/<anything>`.
2. `functions/_middleware.ts` runs at the edge.
3. `isGatedHost(hostname)` returns true → middleware checks the
   `wapp_auth` cookie via `verifyToken(token, COOKIE_SECRET, maxAge)`.
4. Missing/invalid cookie → middleware fetches `/login.html` from
   `env.ASSETS` and returns it with HTTP **401**.
5. The login page POSTs `{password}` to `/api/auth`. Backend
   constant-time-compares to `APP_PASSWORD`, issues HMAC-signed cookie.
6. Browser stores cookie, retries the original URL, middleware passes
   through.

`functions/_middleware.ts` already lists allowed-through paths (favicons,
robots, login.html, /api/auth).

---

## Apps inventory — wojciech.io/work vs app.wojciech.io/apps

The two sites intentionally show different cuts. Don't unify the lists —
they serve different audiences (public proof vs private full portfolio).

| App                          | wojciech.io/work | app.wojciech.io/apps |
|-----------------------------|:----------------:|:--------------------:|
| Ads Assistant                | ✓                | ✓                    |
| NotchCue                     | ✓                | ✓                    |
| Kamperownia                  | ✓                | ✓                    |
| Działkomierz / Działka+      | ✓ (mini-apps)    | ✓                    |
| Brand24 AI                   | ✓                | —                    |
| GTM Agent Starter Pack       | ✓                | —                    |
| Nordics GTM                  | ✓                | —                    |
| Relora                       | ✓                | —                    |
| Paczka+ / Resume+            | ✓ (mini-apps)    | —                    |
| GrowthHub                    | —                | ✓ (in progress)      |
| HireMe                       | —                | ✓                    |
| AN Projekt                   | —                | ✓                    |
| Ciryam                       | —                | ✓                    |
| SabiSzop                     | —                | ✓                    |

---

## Open tasks

### Task #1 — Rewrite GrowthHub on Claude (live in this repo's task list)

The card sits behind a "Coming soon" badge on `apps/app/src/pages/apps.astro:77-106`.
Memory file `project_kadromierz_dispute.md` mandates **zero mentions of
Kadromierz** anywhere on the site or in any rebuilt product.

Scope:
1. Rebuild GrowthHub as a fresh Claude-built React+TypeScript app
   (demand gen, lead scoring, revenue tracking).
2. Strip every visual/textual trace of Kadromierz: logos, names,
   screenshots, internal references, env vars, CSS class names.
3. Deploy under a neutral domain (suggested: `growthhub.wojciech.io`
   or as another `apps/` workspace).
4. Re-enable the "Open" button and "Live" badge on the apps/app card
   with the new URL.

### Decisions waiting on Wojtek (don't decide for him)

- **Azure SWA failover** — Worker failover code in `workers/health-check.ts`
  exists but has nowhere to fail over to until Wojtek sets up an Azure SWA.
  Defense-in-depth, not currently urgent.
- **/now page** — explicitly skipped for v1.
- **academy.wojciech.io** — cutover completed 2026-05-21. It is still a
  direct-upload CF Pages project (`akademia-wojciech-io`), now deployed from
  `apps/academy` in this monorepo.

### Subdomain deploys (direct upload)

These projects are **direct-upload CF Pages** (no Git Provider). They deploy
via wrangler from the monorepo. Standalone GH repos
`subscribe-wojciech-io`, `notch-wojciech-io`, and `wojciech-app` are
**archived** on GitHub.

```bash
npm run deploy:subscribe   # builds apps/subscribe, uploads
npm run deploy:notch       # builds apps/notch, uploads
npm run deploy:growthhub   # builds apps/growthhub, uploads to gh-wojciech-io
npm run deploy:academy     # builds apps/academy, uploads to academy-v2-wojciech-io
npm run deploy:academy:prod # builds apps/academy, uploads to akademia-wojciech-io / academy.wojciech.io
```

Existing bindings on `subscribe-wojciech-io` project (already configured,
do not touch unless rotating):

- `RESEND_API_KEY` (secret_text)
- `SUBSCRIBE_KV` → namespace `8d296760d97c4419aa1a85243fc9fd0c`
- custom domain: `subscribe.wojciech.io`

`notch-wojciech-io`: static, no secrets, no KV. Domain: `notch.wojciech.io`.

`gh-wojciech-io`: gated dashboard + public `/demo`. Domain `gh.wojciech.io`
has a proxied CNAME to `gh-wojciech-io.pages.dev` created via Cloudflare API on
2026-05-21, and the Pages custom-domain status is active. Public resolvers
return Cloudflare edge IPs; local resolvers may briefly cache the previous
NXDOMAIN response. `APP_PASSWORD` was rotated 2026-05-21 per Wojtek's request
and remains a Cloudflare Pages secret, not a repo value.

`academy-v2-wojciech-io`: Academy v2 preview with `academy-db` D1 binding,
`RATE_LIMIT` KV, `AUTH_SECRET`, `ACADEMY_ADMIN_TOKEN`, `ACADEMY_BASE_URL`,
`STRIPE_PRICE_COHORT`, and `STRIPE_COHORT_PAYMENT_LINK` configured. Current
public cohort flow is reservation/waitlist first; payment system is deliberately
parked as a last, optional backlog item per Wojtek's 2026-05-21 decision. Do
**not** make Stripe the next workstream unless Wojtek explicitly asks for it.

`akademia-wojciech-io`: production Academy project for `academy.wojciech.io`.
Cutover deployment: `https://1589cbf7.akademia-wojciech-io.pages.dev`.
Configured 2026-05-21 with the same `academy-db` D1 binding and `RATE_LIMIT`
KV as preview, plus fresh `AUTH_SECRET`, `ACADEMY_ADMIN_TOKEN`, and
`ACADEMY_BASE_URL=https://academy.wojciech.io` secrets. Existing production
`RESEND_API_KEY` remains in place for magic-link/admin emails. Do not copy or
log these secret values.

Academy v2 has an admin-only fallback endpoint:
`POST /api/admin/grant-access` with `Authorization: Bearer <ACADEMY_ADMIN_TOKEN>`.
It upserts a customer, creates a 12-month active membership, creates a magic
link, and sends it if `RESEND_API_KEY` exists. Without Resend it returns
`magic_url` only to the authenticated admin caller. The token is a Cloudflare
secret only; reset it via `wrangler pages secret put ACADEMY_ADMIN_TOKEN` when
manual activation is needed.

### Still pending (user only)

- **Cloudflare old `wojciech-app` Pages project** — **DELETED 2026-05-21**
  per Wojtek's go-ahead. It had no custom domain (only `wojciech-app.pages.dev`),
  so deletion touched no production hostname. Rollback to that old build is no
  longer possible; git history + the archived GitHub repo remain.
- **`gh.wojciech.io` DNS/custom domain** was created 2026-05-21 and is active.
  If a later agent sees a local DNS failure, first check
  `dig @1.1.1.1 gh.wojciech.io A` before asking Wojtek; it may just be local
  NXDOMAIN cache.
- **Cloudflare WAF rate-limit rule** on `/api/*` still needs dashboard access
  or a token with `Zone › Rulesets › Edit`. The wrangler OAuth token has
  `pages:write` but only `zone:read`, so the Rulesets API is refused. NOTE:
  app-level KV rate limits are already enforced and verified active —
  `academy-auth` 8/10min, `stripe-checkout` 10/10min, `contact` 5/10min per IP
  (`apps/academy/functions/_utils/ratelimit.ts`). WAF would be edge-level
  defense-in-depth on top, not a missing protection.
- **Payment system for Academy** is parked as the last optional task, not
  the current blocker. When Wojtek explicitly returns to it: add
  `STRIPE_SECRET_KEY`, create a webhook endpoint for
  `https://academy.wojciech.io/api/stripe/webhook`, listen to
  `checkout.session.completed` and
  `checkout.session.async_payment_succeeded`, then save its signing secret as
  the `STRIPE_WEBHOOK_SECRET` Pages secret and redeploy. Add
  `RESEND_API_KEY`/`RESEND_FROM` before expecting login emails to deliver.
- **Academy production cutover** is done. Verified: home/pricing/cohort/login
  return 200, `/app` redirects to `/login`, `/api/auth` returns `not-a-member`
  for a non-member, and desktop/mobile screenshots render the new v2 hero.

---

## Conventions

- **Tone of voice:** docs/10-tone-of-voice.md (B+A blend: Sadowski base,
  Flanagan edge). No marketing-consultant brochure language. No invented
  metrics — use `TBD` if unverified.
- **Experience framing (i18n, applied everywhere):**
  `20 years marketing & digital · 10 years B2B SaaS · 10 years GTM`.
  Don't change to "15+ years" or similar — see commit `a220bf6` for the
  unification.
- **i18n:** every user-facing string has `data-en`, `data-pl`, `data-it`
  attributes. PL is Wojtek's native, EN is canonical, IT is for audience
  reach. Don't use literary/archaic PL words (e.g. "zrecenzuj" → "oceń").
  **EXCEPTION — Academy is intentionally PL-only** (`<html lang="pl">`, no
  data-en/pl/it, no switcher). Decided 2026-05-21: the program audio is in
  Polish, so the marketing language matches the product. Do NOT add i18n to
  `apps/academy` unless Wojtek ships an English-language version of the course.
- **Stack pinned:** Astro + Tailwind + CSS tokens. No new component
  frameworks. No new CSS systems. apps/app uses plain CSS, not Tailwind.
- **Deploys:** push to main auto-deploys both CF Pages projects.
  `wojciech.io` — push to main is free game. `app.wojciech.io` —
  branch/preview only, no production deploy without Wojtek's greenlight.
- **Kadromierz:** zero mentions anywhere on the site. Active dispute.
  See memory file `project_kadromierz_dispute.md`.
- **String literals with apostrophes:** Italian `Vent'anni`, English
  `don't`, etc. — use double quotes for the outer JS string, not single.

---

## What was shipped in this session (2026-05-21)

In commit order on main:

- `7afbe02` — monorepo skeleton, packages/{tokens,ui,mdx-components},
  apps/app initial structure with client-side gate.
- `a220bf6` — experience framing unified: 20y marketing/digital · 10y SaaS
  · 10y GTM across homepage, /about, apps/app CV, llms.txt, humans.txt,
  hero subcopy in EN/PL/IT.
- `f9ce115` — initial CODEX_HANDOFF.md.
- `b0d8d6d` — apps/app prep for CF Pages: noindex headers, robots disallow,
  build aliases.
- `b65fd53` — gate visual restore (lime halo, photo avatar, badges,
  trusted-by) — BUT was a client-side gate. Superseded by next commit.
- `43d5772` — server-side auth ported from old wojciech-app: Pages
  Functions + signed cookies + login.html. Client gate removed.
- `96df9d0` — auth functions moved to repo root with hostname-gate so
  CF Pages projects share `functions/` cleanly. Italian apostrophe build
  bug fixed in `src/i18n/translations.ts`.
- `1d40904` — timeline + stack CSS port (200+ lines), wojciech.io-style
  footer added, header restyled with `app.wojciech.io` wordmark.
- (this commit) — CV + contact CSS port, handoff doc updated.
- `76eae58` — Academy v2 rich landing visuals restored: model ranker,
  tool marquee, audio sample player, learning flow, and "Co dostajesz" kit.
- `3e114fb` — Academy purchase/access hardening: Stripe checkout params,
  idempotent webhook, 12-month access expiry, clearer login/thanks copy, and
  admin-only manual access fallback.
- `cae6607` — Academy public flow changed from Stripe-first checkout to
  reservation/waitlist; payments explicitly moved to the end of the backlog.
- `6a038cb` — Academy visual/copy polish: added OutcomeBoard with
  before/after implementation deltas and a GTM operating dashboard mockup.
- `c1f9048` — Academy SEO: per-page `<link rel=canonical>` + full OG/Twitter
  meta in `apps/academy/src/layouts/Layout.astro` (canonical/og:url derive from
  request path, not a hardcoded homepage URL).
- `14a1460` — Academy branded 1200×630 social share image
  (`apps/academy/public/og-cover.png`, SVG source in `apps/academy/scripts/`),
  Twitter card upgraded to `summary_large_image`. Deployed to academy prod
  (`akademia-wojciech-io`, deploy `ad428eb5`) and verified live: canonical
  per-page, `og-cover.png` returns 200 image/png.
- `e880ee6` — Academy forms a11y: every `<label>` tied to its input via
  `for`/`id` (login + cohort ×2 + pricing), status regions `role=status
  aria-live=polite`. Deployed prod `d61c2dc4`, verified live.
- `75259b7` — GrowthHub fix: leads table wrapped in `overflow-x:auto`
  (`.gh-table-wrap`) so it scrolls instead of breaking the card on mobile;
  deferred v1.5 nav tabs marked `aria-disabled`. Deployed `1b2e8162`, verified
  live on `/demo` (gh-wojciech-io is direct-upload).
- `b0251b2` — **GrowthHub v1.2 playground.** Per Wojtek (2026-05-21): no
  access to old company resources, so GrowthHub runs as a synthetic playground
  architected for FUTURE integration. Added: paid-acquisition data (Google Ads
  / Meta Ads / LinkedIn — spend/clicks/leads/CPL/ROAS) in `lib/dummy-data.ts`,
  a `dataSources` provenance model + integrations status strip (GA4, Google
  Ads, Meta Ads, CRM — all "Demo"), a `Paid acquisition · 7d` table in
  `WeeklyReview.astro`, and future-integration adapter stubs
  `lib/adapters/{googleads,meta,hubspot}.ts` mirroring the GA4/Pipedrive
  pattern (return `*-not-configured` until env vars set). All data fictional;
  no client identification. Adapters document the real API + target D1 table
  in their header comments.
- `8166dcf` — **GrowthHub gate fix (important):** `functions/_middleware.ts`
  did not allow `/_astro/` build assets, so once the stylesheet grew past
  Astro's inline threshold the externalised CSS/JS 302'd to `/login` and the
  public `/demo` rendered UNSTYLED. Now `/_astro/*` is allowlisted (public,
  content-hashed, no gated data). Deployed `68f2d645`, verified: CSS returns
  200 text/css, demo renders fully styled. **If you add gated apps with the
  same middleware pattern, remember `/_astro/` must pass.**

- `bbbf146` — Academy honest "Opinie" section: empty-state copy until the
  first cohort, editable `testimonials` array ({quote,name,role}) renders cards
  when filled. No fabricated social proof. Deployed `51aa8bf4`.
- `ba6dc07` — **Main site hreflang centralised in SEOHead.** Was in
  `Layout.astro`, emitting alternates for EN-only pages (privacy/404 → broken
  /pl,/it URLs) with x-default hardcoded to home. Now in `SEOHead.astro` as the
  single source: restricted to the 10 localized paths, per-page x-default,
  dynamic `og:locale` + `og:locale:alternate`. Verified in dist; flagship
  auto-deploys from main (git-connected) — allow a few min for CF build.
  NOTE: Academy stays PL-only (see Conventions); these hreflang changes are
  the main wojciech.io site only.

### QA / verification done this session (Claude Code, 2026-05-21 eve)

- Live smoke all subdomains green (app gated 401, rest 200).
- Academy v2 QA: no console errors, no mobile horizontal overflow on
  `/ /pricing /cohort /login`, zero mojibake, Polish diacritics intact.
- SEO/OG sweep: subscribe + notch already had canonical+OG (og-default.png
  live 200); gh + app are intentionally `noindex,nofollow` (gated). Only
  Academy needed the meta — now shipped.
- GrowthHub still has zero Kadromierz references (grep clean). Direction
  changed: it is now a **synthetic playground** (Wojtek has no access to old
  company resources). Real GA4/Google Ads/Meta Ads/CRM integration is wired as
  FUTURE work via adapter stubs; flip `dataSources[].status` to `connected`
  once an adapter writes real rows to D1. Provide env vars to activate (see
  each adapter header). v1.5 tabs (Demand-gen/Leads/Revenue) still deferred.
- Old `wojciech-app` Pages project deleted (see pending list above).
- Did NOT restore the old site's testimonials / attributed expert quotes:
  Academy hasn't launched (waitlist), so that would be fabricated social proof
  — against CLAUDE.md. Revisit only with real, attributable quotes/testimonials.

---

## What an agent should pick up next

1. **Academy visual/copy polish** — continue matching the rich old Academy
   reference: real interface mockups, audio/player feel, diagrams, Polish
   diacritics, and less generic copy. (Social-proof sections need REAL
   testimonials/quotes before they go back — do not fabricate.)
2. **GrowthHub v1.2** — wire real GA4/Pipedrive sync into Functions/shared
   package, then configure D1 + secrets. Public `/demo` already works.
3. **Cloudflare ops** — WAF rate limit `/api/*` still needs a token with
   `Zone › Rulesets › Edit` (current token is `zone:read`). `gh.wojciech.io`
   is live; old `wojciech-app` rollback already deleted.
4. **Academy post-cutover polish** — continue visual/copy polish directly on
   production and keep `academy-v2-wojciech-io.pages.dev` as preview/staging.
5. **Payment system closeout (last optional task)** — add
   `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `RESEND_API_KEY`, run a
   live cohort purchase, confirm the webhook creates the member and magic-link
   email opens `/app`.

---

## Quick verification commands

```bash
# Confirm functions live on app-wojciech-io
curl -s -X POST -H "Content-Type: application/json" \
  -d '{}' https://app-wojciech-io.pages.dev/api/auth
# Expected: {"ok":false,"error":"missing-password"} (400)

# Confirm auth works
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"password":"<APP_PASSWORD>"}' https://app-wojciech-io.pages.dev/api/auth
# Expected: {"ok":true} (200) + set-cookie: wapp_auth=...

# Confirm wojciech.io is NOT gated
curl -sI https://wojciech.io/ | head -3
# Expected: HTTP/2 200 (middleware passes through)
```
