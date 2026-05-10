# 01 - Site audit: current wojciech.io

## Executive diagnosis

Current `wojciech.io` is in a transitional state. The homepage has already moved toward a stronger revenue-oriented positioning, but the rest of the site still reflects an older consulting / agency-like version of the brand. Rebuilding the site in Astro without rewriting the information architecture would simply move the inconsistency from Framer into code.

## Current public / project structure

Framer pages observed:

- `/`
- `/solutions`
- `/about`
- `/support`
- `/pricing`
- `/blog`
- `/my-gpt`
- `/styleguide`
- `/404`

CMS:

- one blog collection
- seven posts total
- only one currently valuable post for the new brand: `The Claude Code GTM Agent Starter Pack` at `/blog/claude-code-vs-clay`

## What works today

### 1. The new homepage direction is stronger than the old site

The current homepage already speaks about revenue systems, pipeline, conversion, retention and expansion. That is closer to Wojciech's present positioning than the old service catalogue.

### 2. Existing proof assets are useful

The current site contains:

- client logos,
- testimonials,
- a set of proof numbers,
- event / workshop photos,
- founder-style photography.

These are useful inputs even if the final page structure changes.

### 3. The newest article has strategic value

The Claude Code article is aligned with the new positioning and should become the seed article for the new `Insights` section.

## Main problems

### 1. Positioning drift

The site currently mixes:

- new revenue-system language on the homepage,
- old service-business language on `/solutions`,
- old generic bio framing on `/about`,
- old custom-GPT framing on `/my-gpt`,
- weak legacy blog content from a different era.

This weakens brand clarity for recruiters, founders, CEOs and search engines.

### 2. Legacy service architecture

`/solutions` still frames the offer around:

- strategic marketing consulting,
- social media management,
- performance marketing.

That is now actively misleading because the current differentiation is not "I offer marketing services" but "I design and operate growth, GTM and AI systems that connect strategy with execution and measurable revenue outcomes."

### 3. Builder-generated structural noise

The current site shows symptoms typical for no-code builders:

- duplicated content blocks in rendered HTML,
- carousel-heavy proof sections,
- inconsistent navigation across templates,
- repeated CTA/footer content.

Even if some of this is visually harmless, it is not a good baseline for the new site.

### 4. Weak content portfolio

Six of seven blog posts are legacy articles that do not represent Wojciech's current strategic edge. They should not be the foundation of the new content strategy.

## Audit conclusion

The correct action is:

- do **not** migrate 1:1,
- preserve only useful proof and references,
- rewrite IA, copy and page structure,
- rebuild in Astro with clean semantic components,
- launch a narrower, sharper v2 rather than a broader but weaker migrated site.
