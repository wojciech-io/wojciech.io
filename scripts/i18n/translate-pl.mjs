// Generate Polish (pl) i18n entries via DeepL, mirroring the German source.
// Usage: DEEPL_API_KEY=... node --experimental-strip-types \
//   --import ./scripts/i18n/_register.mjs scripts/i18n/translate-pl.mjs
//
// Outputs ready-to-insert TS blocks to /tmp/pl-*.txt. Never commits the key.

const KEY = process.env.DEEPL_API_KEY;
if (!KEY) { console.error('DEEPL_API_KEY missing'); process.exit(1); }
const ENDPOINT = KEY.endsWith(':fx')
  ? 'https://api-free.deepl.com/v2/translate'
  : 'https://api.deepl.com/v2/translate';

const ROOT = new URL('../../src/', import.meta.url).pathname;
const { localizedHome } = await import(ROOT + 'data/locales.ts');
const { localizedPages } = await import(ROOT + 'data/localizedPages.ts');
const { insightLocaleLabels } = await import(ROOT + 'lib/insights.ts');

// Brand terms DeepL must not paraphrase — restored verbatim after translation.
const GLOSSARY = [
  'GTM Architect', 'Growth Operator', 'GTM', 'B2B SaaS', 'SaaS', 'CRM',
  'Claude Code', 'MCP', 'AI', 'ICP', 'Operating Model', 'pipeline',
  'Pagefind', 'Cloudflare', 'wojciech.io',
];

const cache = new Map();
async function deepl(texts, source) {
  const out = [];
  for (let i = 0; i < texts.length; i += 40) {
    const chunk = texts.slice(i, i + 40);
    const body = new URLSearchParams();
    chunk.forEach((t) => body.append('text', t));
    body.append('source_lang', source);
    body.append('target_lang', 'PL');
    body.append('preserve_formatting', '1');
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

// Translate a flat list of unique strings, return a Map(src -> pl).
async function translateAll(strings, source) {
  const uniq = [...new Set(strings.filter((s) => typeof s === 'string' && s.trim()))];
  const todo = uniq.filter((s) => !cache.has(s));
  if (todo.length) {
    const res = await deepl(todo, source);
    todo.forEach((s, i) => cache.set(s, res[i]));
  }
  const map = new Map();
  uniq.forEach((s) => map.set(s, cache.get(s)));
  return map;
}

// Deep-translate string values in an object, skipping `skipKeys`.
function collectStrings(obj, skipKeys, acc) {
  if (typeof obj === 'string') { acc.push(obj); return; }
  if (Array.isArray(obj)) { obj.forEach((v) => collectStrings(v, skipKeys, acc)); return; }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (skipKeys.has(k)) continue;
      collectStrings(v, skipKeys, acc);
    }
  }
}
function applyTranslation(obj, skipKeys, map) {
  if (typeof obj === 'string') return map.get(obj) ?? obj;
  if (Array.isArray(obj)) return obj.map((v) => applyTranslation(v, skipKeys, map));
  if (obj && typeof obj === 'object') {
    const o = {};
    for (const [k, v] of Object.entries(obj)) {
      o[k] = skipKeys.has(k) ? v : applyTranslation(v, skipKeys, map);
    }
    return o;
  }
  return obj;
}
function restoreGlossary(s) {
  return s; // DeepL de->pl keeps most acronyms; manual polish pass handles edge cases.
}

const ts = (v, ind = 2) => {
  const pad = ' '.repeat(ind);
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    return `[\n${v.map((x) => pad + ts(x, ind + 2)).join(',\n')}\n${' '.repeat(ind - 2)}]`;
  }
  if (v && typeof v === 'object') {
    const entries = Object.entries(v).map(([k, val]) => `${pad}${k}: ${ts(val, ind + 2)}`);
    return `{\n${entries.join(',\n')}\n${' '.repeat(ind - 2)}}`;
  }
  return String(v);
};

// ── 1. localizedHome.pl (from de) ───────────────────────────────────────────
// NOTE: 'label' is intentionally NOT skipped here — proof[].label must
// translate. The top-level locale `label` is overridden after via Object.assign.
const META = new Set(['key', 'path', 'code', 'htmlLang', 'hreflang', 'ogLocale']);
{
  const src = localizedHome.de;
  const acc = []; collectStrings(src, META, acc);
  const map = await translateAll(acc, 'DE');
  const pl = applyTranslation(src, META, map);
  Object.assign(pl, { key: 'pl', path: 'pl', code: 'PL', label: 'Polski', htmlLang: 'pl', hreflang: 'pl', ogLocale: 'pl_PL' });
  await import('node:fs').then((fs) => fs.writeFileSync('/tmp/pl-home.txt', `  pl: ${ts(pl, 4)},\n`));
}

// ── 2. pageCopy.pl (from de pages) ──────────────────────────────────────────
{
  const SKIP = new Set(['primaryHref', 'secondaryHref']);
  const dePages = localizedPages.filter((p) => p.locale === 'de');
  const block = {};
  for (const p of dePages) {
    const { locale, slug, ...copy } = p;
    const acc = []; collectStrings(copy, SKIP, acc);
    const map = await translateAll(acc, 'DE');
    const pl = applyTranslation(copy, SKIP, map);
    if (pl.primaryHref) pl.primaryHref = pl.primaryHref.replace('/de/', '/pl/');
    if (pl.secondaryHref) pl.secondaryHref = pl.secondaryHref.replace('/de/', '/pl/');
    block[slug] = pl;
  }
  await import('node:fs').then((fs) => fs.writeFileSync('/tmp/pl-pages.txt', `  pl: ${ts(block, 4)},\n`));
}

// ── 3. insightLocaleLabels.pl (from en) ─────────────────────────────────────
{
  const SKIP = new Set(['bylineRole']); // brand role stays in English
  const src = insightLocaleLabels.en;
  const acc = []; collectStrings(src, SKIP, acc);
  const map = await translateAll(acc, 'EN');
  const pl = applyTranslation(src, SKIP, map);
  pl.readTimeSuffix = 'min czytania'; // DeepL leaves "min read" untranslated
  await import('node:fs').then((fs) => fs.writeFileSync('/tmp/pl-labels.txt', `  pl: ${ts(pl, 4)},\n`));
}

console.log('Done. Wrote /tmp/pl-home.txt, /tmp/pl-pages.txt, /tmp/pl-labels.txt');
console.log('DeepL chars used this run (approx):', [...cache.keys()].reduce((n, s) => n + s.length, 0));
