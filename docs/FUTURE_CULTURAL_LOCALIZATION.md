# Cultural localization plan — beyond translation

**Status:** future planning, not in active sprint. Trigger: Wojciech ACK on market entry priority + budget.
**Author:** Claude Code, tech-lead session nervous-bartik-5a866d, 2026-05-24.
**Supersedes:** localization-only sections of `docs/SPRINT012_BLOCKERS.md` "Future" line.

> Translation ≠ localization. Localization ≠ transcreation. wojciech.io targeting JP / US / DK / NO / DE / IT / PL / int'l EN needs **transcreation per market**, not 1:1 string swaps. This doc lays the architecture.

---

## 1. The discipline names

| Term | Definition | When you need it |
|---|---|---|
| **Translation** | Same meaning, different language (literal). | Legal text, technical docs, alt text. |
| **Localization (L10n)** | Translation + locale conventions (date/currency/units, idiom adaptation, image swaps). | All marketing copy at minimum. |
| **Transcreation** | Re-creation of intent for a target culture — may rewrite metaphor, hierarchy, proof type, CTA shape. Source and target may share zero common phrasing. | Hero copy, taglines, value props, case study framing — anywhere positioning lives. |
| **Internationalization (i18n)** | Engineering layer (routing, fallbacks, hreflang, RTL support). | Foundation that enables L10n + transcreation. |
| **Market entry strategy** | Beyond copy: pricing, positioning, channel mix, proof types valued, sales cycle norms. | Per market that's a real revenue target (US, JP, DE). |

For wojciech.io, hero/about/work pages = **transcreation**. Insights articles = **L10n with light transcreation**. Footer/nav/legal = **L10n**.

---

## 2. Cultural variance per market — first-order observations

Generalizing, but starting points (refine with native marketer per market):

### EN-International (default)
- Operator-confident voice locked in `docs/10-tone-of-poice.md`
- B+A blend (Sadowski candor + Flanagan provocation) — works as global default
- Risk: skews North Atlantic anglophone; may feel too colloquial in formal markets

### EN-US (separate from international EN)
- Heavier ROI emphasis: "this drove X% in Y weeks"
- More social proof at scale (logo walls, named customers)
- Direct CTAs ("Book a 30-min call", not "Let's talk")
- Pricing transparency expected
- Case studies frame around dollars + time-to-value
- Awards / press / "as seen in" badges carry weight

### EN-Japanese (yes, separate from US EN — different audience profile)
- Trust signals heavy: company history, photographs, formal credentials, association memberships
- Indirect proof: "X chose us because..." not "we beat Y by Z%"
- Visual rhythm: more whitespace, formal typography, modest claims
- Long-form over short-punchy; hierarchy + structure visible
- CTA shape: "Inquire" or "Request consultation", not "Get started"
- Risk if shipping with US-EN copy: reads as aggressive, untrustworthy

### PL (Polish)
- Operator voice already locked in `docs/10-tone-of-voice.md` PL notes
- "Concrete contrast" works very well — Polish business audience values directness
- Less self-deprecation than EN (Polish operators don't say "I might be wrong, but...")
- Specific numbers > narrative

### IT (Italian)
- Relationship-first opening: who-are-you before what-you-do
- Story arc valued; less bulleted, more flowing
- Family/team framing carries weight (not just "I" — "the team behind X")
- Aesthetic precision matters more than in PL/DE (visual polish = competence signal)

### DE (German)
- Precision + structure first: numbered frameworks, clear methodology
- Skeptical of unsupported claims — every assertion needs sourcing
- Formal address until invited otherwise (Sie/du distinction online still matters)
- Long-form OK if structured; bullet-heavy preferred
- B2B audience values certifications, methodology names (Scrum, SAFe, ITIL references)
- "AI-native" needs explaining differently than in EN

### DK (Danish) + NO (Norwegian) — often grouped, distinct
- Flat hierarchy reflected in copy: no name-dropping titles, no excess formality
- Low-key authority: "I've done X" beats "Industry-leading X"
- Self-deprecation works (opposite of PL)
- Trust through transparency: salary, pricing, methodology openly shared
- DA/NO speakers very comfortable consuming English; localization is choice not necessity
- BUT: if you localize, do it well — half-localized reads worse than full-EN
- Proof types valued: real customer outcomes, candid post-mortems, "what didn't work" sections

### General principle

Source-of-truth EN-International is the **default voice**. Each other locale is a deliberate market positioning fork, not a translation derivative. Pages should NOT be 1:1 EN equivalents — they may share 80% (some sections identical) and diverge 20% (hero copy, featured case studies, proof types surfaced first).

---

## 3. Skills required (and where to find them)

For each market that gets transcreation (not just localization):

| Skill | What they do | How to find | Cost order |
|---|---|---|---|
| **Native marketing copywriter** | Rewrites hero/about/work for local audience, not just translates | LinkedIn search "<market> B2B SaaS copywriter freelance", or Upwork (filter by location + native language) | €40-100/h or €0.15-0.30/word |
| **Cultural consultant** | Reviews positioning, framing, proof types before draft | Hard to find solo; consider partnering with a local agency for one-off audit | €500-2000 one-off per market audit |
| **Local SEO researcher** | Keyword research in-language (not just translation of EN keywords — different search behavior) | Ahrefs/Semrush has per-locale keyword data; a local SEO contractor adds intent + competitor mapping | €300-800/m per market or €1500 one-off audit |
| **Compliance / legal** | GDPR variants per EU country, JP personal data law, US state laws | Local law firm one-off review; templates exist via IAPP | €500-2000 one-off |
| **Native reviewer per article** | Sanity check + voice polish on auto-translated MT first drafts | Same person as copywriter, fractional | €30-80 per article |

**Solo operator realistic stack:**
- 1 native copywriter per market for initial positioning sprint (4-8 hours each)
- Same person fractional for ongoing review (1-2h/m per market)
- AI cross-check (Claude with cultural context prompt) for between-review polish
- Quarterly cultural consultant audit once revenue from market justifies (~€1500/q)

**Cost per market to launch with quality** (positioning sprint + 3 months ongoing review):
- PL (Wojciech native) — €0 + own time
- IT — €1500-3000 (sprint + 3m ongoing)
- DE — €2500-5000 (more research-heavy market)
- DK/NO — €2000-4000 each (small market, expensive native talent)
- US — €3000-6000 (positioning quality bar is high)
- JP — €5000-10000 (deepest cultural adaptation needed)

Total to launch all 7 locales at quality: **€15-30k one-off + €500-1500/m ongoing review**.

---

## 4. Architecture: per-market, not per-language

Critical decision: how the site code separates locales.

**Wrong (1:1 translation model):**
```
src/content/insights/
  en/<slug>.mdx
  pl/<slug>.mdx
  it/<slug>.mdx     ← same article, different language
```

**Right (per-market positioning model):**
```
src/content/insights/
  international/<slug>.mdx
  us/<slug>.mdx          ← may have different featured case studies, different ROI framing
  jp/<slug>.mdx          ← may have different intro, formal address, modest claims
  pl/<slug>.mdx
  de/<slug>.mdx
  ...

src/content/work/
  international/<slug>.json
  us/<slug>.json         ← different metrics surfaced (e.g. dollar amounts)
  jp/<slug>.json         ← different proof framing
  ...
```

**Schema addition** (when localization lands):
```typescript
const insights = defineCollection({
  schema: z.object({
    market: z.enum(['international', 'us', 'jp', 'eu-en', 'pl', 'it', 'de', 'dk', 'no']),
    // ... existing fields
    parentSlug: z.string().optional(), // links transcreated variants back to source
  }),
});
```

**Routing:** Astro i18n with custom locale-to-market mapping:
- `/` → international EN
- `/us/` → US EN
- `/jp/` → Japanese
- `/de/` → German
- `/pl/` → Polish
- etc.

**hreflang:** all per-market URLs reference each other + canonical to international as fallback.

---

## 5. Voice doc per market — `docs/10-tone-of-voice.md` extensions

Source `docs/10` is EN-International canon. Add per-market addenda:

- `docs/10-voice-us.md` — ROI emphasis, social proof at scale, direct CTAs, pricing transparency rules
- `docs/10-voice-jp.md` — formality, indirect proof, trust signals, CTA shape ("Inquire" not "Get started")
- `docs/10-voice-de.md` — structured precision, sourcing every claim, formal address default
- `docs/10-voice-pl.md` — direct, specific numbers, less hedging
- `docs/10-voice-it.md` — relationship-first, story arc, aesthetic polish
- `docs/10-voice-dk.md` + `docs/10-voice-no.md` — flat hierarchy, low-key authority, transparency

Each addendum: 1-2 pages. Written WITH the native copywriter, not just translated.

---

## 6. Workflow when this kicks off

```
Wojciech picks market entry priority (e.g., JP first)
    ↓
Sprint: Cultural Audit JP
    1. Hire JP native marketer (~4h positioning sprint)
    2. Write docs/10-voice-jp.md addendum
    3. Native marketer rewrites hero, about, 2 case studies → not translated, transcreated
    4. Local SEO contractor: keyword research in JA
    5. Native reviewer signoff before push to prod
    ↓
Engineering: Astro i18n + market routing
    1. Update content collection schema (market field)
    2. /jp/ route + Japanese typography (consider serif font for body, formal headlines)
    3. hreflang setup + per-market canonicals
    4. Vale ruleset for JA voice enforcement
    ↓
Ship behind feature flag → soft launch /jp/ → measure
    ↓
After 30 days: review with native marketer → iterate or expand market
```

Estimated time per market: 2-4 weeks elapsed, ~20-40h of Wojciech + 10-20h native marketer.

---

## 7. Tools beyond translation engines

Free / low-cost stack for cultural quality:

| Tool | Use |
|---|---|
| **Hofstede Insights compare-countries** ([free dashboard](https://www.hofstede-insights.com/country-comparison-tool)) | Quick read on culture dimensions per market — informs voice doc per locale |
| **Crowdin Open Source** (free for OSS) | TMS with per-locale style guide + glossary enforcement |
| **Vale** (OSS) | Per-locale ruleset for voice enforcement in CI |
| **Hreflang Tags Generator** (free web tool) | Sanity-check the hreflang cluster across all locale URLs |
| **Screaming Frog** (free up to 500 URLs) | Crawl per-locale to catch missing alternates, orphan pages |
| **DeepL Free** / **Claude API** | First-draft MT before native polish |
| **Ahrefs Keyword Explorer** ($129/m starter — only if you commit) | Per-locale keyword research; cheaper alternative: free Google Trends + manual SERP review |

Paid tools that matter only at scale:
- **Smartling** ($$$) — enterprise transcreation workflow
- **Phrase** ($$) — terminology + style guide enforcement
- **Lokalise** ($$) — better UI than Crowdin but no free tier worth using

**Realistic free stack to ship 7 locales at quality:** Crowdin OSS + DeepL Free + Claude API + native reviewer per market + Vale. Total tooling cost: ~$0-10/m. All quality cost = human review fees.

---

## 8. Anti-patterns to avoid

- **Google Translate widget** (1990s pattern, kills SEO, breaks voice — never)
- **Single PL/IT/DE locale serving multiple markets** (Switzerland vs Germany are different German markets; Austrian B2B differs from German B2B)
- **Translating dollars to euros via Google rate** (use market pricing — JP shows JPY, US shows USD, Europe shows EUR; never auto-convert)
- **Same case studies surfaced everywhere** (different markets recognize different brands; US case study with European logo wins nothing)
- **Forcing every page through every locale** (some content is truly only relevant to one market — let it be)
- **Hreflang fork without canonical strategy** (Google's docs help; misconfiguration = duplicate-content penalty)
- **Shipping JP/DE without native speaker review** (DA/NO can sometimes ship AI-only at launch, but JP and DE specifically are unforgiving markets)

---

## 9. Gating: when does this start?

Hard prerequisite: Sprint 2 content phase complete on EN-International. No point transcreating placeholder text.

Soft prerequisite: at least one market signal (inbound from JP, US lead from referral, etc.) before investing €2k+ per market.

Recommended order:
1. **PL** (Wojciech native, lowest cost, validates the architecture)
2. **EN-International polish** (current EN becomes the canonical "global" version)
3. **EN-US** (split from international; biggest market, highest cost to fail)
4. **IT** (Wojciech's network helps with native review)
5. **DE** (high-precision market, structured rollout)
6. **JP** (longest sprint; most cultural adaptation)
7. **DK / NO** (smallest markets; only if revenue signal)

---

## 10. What to write right now (this session, autonomous)

The work in this session = THIS DOC + future Codex tasks. Nothing user-facing changes until Wojciech ACKs market priority.

Queued Codex tasks (already in `.codex-tasks/`):
- Localization restoration (when EN-International content phase locks)

To add when Wojciech ACKs first market:
- Codex task: market-N positioning sprint scaffold (content collection schema update, route directories, hreflang setup)
- Codex task: per-market Vale ruleset + Lighthouse extension

**For now:** this doc is the contract. When ready, Wojciech writes `start cultural sprint <market>` and we execute against this plan.
