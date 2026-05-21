# Codex handoff — wojciech.io monorepo

Last update: 2026-05-21. Latest commit on `main`: see `git log --oneline -10`.

## TL;DR

Monorepo with public `wojciech.io` at repo root plus subdomain apps in
`apps/*`: `app`, `subscribe`, `notch`, `growthhub`, `academy`. Main
`wojciech.io` and `app.wojciech.io` deploy from Git-connected Cloudflare
Pages projects. `subscribe`, `notch`, `growthhub`, and `academy-v2` are
direct-upload Cloudflare Pages projects deployed via wrangler scripts.

Current live state verified 2026-05-21:
- `wojciech.io` — live from `origin/main`.
- `app.wojciech.io` — gated, custom domain on `app-wojciech-io`.
- `subscribe.wojciech.io` — live, direct-upload from `apps/subscribe`.
- `notch.wojciech.io` — live, direct-upload from `apps/notch`.
- `gh-wojciech-io.pages.dev/demo` — live GrowthHub demo; `gh.wojciech.io`
  DNS/custom domain still not set.
- `academy-v2-wojciech-io.pages.dev` — live Academy v2 preview with
  reservation/waitlist flow, D1-backed magic-link auth, and gated `/app`
  member area. Production `academy.wojciech.io` still points to old
  `akademia-wojciech-io`.

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
│   └── academy/            # academy-v2-wojciech-io.pages.dev — Academy v2 preview
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
- **academy.wojciech.io** — `akademia-wojciech-io` CF Pages project has no
  git source (direct upload). Skipped until source is found or recreated.

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
```

Existing bindings on `subscribe-wojciech-io` project (already configured,
do not touch unless rotating):

- `RESEND_API_KEY` (secret_text)
- `SUBSCRIBE_KV` → namespace `8d296760d97c4419aa1a85243fc9fd0c`
- custom domain: `subscribe.wojciech.io`

`notch-wojciech-io`: static, no secrets, no KV. Domain: `notch.wojciech.io`.

`gh-wojciech-io`: gated dashboard + public `/demo`. Domain
`gh.wojciech.io` is not configured yet; pages.dev works. `APP_PASSWORD` was
rotated 2026-05-21 per Wojtek's request and remains a Cloudflare Pages secret,
not a repo value.

`academy-v2-wojciech-io`: Academy v2 preview with `academy-db` D1 binding,
`RATE_LIMIT` KV, `AUTH_SECRET`, `ACADEMY_ADMIN_TOKEN`, `ACADEMY_BASE_URL`,
`STRIPE_PRICE_COHORT`, and `STRIPE_COHORT_PAYMENT_LINK` configured. Current
public cohort flow is reservation/waitlist first; payment system is deliberately
parked as a last, optional backlog item per Wojtek's 2026-05-21 decision. Do
**not** make Stripe the next workstream unless Wojtek explicitly asks for it.

Academy v2 has an admin-only fallback endpoint:
`POST /api/admin/grant-access` with `Authorization: Bearer <ACADEMY_ADMIN_TOKEN>`.
It upserts a customer, creates a 12-month active membership, creates a magic
link, and sends it if `RESEND_API_KEY` exists. Without Resend it returns
`magic_url` only to the authenticated admin caller. The token is a Cloudflare
secret only; reset it via `wrangler pages secret put ACADEMY_ADMIN_TOKEN` when
manual activation is needed.

### Still pending (user only)

- **Cloudflare old `wojciech-app` Pages project** still exists as rollback
  at `wojciech-app.pages.dev`. Cloudflare has no "archive" state for Pages
  projects; the only CLI action is deletion. Do not delete unless Wojtek
  explicitly accepts losing that rollback.
- **`gh.wojciech.io` custom domain/DNS** still needs Cloudflare DNS/custom
  domain setup. Current wrangler OAuth token has Pages write but only Zone
  read, so DNS changes are not available from this CLI session.
- **Cloudflare WAF rate-limit rule** on `/api/*` still needs dashboard or
  a token with Zone edit. App-level KV rate limits are already in code.
- **Payment system for Academy v2** is parked as the last optional task, not
  the current blocker. When Wojtek explicitly returns to it: add
  `STRIPE_SECRET_KEY`, create a webhook endpoint for
  `https://academy-v2-wojciech-io.pages.dev/api/stripe/webhook`, listen to
  `checkout.session.completed` and
  `checkout.session.async_payment_succeeded`, then save its signing secret as
  the `STRIPE_WEBHOOK_SECRET` Pages secret and redeploy. Add
  `RESEND_API_KEY`/`RESEND_FROM` before expecting login emails to deliver.
- **Academy v2 production cutover** is intentionally held. Preview is live,
  but do one live test purchase before moving `academy.wojciech.io`.

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
- pending commit — Academy visual/copy polish: added OutcomeBoard with
  before/after implementation deltas and a GTM operating dashboard mockup.

---

## What an agent should pick up next

1. **Academy visual/copy polish** — continue matching the rich old Academy
   reference: real interface mockups, audio/player feel, diagrams, Polish
   diacritics, and less generic copy.
2. **GrowthHub v1.2** — wire real GA4/Pipedrive sync into Functions/shared
   package, then configure D1 + secrets. Public `/demo` already works.
3. **Cloudflare ops** — configure `gh.wojciech.io`, add WAF rate limit
   `/api/*`, decide whether to delete old `wojciech-app` Pages rollback.
4. **Academy cutover decision** — show Wojtek v2 and ask before moving
   `academy.wojciech.io` from old `akademia-wojciech-io`.
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
