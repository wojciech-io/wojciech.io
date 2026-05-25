# 09 - SEO migration plan

## Principle

The launch should not preserve weak content for vanity reasons, but it should preserve useful equity and avoid unnecessary 404s.

## Draft redirect map

| Old URL | New URL | Treatment |
|---|---|---|
| `/` | `/` | rewrite in place |
| `/about` | `/about` | rewrite in place |
| `/solutions` | `/work` | 301 |
| `/my-gpt` | `/ai-systems` | 301 |
| `/blog` | `/insights` | 301 |
| `/blog/claude-code-vs-clay` | `/insights/claude-code-vs-clay` | 301 |
| `/pricing` | `/` or 410 | final decision after checking index/backlinks |
| `/support` | `/` or 410 | final decision after checking index/backlinks |
| `/styleguide` | 410 | internal / non-public |

## Sprint 2 redirect map

Sprint 2 removed multilingual route directories and archived legacy insight articles. The redirect policy is intentionally conservative: preserve traffic, avoid 404s, and send retired article equity to the closest stable index until each topic is rewritten.

| Old URL pattern | New URL | Treatment | Rationale |
|---|---|---|---|
| `/pl/*` | `/` | 301 | English-only launch; kill stale localized URLs rather than preserving ghost paths. |
| `/it/*` | `/` | 301 | English-only launch; same rationale as PL. |
| `/en/*` | `/` | 301 | Catch old language-prefixed route variants. |
| `/blog` | `/insights/` | 301 | Old blog index maps to the v2 insights index. |
| `/blog/claude-code-vs-clay` | `/insights/claude-code-vs-clay/` | 301 | Restored Sprint 3 article has a stable v2 URL. |
| `/blog/*` | `/insights/:splat` | 301 | Preserve old blog slug structure for rewritten articles; archived slugs then fall through to the retired-insight rules below if requested directly. |

Archived insight slugs now redirect to `/insights/` with 301 until individual rewrites land:

- `/insights/ai-adoption-framework-b2b-saas-growth-teams`
- `/insights/astro-cloudflare-pages-portfolio-ai-workflow`
- `/insights/b2b-crm-revenue-operations-system-guide`
- `/insights/b2b-revenue-system-design-operator-framework`
- `/insights/b2b-saas-growth-system-icp-acquisition-retention`
- `/insights/cloudflare-migration-zero-trust-free-tier`
- `/insights/component-showcase`
- `/insights/framer-to-astro-build-vs-buy-website-rebuild`
- `/insights/google-ads-ai-management-dashboard-guide`
- `/insights/gtm-ai-agent-four-layer-architecture-guide`
- `/insights/gtm-tools-build-vs-buy-decision-framework`
- `/insights/how-to-build-booking-engine-product-architecture`
- `/insights/how-to-build-gtm-ai-agent-outbound-crm`
- `/insights/how-to-build-micro-saas-with-ai-tools`
- `/insights/macos-teleprompter-macbook-notch-native-app`

The per-slug revival map should be revisited in Sprint 3+ when an archived article is rewritten and intentionally republished.

## Legacy blog posts

Decision required later per URL:

- 301 to `/insights` if there is some residual traffic but no modern equivalent,
- 410 if the page is low-value and has no meaningful equity,
- rewrite only if a topic can genuinely be made current and fit the new content strategy.

## Required launch files

- `sitemap.xml`
- `robots.txt`
- `llms.txt`
- `_redirects`
- RSS feed
- OG defaults
- article OG handling
- structured data

## Measurement continuity

- Preserve existing GA4 property continuity.
- Re-verify Search Console after launch if needed.
- Monitor:
  - coverage,
  - 404s,
  - redirects,
  - indexed pages,
  - branded queries,
  - CTR on new title / description combinations.

## Launch sequencing

1. Finish staging QA.
2. Freeze content.
3. Finalize redirect map.
4. Build `_redirects` and test every mapping.
5. Add custom domain in Cloudflare Pages.
6. Update DNS only when launch candidate is approved.
7. Re-submit sitemap.
8. Monitor 7 / 30 day post-launch performance.
