#!/usr/bin/env node
/**
 * check-sources.mjs — re-read the external claims articles rest on.
 *
 * Usage:
 *   node scripts/check-sources.mjs            # markdown report on stdout
 *   node scripts/check-sources.mjs --json     # machine-readable
 *
 * A comparison post is true the day it ships and quietly stops being true when
 * the other side edits their docs, renames a model, or changes a price. No
 * commit here marks that moment, so nothing in CI can catch it. This walks the
 * `sources:` frontmatter, fetches each URL, and reports where a quoted
 * fragment has stopped appearing at its source.
 *
 * Exit code is always 0. The weekly workflow turns the report into an issue;
 * a third party editing their own page is not a reason to fail a build.
 *
 * Quotes are compared after whitespace normalization, because a fragment
 * wrapped across three lines in the article is one line at the source. That is
 * the same normalization step that has caught real misquotes by hand: a plain
 * substring match on raw text misses them and reports a false failure.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'src/content/insights');
const TIMEOUT_MS = 20_000;
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const asJson = process.argv.includes('--json');

/** Collapse every run of whitespace so line wrapping cannot cause a false miss. */
const normalize = (s) =>
  s
    .replace(/ /g, ' ')
    // Curly quotes and dashes differ between a source's CMS and a hand-copied
    // fragment far more often than the words do.
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/** Crude but sufficient: drop scripts, styles and tags, keep the prose. */
const htmlToText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

async function collectFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await collectFiles(full)));
    else if (/\.mdx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

function frontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  try {
    return yaml.load(m[1]);
  } catch {
    return null;
  }
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': UA, 'cache-control': 'no-cache' },
    });
    const body = await res.text();
    return { status: res.status, text: body };
  } finally {
    clearTimeout(timer);
  }
}

const files = await collectFiles(CONTENT);
const results = [];

for (const file of files) {
  const raw = await readFile(file, 'utf8');
  const fm = frontmatter(raw);
  const sources = fm?.sources;
  if (!Array.isArray(sources) || sources.length === 0) continue;

  for (const source of sources) {
    const record = {
      file: relative(ROOT, file),
      url: source.url,
      claim: source.claim ?? null,
      checkedAt: source.checkedAt ? String(source.checkedAt).slice(0, 10) : null,
      status: null,
      verdict: 'unknown',
      detail: '',
    };

    try {
      const { status, text } = await fetchText(source.url);
      record.status = status;

      if (status >= 400) {
        record.verdict = 'unreachable';
        record.detail = `HTTP ${status}`;
      } else if (!source.quote) {
        record.verdict = 'ok';
        record.detail = 'reachable, no quote pinned';
      } else if (normalize(htmlToText(text)).includes(normalize(source.quote))) {
        record.verdict = 'ok';
        record.detail = 'quote still present';
      } else {
        record.verdict = 'drifted';
        record.detail = 'quote no longer found at source';
      }
    } catch (error) {
      record.verdict = 'unreachable';
      record.detail = error.name === 'AbortError' ? `timed out after ${TIMEOUT_MS / 1000}s` : error.message;
    }

    results.push(record);
  }
}

if (asJson) {
  console.log(JSON.stringify({ results }, null, 2));
  process.exit(0);
}

const drifted = results.filter((r) => r.verdict === 'drifted');
const unreachable = results.filter((r) => r.verdict === 'unreachable');

console.log('### Source check');
console.log();

if (results.length === 0) {
  console.log('No article declares `sources:` yet, so there was nothing to re-read.');
  console.log();
  console.log('Add the field to any post that quotes somebody else, and this becomes the thing that notices when their page changes under it.');
  process.exit(0);
}

console.log(`Re-read ${results.length} source(s) across ${new Set(results.map((r) => r.file)).size} article(s).`);
console.log();

if (drifted.length === 0 && unreachable.length === 0) {
  console.log('Every pinned quote is still present at its source.');
} else {
  console.log('| article | source | verdict | detail |');
  console.log('|---|---|---|---|');
  for (const r of [...drifted, ...unreachable]) {
    const name = r.file.replace('src/content/insights/', '');
    console.log(`| \`${name}\` | ${r.url} | **${r.verdict}** | ${r.detail} |`);
  }
  console.log();
  if (drifted.length > 0) {
    console.log(
      'A drifted quote means the page no longer contains the words the article attributes to it. Re-read the source before editing: the honest fix is sometimes to update the quote, and sometimes to note that they changed their position.',
    );
  }
  if (unreachable.length > 0) {
    console.log();
    console.log('Unreachable is not the same as wrong. Check by hand before touching the article; a bot block or a temporary outage looks identical to a deleted page from here.');
  }
}

process.exit(0);
