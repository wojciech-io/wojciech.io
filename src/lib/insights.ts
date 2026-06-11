import type { CollectionEntry } from 'astro:content';
import type { LocaleKey } from '../data/locales';

export type InsightPost = CollectionEntry<'insights'>;
export type InsightLocale = 'en' | 'pl';

export const localizedInsightLocales = ['pl'] as const satisfies readonly LocaleKey[];

export const insightLocaleLabels: Record<InsightLocale, {
  allInsights: string;
  article: string;
  articles: string;
  bylineRole: string;
  featured: string;
  newsletter: string;
  newsletterHeading: string;
  newsletterBody: string;
  readArticle: string;
  readTimeSuffix: string;
  tldrTitle: string;
  subscribe: string;
  moreFromInsights: string;
  previous: string;
  next: string;
  authorLabel: string;
  authorBio: string;
}> = {
  en: {
    allInsights: 'All insights',
    article: 'Article',
    articles: 'articles',
    bylineRole: 'GTM Architect & Growth Operator',
    featured: 'Featured',
    newsletter: 'Newsletter',
    newsletterHeading: 'Get the next one first.',
    newsletterBody: "When I publish a new article on AI systems, GTM architecture, or growth operating models, you'll be the first to know.",
    readArticle: 'Read article',
    readTimeSuffix: 'min read',
    tldrTitle: 'TL;DR · Key insights',
    subscribe: 'Subscribe',
    moreFromInsights: 'More from insights',
    previous: 'Previous',
    next: 'Next',
    authorLabel: 'About the author',
    authorBio: 'GTM Architect and Growth Operator building AI-native revenue systems for B2B SaaS and technology companies. I connect positioning, SEO, content, paid acquisition, CRM, automation, analytics and AI workflows into practical growth infrastructure.',
  },
  pl: {
    allInsights: 'Wszystkie spostrzeżenia',
    article: 'Artykuł',
    articles: 'artykuły',
    bylineRole: 'GTM Architect & Growth Operator',
    featured: 'Polecane',
    newsletter: 'Newsletter',
    newsletterHeading: 'Najpierw zdobądź następny.',
    newsletterBody: 'Kiedy opublikuję nowy artykuł na temat systemów AI, architektury GTM lub modeli operacyjnych wzrostu, dowiesz się o tym jako pierwszy.',
    readArticle: 'Przeczytaj artykuł',
    readTimeSuffix: 'min czytania',
    tldrTitle: 'TL;DR · Najważniejsze wnioski',
    subscribe: 'Subskrybuj',
    moreFromInsights: 'Więcej informacji',
    previous: 'Poprzedni',
    next: 'Następny',
    authorLabel: 'O autorze',
    authorBio: 'Architekt GTM i operator wzrostu budujący natywne dla AI systemy przychodów dla B2B SaaS i firm technologicznych. Łączę pozycjonowanie, SEO, treści, płatne pozyskiwanie, CRM, automatyzację, analitykę i przepływy pracy AI w praktyczną infrastrukturę wzrostu.'
  },
};

export function insightSlug(post: InsightPost) {
  return post.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? post.id.replace(/\.mdx?$/, '');
}

export function insightLocale(post: InsightPost): InsightLocale {
  return post.data.locale ?? 'en';
}

export function isLocalePost(locale: InsightLocale) {
  return (post: InsightPost) => insightLocale(post) === locale && !post.data.draft;
}

export function sortInsights(a: InsightPost, b: InsightPost) {
  return Number(b.data.featured) - Number(a.data.featured)
    || b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
}

export function localizedInsightAlternates(slug: string) {
  return [
    { lang: 'x-default', href: `https://wojciech.io/insights/${slug}/` },
    { lang: 'en', href: `https://wojciech.io/insights/${slug}/` },
    { lang: 'pl', href: `https://wojciech.io/pl/insights/${slug}/` },
  ];
}

export function localizedInsightIndexAlternates() {
  return [
    { lang: 'x-default', href: 'https://wojciech.io/insights/' },
    { lang: 'en', href: 'https://wojciech.io/insights/' },
    { lang: 'pl', href: 'https://wojciech.io/pl/insights/' },
  ];
}

export function readTime(body = '', locale: InsightLocale = 'en') {
  return `${Math.max(4, Math.ceil(body.split(/\s+/).filter(Boolean).length / 220))} ${insightLocaleLabels[locale].readTimeSuffix}`;
}
