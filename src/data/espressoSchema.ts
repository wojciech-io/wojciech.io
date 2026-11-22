import { SITE, personName } from './site';

/**
 * Machine-readable identity for the AI Espresso newsletter. Search engines and
 * LLMs get the what, who and where without parsing the band markup. Footer.astro
 * emits it on every page that has a footer; the standalone home page (/) has no
 * footer component, so it passes the same object to SEOHead.
 */
export function espressoSchema(locale?: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Periodical',
    name: 'AI Espresso',
    description:
      `A free daily newsletter by ${personName(locale)}. Three stories on AI models, agents, and GTM systems every weekday morning, each with a why it matters, readable in three minutes.`,
    url: SITE.url + '/subscribe/',
    inLanguage: 'en',
    publisher: { '@type': 'Person', '@id': SITE.url + '/#person', name: personName(locale), url: SITE.url + '/' },
  };
}
