import { SITE } from './site';

/**
 * Structured data for the home page (/), tied together by @id so a crawler reads
 * one entity graph instead of unrelated blocks: Person (emitted by SEOHead),
 * WebSite (SEOHead), plus the ProfessionalService, WebPage and FAQPage below.
 * Every FAQ answer restates what the page itself says; nothing here is a claim
 * the visible page does not make. There is no SearchAction: the site has no
 * public search page.
 */
export const HOME_IDS = {
  person: `${SITE.url}/#person`,
  website: `${SITE.url}/#website`,
  service: `${SITE.url}/#service`,
  webpage: `${SITE.url}/#webpage`,
  faq: `${SITE.url}/#faq`,
} as const;

export const HOME_FAQ: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: 'Who is Wojciech Luszczynski?',
    a: 'A GTM architect and growth operator for B2B SaaS. He builds revenue systems and then runs them. His track record is twenty years across ten roles, from city communication in Łódź to Head of Growth at SentiOne.',
  },
  {
    q: 'What does he get hired for?',
    a: 'Three things: GTM (CRM, outbound, paid and RevOps in one pipeline), Marketing (positioning, demand, content and brand) and Growth (experiments, activation, retention and lifecycle).',
  },
  {
    q: 'Which companies does he work with?',
    a: 'B2B SaaS and tech teams past 2M ARR. Each service on the page shows the system, the result it moved and where he ran it before.',
  },
  {
    q: 'What results has he delivered?',
    a: '+80% new customers at SentiOne, +30% lead generation at Symfonia and +25% conversion in the Nordic stores at Tekhuset.',
  },
  {
    q: 'How does he use AI in the work?',
    a: 'Agents run the queue: they research accounts, enrich the data, score the fit and draft the email. He sets the ICP, joins the calls, approves every send and reviews weekly.',
  },
  {
    q: 'What has he built?',
    a: 'Eight tools for revenue work, including Relora, AdsAI, NotchCue, GrowthHub, Content Studio, Recruitify, Camper Rental and the Claude Code GTM Agent Starter Pack. Most open as a live demo on sample data, the rest as a case, at app.wojciech.io.',
  },
  {
    q: 'How can I book a call or follow the work?',
    a: 'Book a 30-minute call at wojciech.io/contact/. For the work in public, follow on LinkedIn or subscribe to AI Espresso, a free newsletter with three AI stories every weekday.',
  },
];

export function homeSchema(): Record<string, unknown>[] {
  const personRef = { '@id': HOME_IDS.person };
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': HOME_IDS.service,
      name: 'Wojciech Luszczynski, GTM and growth for B2B SaaS',
      url: `${SITE.url}/`,
      description:
        'Fractional GTM architect connecting CRM, outbound, paid acquisition and AI workflows into one operating model for B2B SaaS and tech teams.',
      founder: personRef,
      provider: personRef,
      areaServed: 'Worldwide',
      serviceType: ['GTM strategy', 'Marketing', 'Growth'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': HOME_IDS.webpage,
      url: `${SITE.url}/`,
      name: 'Wojciech Luszczynski · AI-native GTM operator',
      inLanguage: 'en',
      isPartOf: { '@id': HOME_IDS.website },
      about: personRef,
      mainEntity: personRef,
      primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE.url}/og/pages/home.png` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': HOME_IDS.faq,
      isPartOf: { '@id': HOME_IDS.webpage },
      mainEntity: HOME_FAQ.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ];
}
