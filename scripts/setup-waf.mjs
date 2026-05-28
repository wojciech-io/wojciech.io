#!/usr/bin/env node
/**
 * setup-waf.mjs — deploy Cloudflare WAF rate-limit rules for wojciech.io.
 *
 * Uses CF Rate Limiting API v1 (available on Pro+).
 * Creates rules in "simulate" mode by default. Switch to "ban" once confirmed.
 *
 * Usage:
 *   CF_API_TOKEN=<token_with_Zone:Edit> \
 *   CF_ZONE_ID=<zone_id> \
 *   [DRY_RUN=1] \
 *   node scripts/setup-waf.mjs
 *
 * The CF_ZONE_ID for wojciech.io is visible in the CF dashboard Overview tab
 * or via: curl -H "Authorization: Bearer $CF_API_TOKEN" \
 *           "https://api.cloudflare.com/client/v4/zones?name=wojciech.io" | jq '.[0].id'
 *
 * Rules are idempotent by description — running twice won't duplicate rules
 * (script checks existing descriptions before creating).
 */

const BASE = 'https://api.cloudflare.com/client/v4';
const TOKEN = process.env.CF_API_TOKEN;
const ZONE_ID = process.env.CF_ZONE_ID;
const DRY_RUN = Boolean(process.env.DRY_RUN);

if (!TOKEN || !ZONE_ID) {
  console.error('CF_API_TOKEN and CF_ZONE_ID env vars are required.');
  process.exit(1);
}

// Rate-limit rule definitions.
// mode: "simulate" logs but doesn't block. Change to "ban" after confirming.
const RULES = [
  {
    description: 'Academy auth endpoint — 10 req/60s per IP',
    match: {
      request: { methods: ['POST'], url_pattern: '*academy.wojciech.io/api/auth*' },
      response: {},
    },
    threshold: 10,
    period: 60,
    action: { mode: 'simulate', response: { content_type: 'application/json', body: '{"ok":false,"error":"rate-limited"}' } },
  },
  {
    description: 'Academy Stripe checkout — 5 req/60s per IP',
    match: {
      request: { methods: ['POST'], url_pattern: '*academy.wojciech.io/api/stripe*' },
      response: {},
    },
    threshold: 5,
    period: 60,
    action: { mode: 'simulate', response: { content_type: 'application/json', body: '{"ok":false,"error":"rate-limited"}' } },
  },
  {
    description: 'Academy contact form — 5 req/60s per IP',
    match: {
      request: { methods: ['POST'], url_pattern: '*academy.wojciech.io/api/contact*' },
      response: {},
    },
    threshold: 5,
    period: 60,
    action: { mode: 'simulate', response: { content_type: 'application/json', body: '{"ok":false,"error":"rate-limited"}' } },
  },
  {
    description: 'GrowthHub sync endpoint — 5 req/60s per IP (cron worker exempt via bearer)',
    match: {
      request: { methods: ['POST'], url_pattern: '*gh.wojciech.io/api/sync*' },
      response: {},
    },
    threshold: 5,
    period: 60,
    action: { mode: 'simulate', response: { content_type: 'application/json', body: '{"ok":false,"error":"rate-limited"}' } },
  },
  {
    description: 'All API surfaces — 60 req/60s per IP (broad safety net)',
    match: {
      request: { methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], url_pattern: '*.wojciech.io/api/*' },
      response: {},
    },
    threshold: 60,
    period: 60,
    action: { mode: 'simulate', response: { content_type: 'application/json', body: '{"ok":false,"error":"rate-limited"}' } },
  },
];

async function cfFetch(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  const json = await res.json();
  if (!json.success) throw new Error(`CF API error on ${path}: ${JSON.stringify(json.errors)}`);
  return json.result;
}

async function getExistingRules() {
  const result = await cfFetch(`/zones/${ZONE_ID}/rate_limits?page=1&per_page=100`);
  return new Set((result || []).map(r => r.description));
}

async function main() {
  console.log(`Zone: ${ZONE_ID} | Dry-run: ${DRY_RUN}`);

  const existing = await getExistingRules();
  console.log(`Existing rules: ${existing.size}`);

  for (const rule of RULES) {
    if (existing.has(rule.description)) {
      console.log(`  SKIP (exists): ${rule.description}`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`  DRY-RUN create: ${rule.description}`);
      continue;
    }
    const created = await cfFetch(`/zones/${ZONE_ID}/rate_limits`, {
      method: 'POST',
      body: JSON.stringify(rule),
    });
    console.log(`  CREATED (${created.id}): ${rule.description}`);
  }

  console.log('\nDone. Rules are in "simulate" mode — check CF dashboard Analytics > Rate Limiting');
  console.log('to confirm traffic patterns, then re-run with mode="ban" to enforce.');
}

main().catch(err => { console.error(err); process.exit(1); });
