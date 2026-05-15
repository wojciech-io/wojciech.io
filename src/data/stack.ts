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

export const STACK: StackCategory[] = [
  {
    name: 'Frontend',
    enables: 'From landing pages to full SaaS dashboards — with type safety, server rendering, and a complete component system ready to extend.',
    items: [
      { name: 'React',       icon: 'react',       iconColor: '61DAFB' },
      { name: 'TypeScript',  icon: 'typescript',  iconColor: '3178C6' },
      { name: 'Tailwind',    icon: 'tailwindcss', iconColor: '06B6D4' },
      { name: 'Vite',        icon: 'vite',        iconColor: '646CFF' },
      { name: 'shadcn/ui',   icon: 'shadcnui',    iconColor: '000000' },
      { name: 'Next.js',     icon: 'nextdotjs',   iconColor: '000000' },
    ],
  },
  {
    name: 'Backend & Data',
    enables: 'Auth, database, and storage in minutes — then custom Python APIs and BigQuery for querying millions of rows without managing servers.',
    items: [
      { name: 'Supabase',  icon: 'supabase',      iconColor: '3ECF8E' },
      { name: 'FastAPI',   icon: 'fastapi',        iconColor: '009688' },
      { name: 'Cloud Run', icon: 'googlecloud',    iconColor: '4285F4' },
      { name: 'BigQuery',  icon: 'googlebigquery', iconColor: '669DF6' },
    ],
  },
  {
    name: 'AI',
    enables: 'Add text generation, document analysis, and voice to any app. Build agents that reason, search, and complete tasks without human input.',
    items: [
      { name: 'OpenAI',      letterMark: 'AI' },
      { name: 'Anthropic',   icon: 'anthropic',    iconColor: 'D4A96A' },
      { name: 'ElevenLabs',  icon: 'elevenlabs',   iconColor: 'F5A623' },
    ],
  },
  {
    name: 'Automation',
    enables: 'Connect tools that do not talk to each other. CRM, email, webhooks, spreadsheets — wired up in hours without writing a line of code.',
    items: [
      { name: 'Zapier', icon: 'zapier', iconColor: 'FF4A00' },
      { name: 'Make',   icon: 'make',   iconColor: '6D00CC' },
      { name: 'n8n',    icon: 'n8n',    iconColor: 'EA4B71' },
    ],
  },
  {
    name: 'Payments & Email',
    enables: 'Subscriptions and one-time payments with managed billing — plus transactional emails that land in the inbox, not spam.',
    items: [
      { name: 'Stripe', icon: 'stripe', iconColor: '635BFF' },
      { name: 'Resend', icon: 'resend', iconColor: '000000' },
    ],
  },
  {
    name: 'Native / Desktop',
    enables: 'Real macOS apps — not Electron wrappers. Menu bar, system tray, local-first, full system API access, custom DMG distribution.',
    items: [
      { name: 'Swift',  icon: 'swift',  iconColor: 'F05138' },
      { name: 'AppKit', icon: 'apple',  iconColor: '000000' },
      { name: 'Xcode',  icon: 'xcode',  iconColor: '147EFB' },
    ],
  },
  {
    name: 'Infrastructure',
    enables: 'Push to git, get a live URL. Edge hosting, branch previews, DNS, and CDN without manual glue.',
    items: [
      { name: 'Cloudflare Pages', icon: 'cloudflarepages', iconColor: 'F38020' },
      { name: 'Cloudflare',       icon: 'cloudflare',      iconColor: 'F38020' },
      { name: 'Vercel',           icon: 'vercel',          iconColor: '000000' },
      { name: 'Netlify',          icon: 'netlify',         iconColor: '00C7B7' },
      { name: 'GitHub',           icon: 'github',          iconColor: '181717' },
    ],
  },
  {
    name: 'Static & Content',
    enables: 'Ultra-fast static sites with 0kb JS by default — perfect for landing pages, docs, and content-heavy projects where Core Web Vitals matter.',
    items: [
      { name: 'Astro',   icon: 'astro',   iconColor: 'FF5D01' },
      { name: 'Framer',  icon: 'framer',  iconColor: '0055FF' },
      { name: 'Webflow', icon: 'webflow', iconColor: '4353FF' },
    ],
  },
];

export const STACK_TOTAL = STACK.reduce((sum, cat) => sum + cat.items.length, 0);
