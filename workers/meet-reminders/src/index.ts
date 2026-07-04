// /meet booking-reminder cron Worker.
// Fires every 15 minutes and POSTs to the Pages Function /api/cron/reminders,
// which queries D1 for calls that are 24h or 1h away and emails the guest.
// CF Pages Functions can't hold a scheduled event, so this Worker bridges the
// cron trigger to that HTTP handler. All the real work lives on the Pages side
// so it reuses the site's D1 binding and RESEND_API_KEY.
//
// Required secret (Workers → Variables): CRON_SECRET — must match the value on
// the wojciech-io Pages project. MEET_URL is a plain var in wrangler.toml.

interface Env {
  CRON_SECRET: string;
  MEET_URL: string;
}

export default {
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(dispatch(env));
  },
} satisfies ExportedHandler<Env>;

async function dispatch(env: Env): Promise<void> {
  const url = `${env.MEET_URL}/api/cron/reminders`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CRON_SECRET}`,
      'Content-Type': 'application/json',
      'User-Agent': 'wojciech-io-meet-reminders/1.0',
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '(no body)');
    throw new Error(`reminders failed: HTTP ${res.status} — ${body}`);
  }

  const result = (await res.json()) as { ok: boolean; scanned: number; sent: number; failures: string[] };
  console.log('meet reminders tick', JSON.stringify(result));
}
