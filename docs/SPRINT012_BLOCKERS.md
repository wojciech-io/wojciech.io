# Sprint 0 + 1 + 2 — Wojciech blockers

**Single source of truth** for everything across Sprint 0/1/2 that needs Wojciech personally. As of 2026-05-23 morning session. Each item: what, why blocking, exact action, estimated time.

Items ordered by **highest-leverage / lowest-time first**.

---

## ✅ B5a RESOLVED — name = Tablica (default pick, Wojciech override-able)

Tech-lead default-picked `Tablica` autonomously 2026-05-23 after `Crewly` failed due-diligence (real product on OMR Reviews). Rename + memory note + docs updates landed in commit alongside this revision.

**Wojciech can override at any time:** write `name = Rotalink` (or anything else) — tech-lead re-checks, renames file, updates docs in <2 min.

**Still pending Wojciech:** real content for the entry (`src/content/work/tablica-growth-system.json`). All fields are `TBD` placeholders + `draft: true` until story + metrics land. See M1 below for metrics flow.

---

## 🟡 BLOCKER M1 — Metrics validation for 7 work entries

**What:** All 7 published entries in `src/content/work/*.json` have `metrics: []`. Per `CLAUDE.md` hard rule: every metric is either validated OR explicit `"TBD"`. Currently it's empty arrays = no proof on the cards.

**Why blocking:** `/work` page renders ProjectCards with no metric bars. Cluster headers + descriptions look fine, but the proof itself is missing.

**Action (~10-15 min total):** Fill the table below. 3-5 metrics per entry. Each metric = `label` + `value`. If you don't have a validated number, write `"TBD"` — that's better than nothing per the hard rule.

### Template — paste filled into chat

```
== METRICS FILL ==

ad-assistant (AdsAI / Ad Assistant)
- label: ___ value: ___
- label: ___ value: ___
- label: ___ value: ___

gtm-starter-pack (Claude Code GTM Agent Starter Pack)
- label: ___ value: ___
- label: ___ value: ___
- label: ___ value: ___

hireme (HireMe)
- label: ___ value: ___
- label: ___ value: ___
- label: ___ value: ___

kamperownia (Camper Rental Booking Engine)
- label: ___ value: ___
- label: ___ value: ___
- label: ___ value: ___

mini-apps (Działka+, Paczka+, Resume+)
- label: ___ value: ___
- label: ___ value: ___
- label: ___ value: ___

notch (NotchCue)
- label: ___ value: ___
- label: ___ value: ___
- label: ___ value: ___

relora (Relora)
- label: ___ value: ___
- label: ___ value: ___
- label: ___ value: ___
```

**Example fill (so you see the shape):**
```
ad-assistant
- label: Active campaigns label: Active campaigns value: 12+
- label: Cost per agent run value: $2-8
- label: Setup time value: <1 day
```

**Output of your action:** Paste filled template → I write all 7 .json files in one PR, no metric invented anywhere.

---

## 🟡 BLOCKER T1 — Testimonials curation (3-5 for homepage featured)

**What:** Testimonials collection schema landed (PR #28). Empty `src/content/testimonials/`. B4 criteria locked: tightest claims + voice fit primary, recognizable names tiebreaker.

**Why blocking:** Homepage testimonial section either doesn't exist or shows nothing. Both `/about` and homepage benefit from featured quotes.

**Action (~10 min):** Paste 3-5 testimonials into the template below. I create the .json files matching the schema.

### Template — paste filled into chat

```
== TESTIMONIALS ==

#1
quote: "<full quote text>"
author: <full name>
role: <job title when given>
company: <company when given>
href: <LinkedIn post URL if public, or leave blank>
date: <YYYY-MM if known>
claimTightness: specific-numbers | specific-outcome | generic
voiceFit: high | medium | low
featured: true | false
tags: [<tag1>, <tag2>]

#2
... same shape ...

#3
... same shape ...
```

**Quick criteria reminders:**
- `claimTightness: specific-numbers` — "30% lift in Q2", "shipped 12 campaigns"
- `claimTightness: specific-outcome` — "we closed 3 deals in 6 weeks", non-numeric but concrete
- `claimTightness: generic` — "great to work with", "trusted advisor" — these get `featured: false`
- `voiceFit: high` — sounds like operator language, fits site tone
- `voiceFit: medium` — corporate but useful
- `voiceFit: low` — too SaaS-brochure — `featured: false`

**Output of your action:** Paste filled → I create `src/content/testimonials/<slug>.json` files in one PR. You review JSON in PR before merge.

---

## 🟢 STATUS R1 — /resources is already good (informational, no action needed unless you want changes)

**What's there today after this PR:** 3 strong items.

1. **Claude Code GTM Agent Starter Pack** → github.com/wojciechluszczynski/gtm-agent-repo (external)
2. **Shipped apps: live reference** → app.wojciech.io/apps (external)
3. **Operator notes: newsletter** → /subscribe (internal)

**What was removed by this PR:** 2 cards that pointed at archived insights (`/insights/how-to-build-gtm-ai-agent-outbound-crm/`, `/insights/astro-cloudflare-pages-portfolio-ai-workflow/`). They returned 404 after PR #27.

**Action (~2 min IF you have things to add):** If there are MORE assets you want surfaced, tell me each as: `title | description | link | tags`. Otherwise no action — current 3 are launch-quality.

---

## 🔴 BLOCKER S0-1 — Cloudflare Access for `dev.wojciech.io` (Sprint 0 carryover)

**Why blocking:** Dashboard PR #21 is DRAFT, cannot deploy until Access policy is live.

**Action (~5-7 min):** Step-by-step instructions delivered earlier in chat (search "Cloudflare Access — instrukcja"). Or open Cloudflare Zero Trust dashboard → Access → Applications → set up `dev.wojciech.io` with Google + WebAuthn, allow your email only.

**Output:** Say "CF Access done" → I mark PR #21 Ready + merge + smoke test login flow.

**Issue:** [#10](https://github.com/wojciechluszczynski/wojciech-io/issues/10)

---

## 🟡 BLOCKER S1-1 — Codex first task consumption

**What:** First closed task spec written at `.codex-tasks/2026-05-22-seo-foundations-review.md`. Activates the Codex role (#3 in agent roster). Currently pending consumption.

**Why blocking:** First end-to-end Codex↔Claude Code orchestration cycle hasn't happened. Without it, "9-agent system" is theory.

**Action (~10 min start, async after):**
1. Open Codex in a fresh session (terminal: `codex` or your usual flow)
2. Point it at the task: `"Read .codex-tasks/2026-05-22-seo-foundations-review.md in wojciechluszczynski/wojciech-io repo and execute per the acceptance criteria. Branch: codex/seo-foundations-review. Open PR when done. Write result file at .codex-tasks/<same>-result.md."`
3. Wait for Codex to come back (1-2 sessions per Codex)
4. Codex PR appears → tag me, I review + merge

**Output:** Codex PR opens → I take over for review.

---

## 🟢 BLOCKER S1-2 — Better Stack monitor (Sprint 1 carryover, deferred Sprint 2)

**What:** Urgent escalation channel for SECURITY HIGH/CRITICAL + prod down events. Per Sprint 0 spec: SMS + 2nd email when severity ≥ critical.

**Why blocking:** Not blocking anything live today. Daily digest covers normal cadence. Becomes blocking the day there's a real critical event without a channel.

**Action (~10 min):** [betterstack.com](https://betterstack.com/) → create account → set up an Uptime monitor pinging `https://wojciech.io/` every 1-3 min → configure SMS + email alert → tell me the account is up so I can wire `BETTERSTACK_TOKEN` secret.

**Issue:** [#11](https://github.com/wojciechluszczynski/wojciech-io/issues/11)

**Estimated value:** medium — preventative.

---

## 🟢 BLOCKER S1-3 — Renovate GitHub App install (Sprint 1 carryover)

**What:** `renovate.json` config exists, app never installed. Zero automated dep PRs arriving.

**Why blocking:** Not blocking today. Becomes blocking when a CVE drops and we want fast auto-PR fix.

**Action (~5 min):** [github.com/apps/renovate](https://github.com/apps/renovate) → Install → select `wojciechluszczynski/wojciech-io` only → grant permissions → wait ~5 min → onboarding PR appears → merge.

**Issue:** [#25](https://github.com/wojciechluszczynski/wojciech-io/issues/25)

---

## 🟢 OPTIONAL S2 — Linear integration decision

**What:** Linear workspace created at [luscinetti](https://linear.app/luscinetti/welcome) but no integration with the wojciech.io agent system.

**Why blocking:** Not blocking. GitHub Issues is the system today. Decision is just "do we mirror, switch, or stay GitHub-only".

**Action (~2 min decision):** Tell me one of:
- "wire Linear" → I draft integration plan (daily digest pulls Linear assigned-to-me, critical escalations mirror to Linear)
- "stay GitHub-only" → I close the consideration permanently in memory
- "defer" → no change, revisit later

**Memory note:** `integration-linear-workspace`

---

## Summary table — your punch list

| ID | Item | Time | Type | Priority |
|---|---|---|---|---|
| B5a | Pick fake name (Tablica recommended) | 1 min | Decision | 🔴 high |
| M1 | Fill metrics for 7 work entries | 10-15 min | Data | 🟡 medium |
| T1 | Paste 3-5 testimonials | ~10 min | Data | 🟡 medium |
| S0-1 | CF Access setup | 5-7 min | Config | 🔴 high |
| S1-1 | Open Codex session + run first task | 10 min | Workflow | 🟡 medium |
| S1-2 | Better Stack account + monitor | ~10 min | Config | 🟢 low |
| S1-3 | Install Renovate GitHub App | ~5 min | Config | 🟢 low |
| S2 | Linear integration decision | 2 min | Decision | 🟢 low |
| R1 | (optional) Add more /resources items | varies | Data | 🟢 low |

**Total focused time to clear all 🔴 + 🟡:** ~40-45 min spread across however you want to break it up.

**Minimum critical path to "Sprint 2 content cluster #2 ships":** B5a (1 min) + M1 for crewly entry (3 min) = 4 min, then I write the entry, then you fill remaining 6 entries' metrics.

**Each item above produces a single concrete output from you (a paste, a decision, an account setup). I take that and turn it into a PR.**
