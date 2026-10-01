#!/usr/bin/env node
/**
 * Health check for portfolio app URLs
 * Verifies all live apps respond with 2xx/3xx status codes
 */

import fs from 'fs';
import { request } from 'https';
import { request as httpRequest } from 'http';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

/* The URLs below are parsed out of a checked-in source file and then requested
 * from whoever runs this. CodeQL flags that flow and it is right to: an edit to
 * apps-data.ts, by anyone, redirects these requests without touching this file.
 *
 * The allowlist is the guard. A host that is not on it is reported and skipped
 * rather than contacted. Adding a portfolio app means adding its host here on
 * purpose, which is the point. */
const ALLOWED_HOSTS = new Set([
  'wojciech.io',
  'gh.wojciech.io',
  'notch.wojciech.io',
  'github.com',
  'anprojekt.com.pl',
  'ads-assistant-three.vercel.app',
  'camper-rental-weld.vercel.app',
  'relora-jet.vercel.app',
  'ciryam.lovable.app',
  'sabiszop.netlify.app',
]);

/** Only https or http, and only a host this script is meant to reach. */
function allowedUrl(raw) {
  try {
    const { protocol, hostname } = new URL(raw);
    if (protocol !== 'https:' && protocol !== 'http:') return false;
    return ALLOWED_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

async function checkUrl(url) {
  return new Promise((resolve) => {
    const proto = url.startsWith('https') ? request : httpRequest;
    const req = proto(url, 
      { 
        timeout: 5000,
        headers: { 'User-Agent': UA }
      }, 
      (res) => {
        resolve({ url, ok: res.statusCode < 400 });
      }
    ).on('error', () => resolve({ url, ok: false }));
    req.end();
  });
}

const content = fs.readFileSync('./apps/app/src/lib/apps-data.ts', 'utf8');
const apps = [];
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  // Anchored to the start of the line on purpose: an unanchored /id:/ also
  // matches the tail of `grid:`, and the icon map above the app list has one.
  // That pulled an SVG path in as an app id every time this ran.
  const idMatch = lines[i].match(/^\s*id:\s*'([^']+)'/);
  if (idMatch) {
    let app = { id: idMatch[1] };
    for (let j = i; j < Math.min(i + 30, lines.length); j++) {
      const urlMatch = lines[j].match(/^\s*url:\s*'([^']+)'/);
      if (urlMatch) app.url = urlMatch[1];
      if (lines[j].includes("status: 'live'") && app.url) {
        apps.push(app);
        break;
      }
    }
  }
}

const skipped = apps.filter((a) => !allowedUrl(a.url));
const checked = apps.filter((a) => allowedUrl(a.url));

if (skipped.length > 0) {
  console.log('\nSkipped, host not on the allowlist in this script:');
  for (const a of skipped) console.log(`   ${a.id.padEnd(18)} ${a.url}`);
}

console.log(`\nChecking ${checked.length} live portfolio apps...\n`);
const results = await Promise.all(checked.map((a) => checkUrl(a.url)));

let healthy = true;
results.forEach((r, i) => {
  const status = r.ok ? '✅' : '❌';
  console.log(`${status} ${checked[i].id.padEnd(18)} ${r.url}`);
  if (!r.ok) healthy = false;
});

// A skipped app is not a healthy app: it is one nobody checked.
if (skipped.length > 0) healthy = false;

console.log(`\n${healthy ? '✅ Portfolio healthy' : '❌ Check failed'}\n`);
process.exit(healthy ? 0 : 1);
