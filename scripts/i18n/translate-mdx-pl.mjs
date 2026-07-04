// Translate EN insight MDX articles into PL via DeepL.
// Preserves YAML frontmatter structure, MDX/JSX components, code fences,
// and brand glossary. Outputs to src/content/insights/pl/<slug>.mdx.
//
// Usage: DEEPL_API_KEY=...:fx node scripts/i18n/translate-mdx-pl.mjs

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KEY = process.env.DEEPL_API_KEY;
if (!KEY) { console.error('DEEPL_API_KEY missing'); process.exit(1); }
const ENDPOINT = KEY.endsWith(':fx')
  ? 'https://api-free.deepl.com/v2/translate'
  : 'https://api.deepl.com/v2/translate';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const SRC_DIR = join(ROOT, 'src/content/insights');
const OUT_DIR = join(SRC_DIR, 'pl');

// Brand/technical terms preserved verbatim.
const GLOSSARY = [
  'Claude Code', 'Claude Sonnet', 'Claude Opus', 'Sonnet', 'Opus',
  'GTM Architect', 'Growth Operator', 'GTM',
  'B2B SaaS', 'SaaS', 'CRM', 'ICP', 'MCP', 'AI', 'LLM',
  'Pagefind', 'Cloudflare', 'Cloudflare Pages', 'Cloudflare Workers',
  'Pipedrive', 'Clay', 'Notion AI', 'Zapier',
  'Astro', 'MDX', 'wojciech.io', 'app.wojciech.io', 'subscribe.wojciech.io',
  'Operating Model', 'pipeline',
  // Kept English by corpus convention (outbound declines as a PL loanword);
  // proper nouns from the batch below so DeepL can't mangle them.
  'outbound', 'Claude', 'Anthropic', 'Apollo', 'n8n', 'Resend', 'micro-SaaS',
  'macOS', 'MacBook', 'SwiftUI', 'Swift', 'SEO',
];

// JSX attribute names whose values should be translated.
const JSX_TRANSLATABLE = new Set([
  'title', 'body', 'label', 'subtitle', 'kicker', 'tag', 'heading',
  'desc', 'description', 'name', 'content', 'value', 'caption',
  'before', 'after', 'metric', 'unit',
]);

// ── glossary placeholder ──────────────────────────────────────────────────
// DeepL `tag_handling=xml` preserves `<x />`. We wrap glossary terms in
// `<x id="N"/>` before translation, restore after.
function protectGlossary(text) {
  const tokens = [];
  let out = text;
  // Sort longest first so 'Claude Code' doesn't get partially matched by 'Claude'.
  const sorted = [...GLOSSARY].sort((a, b) => b.length - a.length);
  for (const term of sorted) {
    const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'g');
    out = out.replace(re, () => {
      const id = tokens.length;
      tokens.push(term);
      return `<x id="${id}"/>`;
    });
  }
  return { text: out, tokens };
}
function restoreGlossary(text, tokens) {
  return text.replace(/<x id="(\d+)"\/>/g, (_, n) => tokens[Number(n)] ?? '');
}

// Rewrite bare internal links to carry /pl/ prefix, matching DE/DK convention.
function localizeLinks(text, locale) {
  // ](/insights/...) -> ](/pl/insights/...) ; ](/contact#x) -> ](/pl/contact/#x)
  // Skip already-prefixed (e.g. /de/, /pl/), external, and anchors.
  return text.replace(/\]\(\/(?![a-z]{2}\/|http|#)([^)]+)\)/g, (_, path) => {
    // Insert slash before fragment for consistency with other locales (/contact#x → /contact/#x)
    const normalized = path.replace(/([^/])#/, '$1/#');
    return `](/${locale}/${normalized})`;
  });
}

// DeepL paranoidally wraps anglicisms with `typu „X"` and Polish quotes.
// Strip both when X is a known brand term.
function cleanBrandWrappers(text) {
  let out = text;
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const term of GLOSSARY) {
    const t = escapeRe(term);
    // 1. Polish quotes around brand: „MCP" -> MCP
    out = out.replace(new RegExp(`„${t}”`, 'g'), term);
    // 2. "narzędzi/operacji/systemu typu MCP" -> "narzędzi MCP"
    out = out.replace(new RegExp(`(\\w+\\s+)typu ${t}\\b`, 'g'), `$1${term}`);
    // 3. Bare "typu MCP" with no prefix (start of phrase) -> "MCP"
    out = out.replace(new RegExp(`\\btypu ${t}\\b`, 'g'), term);
  }
  return out;
}

// ── DeepL ─────────────────────────────────────────────────────────────────
const cache = new Map();
async function deeplBatch(texts) {
  if (!texts.length) return [];
  const out = [];
  for (let i = 0; i < texts.length; i += 40) {
    const chunk = texts.slice(i, i + 40);
    const body = new URLSearchParams();
    chunk.forEach((t) => body.append('text', t));
    body.append('source_lang', 'EN');
    body.append('target_lang', 'PL');
    body.append('preserve_formatting', '1');
    body.append('tag_handling', 'xml');
    body.append('ignore_tags', 'x');
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `DeepL-Auth-Key ${KEY}` },
      body,
    });
    if (!res.ok) throw new Error(`DeepL ${res.status}: ${await res.text()}`);
    const json = await res.json();
    out.push(...json.translations.map((t) => t.text));
  }
  return out;
}

async function translateMany(strings) {
  const todo = [...new Set(strings.filter((s) => typeof s === 'string' && s.trim()))]
    .filter((s) => !cache.has(s));
  if (!todo.length) return;
  const protectedPairs = todo.map((s) => protectGlossary(s));
  const translated = await deeplBatch(protectedPairs.map((p) => p.text));
  todo.forEach((src, i) => {
    cache.set(src, restoreGlossary(translated[i], protectedPairs[i].tokens));
  });
}
const T = (s) => (typeof s === 'string' && s.trim() ? (cache.get(s) ?? s) : s);

// ── MDX parsing ───────────────────────────────────────────────────────────
function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error('No frontmatter');
  return { fm: m[1], body: m[2] };
}

// Block types: code | jsx | md
function tokenizeBody(body) {
  const lines = body.split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // Fenced code
    if (/^```/.test(line)) {
      const start = i;
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) i++;
      i++; // include closing fence
      blocks.push({ type: 'code', text: lines.slice(start, i).join('\n') });
      continue;
    }
    // JSX top-level (line begins with `<Uppercase`)
    if (/^<[A-Z]/.test(line)) {
      const start = i;
      // Read until tag balance closes (`/>` self-close or matching `</Component>`).
      const tagMatch = line.match(/^<([A-Z][A-Za-z0-9]*)/);
      const name = tagMatch ? tagMatch[1] : null;
      let depth = 0;
      let selfClosed = false;
      while (i < lines.length) {
        const l = lines[i];
        // Count opens and closes for this name
        if (name) {
          const opens = (l.match(new RegExp(`<${name}\\b`, 'g')) || []).length;
          const closes = (l.match(new RegExp(`</${name}\\b`, 'g')) || []).length;
          depth += opens - closes;
        }
        if (/\/>\s*$/.test(l) && depth === 1) { selfClosed = true; i++; break; }
        if (name && depth === 0) { i++; break; }
        i++;
        if (i >= lines.length) break;
      }
      blocks.push({ type: 'jsx', text: lines.slice(start, i).join('\n') });
      continue;
    }
    // Markdown — collect until blank line or block boundary
    const start = i;
    while (i < lines.length && !/^```/.test(lines[i]) && !/^<[A-Z]/.test(lines[i])) {
      i++;
    }
    blocks.push({ type: 'md', text: lines.slice(start, i).join('\n') });
  }
  return blocks;
}

// Extract translatable JSX attribute values. Returns:
// { sanitized: 'block with __SLOT_N__', slots: ['original value strings'] }
function extractJsxAttrs(block) {
  const slots = [];
  // Match attrName="value", attrName='value', or attrName: "value" (object props inside {})
  const re = /(\w+)(=|:\s*)("([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)')/g;
  const sanitized = block.replace(re, (full, attr, sep, q, dq, sq) => {
    if (!JSX_TRANSLATABLE.has(attr)) return full;
    const value = dq !== undefined ? dq : sq;
    if (!value.trim()) return full;
    const id = slots.length;
    slots.push(value);
    const quote = q[0];
    return `${attr}${sep}${quote}__SLOT_${id}__${quote}`;
  });
  return { sanitized, slots };
}

// Markdown text within a block — split paragraphs to feed to translate.
// Returns { sanitized, slots } where slots are paragraph strings.
function extractMd(block) {
  // Markdown headings (## ...) and list bullets stay structurally, but their
  // content should translate. We split paragraphs by blank lines and translate
  // each (DeepL handles inline markdown like **bold**, [link](url) ok).
  const paragraphs = block.split(/(\n[ \t]*\n)/); // keep separators
  const slots = [];
  const sanitized = paragraphs.map((p) => {
    if (/^\n[ \t]*\n$/.test(p)) return p;
    if (!p.trim()) return p;
    const id = slots.length;
    slots.push(p);
    return `__SLOT_${id}__`;
  }).join('');
  return { sanitized, slots };
}

// ── YAML frontmatter — minimal parser/serializer for our schema ──────────
// Schema is constrained: scalars, arrays of scalars, no nesting beyond tldr[].
function parseFm(fm) {
  const out = {};
  const lines = fm.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) { i++; continue; }
    const key = m[1];
    let val = m[2];
    if (val === '') {
      // Array — read following indented lines `  - item`
      const items = [];
      i++;
      while (i < lines.length && /^\s+-\s+/.test(lines[i])) {
        const itm = lines[i].replace(/^\s+-\s+/, '').trim();
        items.push(stripQuotes(itm));
        i++;
      }
      out[key] = items;
      continue;
    }
    out[key] = stripQuotes(val.trim());
    i++;
  }
  return out;
}
function stripQuotes(s) {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  if (s === 'true') return true;
  if (s === 'false') return false;
  return s;
}
function fmString(v) {
  if (typeof v === 'boolean') return String(v);
  // Quote always for safety; escape inner double quotes.
  return `"${String(v).replace(/"/g, '\\"')}"`;
}
function serializeFm(obj, order) {
  const lines = [];
  for (const k of order) {
    if (!(k in obj)) continue;
    const v = obj[k];
    if (Array.isArray(v)) {
      lines.push(`${k}:`);
      for (const itm of v) lines.push(`  - ${fmString(itm)}`);
    } else {
      lines.push(`${k}: ${fmString(v)}`);
    }
  }
  return lines.join('\n');
}

// ── Main per-file ────────────────────────────────────────────────────────
async function translateFile(slug) {
  const src = readFileSync(join(SRC_DIR, `${slug}.mdx`), 'utf8');
  const { fm: fmRaw, body } = splitFrontmatter(src);
  const fm = parseFm(fmRaw);

  // Collect strings for batch translation.
  const corpus = [];

  // Frontmatter translatable fields
  const FM_TRANSLATE = ['title', 'description'];
  for (const k of FM_TRANSLATE) if (fm[k]) corpus.push(fm[k]);
  if (Array.isArray(fm.tldr)) corpus.push(...fm.tldr);

  // Body blocks
  const blocks = tokenizeBody(body);
  const blockMeta = blocks.map((b) => {
    if (b.type === 'code') return { ...b };
    if (b.type === 'jsx') {
      const { sanitized, slots } = extractJsxAttrs(b.text);
      corpus.push(...slots);
      return { ...b, sanitized, slots };
    }
    // md
    const { sanitized, slots } = extractMd(b.text);
    corpus.push(...slots);
    return { ...b, sanitized, slots };
  });

  console.log(`[${slug}] translating ${corpus.length} strings...`);
  await translateMany(corpus);

  // Build new frontmatter
  const newFm = { ...fm };
  for (const k of FM_TRANSLATE) if (newFm[k]) newFm[k] = T(newFm[k]);
  if (Array.isArray(newFm.tldr)) newFm.tldr = newFm.tldr.map(T);
  newFm.locale = 'pl';
  newFm.translationOf = slug;

  const order = ['title', 'description', 'publishedAt', 'tags', 'featured',
    'draft', 'coverType', 'category', 'locale', 'translationOf', 'tldr'];

  // Rebuild body
  const newBody = blockMeta.map((b) => {
    if (b.type === 'code') return b.text;
    if (b.type === 'jsx') {
      let out = b.sanitized;
      b.slots.forEach((orig, i) => {
        const translated = (T(orig) || orig).replace(/"/g, '\\"');
        out = out.replace(`__SLOT_${i}__`, translated);
      });
      return out;
    }
    // md
    let out = b.sanitized;
    b.slots.forEach((orig, i) => {
      out = out.replace(`__SLOT_${i}__`, T(orig) || orig);
    });
    return out;
  }).join('\n');

  let finalDoc = `---\n${serializeFm(newFm, order)}\n---\n${newBody}`;
  finalDoc = cleanBrandWrappers(finalDoc);
  finalDoc = localizeLinks(finalDoc, 'pl');

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, `${slug}.mdx`), finalDoc);
  console.log(`[${slug}] wrote ${join('pl', `${slug}.mdx`)}`);
}

// ── Run ──────────────────────────────────────────────────────────────────
// Pass slugs as args to retranslate only those (e.g. to repair specific files).
// With no args, translates every EN article.
const argSlugs = process.argv.slice(2).map((s) => s.replace(/\.mdx$/, ''));
const slugs = argSlugs.length
  ? argSlugs
  : readdirSync(SRC_DIR)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''));

console.log(`Translating ${slugs.length} articles to PL: ${slugs.join(', ')}`);
for (const slug of slugs) {
  await translateFile(slug);
}
console.log(`\nDeepL chars (approx): ${[...cache.keys()].reduce((n, s) => n + s.length, 0)}`);
