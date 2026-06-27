/**
 * AI Espresso — recent issues. SINGLE SOURCE OF TRUTH for the landing page.
 *
 * Both inbox views on index.astro (the hero panel and the "What's been landing"
 * list) read from this array, so there is only one place to update.
 *
 * Curated from the sent editions. The newsletter ships in Polish; the HTML lives
 * outside the repo in the Codex automation workdir
 * (~/Documents/Codex/2026-05-07/goal-ai-listener-newsletter-przygotowuj-mi,
 * files ai_espresso_public_YYYY-MM-DD.html). `title`/`lead` are short English
 * standfirsts written from each issue. Keep newest first.
 *
 * WEEKLY UPDATE: add the new issues to the top, drop the oldest so this stays
 * ~16 long, and bump `totalIssues` to the count of sent issues.
 */
export interface Edition {
  /** ISO date the issue went out. */
  date: string;
  /** Short topic label, uppercased in the UI. */
  tag: string;
  /** Issue headline, as sent. */
  title: string;
  /** One-line standfirst. */
  lead: string;
}

export const editions: Edition[] = [
  {
    date: '2026-06-17',
    tag: 'Ops',
    title: 'The agent really costs now.',
    lead: 'GitHub prices code quality with an org-wide switch, Vercel runs sandboxes 24h, Linear ships fixes via Claude Code and Codex.',
  },
  {
    date: '2026-06-16',
    tag: 'Runtime',
    title: 'Cost, control, runtime.',
    lead: 'GitHub counts new billable users, Copilot review gets central runner control, Anthropic retires old Sonnet 4 and Opus 4.',
  },
  {
    date: '2026-06-12',
    tag: 'Workflow',
    title: 'Agent workflow grows up.',
    lead: 'GitHub ships agent workflows to public beta, Copilot CLI consolidates settings, Linear wires Claude Code and Codex into issues.',
  },
  {
    date: '2026-06-11',
    tag: 'Security',
    title: 'Agents get memory and limits.',
    lead: 'Copilot CLI gains a security review, Copilot Chat surfaces agent session traces, Claude Fable 5 arrives with retention controls.',
  },
  {
    date: '2026-06-10',
    tag: 'Scope',
    title: 'Workflow gets a budget and a scope.',
    lead: 'Okta trims MCP to user permissions, Vercel frames model routing as a financial call, the skills market needs a scanner not a marketplace.',
  },
  {
    date: '2026-06-09',
    tag: 'Runtime',
    title: 'Local models, scopes, and a hard token bill.',
    lead: 'Agents enter Xcode, IAM, model routing, business metrics, and voice ops.',
  },
  {
    date: '2026-06-08',
    tag: 'Ops',
    title: 'Agents within boundaries.',
    lead: 'Org context, secure execution, and cost audit matter more than the agent itself.',
  },
  {
    date: '2026-06-06',
    tag: 'Platform',
    title: 'The interesting moves are below the model.',
    lead: 'Persistent storage, managed plugins, tool payments, and auditable agent actions.',
  },
  {
    date: '2026-06-05',
    tag: 'Skills',
    title: 'Agents get an operational backbone.',
    lead: 'Cloudflare agent skills, OpenAI on AWS, CRM automations, and AI visibility metrics.',
  },
  {
    date: '2026-06-04',
    tag: 'FinOps',
    title: 'Agents come under control.',
    lead: 'Usage billing, browser harness, cost telemetry, and repeatable runtimes.',
  },
  {
    date: '2026-06-03',
    tag: 'Workflow',
    title: 'Agents descend into daily workflow.',
    lead: 'Codex beyond devs, Auto model mixing, governance, and reusable browser skills.',
  },
  {
    date: '2026-06-02',
    tag: 'Cost',
    title: 'Agent stack gets a counter.',
    lead: 'Copilot budgets, new gateway models, web change monitoring, and AI visibility.',
  },
  {
    date: '2026-06-01',
    tag: 'FinOps',
    title: 'Agent cost enters the budget.',
    lead: 'Token billing, team budgets, no free fallbacks, and hard tool limits become standard.',
  },
  {
    date: '2026-05-29',
    tag: 'MCP',
    title: 'MCP goes to production.',
    lead: 'Zapier migrates to MCP, GitHub and Vercel add cost policies and execution isolation.',
  },
  {
    date: '2026-05-28',
    tag: 'Security',
    title: 'Agent stack without slip-ups.',
    lead: 'Safer integration gates, predictable MCP defaults, and a real CVE in a popular workflow tool.',
  },
  {
    date: '2026-05-27',
    tag: 'Runtime',
    title: 'Durable runtime for agents.',
    lead: 'Persistent state, repeatable procedures, and hard integration gates over model choice.',
  },
];

/** Total issues sent to date (inbox shows a recent slice of this). */
export const totalIssues = 34;
