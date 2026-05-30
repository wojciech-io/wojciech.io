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
  status: {
    title: 'Network Status · Live Service Health',
    eyebrow: 'Status',
    description: 'Live availability of every surface across this network, probed in real time.',
  },
  // Locale homes — tytuł wspólny, descriptions skrócone z data/locales.ts
  // do limitu OG (120 ch) z zachowaniem sensu. Eyebrow = lokalna nazwa.
  pl: {
    title: 'Wojciech Łuszczyński · AI-native GTM Operator (PL)',
    eyebrow: 'wojciech.io · PL',
    description: 'AI-native systemy przychodowe dla B2B SaaS: GTM, CRM, automatyzacja i workflowy AI jako jeden model operacyjny.',
  },
  it: {
    title: 'Wojciech Łuszczyński · AI-native GTM Operator (IT)',
    eyebrow: 'wojciech.io · IT',
    description: 'Sistemi di ricavo AI-native per SaaS B2B: GTM, CRM, automazione e flussi AI come un unico modello operativo.',
  },
  de: {
    title: 'Wojciech Łuszczyński · AI-native GTM Operator (DE)',
    eyebrow: 'wojciech.io · DE',
    description: 'AI-native Revenue-Systeme für B2B SaaS: GTM, CRM, Automatisierung und AI-Workflows als ein Operating Model.',
  },
  dk: {
    title: 'Wojciech Łuszczyński · AI-native GTM Operator (DK)',
    eyebrow: 'wojciech.io · DK',
    description: 'AI-native revenue-systemer til B2B SaaS: GTM, CRM, automatisering og AI-arbejdsgange som én operating model.',
  },
  no: {
    title: 'Wojciech Łuszczyński · AI-native GTM Operator (NO)',
    eyebrow: 'wojciech.io · NO',
    description: 'AI-native revenue-systemer for B2B SaaS: GTM, CRM, automatisering og AI-arbeidsflyter som én operating model.',
  },
  jp: {
    title: 'Wojciech Łuszczyński · AI-native GTM Operator (JP)',
    eyebrow: 'wojciech.io · JP',
    description: 'B2B SaaS向けAIネイティブRevenue system：GTM、CRM、自動化、AIワークフローを1つのオペレーティングモデルとして提供。',
  },
  es: {
    title: 'Wojciech Łuszczyński · AI-native GTM Operator (ES)',
    eyebrow: 'wojciech.io · ES',
    description: 'Sistemas de ingresos AI-native para SaaS B2B: GTM, CRM, automatización y flujos AI como un único modelo operativo.',
  },
};

/** The set of page slugs that will be pre-rendered by getStaticPaths. */
export const OG_PAGE_SLUGS = Object.keys(OG_PAGES) as (keyof typeof OG_PAGES)[];
