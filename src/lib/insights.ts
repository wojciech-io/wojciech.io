import type { CollectionEntry } from 'astro:content';
import type { LocaleKey } from '../data/locales';

export type InsightPost = CollectionEntry<'insights'>;
export type InsightLocale = 'en' | 'pl' | 'de' | 'es' | 'it';

export const localizedInsightLocales = ['pl', 'de', 'es', 'it'] as const satisfies readonly LocaleKey[];

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
  de: {
    allInsights: 'Alle Beiträge',
    article: 'Beitrag',
    articles: 'Beiträge',
    bylineRole: 'GTM Architect & Growth Operator',
    featured: 'Empfohlen',
    newsletter: 'Newsletter',
    newsletterHeading: 'Den nächsten zuerst lesen.',
    newsletterBody: 'Wenn ich einen neuen Beitrag über KI-Systeme, GTM-Architektur oder operative Wachstumsmodelle veröffentliche, erfahren Sie es als Erstes.',
    readArticle: 'Beitrag lesen',
    readTimeSuffix: 'Min. Lesezeit',
    tldrTitle: 'Kurzfassung · Die wichtigsten Punkte',
    subscribe: 'Abonnieren',
    moreFromInsights: 'Mehr aus den Beiträgen',
    previous: 'Zurück',
    next: 'Weiter',
    authorLabel: 'Über den Autor',
    authorBio: 'GTM-Architekt und Growth Operator, der KI-native Umsatzsysteme für B2B-SaaS- und Technologieunternehmen baut. Ich verbinde Positionierung, SEO, Content, bezahlte Akquise, CRM, Automatisierung, Analytics und KI-Workflows zu einer praktikablen Wachstumsinfrastruktur.',
  },
  es: {
    allInsights: 'Todos los artículos',
    article: 'Artículo',
    articles: 'artículos',
    bylineRole: 'GTM Architect & Growth Operator',
    featured: 'Destacado',
    newsletter: 'Newsletter',
    newsletterHeading: 'Recibe el próximo antes que nadie.',
    newsletterBody: 'Cuando publique un artículo nuevo sobre sistemas de IA, arquitectura GTM o modelos operativos de crecimiento, serás el primero en saberlo.',
    readArticle: 'Leer artículo',
    readTimeSuffix: 'min de lectura',
    tldrTitle: 'Resumen · Lo esencial',
    subscribe: 'Suscribirse',
    moreFromInsights: 'Más artículos',
    previous: 'Anterior',
    next: 'Siguiente',
    authorLabel: 'Sobre el autor',
    authorBio: 'Arquitecto de GTM y operador de crecimiento que construye sistemas de ingresos nativos de IA para empresas B2B SaaS y tecnológicas. Conecto posicionamiento, SEO, contenido, adquisición de pago, CRM, automatización, analítica y flujos de trabajo con IA en una infraestructura de crecimiento que funciona.',
  },
  it: {
    allInsights: 'Tutti gli articoli',
    article: 'Articolo',
    articles: 'articoli',
    bylineRole: 'GTM Architect & Growth Operator',
    featured: 'In evidenza',
    newsletter: 'Newsletter',
    newsletterHeading: 'Ricevi il prossimo per primo.',
    newsletterBody: 'Quando pubblico un articolo nuovo su sistemi di AI, architettura GTM o modelli operativi di crescita, lo saprai per primo.',
    readArticle: 'Leggi l\'articolo',
    readTimeSuffix: 'min di lettura',
    tldrTitle: 'In breve · I punti chiave',
    subscribe: 'Iscriviti',
    moreFromInsights: 'Altri articoli',
    previous: 'Precedente',
    next: 'Successivo',
    authorLabel: 'Sull\'autore',
    authorBio: 'GTM Architect e growth operator che costruisce sistemi di ricavi nativi per l\'AI per aziende B2B SaaS e tecnologiche. Collego posizionamento, SEO, contenuti, acquisizione a pagamento, CRM, automazione, analytics e flussi di lavoro con AI in un\'infrastruttura di crescita che funziona.',
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

/**
 * Which localized versions of `baseSlug` actually exist. Hreflang must never
 * advertise a translation that is not published: a locale added to
 * `localizedInsightLocales` before its articles land would otherwise point
 * search engines straight at a 404.
 */
export function insightAlternateLocales(posts: InsightPost[], baseSlug: string): string[] {
  return localizedInsightLocales.filter((locale) =>
    posts.some(
      (post) =>
        post.data.locale === locale &&
        !post.data.draft &&
        (post.data.translationOf ?? insightSlug(post)) === baseSlug
    )
  );
}

export function localizedInsightAlternates(slug: string, translatedLocales: readonly string[] = []) {
  return [
    { lang: 'x-default', href: `https://wojciech.io/insights/${slug}/` },
    { lang: 'en', href: `https://wojciech.io/insights/${slug}/` },
    ...translatedLocales.map((locale) => ({
      lang: locale,
      href: `https://wojciech.io/${locale}/insights/${slug}/`,
    })),
  ];
}

export function localizedInsightIndexAlternates() {
  return [
    { lang: 'x-default', href: 'https://wojciech.io/insights/' },
    { lang: 'en', href: 'https://wojciech.io/insights/' },
    ...localizedInsightLocales.map((locale) => ({
      lang: locale,
      href: `https://wojciech.io/${locale}/insights/`,
    })),
  ];
}

export function readTime(body = '', locale: InsightLocale = 'en') {
  return `${Math.max(4, Math.ceil(body.split(/\s+/).filter(Boolean).length / 220))} ${insightLocaleLabels[locale].readTimeSuffix}`;
}
