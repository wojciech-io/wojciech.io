# 02 - Current state inventory

## Current pages and treatment

| Current URL | Current role | v2 decision |
|---|---|---|
| `/` | transitional homepage | rewrite from scratch |
| `/solutions` | old service catalogue | retire content; likely 301 to `/work` |
| `/about` | old bio / mission page | rewrite from scratch |
| `/support` | legacy / unclear | do not migrate unless later evidence says otherwise |
| `/pricing` | legacy pricing page | do not migrate |
| `/blog` | legacy blog index | replace with `/insights` |
| `/blog/claude-code-vs-clay` | valuable article | migrate to `/insights/claude-code-vs-clay` |
| `/my-gpt` | old custom GPT page | retire; concept absorbed into `/ai-systems` |
| `/styleguide` | internal | do not expose publicly |
| `/404` | utility | rebuild in Astro |

## Existing proof inventory

### Reusable

- client logos,
- testimonials,
- workshop / speaking photos,
- selected metrics after validation,
- the Claude Code article,
- current external links once reconciled with `app.wojciech.io`.

### Not reusable as-is

- current hero structure,
- `services` framing,
- `vision and mission` style about copy,
- `/solutions` copy,
- `/my-gpt` copy,
- six older blog posts as a featured content base.

## Existing blog inventory

| Post | v2 decision |
|---|---|
| The Claude Code GTM Agent Starter Pack | keep, migrate, improve |
| Top 5 Twitter Alternatives | not featured in v2; later decide redirect / archive |
| B2B Evolution: Mastering Product-Led Growth | not featured in v2; later decide redirect / archive |
| Brand monitoring: Why it's essential and the tools to do it | not featured in v2 |
| Top 7 AI tools for the business | not featured in v2 |
| Unlock the Power of Linkedin | not featured in v2 |
| 5 steps to a successful social media strategy for B2B Companies | not featured in v2 |

## External destinations that should remain visible

- `app.wojciech.io` / `app.wojciech.io/apps`
- Substack
- LinkedIn
- GitHub
- booking link (`cal.com` / current canonical meeting URL to be validated before launch)

## Asset handling

### Now

- use assets already present on current `wojciech.io` and `app.wojciech.io` as working references,
- use screenshots and current production pages to establish structure and visual direction.

### Later

- replace with original source files where higher quality is needed,
- select a stronger new hero image if current one feels too brochure-like,
- compress and re-export final production assets through the Astro image pipeline.
