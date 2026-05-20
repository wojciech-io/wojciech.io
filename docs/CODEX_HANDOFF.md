# Codex handoff — wojciech.io monorepo

Status as of 2026-05-20. Working branch synced with `main` (latest: `a220bf6`).

## TL;DR

Monorepo is live with two Astro apps (`apps/app`, root site) sharing
`packages/tokens`, `packages/ui`, `packages/mdx-components`. Builds clean. The
remaining work is split into (a) decisions that need Wojtek's input, (b) work
that's ready for an agent to pick up, and (c) infra steps that need a human in
a dashboard.

---

## Monorepo layout

```
wojciech-io/
├── apps/
│   └── app/                # apps.wojciech.io — gated portfolio, 9 app cards
├── packages/
│   ├── tokens/             # @wojciech/tokens — design tokens + global.css
│   ├── ui/                 # @wojciech/ui — shared Astro components
│   └── mdx-components/     # @wojciech/mdx-components — StatRow, Compare, etc.
├── src/                    # wojciech.io — public site
├── public/                 # llms.txt, humans.txt, robots.txt
└── docs/                   # this file + sprint plans + audits
```

Workspaces declared in root `package.json`:

```json
"workspaces": ["apps/*", "packages/*"]
```

Build commands:

```bash
npm install                                 # one-time, hoists everything
npx astro build                             # build wojciech.io
npm run build --workspace=apps/app          # build apps/app
```

Dev servers (defined in `.claude/launch.json`):
- `wojciech.io` → port 4399
- `app.wojciech.io` → port 4322

---

## Apps inventory — wojciech.io/work vs apps/app/apps

The two sites intentionally show different cuts. Don't unify the lists — they
serve different audiences (public proof vs full gated portfolio).

| App                          | wojciech.io/work | apps/app/apps |
|-----------------------------|:----------------:|:-------------:|
| Ads Assistant                | ✓                | ✓             |
| NotchCue                     | ✓                | ✓             |
| Kamperownia                  | ✓                | ✓             |
| Działkomierz / Działka+      | ✓ (mini-apps)    | ✓             |
| Brand24 AI                   | ✓                | —             |
| GTM Agent Starter Pack       | ✓                | —             |
| Nordics GTM                  | ✓                | —             |
| Relora                       | ✓                | —             |
| Paczka+ / Resume+            | ✓ (mini-apps)    | —             |
| GrowthHub                    | —                | ✓ (in progress) |
| HireMe                       | —                | ✓             |
| AN Projekt                   | —                | ✓             |
| Ciryam                       | —                | ✓             |
| SabiSzop                     | —                | ✓             |

**Rule of thumb:** if it's GTM/SaaS proof for B2B clients → wojciech.io/work.
If it's a personal/side app → apps/app only.

---

## Open decisions (need Wojtek)

1. **Apps inventory** — confirm the split above, or ask Wojtek which apps to
   promote between layers.
2. **Azure SWA failover** — Wojtek doesn't have an Azure account yet. Without
   it, the Cloudflare Worker failover code (`workers/health-check.ts`) has
   nowhere to fail over to. Plan: spin up Azure SWA free tier, point Worker's
   `AZURE_SWA_HOSTNAME` secret at it.
3. **/now page** — Wojtek said skip for now. Don't add unless asked.

---

## Active tasks (ready to execute)

### Task #1 — Rewrite GrowthHub on Claude, strip Kadromierz branding

**Context:** GrowthHub is currently parked behind a "Coming soon" card on
`apps/app/src/pages/apps.astro` (lines 77–106). The old netlify URL
(`kadromierz-growth.netlify.app`) was removed; tagline references "rebuild on
Claude". Memory file `project_kadromierz_dispute.md` mandates **zero mentions
of Kadromierz** anywhere on the site or in any rebuilt product.

**Scope:**
1. Rebuild GrowthHub as a fresh Claude-built React+TypeScript app
   (demand gen, lead scoring, revenue tracking — same product surface).
2. Strip every visual/textual trace of Kadromierz: logos, names, screenshots,
   internal references, env vars, CSS class names that reference the brand.
3. Deploy under a neutral domain or subdomain (suggested:
   `growthhub.wojciech.io` or as another `apps/` workspace).
4. Re-enable the "Open" button on the apps/app card with the new URL and
   switch the badge from "In progress" back to "Live".

**Files to edit when re-enabling:**
- `apps/app/src/pages/apps.astro:87-105` — restore the Live badge styling
  (currently overridden inline to amber/in-progress) and swap the
  `<span class="btn-p" ...>Coming soon</span>` back to
  `<a href="NEW_URL" class="btn-p">Open</a>`.
- `apps/app/src/pages/apps.astro:100` — restore plain tagline without the
  "Currently being rebuilt" note.

### Cloudflare Pages — register apps/app project

apps/app builds but has no CF Pages project yet. Steps for a human:

1. CF dashboard → Pages → Create project → connect GitHub `wojciech-io` repo
2. **Build settings:**
   - Production branch: `main`
   - Root directory: `apps/app`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Build system version: 2
3. **Custom domain:** `app.wojciech.io`
4. **Env vars:** none required (gate password is hardcoded in
   `apps/app/src/layouts/Layout.astro` — sessionStorage key
   `app-wojciech-io-access`, password `wojciech-portfolio-2026`).

The root site (`wojciech-io`) is already on CF Pages → `wojciech.io`.

---

## Recently shipped (for context)

- **a220bf6** — experience framing unified everywhere: `20y marketing & digital
  · 10y B2B SaaS · 10y GTM`. Affects homepage strip, /about proof points,
  apps/app CV, llms.txt, humans.txt, hero subcopy in EN/PL/IT. GrowthHub card
  parked behind "Coming soon". Kadromierz mentions removed from timeline.
- **7afbe02** — monorepo skeleton + apps/app rewrite (gate, /apps, /cv,
  /stack, /timeline, /contact).

---

## Conventions to follow

- **Tone of voice:** docs/10-tone-of-voice.md (B+A blend: Sadowski base,
  Flanagan edge). No marketing-consultant brochure language. No invented
  metrics — use `TBD` if unverified.
- **i18n:** every user-facing string has `data-en`, `data-pl`, `data-it`
  attributes. PL is Wojtek's native, EN is canonical, IT is for audience
  reach. Don't use literary/archaic PL words (e.g. "zrecenzuj" → "oceń").
- **Stack pinned:** Astro + Tailwind + CSS tokens. No new component
  frameworks. No new CSS systems.
- **Deploys:** `wojciech.io` — push to main is free game. `app.wojciech.io`
  — branch/preview only, no prod deploy without Wojtek's greenlight.
- **Kadromierz:** zero mentions anywhere on the site. Active dispute. See
  memory file `project_kadromierz_dispute.md`.

---

## Token-budget note

This handoff was prepared near the end of a session approaching weekly limit.
If something looks half-finished, check the last 2–3 commits before assuming
it's intentional.
