/**
 * AI Espresso — recent issues. SINGLE SOURCE OF TRUTH for the landing page.
 *
 * Both inbox views on index.astro (the hero panel and the "What's been landing"
 * list) read from this array, so there is only one place to update.
 *
 * Curated from the sent editions. The newsletter ships in Polish; the HTML lives
 * outside the repo in the Codex automation workdir
 * (~/.codex/automations/ai-listener-newsletter-2/workdir,
 * files ai_espresso_public_YYYY-MM-DD.html). `title`/`lead` are short English
 * standfirsts written from each issue. Keep newest first.
 *
 * UPDATE: add the new issues to the top, drop the oldest so this stays ~16 long,
 * and bump `totalIssues` to the count of sent issues.
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
    date: '2026-06-30',
    tag: 'Routing',
    title: 'Fast mode becomes architecture.',
    lead: 'GitHub adds Opus 4.8 fast mode to Copilot as Anthropic retires it for 4.6, OpenAI folds Codex into ChatGPT Business seats, GitHub locks CI cache for untrusted triggers.',
  },
  {
    date: '2026-06-29',
    tag: 'Lifecycle',
    title: 'Agents become an operational resource.',
    lead: 'AWS AgentCore moves agents into normal cloud workflows, Copilot Studio organizes them around knowledge and memory, Boomi ships an Agent Garden lifecycle API.',
  },
  {
    date: '2026-06-28',
    tag: 'Runtime',
    title: 'Production needs runtime, memory, a gate.',
    lead: 'Google frames the agent stack as services not one library, Tencent EdgeOne deploys agents like web apps, HubSpot wires G2 signals into Breeze Agents over MCP.',
  },
  {
    date: '2026-06-27',
    tag: 'Access',
    title: 'Top models arrive through gates.',
    lead: 'GPT-5.6 Sol signals frontier models dosed like critical infrastructure, GitHub Desktop 3.6 pulls in worktrees and Copilot, Vercel Agent Runs makes runs debuggable.',
  },
  {
    date: '2026-06-26',
    tag: 'Control',
    title: 'The workspace is set. Now the rules.',
    lead: 'Codex and Claude make the local agent a service you supervise from your phone, Vercel AI SDK 7 turns agents into a portable execution layer, Copilot for Jira closes ticket to PR.',
  },
  {
    date: '2026-06-25',
    tag: 'Telemetry',
    title: 'Agents get hands, now meters.',
    lead: 'Gemini 3.5 Flash gains native computer control, Heron shows what an agent actually does on the web, AI PR-spam turns into an operational problem.',
  },
  {
    date: '2026-06-24',
    tag: 'Infra',
    title: 'Agents become company infrastructure.',
    lead: 'Claude Tag turns Slack into shared delegation, Copilot App runs agent sessions on your own models, Mistral OCR 4 gives agents documents with layout not just text.',
  },
  {
    date: '2026-06-23',
    tag: 'Trust',
    title: 'An agent is not enough without a checker.',
    lead: 'OpenAI and Trail of Bits push fixes over more reports, GitHub brings enterprise agents to JetBrains with per-turn cost, Skybridge wants to be React for in-Claude apps.',
  },
  {
    date: '2026-06-21',
    tag: 'Ops',
    title: 'Control becomes the product.',
    lead: 'OpenAI gives admins one view of ChatGPT and Codex cost, GitHub closes the common pwn-request in Actions, Slackbot starts calling MCP tools from a channel.',
  },
  {
    date: '2026-06-20',
    tag: 'Auth',
    title: 'The agent stack turns enterprise.',
    lead: 'MCP gains stable Enterprise Managed Authorization, Gemini API cuts unlimited standard keys, Claude Code Artifacts turn agent runs into a live page.',
  },
  {
    date: '2026-06-18',
    tag: 'Runtime',
    title: 'Discovery, auth, and runtime replace glue.',
    lead: 'Codex CLI 0.141 hardens remote execution and per-thread MCP, GitHub Agent Finder tackles which tool the agent should know, Vercel Eve treats the agent like a file directory.',
  },
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
];

/** Total issues sent to date (inbox shows a recent slice of this). */
export const totalIssues = 45;
