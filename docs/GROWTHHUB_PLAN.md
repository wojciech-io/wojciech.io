# GrowthHub rewrite — plan and architecture

**Status:** pre-work. Not yet started. Blocked on Wojtek's decisions in
section 7 below.

Memory file `project_kadromierz_dispute.md` mandates **zero mentions of the
former client** anywhere on the rebuilt product — repo name, domain,
README, env vars, code comments, screenshots, support email, database
table names. Everything below assumes that constraint.

---

## 1. Product concept (vendor-neutral)

GrowthHub is a private dashboard for a B2B SaaS growth team. The product
the rebuild replaces was a single-tenant tool a Wojtek built for one
B2B SaaS scale-up. The rebuild keeps the *concept* but cuts every link
to the previous deployment, including any data the previous owner can
claim.

Core jobs the dashboard does:

1. **Demand-gen overview** — daily/weekly traffic, sources, top
   campaigns, CPL by channel. Reads from GA4/Plausible + ad accounts.
2. **Lead scoring** — inbound leads pulled from CRM (or webhook),
   scored 0–100 by ICP fit + behaviour signals. Sortable list, exportable.
3. **Revenue tracking** — pipeline by stage, MoM delta, won/lost, time
   to close. Reads from CRM.
4. **Operating cadence** — weekly view that combines acquisition →
   pipeline → revenue into one screen for the growth review meeting.

What it is **not**:

- A CRM. It reads from one, doesn't replace it.
- A BI tool. Single audience (growth lead), one opinionated view.
- A multi-tenant SaaS for sale. Single user (Wojtek) for now.

---

## 2. Architecture options (tradeoff matrix)

| Aspect | Option A: Astro + Cloudflare D1 | Option B: React + Vite + Supabase | Option C: Next.js + Vercel + Postgres |
|---|---|---|---|
| Fits monorepo | ✓ as `apps/growthhub/` | △ separate repo or apps/ with diff stack | ✗ separate repo |
| Same auth pattern as `apps/app` | ✓ Pages Functions + signed cookies | ✗ different auth needed | ✗ different |
| Data backend | CF D1 (SQLite at edge) | Supabase (Postgres + auth + storage) | Vercel Postgres / Neon |
| Real-time | Slow, pull-based | Built-in (Realtime subs) | Decent (with extra setup) |
| Cost at one user | ~$0 (CF free tier) | ~$0 (Supabase free tier) | ~$0 but quick to hit limits |
| Background jobs | CF Cron Triggers | Supabase Edge Functions / pg_cron | Vercel Cron |
| Time to first commit | Fastest (same stack) | Medium | Slowest |
| Reuses existing stack | ✓ design tokens, ui pkg, auth | △ tokens reusable, auth not | ✗ |

**Recommendation:** Option A (Astro + CF D1) **unless** real-time
collaboration matters — which for a single-user dashboard it doesn't.

Why A wins for this case:
- Repo lives at `apps/growthhub/` next to `apps/app/`. Reuses `@wojciech/tokens`
  and `@wojciech/ui`. One install, one build pipeline.
- Auth is the existing `functions/_middleware.ts` pattern — same gate,
  same cookie, same secret. Add `growthhub.wojciech.io` to `isGatedHost()`.
- CF D1 is SQLite at the edge. Zero ops, free tier covers more than
  one user will ever need. SQL is fine for this data model.
- Background jobs (nightly pull from GA4/CRM) via CF Cron Triggers.
- Visual consistency with the rest of the ecosystem out of the box.

---

## 3. Proposed repo layout

```
wojciech-io/
├── apps/
│   ├── app/                # existing app.wojciech.io
│   └── growthhub/          # NEW — growthhub.wojciech.io
│       ├── public/
│       │   └── login.html   # reuse with branding swap
│       ├── src/
│       │   ├── layouts/Layout.astro      # same shell as apps/app
│       │   ├── pages/
│       │   │   ├── index.astro           # weekly review
│       │   │   ├── demand.astro          # demand-gen
│       │   │   ├── leads.astro           # lead list + scoring
│       │   │   ├── revenue.astro         # pipeline view
│       │   │   └── api/                  # internal API routes
│       │   └── lib/
│       │       ├── ga4.ts                # GA4 client
│       │       ├── crm.ts                # CRM client (Pipedrive/HubSpot/etc.)
│       │       └── scoring.ts            # scoring rules
│       ├── astro.config.mjs
│       └── package.json
├── functions/                            # SHARED — extends existing
│   └── _middleware.ts                    # add growthhub.wojciech.io to isGatedHost()
└── ...
```

Database lives on CF D1, separate database per project (`growthhub-db`),
not shared with `app.wojciech.io`.

---

## 4. Data model (initial draft)

CF D1 tables:

```sql
-- Inbound leads, scored daily
CREATE TABLE leads (
  id TEXT PRIMARY KEY,            -- CRM id, never the lead's email
  source TEXT NOT NULL,           -- 'inbound-form' | 'demo-request' | 'newsletter'
  created_at TEXT NOT NULL,       -- ISO 8601
  icp_score INTEGER NOT NULL,     -- 0-100
  behaviour_score INTEGER NOT NULL,
  total_score INTEGER NOT NULL,
  stage TEXT,                     -- mirrors CRM stage
  amount_cents INTEGER,
  meta_json TEXT                  -- opaque payload for diagnostics
);

-- Daily acquisition snapshots
CREATE TABLE acquisition_daily (
  date TEXT PRIMARY KEY,          -- YYYY-MM-DD
  sessions INTEGER,
  signups INTEGER,
  leads INTEGER,
  cpl_cents INTEGER,
  source_breakdown_json TEXT
);

-- Pipeline snapshots (one row per day per stage)
CREATE TABLE pipeline_snapshot (
  date TEXT NOT NULL,
  stage TEXT NOT NULL,
  count INTEGER NOT NULL,
  amount_cents INTEGER NOT NULL,
  PRIMARY KEY (date, stage)
);

-- Won/lost log
CREATE TABLE deals_closed (
  id TEXT PRIMARY KEY,
  closed_at TEXT NOT NULL,
  outcome TEXT NOT NULL,          -- 'won' | 'lost'
  amount_cents INTEGER NOT NULL,
  cycle_days INTEGER,
  source TEXT
);
```

Notes:
- No PII (email, name) stored beyond the CRM id. Easier compliance, no
  data the original client could claim ownership of.
- Source breakdown stored as JSON to avoid an explosion of channels.
- All amounts in integer cents to avoid float drift.

---

## 5. Integrations needed

| Source | Read | Frequency | Notes |
|---|---|---|---|
| GA4 / Plausible | sessions, signups, source breakdown | nightly | GA4 has BigQuery export; Plausible has a simple stats API. |
| Ad accounts (Google Ads, Meta, LinkedIn) | spend, clicks → CPL | nightly | Need API tokens per account. Could be scoped to Wojtek's own ad accounts only. |
| CRM (TBD: Pipedrive / HubSpot / Close) | deals, stages, amounts, contacts | nightly + webhook on update | Pick **one**. See section 7. |
| Stripe (optional) | actual recognised revenue | nightly | Only if subscription product. |

Nightly job is a CF Cron Trigger that hits each API, normalises, writes
to D1. Webhooks (CRM → us) update lead scores in real time.

---

## 6. Brand sanitisation checklist (non-negotiable)

Before any line of code lands:

- [ ] Repo name: `wojciech-io/apps/growthhub` — no reference to the
  previous owner.
- [ ] Public domain: `growthhub.wojciech.io` (or similar). **NOT** a
  domain controlled by the former client.
- [ ] No email addresses from the former client domain anywhere in code,
  env vars, README, support links.
- [ ] No logo, favicon, OG image, or screenshot containing the previous
  branding.
- [ ] Database name, table names, column names — generic, descriptive.
  E.g. `leads`, not `<client>_leads`.
- [ ] CRM data: only fetch leads with explicit consent flag or sourced
  through Wojtek's own forms. Do not import historical CRM rows where
  ownership is contested.
- [ ] Commit messages and changelog entries — vendor-neutral language.
  Refer to "previous build" or "legacy tool" if context needed.
- [ ] /status auto-changelog: no commit subject should mention the
  former client.

---

## 7. Open decisions — need Wojtek before kickoff

These block actual implementation.

1. **Tech stack confirmation.** Recommendation is Option A (Astro + CF
   D1 in the monorepo). Override?
2. **Domain.** Proposed: `growthhub.wojciech.io`. OK or different?
3. **CRM source.** Which CRM does the new dashboard read from?
   Pipedrive / HubSpot / Close / something else? Need to pick one to
   build against; can add others later.
4. **Ad accounts.** Which platforms in scope for v1? Google Ads only,
   or also Meta and LinkedIn? Each adds ~1 day of integration work.
5. **GA4 vs Plausible.** What is currently the source of truth for
   site traffic? If both, which is primary?
6. **Scoring model — explicit or inherited?**
   - Explicit: define new ICP-fit rules from scratch in v2.
   - Inherited: re-implement the rules from memory (no copy-paste,
     just intent) of what worked on the previous build.
   - Recommend explicit, because it's faster and cleaner from a brand
     sanitisation POV.
7. **Timeline.** Is GrowthHub blocking anything else, or is this a
   "ship in the next month" item? Affects scope cuts in v1.
8. **Real users beyond Wojtek?** If yes, add auth layer for invited
   users (currently single shared password). If no, keep simple.

---

## 8. v1 scope (if all decisions land at the defaults above)

A first publishable version, 3–5 working days end-to-end:

- [ ] `apps/growthhub/` scaffold with same shell as `apps/app`
- [ ] Auth via shared middleware, gated by `growthhub.wojciech.io`
  hostname
- [ ] D1 database provisioned, schema applied
- [ ] One integration: GA4 nightly pull → `acquisition_daily`
- [ ] One integration: chosen CRM nightly pull → `leads`, `pipeline_snapshot`,
  `deals_closed`
- [ ] Four pages: weekly review (home), demand-gen, leads, revenue
- [ ] Light scoring rules (ICP fit by company size + industry + role)
- [ ] CF Pages project + custom domain + secrets
- [ ] Re-enable "Open" button on the apps/app GrowthHub card with the
  new URL; flip "Coming soon" badge back to "Live"

v2 backlog (not in v1):

- Ad spend integrations (Google/Meta/LinkedIn)
- Stripe revenue
- Saved views / filters
- Exports (CSV)
- Notifications (Slack on stage change, Resend digest weekly)

---

## 9. Risks

- **CRM API rate limits.** Nightly pulls are fine, but webhook bursts
  during high-traffic days can throttle. Add a queue if it bites.
- **Data freshness mismatch with CRM truth.** Always link out to the
  CRM record from the lead row so the user can verify in source.
- **D1 limits.** 100k rows/free tier. Plenty for one team's lead
  history, but archive deals >2 years to a cold table if it ever
  becomes tight.
- **Brand sanitisation drift.** Easy to slip and reference the previous
  build by name in a commit message. Mitigation: add a pre-commit hook
  in `apps/growthhub/` that greps for the forbidden string and fails
  the commit. Will set up on day 1.

---

## 10. Next step

Wojtek answers section 7 questions. Then I:
1. Create the `apps/growthhub/` scaffold (1h)
2. Provision D1 + apply schema (15 min)
3. Wire auth via middleware update (15 min)
4. Build GA4 + CRM integrations (1–2 days)
5. Build four pages (1–2 days)
6. Deploy + flip card (15 min)
