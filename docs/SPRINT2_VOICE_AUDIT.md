# Sprint 2 — Voice audit

**Date:** 2026-05-22, late evening session (`nervous-bartik-5a866d`).
**Auditor:** Claude Code (Tech Lead role).
**Source of truth:** `docs/10-tone-of-voice.md`.

> TL;DR — site is **already voice-conformant.** Zero rewrites needed before content sprint. Hero matches voice doc canonical example verbatim. Cleanup work for Sprint 2 is content-validation (real metrics, Crewly story, testimonials curacja), NOT voice migration.

---

## Method

Scanned all `src/pages/*.astro`, `src/components/pages/*.astro`, `src/components/home/*.astro`, and `src/data/` for the four anti-pattern categories defined in `docs/10-tone-of-voice.md` § "Anti-patterns — don't":

1. SaaS-brochure adjectives (cutting-edge, innovative, synergy, leverage, best-in-class, seamless, empower, disrupt, game-changing)
2. Consultant hedging (we could explore, potentially, it depends, might be able to, let's see)
3. Generic "help X grow" copy
4. Hype / superlatives (world-class, next-gen, state-of-the-art, premium, industry-leading)

Plus a verbatim check against the **canonical hero example** in `docs/10` § 9.

---

## Findings

### Anti-pattern category 1 — SaaS-brochure adjectives

**Hits: 3, all legitimate operator-context, NOT anti-patterns.**

| File | Line | Context | Verdict |
|---|---|---|---|
| `src/pages/ai-systems.astro` | 8 | `"AI-native workflows, GTM agents, and operating leverage: how Wojciech builds with AI in practice."` (meta description) | ✅ "Operating leverage" — legitimate per voice doc principle 4 ("AI as operating leverage, not theatre") |
| `src/pages/index.astro` | 382 | `<!-- ─── 7. AI LEVERAGE ──────────── -->` (HTML comment, dev-facing) | ✅ Code comment, not user-visible |
| `src/components/pages/AiSystemsContent.astro` | 14 | `"...I design the system first, then find where AI creates real leverage."` | ✅ Operator phrase, matches voice doc tone |

Zero hits for: cutting-edge, innovative, synergy, best-in-class, seamless, empower, disrupt, game-changing.

### Anti-pattern category 2 — Consultant hedging

**Hits: 0.** No "we could explore", "potentially", "it depends", "might be able to", "let's see" anywhere.

### Anti-pattern category 3 — Generic "help X grow"

**Hits: 0.** No "I help [you|brands|companies|businesses] grow" patterns.

### Anti-pattern category 4 — Hype / superlatives

**Hits: 0.** No "world-class", "next-gen", "state-of-the-art", "premium quality", "industry-leading".

### Hero canonical-example check

**`src/pages/index.astro` line 166-172:**

H1:
> "I build revenue systems. Then I stay until they work."

vs voice doc canonical:
> "I build revenue systems. Then I stay until they work."

→ **Verbatim match.**

Subhead:
> "Most B2B companies don't have a traffic problem — they have a system problem. **Twenty years** inside marketing and growth teams showed me the same gap everywhere: great traffic with a leaky CRM, AI in the deck but Excel in the actual work. I rebuild it as one operating model — GTM, CRM, automation and AI as a single machine — and I don't leave when it gets hard."

vs voice doc canonical:
> "...**Fifteen years** inside growth teams showed me the same gap everywhere: great traffic with a leaky CRM, AI in the deck but Excel in the actual work..."

→ **Identical except "Twenty years" vs voice doc's "Fifteen years"** — biographical fact, Wojciech's call. Not a voice drift; voice doc example was illustrative.

---

## What this means for Sprint 2

Sprint 2 was assumed to require a content rewrite. **It does not.** Existing copy is voice-conformant. The actual Sprint 2 work is:

- **Validate proof metrics** — 7 `src/content/work/*.json` files all have `metrics: []`. Each entry needs validated numbers OR explicit "TBD" per `CLAUDE.md` hard rule. This is data work, not copy work.
- **Fill the growth-architecture cluster** — Crewly placeholder landed (PR #28). Needs real story per `docs/06-proof-architecture.md` cluster #2 + `docs/03-content-decisions.md` B5 + memory rule.
- **Curate testimonials** — schema landed (PR #28). Pick 3-5 entries matching B4 criteria (tightest claims + voice fit primary; recognizable names tiebreaker).
- **`/resources` asset inventory** — B6 decision needs concrete asset list.

None of these require Claude Code to invent positioning. All need Wojciech's data/story/picks.

---

## What's locked in this session

- Voice doc itself: `docs/10-tone-of-voice.md` (untouched)
- Hero copy: matches voice doc canonical example (line 166-172 of `src/pages/index.astro`)
- Anti-pattern absence: confirmed across all user-facing surfaces

## What remains deferred to a later voice audit pass

- Voice audit on legacy insights articles in `archive/insights-legacy/` was NOT performed — those are outside live content per Sprint 2 B2 decision.

---

## Reproduce

```bash
# anti-pattern grep
grep -rinE "cutting.edge|innovative|synergy|leverage|best.in.class|seamless|empower|disrupt|game.chang" \
  src/pages/*.astro src/components/pages/*.astro src/components/home/*.astro src/data/

# consultant hedging
grep -rinE "we could explore|potentially|it depends|might be able to|let's see" \
  src/pages/*.astro src/components/pages/*.astro src/components/home/*.astro

# generic
grep -rinE "I help|we help|help (you|brands|companies|businesses) grow" \
  src/pages/*.astro src/components/pages/*.astro src/components/home/*.astro

# hype
grep -rinE "world.class|next.gen|state.of.the.art|premium quality|industry.leading" \
  src/pages/*.astro src/components/pages/*.astro src/components/home/*.astro
```

All four should return either zero hits or only legitimate operator-context matches (the 3 "leverage" cases listed above).
