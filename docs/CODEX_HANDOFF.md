# Codex handoff — wojciech.io monorepo

Last update: 2026-05-20. Latest commit on `main`: see `git log --oneline -10`.

## TL;DR

Monorepo with two Astro apps sharing design tokens. Public site
`wojciech.io` lives at repo root. Private workspace `apps/app` lives in
`apps/app/` and deploys to `app.wojciech.io`. Both deploy to Cloudflare
Pages from the same repo. Server-side auth on `app.wojciech.io` via Pages
Functions at repo root, gated by hostname.

**You should read this whole doc before touching anything.**

---

## Layout

```
wojciech-io/
├── apps/
│   └── app/                # app.wojciech.io — gated workspace
│       ├── public/         # _headers, robots.txt, login.html, wojciech-photo.png
│       ├── src/
│       │   ├── components/Footer.astro      # app-specific footer (mirrors wojciech.io)
│       │   ├── layouts/Layout.astro          # header + nav + footer wrapper
│       │   ├── pages/{apps,cv,stack,timeline,contact}.astro
│       │   └── styles/global.css             # ~1000 lines, all tokens + components
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
npm run build:app                             # build apps/app → apps/app/dist/
```

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
- **Apps inventory unification** — Wojtek explicitly wants to manage
  this before any unification.
- **/now page** — explicitly skipped for v1.

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

## What was shipped in this session (2026-05-20)

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

---

## What an agent should pick up next

1. **GrowthHub rewrite** (Task #1 above) — biggest open product item.
2. **Custom domain swap (manual)** — Wojtek needs to remove
   `app.wojciech.io` from the old `wojciech-app` CF Pages project and
   add it to `app-wojciech-io`. Once swapped, the old `wojciech-app`
   project + standalone `wojciechluszczynski/wojciech-app` GitHub repo
   can be archived.
3. **Polish pass on apps/app** — after domain swap, run a full visual
   QA across all 5 pages (apps/cv/stack/timeline/contact) in EN/PL/IT
   and both light/dark themes.
4. **Decide on subdomain expansion** — Wojtek wants subscribe, notch,
   academy as next monorepo apps. Pattern: copy `apps/app/` as
   `apps/<name>/`, adapt CSS/content, create CF Pages project pointing
   at `apps/<name>/dist`.

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
