export interface OGPageMeta {
  title: string;
  eyebrow: string;
  description: string;
}

/**
 * Metadata for each statically-generated per-page OG image.
 * Keys are the route segments used in /og/pages/[page].png
 */
export const OG_PAGES: Record<string, OGPageMeta> = {
  about: {
    title: 'Fractional GTM Architect & AI Systems Builder',
    eyebrow: 'About',
    description: 'Growth operator building AI-native revenue systems for B2B SaaS.',
  },
  work: {
    title: 'GTM Systems & Case Studies',
    eyebrow: 'Work',
    description: 'AI-native GTM, CRM, automation, and shipped products.',
  },
  'ai-systems': {
    title: 'AI Systems · Workflows, Agents & Operating Leverage',
    eyebrow: 'AI Systems',
    description: 'Claude Code, MCP, and automation built for real production GTM.',
  },
  contact: {
    title: 'Build, Fix, or Review the System',
    eyebrow: 'Contact',
    description: '30-minute call for GTM audits, AI workflow design, and CRM architecture.',
  },
  insights: {
    title: 'AI & GTM Insights · Operator Notes',
    eyebrow: 'Insights',
    description: 'Field notes on AI systems, GTM architecture, and revenue design.',
  },
  now: {
    title: "What I'm Working On Now",
    eyebrow: 'Now',
    description: 'Current focus: systems, clients, reading, and thinking.',
  },
  resources: {
    title: 'Resources · Tools and Templates for Operators',
    eyebrow: 'Resources',
    description: 'Starter packs, MCP configs, and operator frameworks for AI-native GTM.',
  },
  bites: {
    title: 'Bites · Small Claude Code Tools',
    eyebrow: 'Bites',
    description: 'Free Claude Code plugins that each do one job well. Take them and run.',
  },
  home: {
    title: 'GTM Architect · AI-native Revenue Systems',
    eyebrow: 'wojciech.io',
    description: 'Build AI-native revenue systems for B2B SaaS.',
  },
  roadmap: {
    title: "What I'm Shipping · Public Roadmap",
    eyebrow: 'Roadmap',
    description: 'A live look at what is in production, what is being built, and what is next.',
  },
};

/** The set of page slugs that will be pre-rendered by getStaticPaths. */
export const OG_PAGE_SLUGS = Object.keys(OG_PAGES) as (keyof typeof OG_PAGES)[];
