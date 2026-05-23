# 03 - Content decisions

## Core positioning

`wojciech.io v2` should present Wojciech as:

> a growth and GTM operator who designs revenue systems, builds AI-native workflows, and ships products rather than only advising on them.

## Content principles

1. **Systems over services** - do not sell a menu of activities.
2. **Proof over claims** - every major claim should be followed by evidence.
3. **Operator over consultant** - the site should feel built by someone who actually runs systems, not by someone who comments on them.
4. **AI as operating leverage, not theatre** - practical systems, workflow redesign, agents, tools, code-assisted execution.
5. **Editorial clarity over page bloat** - fewer stronger sections, not every historical asset exposed equally.

## Content decisions by page

### Homepage

Rewrite from scratch. Purpose:

- define current positioning,
- explain the problem Wojciech solves,
- show how he works,
- prove it through grouped evidence,
- route the user to work, AI systems, apps, insights and contact.

### About

Rewrite from scratch. Purpose:

- tell the operator story,
- show the bridge between strategy and execution,
- establish credibility without old mission/vision filler,
- connect experience with present-day practice.

### Work

New page. Purpose:

- selected proof, not exhaustive portfolio,
- grouped case studies and systems,
- outcome-first storytelling.

### AI systems

New page. Purpose:

- explain practical AI work,
- show agents, Claude Code, Codex, native app building, automation and workflow redesign,
- replace the old `/my-gpt` narrative with something current and much stronger.

### Insights

New section. Purpose:

- house only content aligned with current positioning,
- launch with one strong migrated article,
- support future articles around AI x GTM, revenue systems and operator workflows.

### Resources

New page, can launch lean. Purpose:

- repositories,
- starter packs,
- checklists,
- downloadable operator assets.

## What to avoid

- generic "I help brands grow" copy,
- old social media / agency descriptors,
- too many self-congratulatory numbers without context,
- using every testimonial everywhere,
- showing all side projects as equal proof,
- publishing weak legacy blog posts merely to look fuller.

---

## Sprint 2 decisions — LOCKED 2026-05-22

Wojciech's answers to `docs/SPRINT2_BRIEF.md` section B (B1-B6).

### B1 — Multilingual: RIP

**Decision:** Remove multilingual scaffold. Launch English-only per `CLAUDE.md`. Re-introduce in a dedicated localization sprint later (not part of current roadmap).

**Implementation (this PR):**
- Deleted `src/pages/[lang]/`, `src/pages/pl/`, `src/pages/it/`
- `src/i18n/` and component-side language switcher code (Nav/Footer/Header) LEFT INTACT for now — visible UI cleanup happens during the homepage rewrite when those components are touched anyway

### B2 — 14 (15 actually) legacy insights: ARCHIVE

**Decision:** Archive all 15 legacy `.mdx` files to an in-repo snapshot. Not deleted. Preserved in git for future revival (with rewrite for v2 voice).

**Implementation (this PR):**
- Moved 15 articles from `src/content/insights/` to `archive/insights-legacy/`
- README at `archive/insights-legacy/README.md` documents revival procedure
- The collection is now empty until `claude-code-vs-clay` migration lands (Sprint 3 per `CLAUDE.md`)
- SEO note: old `/insights/<slug>` URLs will 404 — redirect audit deferred to Codex SEO task

### B3 — Proof clusters: audit existing + add missing as `draft: true`

**Decision:** Audit current 7 entries in `src/content/work/`, verify `cluster` field, add missing entries from `docs/06-proof-architecture.md` as `draft: true` until claims validated.

**Implementation:** **NOT in this PR.** Requires per-entry content work + claim validation against real data. Tracked as Sprint 2 implementation step. Hard rule from `CLAUDE.md` still applies: every `metrics:` value either real or `"TBD"`.

### B4 — Featured testimonials: tightest claims + voice fit primary, recognizable names tiebreaker

**Decision:** Curated subset criteria locked. Need `src/content/testimonials/` collection added to `content.config.ts` schema.

**Implementation:** **NOT in this PR.** Collection schema + testimonial files come during homepage rewrite.

### B5 — Kadromierz: fake name (not anonymized)

**Decision:** Present the Kadromierz proof under a **fictional company name** rather than as "anonymized HR-tech startup". Voice stays operator-confident.

**Implementation:** **BLOCKED on fake name selection.** Tech-lead (Claude Code) proposed 3 options for Wojciech to pick from — see Sprint 2 followup. Until name is picked, NO Kadromierz proof entry lands.

### B6 — `/resources` at launch: curated existing assets

**Decision:** Surface real existing assets (Claude Code GTM Starter Pack repo, downloadable PDFs if any). Only fall back to "Coming soon" placeholder if there's nothing concrete to surface.

**Implementation:** **NOT in this PR.** Asset inventory pass needed first. Sprint 2 task.
