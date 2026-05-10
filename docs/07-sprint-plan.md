# 07 - Sprint plan

## Delivery model

- 2-week sprint structure
- publishable staging after Sprint 2
- production cutover after Sprint 3 QA

## Sprint 0 - decisions and setup - DONE / pack delivered

### Outcome

- tech stack selected,
- hosting selected,
- repo created,
- Cloudflare Pages staging live,
- old site audited,
- v2 direction documented.

### Done by

- Wojciech + GPT-5.5 Thinking

### Artifacts

- this entire pack

---

## Sprint 1 - foundations and visual system

### Goal

Create the technical and visual foundation before building content-heavy pages.

### Claude Code does

- add Tailwind CSS,
- create design tokens,
- create global layout,
- create metadata / SEO primitives,
- add content collections scaffolding,
- create reusable UI components,
- build homepage shell with placeholder copy only where absolutely needed,
- create 2-3 coded visual variants for review if useful.

### Codex reviews

- dependency choices,
- project structure,
- accessibility baseline,
- SEO foundation,
- performance risk from the chosen implementation.

### Wojciech decides

- final visual direction,
- which image style is used in hero,
- initial CTA language direction,
- whether homepage shell has the right feel.

### GPT-5.5 Thinking reviews

- whether the structure matches the intended positioning,
- whether proof is being surfaced in the right sequence.

### Sprint 1 deliverables

- production-ready project skeleton,
- frozen design tokens v1,
- approved homepage structure,
- reusable component library.

---

## Sprint 2 - core pages and proof

### Goal

Build the real site narrative and core pages.

### Claude Code does

- implement homepage,
- implement `/about`, `/work`, `/ai-systems`,
- create proof-cluster components,
- create testimonial system,
- create case-study card system,
- integrate real assets currently available.

### Codex reviews

- responsive behavior,
- consistency of component use,
- semantic structure,
- duplicate content / DOM noise,
- dead links and broken routes.

### Wojciech decides

- final project selection,
- proof metrics to expose publicly,
- testimonial subset to feature,
- copy-level tone corrections.

### GPT-5.5 Thinking reviews

- narrative sharpness,
- hierarchy of proof,
- whether the site still feels like Wojciech rather than generic AI-consulting copy.

### Sprint 2 deliverables

- full core site on staging,
- selected work live,
- proof architecture visible,
- site already good enough for internal review.

---

## Sprint 3 - content, migration and launch readiness

### Goal

Make the site publishable without losing SEO or trust.

### Claude Code does

- implement `/insights`, `/resources`, article template,
- migrate and improve Claude Code article,
- add redirects,
- add sitemap, RSS, robots.txt, `llms.txt`, OG images, schema,
- wire analytics,
- optimize images,
- build 404 page.

### Codex reviews

- redirect map,
- canonical URLs,
- structured data,
- Lighthouse / accessibility / performance,
- production cutover checklist.

### Wojciech decides

- whether to keep, redirect or retire each legacy article URL,
- final external links,
- go / no-go for domain switch.

### GPT-5.5 Thinking reviews

- final editorial QA,
- proof claims,
- metadata,
- release decision.

### Sprint 3 deliverables

- launch candidate,
- migration checklist,
- SEO-safe redirect map,
- production cutover plan.

---

## Sprint 4 - post-launch optimization

### Goal

Turn the new site from a finished project into a compounding asset.

### Activities

- monitor GSC / GA4,
- improve CTA conversion,
- publish new high-fit insights,
- add case studies as proof matures,
- use Search Console and LLM visibility observations to refine pages.

## What Wojciech can do now, before Sprint 1 starts

- keep current Framer production live,
- collect original high-res photos and logos when convenient,
- think through which metrics are fully defensible,
- keep adding new proof material to a private source folder,
- avoid manually redesigning in Framer or adding random dependencies locally.
