// Surgically inject the "What the meter actually costs" pricing block into
// every locale copy of the Fable 5 article, translating only the new strings
// via DeepL. Leaves all existing (already hand-corrected) translations intact.
//
// Why a surgical splice instead of a full re-translate: the main PL translator
// would re-run DeepL over the whole article and clobber the manual fixes made
// earlier (partner names, category nouns before "Fable"). This touches only the
// new block, anchored structurally (first `## ` heading after <ArticleTimeline>).
//
// Idempotent: re-running is a no-op once the block is present (detected by the
// verbatim MetricRow value "$10 / $50", which is never translated).
//
// Usage:
//   STUB (no DeepL, identity strings, dry-run print): node scripts/i18n/inject-fable-pricing-block.mjs --stub
//   REAL dry-run:   DEEPL_API_KEY=...:fx node scripts/i18n/inject-fable-pricing-block.mjs
//   REAL write:     DEEPL_API_KEY=...:fx node scripts/i18n/inject-fable-pricing-block.mjs --write

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const SRC_DIR = join(ROOT, 'src/content/insights');
const SLUG = 'claude-fable-5-mythos-5';

const WRITE = process.argv.includes('--write');
const STUB = process.argv.includes('--stub');

const KEY = process.env.DEEPL_API_KEY;
if (!STUB && !KEY) {
  console.error('DEEPL_API_KEY missing. Run with --stub to validate splicing, or export the key.');
  process.exit(1);
}
const ENDPOINT = KEY && KEY.endsWith(':fx')
  ? 'https://api-free.deepl.com/v2/translate'
  : 'https://api.deepl.com/v2/translate';

// folder -> DeepL target_lang
const LOCALES = [
  { dir: 'pl', deepl: 'PL' },
  { dir: 'no', deepl: 'NB' },
  { dir: 'it', deepl: 'IT' },
  { dir: 'de', deepl: 'DE' },
  { dir: 'dk', deepl: 'DA' },
  { dir: 'es', deepl: 'ES' },
  { dir: 'jp', deepl: 'JA' },
];

// Proper nouns that must survive translation verbatim. Deliberately limited to
// brand names: protecting units/dates (1M, USD, "June 23") made DeepL wrap them
// in `typu X` artifacts and misread "credits"/"launch"/"model card" as film and
// game terms. Plain numbers and dates translate cleanly on their own.
const PROTECT = [
  'Fable 5', 'Mythos 5', 'Opus 4.8', 'Fable', 'Mythos', 'Opus', 'Anthropic',
];

// Translatable strings (everything user-facing in the new block).
// Keys map into the template below. Verbatim numeric/value fields are NOT here.
const STR = {
  heading: 'What the meter actually costs',
  p1: 'When usage billing starts on June 23, Fable 5 and Mythos 5 both list at $10 per million input tokens and $50 per million output tokens. That is exactly double Opus 4.8, which sits at $5 and $25. These are published list prices, not my estimates.',
  mLabel1: 'Fable 5 input and output tokens, per million',
  mLabel2: 'Opus 4.8 is half the price, $5 and $25 per million tokens',
  mLabel3: 'Sessions handed to Opus 4.8 as a fallback',
  mLabel4: 'Free window ends, billing starts',
  mCaption: "List pricing from Anthropic's published numbers for this launch. Verified against the public pricing, not modelled by me.",
  bLabel: 'Output-token price, USD per million',
  bCaption: 'Lower is cheaper, so the longer bar is the one that costs more. Fable 5 costs exactly twice as much as Opus 4.8. The frontier capability is what the premium buys.',
  p2: 'The number that decides whether this is worth 2× is not on any price page: cost per finished result. A model that costs twice as much per token but finishes a long agentic run in half the steps can land cheaper per result. That is the only comparison that matters, and it is exactly what the cost test in the next section is built to measure.',
};

// Build the localized MDX block from translated strings. Value fields and the
// two proper-noun labels stay verbatim across all locales.
function buildBlock(t) {
  return `## ${t.heading}

${t.p1}

<MetricRow
  items={[
    { value: "$10 / $50", label: "${esc(t.mLabel1)}" },
    { value: "2×", label: "${esc(t.mLabel2)}" },
    { value: "<5%", label: "${esc(t.mLabel3)}" },
    { value: "Jun 23", label: "${esc(t.mLabel4)}" }
  ]}
  caption="${esc(t.mCaption)}"
/>

<Benchmark
  label="${esc(t.bLabel)}"
  yours={50}
  baseline={25}
  yoursLabel="Fable 5 / Mythos 5"
  baselineLabel="Opus 4.8"
  unit=""
  lowerIsBetter={true}
  caption="${esc(t.bCaption)}"
/>

${t.p2}`;
}
// JSX attribute values are double-quoted and do NOT honour backslash escapes,
// so any raw " inside a value terminates the attribute and breaks the build.
// Convert residual straight quotes to a typographic right-quote, which renders
// fine and can never close the attribute.
const esc = (s) => String(s).replace(/\\(?=")/g, '').replace(/"/g, '”');

// DeepL sometimes wraps a protected token in quotes ("Anthropic", „Opus 4.8").
// Strip a matching quote pair around any brand term, mirroring the main
// translator's cleanBrandWrappers.
const QUOTES = '"“„«»”';
function cleanWrappers(text) {
  let out = text;
  for (const term of PROTECT) {
    const t = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(`[${QUOTES}]\\s*${t}\\s*[${QUOTES}]`, 'g'), term);
  }
  return out;
}

// ── DeepL with proper-noun protection (mirrors translate-mdx-pl.mjs) ────────
function protect(text) {
  const tokens = [];
  let out = text;
  const sorted = [...PROTECT].sort((a, b) => b.length - a.length);
  for (const term of sorted) {
    const re = new RegExp(`(?<![\\w])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w])`, 'g');
    out = out.replace(re, () => { const id = tokens.length; tokens.push(term); return `<x id="${id}"/>`; });
  }
  return { text: out, tokens };
}
const restore = (text, tokens) => text.replace(/<x id="(\d+)"\/>/g, (_, n) => tokens[Number(n)] ?? '');

async function deepl(texts, target) {
  if (STUB) return texts.slice();
  const body = new URLSearchParams();
  texts.forEach((t) => body.append('text', t));
  body.append('source_lang', 'EN');
  body.append('target_lang', target);
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
  return json.translations.map((t) => t.text);
}

async function translateStrings(target) {
  const keys = Object.keys(STR);
  const protectedPairs = keys.map((k) => protect(STR[k]));
  const translated = await deepl(protectedPairs.map((p) => p.text), target);
  const out = {};
  keys.forEach((k, i) => { out[k] = cleanWrappers(restore(translated[i], protectedPairs[i].tokens)); });
  return out;
}

// ── Splice ──────────────────────────────────────────────────────────────────
const SENTINEL = '"$10 / $50"'; // verbatim, never translated → idempotency marker

function inject(raw, block) {
  if (raw.includes(SENTINEL)) return { raw, status: 'already-present' };
  const lines = raw.split('\n');
  const tlIdx = lines.findIndex((l) => /^<ArticleTimeline\b/.test(l));
  if (tlIdx === -1) return { raw, status: 'no-ArticleTimeline-anchor' };
  // First `## ` heading after the ArticleTimeline block.
  let hIdx = -1;
  for (let i = tlIdx + 1; i < lines.length; i++) {
    if (/^## /.test(lines[i])) { hIdx = i; break; }
  }
  if (hIdx === -1) return { raw, status: 'no-following-heading' };
  const before = lines.slice(0, hIdx).join('\n').replace(/\s*$/, '');
  const after = lines.slice(hIdx).join('\n');
  return { raw: `${before}\n\n${block}\n\n${after}`, status: 'injected', anchor: lines[hIdx] };
}

// ── Run ───────────────────────────────────────────────────────────────────
for (const { dir, deepl: target } of LOCALES) {
  const path = join(SRC_DIR, dir, `${SLUG}.mdx`);
  let raw;
  try { raw = readFileSync(path, 'utf8'); }
  catch { console.log(`[${dir}] SKIP (file not found)`); continue; }

  const t = await translateStrings(target);
  const block = buildBlock(t);
  const { raw: next, status, anchor } = inject(raw, block);

  console.log(`\n[${dir}] ${status}${anchor ? `  (anchor: ${anchor})` : ''}`);
  if (status !== 'injected') continue;
  if (STUB) { console.log(block.split('\n').slice(0, 3).join('\n') + '\n  ...'); continue; }
  if (WRITE) { writeFileSync(path, next); console.log(`[${dir}] wrote ${dir}/${SLUG}.mdx`); }
  else { console.log(`[${dir}] dry-run (pass --write to apply). Heading: ## ${t.heading}`); }
}
console.log(`\nDone. mode=${STUB ? 'stub' : WRITE ? 'write' : 'dry-run'}`);
