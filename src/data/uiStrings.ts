// Shared UI strings for the chrome that wraps every page:
// Header CTA, primary Nav labels, CookieBanner, Footer link labels.
//
// Translations were picked to match docs/10-tone-of-voice.md:
// - idiomatic, not literal
// - short and direct
// - no AI slop
// - DE: avoids Denglish (no "Call buchen")
// - PL/IT/ES/JP: native phrasing for B2B tech audience
//
// 'en' is the canonical fallback. Any new key MUST exist in 'en' first.

import type { LocaleKey } from './locales';

export type UiLocale = LocaleKey | 'en' | 'ar';

export interface UiStrings {
  nav: {
    work: string;
    aiSystems: string;
    insights: string;
    tools: string;
    stack: string;
    about: string;
    contact: string;
  };
  cta: {
    bookCall: string;
    nextStep: string;
  };
  cookie: {
    bannerText: string;
    privacyPolicy: string;
    accept: string;
    reject: string;
  };
  footer: {
    getInTouch: string;
    allWriting: string;
    brandTagline: string;
    bottomTagline: string;
  };
}

const en: UiStrings = {
  nav: {
    work: 'Work',
    aiSystems: 'AI Systems',
    insights: 'Insights',
    tools: 'Tools',
    stack: 'Stack',
    about: 'About',
    contact: 'Contact',
  },
  cta: {
    bookCall: 'Book a call',
    nextStep: 'Next step',
  },
  cookie: {
    bannerText: 'I use PostHog and Google Analytics to see which content is useful: anonymously, EU data residency, no ads.',
    privacyPolicy: 'Privacy policy',
    accept: 'Accept analytics',
    reject: 'No thanks',
  },
  footer: {
    getInTouch: 'Get in touch →',
    allWriting: 'All writing →',
    brandTagline: 'GTM architect · AI-native builder. Revenue systems for B2B SaaS.',
    bottomTagline: 'GTM architect · AI-native builder',
  },
};

const pl: UiStrings = {
  nav: {
    work: 'Praca',
    aiSystems: 'Systemy AI',
    insights: 'Insights',
    tools: 'Narzędzia',
    stack: 'Stack',
    about: 'O mnie',
    contact: 'Kontakt',
  },
  cta: {
    bookCall: 'Umów rozmowę',
    nextStep: 'Następny krok',
  },
  cookie: {
    bannerText: 'Używam PostHog i Google Analytics, żeby wiedzieć, które treści są przydatne: anonimowo, dane w UE, bez reklam.',
    privacyPolicy: 'Polityka prywatności',
    accept: 'Akceptuję',
    reject: 'Nie, dzięki',
  },
  footer: {
    getInTouch: 'Napisz do mnie →',
    allWriting: 'Wszystkie wpisy →',
    brandTagline: 'GTM architect · AI-native builder. Systemy revenue dla B2B SaaS.',
    bottomTagline: 'GTM architect · AI-native builder',
  },
};

const de: UiStrings = {
  nav: {
    work: 'Arbeit',
    aiSystems: 'AI-Systeme',
    insights: 'Insights',
    tools: 'Tools',
    stack: 'Stack',
    about: 'Über mich',
    contact: 'Kontakt',
  },
  cta: {
    bookCall: 'Termin vereinbaren',
    nextStep: 'Nächster Schritt',
  },
  cookie: {
    bannerText: 'Ich nutze PostHog und Google Analytics, um zu sehen, welche Inhalte hilfreich sind: anonym, EU-Datenresidenz, keine Werbung.',
    privacyPolicy: 'Datenschutz',
    accept: 'Akzeptieren',
    reject: 'Nein, danke',
  },
  footer: {
    getInTouch: 'Kontakt aufnehmen →',
    allWriting: 'Alle Beiträge →',
    brandTagline: 'GTM-Architekt · AI-native Builder. Revenue-Systeme für B2B SaaS.',
    bottomTagline: 'GTM-Architekt · AI-native Builder',
  },
};

const dk: UiStrings = {
  nav: {
    work: 'Arbejde',
    aiSystems: 'AI-systemer',
    insights: 'Insights',
    tools: 'Værktøjer',
    stack: 'Stack',
    about: 'Om mig',
    contact: 'Kontakt',
  },
  cta: {
    bookCall: 'Book et møde',
    nextStep: 'Næste skridt',
  },
  cookie: {
    bannerText: 'Jeg bruger PostHog og Google Analytics for at se, hvilket indhold der er nyttigt: anonymt, EU-data, ingen annoncer.',
    privacyPolicy: 'Privatlivspolitik',
    accept: 'Accepter',
    reject: 'Nej tak',
  },
  footer: {
    getInTouch: 'Tag kontakt →',
    allWriting: 'Alle artikler →',
    brandTagline: 'GTM-arkitekt · AI-native builder. Revenue-systemer til B2B SaaS.',
    bottomTagline: 'GTM-arkitekt · AI-native builder',
  },
};

const no: UiStrings = {
  nav: {
    work: 'Arbeid',
    aiSystems: 'AI-systemer',
    insights: 'Insights',
    tools: 'Verktøy',
    stack: 'Stack',
    about: 'Om meg',
    contact: 'Kontakt',
  },
  cta: {
    bookCall: 'Book et møte',
    nextStep: 'Neste steg',
  },
  cookie: {
    bannerText: 'Jeg bruker PostHog og Google Analytics for å se hvilket innhold som er nyttig: anonymt, EU-data, ingen annonser.',
    privacyPolicy: 'Personvern',
    accept: 'Godta',
    reject: 'Nei takk',
  },
  footer: {
    getInTouch: 'Ta kontakt →',
    allWriting: 'Alle artikler →',
    brandTagline: 'GTM-arkitekt · AI-native builder. Revenue-systemer for B2B SaaS.',
    bottomTagline: 'GTM-arkitekt · AI-native builder',
  },
};

const jp: UiStrings = {
  nav: {
    work: '実績',
    aiSystems: 'AIシステム',
    insights: 'インサイト',
    tools: 'ツール',
    stack: 'スタック',
    about: 'プロフィール',
    contact: 'お問い合わせ',
  },
  cta: {
    bookCall: '相談を予約',
    nextStep: '次のステップ',
  },
  cookie: {
    bannerText: 'PostHog と Google Analytics で、どのコンテンツが役立っているかを匿名で計測しています。データは EU 内に保管され、広告には使用しません。',
    privacyPolicy: 'プライバシーポリシー',
    accept: '許可する',
    reject: '許可しない',
  },
  footer: {
    getInTouch: 'お問い合わせ →',
    allWriting: 'すべての記事 →',
    brandTagline: 'GTM アーキテクト · AI-native ビルダー。B2B SaaS のための Revenue システム。',
    bottomTagline: 'GTM アーキテクト · AI-native ビルダー',
  },
};

const it: UiStrings = {
  nav: {
    work: 'Lavoro',
    aiSystems: 'Sistemi AI',
    insights: 'Insights',
    tools: 'Strumenti',
    stack: 'Stack',
    about: 'Chi sono',
    contact: 'Contatti',
  },
  cta: {
    bookCall: 'Prenota una call',
    nextStep: 'Prossimo passo',
  },
  cookie: {
    bannerText: 'Uso PostHog e Google Analytics per capire quali contenuti sono utili: anonimo, dati in UE, niente pubblicità.',
    privacyPolicy: 'Privacy',
    accept: 'Accetta',
    reject: 'No, grazie',
  },
  footer: {
    getInTouch: 'Scrivimi →',
    allWriting: 'Tutti gli articoli →',
    brandTagline: 'GTM architect · AI-native builder. Sistemi revenue per B2B SaaS.',
    bottomTagline: 'GTM architect · AI-native builder',
  },
};

const es: UiStrings = {
  nav: {
    work: 'Trabajo',
    aiSystems: 'Sistemas IA',
    insights: 'Insights',
    tools: 'Herramientas',
    stack: 'Stack',
    about: 'Sobre mí',
    contact: 'Contacto',
  },
  cta: {
    bookCall: 'Reservar llamada',
    nextStep: 'Siguiente paso',
  },
  cookie: {
    bannerText: 'Uso PostHog y Google Analytics para ver qué contenido es útil: anónimo, datos en la UE, sin publicidad.',
    privacyPolicy: 'Privacidad',
    accept: 'Aceptar',
    reject: 'No, gracias',
  },
  footer: {
    getInTouch: 'Escríbeme →',
    allWriting: 'Todos los artículos →',
    brandTagline: 'GTM architect · AI-native builder. Sistemas de revenue para B2B SaaS.',
    bottomTagline: 'GTM architect · AI-native builder',
  },
};

const ar: UiStrings = {
  nav: {
    work: 'الأعمال',
    aiSystems: 'أنظمة الذكاء الاصطناعي',
    insights: 'رؤى',
    tools: 'أدوات',
    stack: 'التقنية',
    about: 'عنّي',
    contact: 'تواصل',
  },
  cta: {
    bookCall: 'احجز مكالمة',
    nextStep: 'الخطوة التالية',
  },
  cookie: {
    bannerText: 'أستخدم PostHog و Google Analytics لمعرفة المحتوى المفيد: بشكل مجهول، وبيانات داخل الاتحاد الأوروبي، وبدون إعلانات.',
    privacyPolicy: 'سياسة الخصوصية',
    accept: 'أوافق',
    reject: 'لا، شكرًا',
  },
  footer: {
    getInTouch: 'تواصل معي ←',
    allWriting: 'كل المقالات ←',
    brandTagline: 'مهندس GTM · باني أنظمة قائمة على الذكاء الاصطناعي. أنظمة إيراد لشركات B2B SaaS.',
    bottomTagline: 'مهندس GTM · باني قائم على الذكاء الاصطناعي',
  },
};

const STRINGS: Record<UiLocale, UiStrings> = { en, pl, de, dk, no, jp, it, es, ar };

/** Extract locale from a pathname like "/de/about/" → "de". Returns "en" for "/" or unknown locales. */
export function getLocaleFromPath(pathname: string): UiLocale {
  const segment = pathname.split('/').filter(Boolean)[0];
  if (!segment) return 'en';
  return (segment in STRINGS && segment !== 'en') ? (segment as UiLocale) : 'en';
}

/** Get the UiStrings bundle for a given locale. Falls back to English. */
export function getUiStrings(locale: UiLocale): UiStrings {
  return STRINGS[locale] ?? en;
}

/** Convenience: extract locale from pathname AND return strings in one call. */
export function getUiStringsForPath(pathname: string): UiStrings {
  return getUiStrings(getLocaleFromPath(pathname));
}

/** Pages that have a real Arabic version. Nav links to anything else stay on
 *  the English route so the Arabic chrome never points at a 404. Extend as
 *  more /ar/ pages ship. */
const AR_LOCALIZED_PATHS = new Set(['/work/', '/contact/', '/about/', '/ai-systems/', '/insights/', '/gtm/', '/marketing/', '/growth/']);

/** Prefix an internal path with the current locale segment when not EN. */
export function localizeHref(href: string, locale: UiLocale): string {
  if (locale === 'en') return href;
  // Only rewrite leading-slash relative URLs; leave absolute, hash, mailto alone.
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  // Avoid double-prefixing if the href already starts with /<locale>/.
  if (href.startsWith(`/${locale}/`) || href === `/${locale}` || href === `/${locale}/`) return href;
  // Arabic only has a subset of pages translated; link the rest to English.
  if (locale === 'ar' && !AR_LOCALIZED_PATHS.has(href)) return href;
  return `/${locale}${href}`;
}

/** Primary navigation links, with labels + hrefs already localized for the current path. */
export function getPrimaryNavLinks(pathname: string) {
  const locale = getLocaleFromPath(pathname);
  const t = getUiStrings(locale);
  const work     = { label: t.nav.work,     href: localizeHref('/work/', locale),                              minWidth: '4rem' };
  const insights = { label: t.nav.insights, href: localizeHref('/insights/', locale),                          minWidth: '4rem' };
  const about    = { label: t.nav.about,    href: localizeHref('/about/', locale),                             minWidth: '4rem' };
  const contact  = { label: t.nav.contact,  href: localizeHref('/contact/', locale),                           minWidth: '4rem' };

  // Arabic carries the three lenses too — native /ar/ pages exist. Labels are
  // Arabic (GTM stays an acronym); hrefs point at the localized pages.
  if (locale === 'ar') {
    return [
      work,
      { label: 'GTM',     href: '/ar/gtm/',       minWidth: '3rem' },
      { label: 'التسويق', href: '/ar/marketing/', minWidth: '5rem' },
      { label: 'النمو',   href: '/ar/growth/',    minWidth: '4rem' },
      insights,
      about,
      contact,
    ];
  }

  // The lens pages exist in EN (and AR) only. On other localized pages, surfacing
  // them would mix English labels into a localized bar AND link out to English
  // pages (breaking the locale), so those locales keep the clean classic nav.
  if (locale !== 'en') {
    return [work, insights, about, contact];
  }

  return [
    work,
    { label: 'GTM',       href: '/gtm/',       minWidth: '3rem' },
    { label: 'Marketing', href: '/marketing/', minWidth: '5rem' },
    { label: 'Growth',    href: '/growth/',    minWidth: '4rem' },
    insights,
    about,
    contact,
  ];
}
