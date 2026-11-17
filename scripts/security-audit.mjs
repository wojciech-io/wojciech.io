#!/usr/bin/env node
// Production-focused dependency audit gate.
//
// `npm audit --audit-level=high` fails on advisories in the local build
// toolchain (vite, esbuild, ws via miniflare/wrangler, the Cloudflare adapter).
// None of those ship to the Cloudflare Workers/Pages runtime: they are bundlers,
// dev servers, and local emulators. Several also have no non-breaking fix
// (e.g. the esbuild dev-server advisory), so a strict gate can never go green.
//
// This gate fails on any high/critical advisory in a RUNTIME dependency, while
// waiving a documented allowlist of build/dev-only packages. Add to the
// allowlist only for tooling that provably never reaches production.

import { execSync } from 'node:child_process';

const DEV_ONLY = new Set([
  'vite',
  'esbuild',
  'ws',
  'miniflare',
  'wrangler',
  '@astrojs/cloudflare',
  '@cloudflare/vite-plugin',
  'launch-editor',
  // undici reaches the tree only through the Cloudflare dev toolchain
  // (miniflare → wrangler → @cloudflare/vite-plugin, all waived above). The
  // Workers/Pages runtime provides its own fetch and never bundles undici, so
  // its advisories do not affect production. miniflare hard-pins the version,
  // so an npm `override` cannot lift it without forking the dev tool.
  'undici',
  // sharp reaches the tree in two copies. The one this project imports, and the
  // one Astro uses, are both 0.35.4 and therefore already patched. The only
  // vulnerable copy is 0.35.2, pulled in by miniflare -> wrangler (both waived
  // above) inside the growthhub-cron workspace. Fixing it means a semver-major
  // wrangler bump for a dev emulator that never ships to Workers/Pages.
  'sharp',
  // fast-uri reaches the tree only through commitlint, a devDependency that
  // lints commit messages in CI (@commitlint/cli -> load -> config-validator
  // -> ajv -> fast-uri). It is never imported by the site and never bundled
  // into the Workers/Pages output. ajv pins the range, so an npm `override`
  // cannot lift it without breaking commitlint's own schema validation.
  'fast-uri',
]);

let raw = '';
try {
  raw = execSync('npm audit --json', { encoding: 'utf8' });
} catch (err) {
  // npm audit exits non-zero whenever advisories exist; the JSON is on stdout.
  raw = err.stdout?.toString() ?? '';
}

if (!raw) {
  console.error('security-audit: no output from `npm audit --json`');
  process.exit(2);
}

// Advisories waived by ID, not by package name. A package counts as waived only
// when every high/critical path to it runs through one of these, so the same
// packages still fail the gate on any other advisory. Each entry needs a reason
// and an exit condition.
const WAIVED_ADVISORIES = new Map([
  [
    // picomatch ReDoS through repeated extglobs. No patched release exists: the
    // range is <=4.0.7 and 4.0.7 is the newest version. picomatch runs only at
    // build and test time, on glob patterns written in this repo (Astro content
    // globs, Vite, Vitest). Every site builds static and Pages Functions do not
    // import it. Remove this entry once picomatch ships a fix.
    'GHSA-fc5q-39xc-vjpf',
    'picomatch ReDoS, no patched release, build-time only',
  ],
]);

const report = JSON.parse(raw);
const byName = report.vulnerabilities ?? {};
const vulns = Object.values(byName);
const isSevere = (severity) => severity === 'high' || severity === 'critical';
const severe = vulns.filter((v) => isSevere(v.severity));

// True when every high/critical cause of `name` is a waived advisory, either
// directly or through dependencies that are themselves only waived.
function onlyWaivedAdvisories(name, path = new Set()) {
  if (path.has(name)) return true;
  const v = byName[name];
  if (!v) return true;
  const next = new Set(path).add(name);
  return v.via.every((via) => {
    if (typeof via === 'string') {
      const dep = byName[via];
      return !dep || !isSevere(dep.severity) || onlyWaivedAdvisories(via, next);
    }
    const id = String(via.url ?? '').split('/').pop();
    return !isSevere(via.severity) || WAIVED_ADVISORIES.has(id);
  });
}

const waived = severe.filter((v) => DEV_ONLY.has(v.name));
const runtime = severe.filter((v) => !DEV_ONLY.has(v.name));
const waivedByAdvisory = runtime.filter((v) => onlyWaivedAdvisories(v.name));
const blocking = runtime.filter((v) => !onlyWaivedAdvisories(v.name));

if (waived.length) {
  console.log(
    `Waived ${waived.length} build/dev-only advisory(ies): ${waived.map((v) => `${v.name} (${v.severity})`).join(', ')}`,
  );
}

if (waivedByAdvisory.length) {
  console.log(
    `Waived by advisory ID (${[...WAIVED_ADVISORIES.keys()].join(', ')}): ${waivedByAdvisory.map((v) => v.name).join(', ')}`,
  );
}

if (blocking.length) {
  console.error('\nHigh/critical advisories in RUNTIME dependencies:');
  for (const v of blocking) console.error(`  ${v.severity.padEnd(8)} ${v.name}`);
  console.error('\nFix these before merging (npm audit for detail).');
  process.exit(1);
}

console.log('OK: no high/critical advisories in runtime dependencies.');
