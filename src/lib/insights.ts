import type { CollectionEntry } from 'astro:content';
import { localizedHomeList, type LocaleKey } from '../data/locales';

export type InsightPost = CollectionEntry<'insights'>;
export type InsightLocale = 'en' | LocaleKey;

export const localizedInsightLocales = localizedHomeList.map((locale) => locale.key);

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
    subscribe: 'Subscribe',
    moreFromInsights: 'More from insights',
    previous: 'Previous',
    next: 'Next',
    authorLabel: 'About the author',
    authorBio: 'GTM Architect and Growth Operator building AI-native revenue systems for B2B SaaS and technology companies. I connect positioning, SEO, content, paid acquisition, CRM, automation, analytics and AI workflows into practical growth infrastructure.',
  },
  de: {
    allInsights: 'Alle Insights',
    article: 'Artikel',
    articles: 'Artikel',
    bylineRole: 'GTM Architect & Growth Operator',
    featured: 'Empfohlen',
    newsletter: 'Newsletter',
    newsletterHeading: 'Den nächsten Beitrag zuerst lesen.',
    newsletterBody: 'Wenn ein neuer Artikel zu AI-Systemen, GTM-Architektur oder Growth Operating Models erscheint, bekommst du ihn zuerst.',
    readArticle: 'Artikel lesen',
    readTimeSuffix: 'Min. Lesezeit',
    subscribe: 'Abonnieren',
    moreFromInsights: 'Mehr aus den Insights',
    previous: 'Zurück',
    next: 'Weiter',
    authorLabel: 'Über den Autor',
    authorBio: 'GTM Architect und Growth Operator für AI-native Revenue-Systeme in B2B SaaS und Technologieunternehmen. Ich verbinde Positionierung, SEO, Content, Paid Acquisition, CRM, Automatisierung, Analytics und AI Workflows zu praktischer Growth-Infrastruktur.',
  },
  dk: {
    allInsights: 'Alle insights',
    article: 'Artikel',
    articles: 'artikler',
    bylineRole: 'GTM architect & Growth operator',
    featured: 'Fremhævet',
    newsletter: 'Newsletter',
    newsletterHeading: 'Få den næste først.',
    newsletterBody: 'Når jeg udgiver en ny artikel om AI-systemer, GTM-arkitektur eller growth operating models, får du den først.',
    readArticle: 'Læs artikel',
    readTimeSuffix: 'min læsning',
    subscribe: 'Abonnér',
    moreFromInsights: 'Mere fra insights',
    previous: 'Forrige',
    next: 'Næste',
    authorLabel: 'Om forfatteren',
    authorBio: 'GTM architect og growth operator, der bygger AI-native revenue-systemer for B2B SaaS og teknologivirksomheder. Jeg forbinder positioning, SEO, content, paid acquisition, CRM, automation, analytics og AI workflows til praktisk growth-infrastruktur.',
  },
  no: {
    allInsights: 'Alle insights',
    article: 'Artikkel',
    articles: 'artikler',
    bylineRole: 'GTM-arkitekt & Growth-operatør',
    featured: 'Fremhevet',
    newsletter: 'Nyhetsbrev',
    newsletterHeading: 'Få neste artikkel først.',
    newsletterBody: 'Når jeg publiserer en ny artikkel om AI-systemer, GTM-arkitektur eller growth operating models, får du den først.',
    readArticle: 'Les artikkel',
    readTimeSuffix: 'min lesing',
    subscribe: 'Abonner',
    moreFromInsights: 'Mer fra insights',
    previous: 'Forrige',
    next: 'Neste',
    authorLabel: 'Om forfatteren',
    authorBio: 'GTM-arkitekt og growth-operatør som bygger AI-native revenue-systemer for B2B SaaS og teknologiselskaper. Jeg kobler positioning, SEO, content, paid acquisition, CRM, automasjon, analytics og AI workflows til praktisk growth-infrastruktur.',
  },
  jp: {
    allInsights: 'すべてのInsights',
    article: '記事',
    articles: '記事',
    bylineRole: 'GTM Architect & Growth Operator',
    featured: 'Featured',
    newsletter: 'Newsletter',
    newsletterHeading: '次の記事を先に受け取る。',
    newsletterBody: 'AI systems、GTM architecture、growth operating modelsに関する新しい記事を公開したら、最初にお知らせします。',
    readArticle: '記事を読む',
    readTimeSuffix: '分で読めます',
    subscribe: '購読する',
    moreFromInsights: '関連Insights',
    previous: '前の記事',
    next: '次の記事',
    authorLabel: '著者について',
    authorBio: 'B2B SaaSとテクノロジー企業向けにAI-native revenue systemsを構築するGTM Architect / Growth Operator。Positioning、SEO、content、paid acquisition、CRM、automation、analytics、AI workflowsを実務で使えるgrowth infrastructureに接続します。',
  },
  it: {
    allInsights: 'Tutti gli Insights',
    article: 'articolo',
    articles: 'articoli',
    bylineRole: 'GTM Architect & Growth Operator',
    featured: 'In evidenza',
    newsletter: 'Newsletter',
    newsletterHeading: 'Ricevi il prossimo per primo.',
    newsletterBody: 'Quando pubblico un nuovo articolo su sistemi AI, architettura GTM o growth operating model, sarai il primo a saperlo.',
    readArticle: "Leggi l'articolo",
    readTimeSuffix: 'min di lettura',
    subscribe: 'Iscriviti',
    moreFromInsights: 'Altri Insights',
    previous: 'Precedente',
    next: 'Avanti',
    authorLabel: "Sull'autore",
    authorBio: "Architetto GTM e Growth Operator che costruisce sistemi di ricavo AI-native per aziende B2B SaaS e tecnologiche. Collego posizionamento, SEO, contenuti, acquisizione a pagamento, CRM, automazione, analytics e flussi di lavoro AI in un'infrastruttura di crescita pratica.",
  },
  es: {
    allInsights: 'Todos los Insights',
    article: 'artículo',
    articles: 'artículos',
    bylineRole: 'GTM Architect & Growth Operator',
    featured: 'Destacado',
    newsletter: 'Newsletter',
    newsletterHeading: 'Sé el primero en recibir el siguiente.',
    newsletterBody: 'Cuando publique un nuevo artículo sobre sistemas de IA, arquitectura GTM o modelos operativos de crecimiento, serás el primero en saberlo.',
    readArticle: 'Leer el artículo',
    readTimeSuffix: 'min de lectura',
    subscribe: 'Suscribirse',
    moreFromInsights: 'Más Insights',
    previous: 'Anterior',
    next: 'Siguiente',
    authorLabel: 'Sobre el autor',
    authorBio: 'Arquitecto GTM y Growth Operator que crea sistemas de ingresos AI-native para empresas B2B SaaS y tecnológicas. Conecto posicionamiento, SEO, contenido, adquisición de pago, CRM, automatización, analytics y flujos de trabajo de IA en una infraestructura de crecimiento práctica.',
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
    ...localizedHomeList.map((locale) => ({
      lang: locale.hreflang,
      href: `https://wojciech.io/${locale.path}/insights/${slug}/`,
    })),
  ];
}

export function localizedInsightIndexAlternates() {
  return [
    { lang: 'x-default', href: 'https://wojciech.io/insights/' },
    { lang: 'en', href: 'https://wojciech.io/insights/' },
    ...localizedHomeList.map((locale) => ({
      lang: locale.hreflang,
      href: `https://wojciech.io/${locale.path}/insights/`,
    })),
  ];
}

export function readTime(body = '', locale: InsightLocale = 'en') {
  return `${Math.max(4, Math.ceil(body.split(/\s+/).filter(Boolean).length / 220))} ${insightLocaleLabels[locale].readTimeSuffix}`;
}
