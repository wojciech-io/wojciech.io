/**
 * AI Espresso — recent issues.
 *
 * Curated from the sent editions (HTML lives outside the repo, in the Codex
 * automation workdir, so it cannot be read at build time). Keep newest first.
 * `tag` is a short topic label; `lead` is the issue's one-line standfirst.
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
];

/** Total issues sent to date (inbox shows a recent slice of this). */
export const totalIssues = 25;
