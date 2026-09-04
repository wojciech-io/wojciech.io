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

const report = JSON.parse(raw);
const vulns = Object.values(report.vulnerabilities ?? {});
const severe = vulns.filter((v) => v.severity === 'high' || v.severity === 'critical');

const blocking = severe.filter((v) => !DEV_ONLY.has(v.name));
const waived = severe.filter((v) => DEV_ONLY.has(v.name));

if (waived.length) {
  console.log(
    `Waived ${waived.length} build/dev-only advisory(ies): ${waived.map((v) => `${v.name} (${v.severity})`).join(', ')}`,
  );
}

if (blocking.length) {
  console.error('\nHigh/critical advisories in RUNTIME dependencies:');
  for (const v of blocking) console.error(`  ${v.severity.padEnd(8)} ${v.name}`);
  console.error('\nFix these before merging (npm audit for detail).');
  process.exit(1);
}

console.log('OK: no high/critical advisories in runtime dependencies.');
