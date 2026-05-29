// GrowthHub nightly sync cron Worker.
// Fires at 03:00 UTC daily and POSTs to the Pages Function /api/sync endpoint.
// CF Pages Functions don't support scheduled events, so this separate Worker
// bridges the cron trigger to the existing HTTP handler.
//
// Required secrets (Workers → growthhub-cron → Variables):
//   CRON_SECRET       — shared secret, must match growthhub Pages CRON_SECRET
//   GROWTHHUB_URL     — base URL, e.g. "https://gh.wojciech.io" (plain var, not secret)

interface Env {
  CRON_SECRET: string;
  GROWTHHUB_URL: string;
}

export default {
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runSync(env));
  },
} satisfies ExportedHandler<Env>;

async function runSync(env: Env): Promise<void> {
  const url = `${env.GROWTHHUB_URL}/api/sync`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.CRON_SECRET}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '(no body)');
    throw new Error(`sync failed: HTTP ${res.status} — ${body}`);
  }

  const result = await res.json() as { ok: boolean; results: Record<string, unknown> };
  console.log('growthhub sync complete', JSON.stringify(result.results));
}
