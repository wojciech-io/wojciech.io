#!/usr/bin/env node
/**
 * Build-time generator: scans recent git history on main for squash-merged PRs
 * and writes src/data/shipped.json. Consumed by /roadmap to render a
 * self-updating "Shipped recently" section.
 *
 * Squash commit format expected: `type(scope): description (#NNN)`
 *
 * Fail-soft: if git is missing (e.g. CF Pages build without history),
 * writes an empty array so the page can render a graceful fallback.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/data/shipped.json');
const WINDOW_DAYS = 14;
const MAX_ENTRIES = 12;

const SQUASH_RE = /^(\w+)(?:\(([^)]+)\))?:\s*(.+?)\s*\(#(\d+)\)$/;

let entries = [];
try {
  const raw = execFileSync(
    'git',
    ['log', `--since=${WINDOW_DAYS} days ago`, '--no-merges', '--pretty=format:%s|%H|%aI'],
    { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
  );
  for (const line of raw.split('\n')) {
    const [subject, sha, iso] = line.split('|');
    if (!subject) continue;
    const m = subject.match(SQUASH_RE);
    if (!m) continue;
    const [, type, scope, description, number] = m;
    entries.push({
      number: Number(number),
      type,
      scope: scope || null,
      title: description,
      mergedAt: iso,
      sha: sha.slice(0, 7),
    });
  }
  entries = entries.slice(0, MAX_ENTRIES);
  console.log(`[shipped] ${entries.length} squash-merged PR(s) in last ${WINDOW_DAYS} days`);
} catch (err) {
  console.warn(`[shipped] git history unavailable, writing empty list (${err.message})`);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(entries, null, 2) + '\n');
