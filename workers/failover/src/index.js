const CF_PAGES_HOSTNAME = 'wojciech-io.pages.dev';

export default {
  // Cron trigger: every 5 minutes
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(monitor(env));
  },

  // HTTP trigger: manual check via GET /trigger
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === '/trigger') {
      ctx.waitUntil(monitor(env));
      return new Response('Monitor triggered\n', { status: 202 });
    }
    return new Response('wojciech.io failover monitor — GET /trigger to run\n');
  },
};

async function monitor(env) {
  const healthy = await checkHealth();
  const target = await getDnsTarget(env);

  if (target === null) {
    console.error('Could not read DNS record — aborting');
    return;
  }

  const onPrimary = target === CF_PAGES_HOSTNAME;

  if (!healthy && onPrimary) {
    await updateDns(env, env.AZURE_SWA_HOSTNAME);
    console.log(`FAILOVER → Azure: ${env.AZURE_SWA_HOSTNAME}`);
  } else if (healthy && !onPrimary) {
    await updateDns(env, CF_PAGES_HOSTNAME);
    console.log(`RESTORE → CF Pages: ${CF_PAGES_HOSTNAME}`);
  } else {
    console.log(`OK — healthy=${healthy}, target=${target}`);
  }
}

async function checkHealth() {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const resp = await fetch('https://wojciech.io', {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(8_000),
      });
      if (resp.status < 500) return true;
    } catch {
      // network error or timeout — continue to retry
    }
    if (attempt < 2) await sleep(5_000);
  }
  return false;
}

async function getDnsTarget(env) {
  try {
    const resp = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${env.CF_ZONE_ID}/dns_records/${env.CF_ROOT_RECORD_ID}`,
      { headers: { Authorization: `Bearer ${env.CF_API_TOKEN}` } }
    );
    const data = await resp.json();
    return data.result?.content ?? null;
  } catch {
    return null;
  }
}

async function updateDns(env, target) {
  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${env.CF_ZONE_ID}/dns_records/${env.CF_ROOT_RECORD_ID}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${env.CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: target, proxied: true }),
    }
  );
  const data = await resp.json();
  if (!data.success) throw new Error(`DNS update failed: ${JSON.stringify(data.errors)}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
