#!/usr/bin/env node
// slop-structure.mjs — structural copy-quality report for EVERY language.
//
// Usage:
//   node scripts/slop-structure.mjs                    # whole insights corpus
//   node scripts/slop-structure.mjs --diff BASE HEAD   # only what a PR touched
//   node scripts/slop-structure.mjs --json             # machine-readable
//   node scripts/slop-structure.mjs path/to/file.mdx   # one file
//
// WHY THIS EXISTS ALONGSIDE anti-slop.sh
//
// Vale's ai-tells rules are written against English vocabulary, so
// anti-slop.sh deliberately scopes itself to src/content/insights/*.mdx and
// leaves every translation unmeasured. That was fine at 29 English articles
// and one Polish mirror. It stops being fine the moment the corpus is mostly
// translations: the quality gate would cover a shrinking minority of what
// ships.
//
// The tells this script measures are structural rather than lexical, so they
// survive translation. A generated paragraph has the same shape in Polish,
// German and Spanish as it does in English: sentences of near-identical
// length, three-item lists as the default rhythm, "not X but Y" as the
// default contrast, and a short punchy line dropped on its own for effect.
// None of that needs a dictionary to see.
//
// ALWAYS EXITS 0 in report mode, for the same reason anti-slop.sh does: a
// tricolon can be a genuine quotation and a one-line paragraph can be the
// right call. Pass --strict to exit non-zero when a file crosses a line.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT_DIR = join(ROOT, 'src', 'content', 'insights');
const CIRCULAR_OVERLAP = Number(process.env.CIRCULAR_OVERLAP ?? 0.5);

// ── Unicode word boundaries ───────────────────────────────────────────────────
//
// JavaScript's \b is defined against [A-Za-z0-9_], so it reports a boundary
// in the middle of any word containing a non-ASCII letter. In "wartości" it
// finds one between "ś" and "ci" and matches the Polish pronoun "ci" eleven
// times in a text that contains none. Every pattern below therefore uses
// explicit lookarounds over \p{L}\p{N} instead.
const B0 = '(?<![\\p{L}\\p{N}])';
const B1 = '(?![\\p{L}\\p{N}])';

/** Build a Unicode-safe alternation of whole words. */
function words(list) {
  const alt = list.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return `${B0}(?:${alt})${B1}`;
}

// ── Per-language function words ───────────────────────────────────────────────
//
// Only two things need a language: the coordinating conjunction, to spot a
// three-item list, and the antithesis pair, to spot "not X but Y". Everything
// else is arithmetic on word counts.
//
// A locale missing from here still gets every language-independent metric; it
// just skips the two lexical ones rather than scoring them wrongly.
const LANG = {
  en: {
    and: ['and', 'or'],
    antithesis: [new RegExp(`${B0}not\\s+(?:just|only|merely)?\\s*[^.,;!?]{2,60},?\\s+but${B1}`, 'giu')],
  },
  pl: {
    and: ['i', 'oraz', 'lub', 'albo'],
    // The comma is required, not optional. Polish writes the antithesis as
    // "nie X, tylko Y"; without the comma the same words are "nie tylko X",
    // which is "not only X" and a different construction. The optional comma
    // collapsed the two and reported "nie przenosi tylko" ("does not only
    // transfer") as a rhetorical tic three times over.
    antithesis: [new RegExp(`${B0}nie\\s+[^.,;!?]{2,60},\\s+(?:tylko|lecz|ale)${B1}`, 'giu')],
  },
  de: {
    and: ['und', 'oder'],
    antithesis: [new RegExp(`${B0}nicht\\s+[^.,;!?]{2,60},?\\s+sondern${B1}`, 'giu')],
  },
  es: {
    and: ['y', 'e', 'o', 'u'],
    antithesis: [new RegExp(`${B0}no\\s+[^.,;!?]{2,60},?\\s+sino${B1}`, 'giu')],
  },
  it: {
    and: ['e', 'ed', 'o'],
    antithesis: [new RegExp(`${B0}non\\s+[^.,;!?]{2,60},?\\s+ma${B1}`, 'giu')],
  },
  fr: {
    and: ['et', 'ou'],
    antithesis: [new RegExp(`${B0}non\\s+[^.,;!?]{2,60},?\\s+mais${B1}`, 'giu')],
  },
  da: {
    and: ['og', 'eller'],
    antithesis: [new RegExp(`${B0}ikke\\s+[^.,;!?]{2,60},?\\s+men${B1}`, 'giu')],
  },
  no: {
    and: ['og', 'eller'],
    antithesis: [new RegExp(`${B0}ikke\\s+[^.,;!?]{2,60},?\\s+men${B1}`, 'giu')],
  },
};

// Headings that announce a description instead of making a claim.
//
// docs/10-tone-of-voice.md is explicit that a section heading may be "a
// statement or a question" and must not be a label. A question heading is
// therefore correct, and it is also how answer engines find a section, so a
// rule that flagged every "What ..." heading would fight both the spec and
// the search strategy. It would also be wrong about this corpus: headings
// like "What got cut" and "Co bym zrobil inaczej" are concrete and in voice.
//
// What the spec does rule out is the heading that points at itself. "Why this
// matters" and "Jak to wyglada w praktyce" name no subject: strip the deictic
// pronoun and nothing is left. That is the shape below, listed literally
// rather than inferred, so a hit is a hit and not a guess.
const VAGUE_HEADING = [
  /^why (this|that|it) matters\b/i,
  /^how (this|it) works( in practice)?[?.]?$/i,
  /^what (this|that|it) means( for you)?[?.]?$/i,
  /^what (this|that|it) looks like( in practice)?[?.]?$/i,
  /^jak to wyglada w praktyce[?.]?$/i,
  /\band why (it|this|that) matters\b/i,
  /^(the )?(importance|benefits|advantages|power) of\b/i,
  /\bwhat you need to know\b/i,
  /^dlaczego (to|jest to) (ma znaczenie|wazne)/i,
  /^dlaczego to ma znaczenie/i,
  /^jak to (dziala|wyglada)( w praktyce)?[?.]?$/i,
  /^co to (oznacza|znaczy)( dla ciebie)?[?.]?$/i,
  /^(znaczenie|korzysci|zalety) /i,
  /^warum (das|es|dies) wichtig ist/i,
  /^wie (das|es) funktioniert( in der praxis)?[?.]?$/i,
  /^por que (esto|eso) importa/i,
  /^como funciona( en la practica)?[?.]?$/i,
];

/** Strip diacritics so one pattern covers "działa" and "dziala". */
function fold(text) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').replace(/ł/gi, 'l');
}

function isVagueHeading(heading) {
  const folded = fold(heading);
  return VAGUE_HEADING.some((re) => re.test(folded));
}

// First and second person markers. The spec asks for "first person or second
// person. No 'one should' or 'companies often'", so a page that has drifted
// into the impersonal register is measurably off-voice. Pronouns and verb
// endings both count, because Polish, Spanish and Italian drop the pronoun.
const PERSON = {
  en: words(['i', "i'm", "i've", "i'd", "i'll", 'me', 'my', 'mine', 'we', "we're", "we've", 'our', 'ours', 'you', "you're", "you've", 'your', 'yours']),
  pl: words(['ja', 'mnie', 'mi', 'mój', 'moja', 'moje', 'mojego', 'mojej', 'moim', 'my', 'nas', 'nam', 'nasz', 'nasza', 'nasze', 'naszym', 'ty', 'ciebie', 'cię', 'tobie', 'twój', 'twoja', 'twoje', 'twojego', 'wy', 'was', 'wam']),
  de: words(['ich', 'mir', 'mich', 'mein', 'meine', 'meinen', 'meinem', 'wir', 'uns', 'unser', 'unsere', 'unseren', 'du', 'dir', 'dich', 'dein', 'deine', 'ihnen', 'ihr', 'ihre', 'ihren']),
  es: words(['yo', 'me', 'mi', 'mis', 'mío', 'mía', 'nosotros', 'nos', 'nuestro', 'nuestra', 'nuestros', 'tú', 'te', 'ti', 'tu', 'tus', 'usted', 'ustedes', 'vosotros']),
  it: words(['io', 'me', 'mi', 'mio', 'mia', 'miei', 'noi', 'ci', 'nostro', 'nostra', 'nostri', 'tu', 'te', 'ti', 'tuo', 'tua', 'tuoi', 'voi', 'vi']),
  fr: words(['je', 'me', 'moi', 'mon', 'ma', 'mes', 'nous', 'notre', 'nos', 'tu', 'te', 'toi', 'ton', 'ta', 'tes', 'vous', 'votre', 'vos']),
  da: words(['jeg', 'mig', 'min', 'mit', 'mine', 'vi', 'os', 'vor', 'vores', 'du', 'dig', 'din', 'dit', 'dine', 'jer', 'jeres']),
  no: words(['jeg', 'meg', 'min', 'mitt', 'mine', 'vi', 'oss', 'vår', 'våre', 'du', 'deg', 'din', 'ditt', 'dine', 'dere']),
};

// English function words, used to spot a paragraph that was never translated.
//
// This is the failure mode that scales worst: at one translation nobody
// misses an English block, and at nine it goes out unread. A whole English
// Callout body shipped inside a Polish article this way, under a heading that
// had been translated.
//
// Run against extracted prose only, so fenced code, JSX props and inline code
// are already gone: the article that quotes an English CLAUDE.md template is
// correct to do so and must not fire.
const ENGLISH_MARKERS = words([
  'the', 'and', 'with', 'that', 'this', 'from', 'your', 'when', 'which', 'works',
  'about', 'into', 'what', 'where', 'because', 'through', 'without', 'these',
  'their', 'there', 'would', 'should', 'could', 'every', 'while',
]);
const ENGLISH_RATIO = 0.12;

// Pro-drop languages carry person in the verb, not in a pronoun. "Zbudowałem
// CRM" is first person with no pronoun anywhere in it, so counting pronouns
// alone scored every Polish article near zero and every English one high —
// a language artefact reported as a voice problem.
//
// Polish first- and second-person past-tense endings are distinctive enough
// to match directly. The exception is instrumental-case nouns from stems in
// "-ło": "zespołem", "źródłem", "gardłem" all end in -łem without being
// verbs. They are a closed set at this scale and are listed rather than
// guessed at.
const PERSON_VERB = {
  pl: {
    pattern: `${B0}\\p{L}{3,}(?:łem|łam|liśmy|łyśmy|łeś|łaś|liście)${B1}`,
    notVerbs: new Set([
      'zespołem', 'źródłem', 'gardłem', 'czołem', 'dziełem', 'kołem', 'ciałem',
      'działem', 'hasłem', 'krzesłem', 'masłem', 'mydłem', 'osiedlem', 'skrzydłem',
      'światłem', 'szkłem', 'tłem', 'siodłem', 'wiosłem', 'zwierciadłem', 'godłem',
      'jabłem', 'podłem', 'znaczyłem',
    ]),
  },
  es: {
    // Spanish drops the subject pronoun too. First person plural "-amos/-emos/
    // -imos" and first person singular preterite "-é" are the reliable ones;
    // "-o" is far too common a word ending to use.
    pattern: `${B0}\\p{L}{3,}(?:amos|emos|imos)${B1}`,
    notVerbs: new Set(['ramos', 'tramos', 'gramos', 'kilogramos', 'diagramos']),
  },
  it: {
    pattern: `${B0}\\p{L}{3,}(?:iamo|abbiamo|siamo)${B1}`,
    notVerbs: new Set(),
  },
};

// ── Compiled patterns ─────────────────────────────────────────────────────────
//
// Built once per locale at load rather than per file. Every input is a literal
// from the constants above: a fixed conjunction list, a fixed pronoun list and
// a fixed item shape. Nothing here is reachable from user input, and this
// script only ever reads .mdx files already committed to the repository.
//
// nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
const compileRegExp = (source, flags) => new RegExp(source, flags);

const ITEM = '[\\p{L}\\p{N}][\\p{L}\\p{N}-]*(?:\\s+[\\p{L}\\p{N}][\\p{L}\\p{N}-]*){0,2}';

const COMPILED = new Map(
  Object.keys(LANG).map((locale) => {
    // "fast, cheap and effective": three short parallel items. Each item is
    // capped at three words, which is what separates a rhetorical tricolon
    // from an ordinary sentence holding two commas and a conjunction.
    const conj = LANG[locale].and.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    return [
      locale,
      {
        tricolon: compileRegExp(`${B0}${ITEM},\\s${ITEM},?\\s(?:${conj})\\s${ITEM}${B1}`, 'giu'),
        person: PERSON[locale] ? compileRegExp(PERSON[locale], 'giu') : null,
        personVerb: PERSON_VERB[locale] ? compileRegExp(PERSON_VERB[locale].pattern, 'giu') : null,
      },
    ];
  })
);

const ENGLISH_MARKER_RE = compileRegExp(ENGLISH_MARKERS, 'giu');

// ── Text extraction ───────────────────────────────────────────────────────────

/** Strip everything the reader does not read as running sentences. */
function extractProse(raw) {
  let body = raw;

  // Frontmatter. Keep it out entirely — its one-line description would
  // otherwise register as a very short sentence and fake the variance.
  body = body.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');

  // Fenced code, inline code, module syntax, JSX comments.
  body = body.replace(/```[\s\S]*?```/g, '\n');
  body = body.replace(/`[^`\n]*`/g, ' ');
  body = body.replace(/^import\s+.*$/gm, '');
  body = body.replace(/^export\s+.*$/gm, '');
  body = body.replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ');

  // JSX. A component's props are not prose; its children usually are, so drop
  // the tags and keep what sits between them.
  body = body.replace(/<\/?[A-Za-z][\w.]*(?:\s[^>]*?)?\/?>/g, ' ');

  // Markdown links and images: keep the visible text, drop the target.
  body = body.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');
  body = body.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

  // Emphasis and blockquote markers.
  body = body.replace(/[*_]{1,3}/g, '');
  body = body.replace(/^\s{0,3}>\s?/gm, '');

  return body;
}


/**
 * Quoted strings inside JSX blocks. These render as visible list items, labels
 * and captions, and extractProse deliberately drops them along with the tags,
 * so they need a pass of their own over the raw source. Missing this let five
 * English bullet points ship inside a Polish article.
 */
function extractJsxStrings(raw) {
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').replace(/```[\s\S]*?```/g, '');
  const out = [];
  for (const block of body.match(/<[A-Z][\w.]*[\s\S]*?\/>/g) ?? []) {
    for (const m of block.matchAll(/"([^"\\]{12,})"|'([^'\\]{12,})'/g)) {
      const value = m[1] ?? m[2];
      // Skip anything that is plainly not prose: paths, URLs, identifiers.
      if (/^[/#]|^https?:|^[a-z-]+$/i.test(value)) continue;
      out.push(value);
    }
  }
  return out;
}

/** Headings, read before they are stripped out of the prose. */
function extractHeadings(body) {
  return [...body.matchAll(/^#{2,4}\s+(.+?)\s*$/gm)].map((m) => m[1].trim());
}

/**
 * Paragraphs of running prose. Lists and tables are excluded on purpose: a
 * bulleted list is supposed to have parallel items of similar length, and
 * scoring it for uniformity would punish correct formatting.
 */
function extractParagraphs(body) {
  return body
    .replace(/^#{1,6}\s+.*$/gm, '')
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 0)
    .filter((p) => !/^([-*+]|\d+\.)\s/.test(p))
    .filter((p) => !p.startsWith('|'))
    .filter((p) => !/^:{3}/.test(p));
}

/**
 * Sentence split. Abbreviations and decimals would otherwise fragment a
 * sentence and fake the variance this script exists to measure, so a short
 * list of known abbreviations is protected first and the split then requires
 * whitespace plus a capital or an opening quote.
 */
const ABBREV = new RegExp(
  `${B0}(?:np|itp|itd|tzn|tj|ok|nr|ul|dr|prof|inż|mgr|st|e\\.g|i\\.e|vs|etc|Mr|Mrs|Ms|Dr|Prof|St|Inc|Ltd|Co|approx|fig|No|z\\.B|u\\.a|bzw|ca|evt|osv|f\\.eks)\\.\\s`,
  'giu'
);
const DOT = '￹';

function splitSentences(paragraph) {
  const guarded = paragraph
    .replace(ABBREV, (m) => m.replace(/\./g, DOT))
    .replace(/(\d)\.(\d)/g, `$1${DOT}$2`);
  return guarded
    .split(/(?<=[.!?…])\s+(?=[«"'([]?[\p{Lu}0-9])/u)
    .map((s) => s.split(DOT).join('.').trim())
    .filter(Boolean);
}

/**
 * Content words of a sentence, lowercased and folded, minus the very short
 * tokens that are function words in every language here. Used to compare a
 * paragraph's first sentence with its last.
 */
function contentWords(text) {
  const m = fold(text.toLowerCase()).match(/[\p{L}\p{N}][\p{L}\p{N}'-]*/gu) ?? [];
  // Truncated to a crude stem. Polish, Spanish and Italian inflect the same
  // lemma into half a dozen surface forms, so exact-token comparison found
  // no repetition in a Polish paragraph that repeated itself twice over.
  // Five characters is enough to keep distinct words apart at this length
  // while collapsing "organizacje" and "organizacji".
  return new Set(m.filter((w) => w.length > 3).map((w) => w.slice(0, 5)));
}

function countWords(text) {
  const m = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu);
  return m ? m.length : 0;
}

// ── Metrics ───────────────────────────────────────────────────────────────────

function stats(values) {
  if (values.length === 0) return { mean: 0, sd: 0, cv: 0 };
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  const sd = Math.sqrt(variance);
  return { mean, sd, cv: mean > 0 ? sd / mean : 0 };
}

function detectLocale(file) {
  const rel = relative(CONTENT_DIR, file);
  if (!rel.startsWith('..')) {
    const parts = rel.split(sep);
    return parts.length > 1 ? parts[0] : 'en';
  }
  // A file passed in from outside the collection: take the locale from its
  // parent directory when that names one, and fall back to English. Without
  // this, an ad-hoc file scored zero on every language-dependent metric and
  // looked immaculate.
  const parent = file.split(sep).slice(-2)[0];
  return parent in LANG ? parent : 'en';
}

function analyse(file, raw) {
  const locale = detectLocale(file);
  const lang = LANG[locale] ?? null;
  const compiled = COMPILED.get(locale) ?? null;

  const prose = extractProse(raw);
  const headings = extractHeadings(prose);
  const paragraphs = extractParagraphs(prose);

  const perParagraph = paragraphs.map(splitSentences);
  const sentenceLengths = perParagraph.flat().map(countWords).filter((n) => n > 0);

  const words = sentenceLengths.reduce((a, b) => a + b, 0);
  const sentenceStats = stats(sentenceLengths);

  // Short sentences. Operator prose punches; generated prose rarely drops
  // below a full clause.
  const shortSentences = sentenceLengths.filter((n) => n <= 5).length;

  // Mic drop: a one-sentence paragraph of eight words or fewer, landing right
  // after a paragraph that ran three sentences or more.
  let micDrops = 0;
  for (let i = 1; i < paragraphs.length; i += 1) {
    if (perParagraph[i].length === 1 && countWords(paragraphs[i]) <= 8 && perParagraph[i - 1].length >= 3) {
      micDrops += 1;
    }
  }

  // Paragraph openers. Three paragraphs opening on the same word is a rhythm
  // nobody chooses on purpose.
  const openerCounts = new Map();
  for (const p of paragraphs) {
    const o = (p.match(/^[\p{L}]+/u)?.[0] ?? '').toLowerCase();
    if (o) openerCounts.set(o, (openerCounts.get(o) ?? 0) + 1);
  }
  const repeatedOpeners = [...openerCounts.values()].filter((n) => n >= 3).length;

  // Tricolon: "A, B and C" inside one sentence.
  let tricolons = 0;
  if (compiled) tricolons = (prose.match(compiled.tricolon) ?? []).length;

  // Antithesis: "not X but Y".
  let antitheses = 0;
  if (lang) for (const re of lang.antithesis) antitheses += (prose.match(re) ?? []).length;

  const promiseHeadings = headings.filter(isVagueHeading);

  // Paragraphs left in English inside a translation. Short paragraphs are
  // skipped: a two-word line cannot carry a reliable ratio, and product names
  // are supposed to stay English.
  const untranslated = [];
  if (locale !== 'en') {
    const rate = (text) => {
      const total = countWords(text);
      return total === 0 ? 0 : (text.match(ENGLISH_MARKER_RE) ?? []).length / total;
    };
    for (const paragraph of paragraphs) {
      if (countWords(paragraph) < 12) continue;
      if (rate(paragraph) > ENGLISH_RATIO) untranslated.push(paragraph.slice(0, 80));
    }
    // A prop string is short, so the ratio alone is unreliable on one of them.
    // They are judged together: a component whose strings are collectively
    // English has not been translated, and one English label among Polish ones
    // is usually a product name.
    const props = extractJsxStrings(raw);
    const english = props.filter((v) => countWords(v) >= 4 && rate(v) > ENGLISH_RATIO);
    if (english.length >= 2) untranslated.push(...english.map((v) => v.slice(0, 80)));
  }

  // Circular paragraphs. The spec says a paragraph's last sentence must carry
  // the so-what, "not a summary of what you just said". A paragraph whose
  // closing sentence reuses most of the content words of its opening one is
  // doing exactly that, and it is the single most reliable generated-prose
  // shape that survives translation.
  let circularParagraphs = 0;
  for (const sents of perParagraph) {
    if (sents.length < 3) continue;
    const last = contentWords(sents[sents.length - 1]);
    if (last.size < 4) continue;
    const earlier = new Set();
    for (const sent of sents.slice(0, -1)) for (const w of contentWords(sent)) earlier.add(w);
    let reused = 0;
    for (const w of last) if (earlier.has(w)) reused += 1;
    if (reused / last.size >= CIRCULAR_OVERLAP) circularParagraphs += 1;
  }

  // Register. Impersonal prose is off-voice by the spec, not by taste.
  let personHits = compiled?.person ? (prose.match(compiled.person) ?? []).length : 0;
  if (compiled?.personVerb) {
    const { notVerbs } = PERSON_VERB[locale];
    const hits = prose.match(compiled.personVerb) ?? [];
    personHits += hits.filter((w) => !notVerbs.has(w.toLowerCase())).length;
  }
  const emDashes = (raw.match(/—/g) ?? []).length;

  const per1k = (n) => (words > 0 ? (n * 1000) / words : 0);

  return {
    file: relative(ROOT, file),
    locale,
    words,
    sentences: sentenceLengths.length,
    paragraphs: paragraphs.length,
    meanSentence: sentenceStats.mean,
    cv: sentenceStats.cv,
    shortRatio: sentenceLengths.length ? shortSentences / sentenceLengths.length : 0,
    micDrops,
    repeatedOpeners,
    tricolons,
    tricolonsPer1k: per1k(tricolons),
    antitheses,
    antithesesPer1k: per1k(antitheses),
    circularParagraphs,
    untranslated: untranslated.length,
    untranslatedText: untranslated,
    personPer1k: per1k(personHits),
    personHits,
    promiseHeadings: promiseHeadings.length,
    promiseHeadingText: promiseHeadings,
    emDashes,
    lexicalScored: Boolean(lang),
  };
}

// ── File discovery ────────────────────────────────────────────────────────────

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith('.mdx')) out.push(full);
  }
  return out;
}

function diffFiles(base, head) {
  const out = execFileSync('git', ['diff', '--name-only', '--diff-filter=d', base, head], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return out
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^src\/content\/insights\/.*\.mdx$/.test(l))
    .map((l) => join(ROOT, l));
}

// ── Thresholds ────────────────────────────────────────────────────────────────
//
// Every number below was read off this corpus and checked against a control
// pair of deliberately generated articles, one English and one Polish. The
// derivation and the control scores are in docs/copy-quality.md; re-run the
// percentile pass there when the corpus has grown enough to move them.
//
// The lines sit at roughly the 5th percentile (for measures where low is bad)
// or the 95th (where high is bad), so a normal article passes and the tail
// gets read. A gate that flagged a third of the corpus would be ignored
// inside a week.
const T = {
  cvReview: 0.51,        // corpus p10
  cvInvestigate: 0.47,   // below corpus p05 (0.48); control scored 0.39-0.40
  circular: 1,           // corpus max is 1 per file; control had 2
  micDrops: 5,           // corpus p90
  tricolonsPer1k: 14.6,  // corpus p95
  antithesesPer1k: 2.0,  // above corpus p95 (1.16); control scored 2.2-3.0
  personFloorRatio: 0.3, // share of the locale's own median, see below
  minFilesForLocaleBaseline: 8,
};

/**
 * Per-locale median of first- and second-person markers.
 *
 * A global floor cannot work here. Polish and Spanish are pro-drop: person
 * lives in the verb ending, and even with the verb patterns above, a Polish
 * article registers roughly half the markers of the English one it was
 * translated from. Comparing a Polish file against an English-derived number
 * would report a grammar difference as a voice problem.
 *
 * So each file is measured against its own language, and only when that
 * language has enough articles for a median to mean anything. A locale with
 * two files gets its number printed and no verdict.
 */
function localeBaselines(results) {
  const byLocale = new Map();
  for (const r of results) {
    if (!byLocale.has(r.locale)) byLocale.set(r.locale, []);
    byLocale.get(r.locale).push(r.personPer1k);
  }
  const out = new Map();
  for (const [locale, values] of byLocale) {
    if (values.length < T.minFilesForLocaleBaseline) continue;
    const sorted = [...values].sort((a, b) => a - b);
    out.set(locale, sorted[Math.floor(sorted.length / 2)]);
  }
  return out;
}

function verdict(r, baselines) {
  const flags = [];

  // Sentence rhythm. Needs enough sentences for a variance to mean something;
  // a 200-word note is not evidence either way.
  if (r.sentences >= 20) {
    if (r.cv < T.cvInvestigate) flags.push(`sentence rhythm flat (cv ${r.cv.toFixed(2)})`);
    else if (r.cv < T.cvReview) flags.push(`sentence rhythm even (cv ${r.cv.toFixed(2)})`);
  }

  if (r.circularParagraphs > T.circular) {
    flags.push(`${r.circularParagraphs} paragraphs that close on what they already said`);
  }
  if (r.micDrops > T.micDrops) flags.push(`${r.micDrops} mic-drop paragraphs`);
  if (r.tricolonsPer1k > T.tricolonsPer1k) flags.push(`tricolons ${r.tricolonsPer1k.toFixed(1)}/1k`);
  if (r.antithesesPer1k > T.antithesesPer1k) {
    flags.push(`"not X but Y" ${r.antithesesPer1k.toFixed(1)}/1k`);
  }
  if (r.promiseHeadings > 0) flags.push(`${r.promiseHeadings} heading(s) that name no subject`);

  // Hard ban in docs/10-tone-of-voice.md, so this one is not a matter of degree.
  if (r.emDashes > 0) flags.push(`${r.emDashes} em dash(es)`);

  // Neither is this: an English paragraph inside a translation is a defect the
  // reader sees, not a stylistic preference.
  if (r.untranslated > 0) flags.push(`${r.untranslated} paragraph(s) still in English`);

  const median = baselines.get(r.locale);
  if (median !== undefined && median > 0 && r.personPer1k < median * T.personFloorRatio) {
    flags.push(
      `impersonal register (${r.personPer1k.toFixed(1)}/1k against ${median.toFixed(1)} for ${r.locale})`
    );
  }

  return flags;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const strict = argv.includes('--strict');
const diffIdx = argv.indexOf('--diff');

let files;
let mode;
if (diffIdx !== -1 && argv[diffIdx + 1] && argv[diffIdx + 2]) {
  files = diffFiles(argv[diffIdx + 1], argv[diffIdx + 2]);
  mode = 'changed files';
} else {
  const explicit = argv.filter((a) => a.endsWith('.mdx'));
  if (explicit.length) {
    files = explicit.map((f) => (f.startsWith('/') ? f : join(ROOT, f)));
    mode = `${explicit.length} file(s)`;
  } else {
    files = walk(CONTENT_DIR).sort();
    mode = 'the whole insights corpus';
  }
}

const results = files.map((f) => analyse(f, readFileSync(f, 'utf8')));

if (asJson) {
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

if (results.length === 0) {
  console.log('### Structural copy check\n\nNo article content in this change. Nothing to report.');
  process.exit(0);
}

console.log('### Structural copy check');
console.log('');
console.log(`Scope: ${mode}. These tells survive translation, so every locale is measured.`);
console.log('');
console.log('| file | lang | words | sent. | mean | cv | 1st/2nd person per 1k | circular | mic | tricolon | not-but | em dash |');
console.log('|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|');

const baselines = localeBaselines(results);
const flagged = [];
for (const r of [...results].sort((a, b) => a.cv - b.cv)) {
  const f = verdict(r, baselines);
  if (f.length) flagged.push([r, f]);
  const mark = f.length ? ' ⚠️' : '';
  console.log(
    `| \`${r.file.replace('src/content/insights/', '')}\` | ${r.locale} | ${r.words} | ${r.sentences} | ` +
      `${r.meanSentence.toFixed(1)} | ${r.cv.toFixed(2)}${mark} | ${r.personPer1k.toFixed(1)} | ` +
      `${r.circularParagraphs} | ${r.micDrops} | ${r.tricolons} | ${r.antitheses} | ${r.emDashes} |`
  );
}

console.log('');
if (flagged.length) {
  console.log('Worth reading before it ships:');
  console.log('');
  for (const [r, f] of flagged) {
    console.log(`- \`${r.file.replace('src/content/insights/', '')}\` — ${f.join('; ')}`);
    for (const h of r.promiseHeadingText) console.log(`  - heading: "${h}"`);
    for (const t of r.untranslatedText) console.log(`  - English: "${t}..."`);
  }
  console.log('');
  console.log(
    'None of these is an error on its own. A tricolon can be a quotation and a one-line ' +
      'paragraph can be the right call. The signal is several of them landing in one file.'
  );
} else {
  console.log('Nothing flagged. Every file in scope varies its sentence length like prose somebody wrote.');
}

const worst = [...results].filter((r) => r.sentences >= 20).sort((a, b) => a.cv - b.cv)[0];
if (worst) {
  console.log('');
  console.log(
    `Flattest rhythm in scope: \`${worst.file.replace('src/content/insights/', '')}\` at cv ${worst.cv.toFixed(2)}.`
  );
}

if (strict && flagged.length) process.exit(1);
process.exit(0);
