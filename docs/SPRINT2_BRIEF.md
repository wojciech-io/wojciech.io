# Sprint 2 — Content brief

**Status:** drafted 2026-05-22, awaiting Wojciech decisions on the 6 open items below.
**Owner:** Wojciech (decisions) → Claude Code (implementation) → Codex (independent review).
**Goal:** ship homepage + `/about` + `/work` + `/ai-systems` rewrite, plus proof cluster system, in real voice from `docs/10-tone-of-voice.md`.

> **Reading order before you start:** `CLAUDE.md` → `docs/04-ia-v2.md` → `docs/06-proof-architecture.md` → `docs/10-tone-of-voice.md` → `docs/03-content-decisions.md` → this brief.

---

## A. Reality check vs CLAUDE.md (what's actually in the repo today)

| CLAUDE.md says | Repo reality | Drift? |
|---|---|---|
| Launch is **English only** | `/[lang]/`, `/pl/insights/` exist (multilingual scaffold present) | ⚠️ YES — decision needed |
| Retire `/solutions`, `/pricing`, `/my-gpt`, `/support` | All 4 already removed from `src/pages/` | ✅ done |
| Keep only `claude-code-vs-clay` insight | 15 articles in `src/content/insights/` (14 are legacy) | ⚠️ YES — decision needed |
| 3 proof clusters | 7 entries in `src/content/work/` — need cluster mapping verification | ⚠️ partial |
| `/work` exists | ✅ `src/pages/work.astro` | OK |
| `/ai-systems` exists | ✅ `src/pages/ai-systems.astro` — content quality not audited | OK structurally |
| `/about` exists | ✅ `src/pages/about.astro` — rewrite from scratch per CLAUDE.md | needs rewrite |
| Homepage | ✅ `src/pages/index.astro` — rewrite from scratch per CLAUDE.md | needs rewrite |
| `/insights` exists | ✅ `src/pages/insights/` | OK structurally |
| `/resources` may be lean placeholder | ✅ `src/pages/resources.astro` | OK |

---

## B. Six decisions Wojciech needs to make BEFORE content drafting starts

### B1. Multilingual: keep, ship later, or rip out?
**Current state:** `src/pages/[lang]/` mirrors English pages; `src/pages/pl/insights/` exists; `src/pages/it/` exists.
**CLAUDE.md says:** "Language at launch: English only."

Options:
- **(a) Rip out at launch.** Delete `[lang]/`, `pl/`, `it/`. Cleanest. Re-add later as a deliberate localization sprint.
- **(b) Keep code, hide from prod.** Exclude from sitemap, add `noindex`, leave dormant. Risks: SEO leaks, stale content drift.
- **(c) Ship multilingual.** Contradicts CLAUDE.md but reflects existing code investment.

**Recommendation:** (a) — clean cut. Re-introduce in a dedicated future sprint with proper hreflang + per-language proof variants.

### B2. Insights: which 14 legacy articles get retired?
**Current:** 15 articles in `src/content/insights/`. CLAUDE.md says keep only `claude-code-vs-clay`.

The other 14:
- `ai-adoption-framework-b2b-saas-growth-teams.mdx`
- `astro-cloudflare-pages-portfolio-ai-workflow.mdx`
- `b2b-crm-revenue-operations-system-guide.mdx`
- `b2b-revenue-system-design-operator-framework.mdx`
- `b2b-saas-growth-system-icp-acquisition-retention.mdx`
- `cloudflare-migration-zero-trust-free-tier.mdx`
- `component-showcase.mdx`
- `framer-to-astro-build-vs-buy-website-rebuild.mdx`
- `google-ads-ai-management-dashboard-guide.mdx`
- _(plus 5 more — full list via `ls src/content/insights/`)_

Options:
- **(a) Delete all 14.** Strict CLAUDE.md adherence. Risk: lose SEO juice from existing URLs (need redirects).
- **(b) Move to `draft: true`.** Hidden from index, URLs still resolve. Decide per-article later.
- **(c) Keep some, retire others.** Manual triage round.

**Recommendation:** (b) batch-flip to `draft: true`, then run (c) triage in a follow-up — keep articles whose claims still hold and voice still fits, retire the rest. Use the existing `draft` field in `content.config.ts` schema.

### B3. Proof clusters: which work entry goes in which cluster?
**`docs/06-proof-architecture.md` defines 3 clusters:**
1. AI-native GTM systems (AdsAI, Ad Assistant, Claude Code GTM Starter Pack, Notch)
2. Growth architecture (Kadromierz Q1-Q2, CRM/SEO/CRO operating systems, Brand24 AI)
3. Products shipped (Kamperownia, app.wojciech.io/apps, Działka+, Paczka+, Resume+)

**`src/content/work/` has:** ad-assistant.json, gtm-starter-pack.json, hireme.json, kamperownia.json, mini-apps.json, notch.json, relora.json — 7 entries.

The `cluster` field in the content schema is `'ai-gtm' | 'growth-architecture' | 'products-shipped'`. Verify each entry is assigned correctly. Missing entries: AdsAI (might be folded into ad-assistant), Kadromierz, Brand24 AI, Działka+, Paczka+, Resume+.

**Recommendation:** (1) audit existing 7 entries' `cluster` values; (2) add missing entries per `06-proof-architecture.md` — each as a `.json` file matching the existing schema. Keep `draft: true` until proof claims are validated.

**Hard rule per CLAUDE.md:** *"Do not invent metrics. Put unknown proof points into `TBD` until validated."* — every `metrics:` array entry needs a real source, otherwise mark `value: "TBD"`.

### B4. Testimonials: which curated subset goes on homepage?
**`docs/03-content-decisions.md` says:** "Retain all in inventory for now; feature a curated subset on homepage later."

**Sprint 2 question:** which 3-5 testimonials are featured? Criteria options:
- (a) Loudest names (recognizable companies/brands)
- (b) Tightest claims (specific numbers, not generic praise)
- (c) Voice fit (cadence matches `docs/10-tone-of-voice.md`)
- (d) Recency

**Recommendation:** (b) + (c) primary, (a) tiebreaker. Sprint 2 needs a `src/content/testimonials/` collection (does NOT exist yet — needs adding to `content.config.ts`).

### B5. Kadromierz dispute — how to present without naming?
**Memory rule active:** [kadromierz dispute] — zero name/role/project/logo mentions on the site.

**Implication:** Proof cluster #2 ("Growth architecture in practice") cannot show Kadromierz by name. Options:
- (a) Anonymized case study: "HR-tech startup, 50-100 FTE, Q1-Q2 growth system"
- (b) Skip Kadromierz proof entirely until dispute resolves
- (c) Show only the SYSTEM (CRM, SEO, CRO, winback, analytics) without client attribution at all

**Recommendation:** (c) — the system is the proof, not the brand. Voice fits "operator showing the playbook" rather than "consultant name-dropping clients".

### B6. Resource pack — what's actually in `/resources` at launch?
**CLAUDE.md says:** "may ship as lean placeholder in v1".

Decision needed:
- (a) Lean placeholder: "Coming soon — sign up for notifications" + email capture
- (b) Curated existing assets: link to GitHub starter packs, downloadable PDFs already produced
- (c) Skip — remove `/resources` from nav at launch

**Recommendation:** (b) — if there are existing assets (Claude Code GTM Starter Pack mentioned in proof clusters is already a repo somewhere?), surface them. Otherwise (a).

---

## C. File inventory — what Sprint 2 actually writes/rewrites

After B1-B6 are decided, this is the implementation list. Estimated 2-4 sessions of focused work.

### Rewrite from scratch (per CLAUDE.md "rewrite from scratch" instruction)
- `src/pages/index.astro` — homepage
- `src/pages/about.astro` — operator profile

### Audit + targeted rewrite
- `src/pages/work.astro` — verify it reads new proof clusters correctly
- `src/pages/ai-systems.astro` — voice + claims audit
- `src/components/home/*` — homepage sections; rewrite or replace per new copy
- `src/components/ui/ProjectCard.astro` — verify it fits proof cluster system
- `src/components/ui/TestimonialSlider.astro` — replace with curated subset display (NOT a carousel, per CLAUDE.md "avoid: giant testimonial carousels")

### Add new
- `src/content/testimonials/` collection + schema in `content.config.ts` (with `featured: boolean` for homepage subset)
- Missing proof cluster entries in `src/content/work/` per B3
- Redirect map in `astro.config.mjs` for any retired insights URLs per B2

### Retire (per B1, B2 decisions)
- `src/pages/[lang]/` (if B1 = a)
- `src/pages/pl/`, `src/pages/it/` (if B1 = a)
- 14 legacy insights (if B2 = a — otherwise just flip `draft: true`)

### Verification (after writes)
- `npx playwright test` — smoke + a11y green
- `gh workflow run lighthouse.yml` — perf baseline still passes warn thresholds
- Codex SEO foundations review (`.codex-tasks/2026-05-22-seo-foundations-review.md`) — should be consumed in this sprint
- Visual regression baseline capture (`npx playwright test visual --update-snapshots`) — closes Tier 5a from Sprint 1

---

## D. Out of scope (Sprint 2 hard cap)

- Linear integration
- Better Stack monitor wire-up
- Renovate app install
- CF Access for dev.wojciech.io
- dev.wojciech.io dashboard live deploy
- Branch protection on `main`
- Release Manager first dry-run cut
- New marketing pages beyond the 5 listed
- Performance fixes for `/insights/` (Issue #23) — separate Sprint 2 backlog Issue, can run parallel but doesn't block content work

All these are tracked in `docs/SPRINT1_RETRO.md` Sprint 2 preview + open Issues.

---

## E. Definition of done for Sprint 2

Per `AGENTS.md` "Definition of done for any page":

- semantic structure complete
- responsive mobile/tablet/desktop
- no placeholder copy in live pages (drafts OK in content collections with `draft: true`)
- title / description / canonical / OG defined
- CTA links work
- images optimized (and pass Lighthouse `image-delivery-insight` per Issue #23)
- accessibility reviewed (axe spec passes)
- proof claims either validated or clearly marked `TBD`
- no visual debt introduced

Plus Sprint 2 specific:
- Codex first task PR merged + result file written
- All 6 B-section decisions captured as locked entries in `docs/03-content-decisions.md`
- Updated `docs/SPRINT2_RETRO.md` at sprint close

---

## F. How to start Sprint 2

1. Read this brief
2. Make B1-B6 decisions (capture in `docs/03-content-decisions.md`)
3. Open Codex in a fresh session, point at `.codex-tasks/2026-05-22-seo-foundations-review.md`
4. Set up CF Access (5-7 min, instructions in 2026-05-22 chat)
5. Then: open a Claude Code session and run `/loop` or just iterate — the new homepage + about + work pages
6. Daily digest mail tracks PR state; tech-lead inbox routes blockers
