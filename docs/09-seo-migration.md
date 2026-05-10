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
