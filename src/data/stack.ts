export interface StackItem {
  name: string;
  icon?: string; // simpleicons slug, e.g. "react"
  iconColor?: string; // hex without #
  letterMark?: string; // fallback text if no icon
}

export interface StackCategory {
  name: string;
  items: StackItem[];
  enables: string;
}

const MONO = '888888';

export const STACK: StackCategory[] = [
  {
    name: 'Frontend',
    enables: 'From landing pages to full SaaS dashboards, with type safety, server rendering, and a complete component system ready to extend.',
    items: [
      { name: 'React',       icon: 'react',       iconColor: MONO },
      { name: 'TypeScript',  icon: 'typescript',  iconColor: MONO },
      { name: 'Tailwind',    icon: 'tailwindcss', iconColor: MONO },
      { name: 'Vite',        icon: 'vite',        iconColor: MONO },
      { name: 'shadcn/ui',   icon: 'shadcnui',    iconColor: MONO },
      { name: 'Next.js',     icon: 'nextdotjs',   iconColor: MONO },
    ],
  },
  {
    name: 'Backend & Data',
    enables: 'Auth, APIs, and data at the edge: signed-cookie gates, rate limiting, and SQLite-at-the-edge without managing servers.',
    items: [
      { name: 'Cloudflare Workers',   icon: 'cloudflareworkers', iconColor: MONO },
      { name: 'Pages Functions',      icon: 'cloudflarepages',   iconColor: MONO },
      { name: 'D1',                   letterMark: 'D1' },
      { name: 'Workers KV',           letterMark: 'KV' },
    ],
  },
  {
    name: 'AI',
    enables: 'Text generation, document analysis, and voice in any app. Agents that reason, search, and complete tasks without human input.',
    items: [
      { name: 'Anthropic / Claude', icon: 'anthropic', iconColor: MONO },
      { name: 'OpenAI',             letterMark: 'AI' },
      { name: 'ElevenLabs',         icon: 'elevenlabs', iconColor: MONO },
    ],
  },
  {
    name: 'Automation',
    enables: 'Connect tools that do not talk to each other. CRM, email, webhooks, spreadsheets wired up in hours without writing a line of code.',
    items: [
      { name: 'Zapier', icon: 'zapier', iconColor: MONO },
      { name: 'Make',   icon: 'make',   iconColor: MONO },
      { name: 'n8n',    icon: 'n8n',    iconColor: MONO },
    ],
  },
  {
    name: 'Payments & Email',
    enables: 'Subscriptions and one-time payments with managed billing, plus transactional emails that land in the inbox, not spam.',
    items: [
      { name: 'Stripe', icon: 'stripe', iconColor: MONO },
      { name: 'Resend', icon: 'resend', iconColor: MONO },
    ],
  },
  {
    name: 'Native / Desktop',
    enables: 'Real macOS apps, not Electron wrappers. Menu bar, system tray, local-first, full system API access, custom DMG distribution.',
    items: [
      { name: 'Swift',  icon: 'swift',  iconColor: MONO },
      { name: 'AppKit', icon: 'apple',  iconColor: MONO },
      { name: 'Xcode',  icon: 'xcode',  iconColor: MONO },
    ],
  },
  {
    name: 'Infrastructure',
    enables: 'Push to git, get a live URL. Edge hosting, branch previews, DNS, and CDN, provisioned as code with Terraform.',
    items: [
      { name: 'Cloudflare Pages', icon: 'cloudflarepages', iconColor: MONO },
      { name: 'Cloudflare',       icon: 'cloudflare',      iconColor: MONO },
      { name: 'Terraform',        icon: 'terraform',       iconColor: MONO },
      { name: 'Wrangler',         letterMark: 'WR' },
      { name: 'GitHub',           icon: 'github',          iconColor: MONO },
    ],
  },
  {
    name: 'Static & Content',
    enables: 'Ultra-fast static sites with minimal client JS. Perfect for landing pages, docs, and content-heavy projects where Core Web Vitals matter.',
    items: [
      { name: 'Astro',   icon: 'astro',   iconColor: MONO },
      { name: 'Framer',  icon: 'framer',  iconColor: MONO },
      { name: 'Webflow', icon: 'webflow', iconColor: MONO },
    ],
  },
];

export const STACK_TOTAL = STACK.reduce((sum, cat) => sum + cat.items.length, 0);
