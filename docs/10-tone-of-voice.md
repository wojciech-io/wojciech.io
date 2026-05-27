# Tone of voice — wojciech.io

Source of truth for all visible copy across wojciech.io, subdomains, articles, and localisations. Read before writing or reviewing any text on the site.

---

## The person behind the voice

Wojciech is a GTM architect and growth operator who has run B2B SaaS growth for 20 years, shipped 200+ tools and automations, and now builds AI-native revenue systems. He is not a consultant who writes reports. He is an operator who stays until the system works.

The voice on the site is his. Not a brand persona. Not a character. Him.

---

## Voice blend: Sadowski base, Flanagan edge

The chosen blend is **B+A**:

- **Base: Michał Sadowski** — first-person candour, build-in-public honesty, concrete specifics over vague claims, comfortable saying what did not work
- **Edge: Kieran Flanagan** — provocative framing, diagnosis before prescription, "here is the thing most people get wrong" energy, framework clarity

Supporting influences when those fit better:
- **Paweł Tkaczyk** — concrete vivid contrast, "imagine X vs imagine Y", proof-led narrative

---

## What this voice sounds like

- Short declarative sentences. Subject, verb, object. No padding.
- First person or second person. No "one should" or "companies often".
- Proof before claim. "We cut CPL 40% in six weeks" before "we are good at paid."
- Direct diagnosis: say what is broken, not just that there is room to improve.
- Numbers are specific: 40%, six weeks, 200+ apps. Not "significantly" or "rapidly".
- Positions, not hedges. "This does not work for companies under €2M ARR" is better than "results may vary."

---

## What this voice never sounds like

**Hard bans — no exceptions:**

- No em dashes (—) in visible text, titles, descriptions, or copy. Use a colon (:), interpunct (·), or comma.
- No AI slop phrases:
  - delve into, explore, game-changer, leverage (as a verb), synergy, cutting-edge, innovative solution
  - In conclusion, It is worth noting, In the realm of, At the end of the day
  - Seamlessly, streamline, revolutionize, transform, empower, unlock potential
- No boilerplate GPT structures: numbered lists that are just rephrased headings; sections that end with "In summary, we have seen that..."
- No consultant hedging: "it is important to consider", "one might argue", "this could potentially"
- No warm-up throat-clearing: get to the point by sentence two at the latest

**Test:** read the sentence aloud. If it sounds like a marketing brochure or a chatbot, rewrite it. If you cannot tell whether a human or an LLM wrote it, rewrite it.

---

## Language-specific rules

### English (EN)
- Canonical language. All copy starts in EN.
- British or American spelling is fine; be consistent within a page.
- Titles: sentence case, not Title Case. "How we rebuilt the GTM stack" not "How We Rebuilt the GTM Stack".

### Polish (PL)
- Idiomatic Polish. Never a literal translation of the EN.
- Informal register (ty/twój) unless context is clearly formal.
- Polish punctuation: no non-breaking hyphens in titles.

### Italian (IT)
- Idiomatic Italian. Tu form (informal) for direct address.
- Avoid anglicisms unless they are standard in Italian B2B tech usage.

### German (DE)
- B2B direct register (Sie form unless context is explicitly informal).
- Keep GTM, Revenue Operations, ICP, Pipeline as English — these are standard DE B2B terms.
- Do not translate: AI, SaaS, GTM, CRM, outbound, pipeline, operator.

### Danish (DK) / Norwegian (NO)
- Informal register (du form).
- Keep English industry terms: GTM, pipeline, ICP, outbound, operator, SaaS.

### Japanese (JP)
- Use です/ます form (polite but not overly formal).
- Keep English terms for: GTM, AI, SaaS, CRM, pipeline, ICP, operator, revenue.
- Japanese copy gets the most cultural adaptation; do not transliterate English concepts literally.

---

## Copy patterns to use

**Eyebrow labels (small uppercase category tag above headline):**
Short noun phrase. 2–4 words. "GTM Systems", "AI Ops", "Case Study". No verbs.

**Hero headline:**
One or two lines, maximum. The problem or the positioning, not the features. "Revenue systems that run themselves" not "End-to-end B2B revenue optimisation platform".

**Subheadline / lead:**
One sentence. Expand the headline or the mechanism. No adjectives until after the noun.

**CTA buttons:**
Action verb + object. "Book a call" not "Schedule a meeting". "See the work" not "View portfolio". "Read the case study" not "Learn more".

**Article titles:**
Specific > general. "How we got to €150k ARR with zero paid ads" beats "Our growth journey". Front-load the most specific noun.

**Section headings in articles:**
Statement or question. Not label. "The data told a different story" not "Data Analysis".

---

## What makes a paragraph good here

1. First sentence earns attention: contradiction, specific number, or named problem.
2. Middle sentences: evidence, mechanism, or contrast. No filler.
3. Last sentence: so-what or what-next. Not a summary of what you just said.

---

## Tone by context

| Context | Register |
|---|---|
| Homepage hero | Confident, direct, slight edge |
| About page | First-person candid, no false modesty |
| Work / case studies | Proof-led: numbers, before/after, what broke |
| Insights articles | Operator-to-operator: candid, diagnostic, opinionated |
| Contact page | Warm but not fluffy; what the call is for |
| Error pages | Direct, human, zero jargon |
| CV | Professional, specific, no filler verbs |

---

## Related files

- `CLAUDE.md` — coding assistant brief including security and editing rules
- `docs/design-system.md` — design tokens, typography, spacing
- `src/data/locales.ts` — home page localised copy
- `src/data/localizedPages.ts` — inner page localised copy
