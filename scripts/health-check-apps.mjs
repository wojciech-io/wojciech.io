#!/usr/bin/env node
/**
 * Health check for portfolio app URLs
 * Verifies all live apps respond with 2xx/3xx status codes
 */

import fs from 'fs';
import { request } from 'https';
import { request as httpRequest } from 'http';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

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
  const idMatch = lines[i].match(/id:\s*'([^']+)'/);
  if (idMatch) {
    let app = { id: idMatch[1] };
    for (let j = i; j < Math.min(i + 30, lines.length); j++) {
      const urlMatch = lines[j].match(/url:\s*'([^']+)'/);
      if (urlMatch) app.url = urlMatch[1];
      if (lines[j].includes("status: 'live'") && app.url) {
        apps.push(app);
        break;
      }
    }
  }
}

console.log(`\nChecking ${apps.length} live portfolio apps...\n`);
const results = await Promise.all(apps.map(a => checkUrl(a.url)));

let healthy = true;
results.forEach((r, i) => {
  const status = r.ok ? '✅' : '❌';
  console.log(`${status} ${apps[i].id.padEnd(18)} ${r.url}`);
  if (!r.ok) healthy = false;
});

console.log(`\n${healthy ? '✅ Portfolio healthy' : '❌ Check failed'}\n`);
process.exit(healthy ? 0 : 1);
