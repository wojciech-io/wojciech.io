import type { APIRoute } from 'astro';
import { escapeXml } from '../utils/xml';
import fs from 'node:fs';
import path from 'node:path';

interface ShippedEntry {
  pr?: number;
  title: string;
  date?: string;
  url?: string;
}

function loadShipped(): ShippedEntry[] {
  try {
    const p = path.join(process.cwd(), 'src/data/shipped.json');
    if (!fs.existsSync(p)) return [];
    const raw = JSON.parse(fs.readFileSync(p, 'utf-8'));
    const entries = Array.isArray(raw) ? raw : raw.entries;
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL('https://wojciech.io/');
  const feedUrl = new URL('/changelog.rss', origin).href;
  const entries = loadShipped().slice(0, 30);
  const lastBuildDate = entries[0]?.date
    ? new Date(entries[0].date).toUTCString()
    : new Date().toUTCString();

  const items = entries
    .map((e) => {
      const link = e.url ?? (e.pr ? `https://github.com/wojciech-io/wojciech.io/pull/${e.pr}` : origin.href);
      const pubDate = e.date ? new Date(e.date).toUTCString() : lastBuildDate;
      const guid = e.pr ? `wojciech.io-pr-${e.pr}` : link;
      return `
        <item>
          <title>${escapeXml(e.title)}</title>
          <link>${link}</link>
          <guid isPermaLink="false">${guid}</guid>
          <pubDate>${pubDate}</pubDate>
          <author>hello@wojciech.io (Wojciech Łuszczyński)</author>
        </item>`;
    })
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Wojciech Łuszczyński · Changelog</title>
    <description>What I'm shipping on wojciech.io. Every merged PR, in feed-reader form.</description>
    <link>${new URL('/', origin).href}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <managingEditor>hello@wojciech.io (Wojciech Łuszczyński)</managingEditor>
    <webMaster>hello@wojciech.io (Wojciech Łuszczyński)</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <ttl>360</ttl>
    ${items}
  </channel>
</rss>`,
    {
      headers: {
        'content-type': 'application/rss+xml; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    },
  );
};
