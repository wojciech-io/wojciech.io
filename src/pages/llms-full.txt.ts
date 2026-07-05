import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// Full-content companion to the curated /llms.txt. Concatenates the full
// prose of every published English insight (newest first) into one plain-text
// file for AI engines to ingest in a single fetch. Generated at build time
// from the content collection, so it never drifts from the published site.
//
// Scope guards: drafts are excluded (data.draft), and only English originals
// are emitted — localized translations live under an `xx/` id prefix and are
// skipped to avoid duplicate corpora. Only already-public content is included.

// Reduce MDX source to readable prose: drop imports, JSX component tags
// (keeping their text children), images, link URLs, and MDX comments.
function mdxToText(src: string): string {
  let text = src
    .replace(/^(import|export)\s.*$/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  // Strip JSX/HTML tags until none remain, so nested or malformed markup
  // (e.g. "<<b>i>") can't survive a single non-recursive pass. Iterating to a
  // fixpoint clears the CodeQL incomplete-multi-character-sanitization finding.
  let prev: string;
  do {
    prev = text;
    text = text.replace(/<\/?[A-Za-z][^>]*>/g, '');
  } while (text !== prev);
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL('https://wojciech.io/')).origin;

  const posts = (await getCollection('insights', ({ data }) => !data.draft))
    // English originals only: localized entries have an `xx/slug` id.
    .filter((post) => !/^[a-z]{2}\//.test(post.id))
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

  const header = [
    '# Wojciech Łuszczyński · wojciech.io · full insights corpus',
    '',
    '> Full text of every published English insight, newest first. This is the',
    '> content companion to the curated overview at ' + origin + '/llms.txt.',
    '> Author: Wojciech Łuszczyński (GTM Architect and Growth Operator).',
    '',
    `Articles: ${posts.length}. Generated from the live content collection.`,
    '',
    '---',
    '',
  ].join('\n');

  const body = posts
    .map((post) => {
      const slug = post.id.replace(/\.mdx?$/, '');
      const url = `${origin}/insights/${slug}/`;
      const published = post.data.publishedAt.toISOString().slice(0, 10);
      const updated = post.data.updatedAt
        ? post.data.updatedAt.toISOString().slice(0, 10)
        : null;

      const meta = [
        `## ${post.data.title}`,
        '',
        `URL: ${url}`,
        `Published: ${published}${updated ? ` · Updated: ${updated}` : ''}`,
        post.data.category ? `Category: ${post.data.category}` : null,
        post.data.tags.length ? `Tags: ${post.data.tags.join(', ')}` : null,
        '',
        `> ${post.data.description}`,
      ]
        .filter((line) => line !== null)
        .join('\n');

      const tldr = post.data.tldr?.length
        ? '\n\nTL;DR:\n' + post.data.tldr.map((point) => `- ${point}`).join('\n')
        : '';

      return `${meta}${tldr}\n\n${mdxToText(post.body ?? '')}`;
    })
    .join('\n\n---\n\n');

  return new Response(`${header}${body}\n`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
