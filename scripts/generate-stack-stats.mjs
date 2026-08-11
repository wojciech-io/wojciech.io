#!/usr/bin/env node
/**
 * Build-time generator: counts the automated tests and writes
 * src/data/stack-stats.json. Consumed by /stack, which claims the page is
 * "verified from the repo, not from memory" and so must not carry a number
 * anybody has to remember to update. The previous hardcoded 524 had drifted
 * to 674 by the time anyone checked.
 *
 * `vitest list` enumerates the suite without executing it, so this stays a
 * build-time read and never turns a flaky test into a failed deploy.
 *
 * Fail-soft: on any error the existing JSON is left alone, so a build without
 * devDependencies keeps the last known-good count instead of writing a zero.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/data/stack-stats.json');

function countTests() {
  // One line per test case. `--reporter=json` would be sturdier, but vitest
  // writes it to a file rather than stdout under `list`, so the line count of
  // the default reporter is what is actually available here.
  const out = execFileSync('npx', ['vitest', 'list'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    timeout: 120_000,
  });
  return out.split('\n').filter((line) => line.trim().length > 0).length;
}

let previous = null;
try {
  previous = JSON.parse(readFileSync(OUT, 'utf8'));
} catch {
  previous = null;
}

try {
  const tests = countTests();
  if (!Number.isFinite(tests) || tests <= 0) throw new Error(`implausible count: ${tests}`);
  writeFileSync(OUT, `${JSON.stringify({ tests }, null, 2)}\n`);
  console.log(`[stack-stats] ${tests} automated tests`);
} catch (error) {
  if (previous && Number.isFinite(previous.tests)) {
    console.warn(`[stack-stats] count failed (${error.message}); keeping ${previous.tests}`);
  } else {
    // No prior value to fall back on: write one so the build still renders,
    // and make the placeholder obviously wrong rather than quietly plausible.
    writeFileSync(OUT, `${JSON.stringify({ tests: 0 }, null, 2)}\n`);
    console.warn(`[stack-stats] count failed (${error.message}); wrote 0`);
  }
}
