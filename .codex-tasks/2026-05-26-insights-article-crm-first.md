---
task: sprint4/insights-article-crm-first
branch_hint: codex/insights-article-crm-first
created: 2026-05-26
author: tech-lead (Claude Code)
acceptance:
  - src/content/insights/crm-first-ai-adoption.mdx exists with valid frontmatter
  - Article has 1200–1800 words, structured with H2 sections
  - Uses at least 2 MDX components from src/components/insights/: Callout, Compare or DoDont, and/or CaseStudyBlock
  - Frontmatter: title, description, publishedAt: 2026-05-20, tags: [AI, CRM, GTM], draft: false
  - npm run build passes, article appears at /insights/crm-first-ai-adoption/
  - No TypeScript errors
---

# Codex task — Insights article: CRM-first AI adoption

## Content brief

**Title**: Why CRM-first beats prompt-first in AI adoption

**Core argument**: Most companies implement AI by layering prompts onto existing workflows. This fails because the CRM is the connective tissue — if it's dirty, AI produces confident wrong answers. The right order: fix data model → clean data → then apply AI.

**Structure**:

1. The prompt-first trap (why it looks fast but isn't)
2. What "CRM-first" actually means — data model, field hygiene, attribution, ownership
3. The three AI applications that only work on a clean CRM: ICP scoring, personalized sequences, revenue forecasting
4. A simple 4-step sequencing guide: audit → clean → enrich → then automate
5. What good looks like (2-3 bullet proof points from real patterns, no specific client names)

**Tone**: Direct, operator-level. No fluff. Uses specific technical patterns (e.g. "deal stage field has 17 values, 6 of them mean the same thing"). No AI-generated filler.

**MDX components to use**:
- `<DoDont>` for "Do: define CRM fields before automation" vs "Don't: prompt your way out of dirty data"
- `<Callout type="tip">` for a key takeaway
- `<Compare>` for prompt-first vs CRM-first approach columns

## Important

- Do NOT invent specific company names, revenue numbers, or client metrics
- Use "TBD" placeholders if specific proof points are needed
- Copy must sound like Wojciech, not a chatbot (see docs/10-tone-of-voice.md)
- No em dashes
