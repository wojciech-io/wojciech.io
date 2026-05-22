import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// Canonical XML 1.0 entity escape (5 predefined entities: & < > " ').
// Used on internal MDX content (validated by src/content.config.ts schema),
// not user input. Output context is XML element/attribute text, not HTML —
// so semgrep's HTML-focused replaceAll rule does not apply here.
// See .agent-reports/2026-05-22-security-auditor-triage-002.md for full triage.
const escapeXml = (value: string) =>
  // nosemgrep: javascript.audit.detect-replaceall-sanitization.detect-replaceall-sanitization
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection('insights', ({ data }) => !data.draft)).sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured) || b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );

  const origin = site ?? new URL('https://wojciech.io/');
  const items = posts
    .map((post) => {
      const slug = post.id.replace(/\.mdx?$/, '');
      const url = new URL(`/insights/${slug}/`, origin).href;

      return `
        <item>
          <title>${escapeXml(post.data.title)}</title>
          <description>${escapeXml(post.data.description)}</description>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${post.data.publishedAt.toUTCString()}</pubDate>
        </item>`;
    })
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>Wojciech Łuszczyński - Insights</title>
          <description>Articles on growth, AI systems, GTM architecture, and building revenue systems.</description>
          <link>${new URL('/insights/', origin).href}</link>
          ${items}
        </channel>
      </rss>`,
    {
      headers: {
        'content-type': 'application/rss+xml; charset=utf-8',
      },
    },
  );
};
