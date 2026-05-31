// Voice polish pass for translated PL insights.
// Cuts DeepL stiffness and AI-slop phrasing per docs/10-tone-of-voice.md:
// short declarative sentences, informal ty/twój, no consultant hedging,
// no padding verbs. Edits in place — re-runnable safely.
//
// Usage: node scripts/i18n/polish-pl-voice.mjs

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PL_DIR = join(HERE, '..', '..', 'src/content/insights/pl');

// Patterns are applied in order. Earlier = higher priority.
// Each entry: [regex, replacement]. Avoid edits that would damage MDX/JSX.
const PATTERNS = [
  // ── DeepL formality reflexes ───────────────────────────────────────────
  [/\bza pośrednictwem\b/g, 'przez'],
  [/\bz wykorzystaniem\b/g, 'przez'],
  [/\bw celu osiągnięcia\b/g, 'żeby osiągnąć'],
  [/\bw celu uzyskania\b/g, 'żeby uzyskać'],
  [/\bw celu obsługi\b/g, 'do obsługi'],
  [/\bw celu\b/g, 'żeby'],
  [/\bw ramach\b/g, 'w'],
  [/\bw odniesieniu do\b/g, 'wobec'],
  [/\bw przypadku, gdy\b/g, 'gdy'],
  [/\bw przypadku\b/g, 'gdy'],
  [/\bw zakresie\b/g, 'w'],
  [/\bw oparciu o\b/g, 'na'],
  [/\bna podstawie tego\b/g, 'dlatego'],
  [/\bumożliwia\b/g, 'pozwala'],
  [/\bumożliwiają\b/g, 'pozwalają'],
  [/\bumożliwiające\b/g, 'pozwalające'],
  [/\bzapewnia\b/g, 'daje'],
  [/\bzapewniają\b/g, 'dają'],
  [/\bstanowi to\b/g, 'to'],
  [/\bstanowią one\b/g, 'są to'],
  [/\bjest to (?=narzędzie|rozwiązanie|system|plik|warstwa)/g, 'to '],
  [/\bkonieczne jest, aby\b/g, 'trzeba'],
  [/\bkonieczne jest\b/g, 'trzeba'],
  [/\bnależy\s+(?=[a-ząćęłńóśźż])/g, 'trzeba '],
  [/\bw celu zapewnienia\b/g, 'żeby zapewnić'],

  // ── AI slop intros / hedges (CLAUDE.md bans) ──────────────────────────
  [/\bWarto podkreślić, że\b/gi, ''],
  [/\b[Cc]o ważne,\s*/g, ''],
  [/\bNależy zauważyć, że\b/gi, ''],
  [/\bNależy podkreślić, że\b/gi, ''],
  [/\bWarto zaznaczyć, że\b/gi, ''],
  [/\bNa zakończenie\b/gi, 'Na koniec'],
  [/\bPodsumowując,\s*/g, ''],
  [/\bReasumując,\s*/g, ''],
  [/\bW podsumowaniu,\s*/g, ''],

  // ── Consultant hedging ────────────────────────────────────────────────
  [/\bmoże potencjalnie\b/g, 'może'],
  [/\bpotencjalnie\s+(?=[a-ząćęłńóśźż])/g, ''],
  [/\bistnieje możliwość, że\b/g, 'może'],
  [/\bbyć może warto\b/g, 'warto'],

  // ── Verb bloat ────────────────────────────────────────────────────────
  [/\bdokonuje (\w+ia)\b/g, '$1'], // "dokonuje analizy" -> "analiza"
  [/\bprzeprowadza (\w+ę)\b/g, 'robi $1'],
  [/\brealizuje zadanie\b/g, 'wykonuje'],
  [/\bsą wykonywane\b/g, 'robią się'],

  // ── Brand term cleanups DeepL still slips through ─────────────────────
  [/\bplatformy typu Cloudflare\b/g, 'Cloudflare'],
  [/\busługi typu AI\b/g, 'AI'],
  [/\bsystemu typu CRM\b/g, 'CRM'],
  [/\bsystemów typu CRM\b/g, 'CRM'],
  [/\bsystemach typu CRM\b/g, 'CRM'],
  [/\bw programie „CRM"/g, 'w CRM'],
  [/\bw programie CRM\b/g, 'w CRM'],

  // ── Double spaces and orphan punctuation from removals ────────────────
  [/  +/g, ' '],
  [/\s+([.,;:!?])/g, '$1'],
  [/^\s+$/gm, ''],

  // ── En-dash inside prose used as a separator (apposition) ─────────────
  // EN dash is allowed but `– ` between clauses reads as DeepL artifact.
  // Replace ` – ` (with spaces) with `: ` or comma based on simple heuristic.
  // Keep en-dashes inside ranges like 3–4.
  [/\s+–\s+/g, ': '],
];

function polish(text) {
  // Protect frontmatter, code fences, and JSX blocks from edits that could
  // damage syntax. Apply patterns only to plain markdown paragraphs.
  const lines = text.split('\n');
  const out = [];
  let inFm = false;
  let inFence = false;
  let inJsx = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    // Frontmatter
    if (line.trim() === '---' && i === 0) { inFm = true; out.push(line); i++; continue; }
    if (inFm) {
      if (line.trim() === '---') { inFm = false; out.push(line); i++; continue; }
      // Apply only safe patterns to title/description fields (translation of strings already done).
      out.push(line); i++; continue;
    }
    // Code fence
    if (/^```/.test(line)) { inFence = !inFence; out.push(line); i++; continue; }
    if (inFence) { out.push(line); i++; continue; }
    // JSX block — skip apply to keep attributes safe
    if (/^<[A-Z]/.test(line)) inJsx++;
    if (inJsx > 0) {
      out.push(line);
      // detect end of jsx block on this line
      if (/\/>\s*$/.test(line)) inJsx = Math.max(0, inJsx - 1);
      // We also accept </Component> closing on its own line
      if (/^<\/[A-Z]/.test(line.trim())) inJsx = Math.max(0, inJsx - 1);
      i++; continue;
    }
    // Plain markdown line — apply polish
    let polished = line;
    for (const [re, rep] of PATTERNS) polished = polished.replace(re, rep);
    out.push(polished);
    i++;
  }
  return out.join('\n');
}

const files = readdirSync(PL_DIR).filter((f) => f.endsWith('.mdx'));
let totalChanges = 0;
for (const f of files) {
  const path = join(PL_DIR, f);
  const before = readFileSync(path, 'utf8');
  const after = polish(before);
  if (after !== before) {
    writeFileSync(path, after);
    const diff = Math.abs(before.length - after.length);
    totalChanges += diff;
    console.log(`[${f}] polished (${diff} chars changed)`);
  } else {
    console.log(`[${f}] no changes`);
  }
}
console.log(`Total: ~${totalChanges} chars adjusted across ${files.length} files`);
