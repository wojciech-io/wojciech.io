/**
 * CV data, single source of truth for /cv and localized CV pages.
 *
 * Proper nouns (companies, schools, certification names, tool brands) stay
 * untranslated. Section labels, role titles, bullet descriptions, language
 * levels and education degrees translate fully.
 */

export type CvLang = 'en' | 'pl' | 'de' | 'dk' | 'no' | 'jp' | 'it' | 'es';

export const cvSeoLang = ['en', 'pl', 'de', 'dk', 'no', 'jp', 'it', 'es'] as const satisfies readonly CvLang[];
export const cvLocalizedLangs = cvSeoLang.filter((lang) => lang !== 'en');

export const cvLanguageNames: Record<CvLang, { htmlLang: string; hreflang: string; label: string }> = {
  en: { htmlLang: 'en', hreflang: 'en', label: 'English' },
  pl: { htmlLang: 'pl', hreflang: 'pl', label: 'Polski' },
  de: { htmlLang: 'de-DE', hreflang: 'de-DE', label: 'Deutsch' },
  dk: { htmlLang: 'da-DK', hreflang: 'da-DK', label: 'Dansk' },
  no: { htmlLang: 'nb-NO', hreflang: 'nb-NO', label: 'Norsk' },
  jp: { htmlLang: 'ja-JP', hreflang: 'ja-JP', label: '日本語' },
  it: { htmlLang: 'it-IT', hreflang: 'it-IT', label: 'Italiano' },
  es: { htmlLang: 'es-ES', hreflang: 'es-ES', label: 'Español' },
};

export const cvPathForLang = (lang: CvLang) => (lang === 'en' ? '/cv/' : `/${lang}/cv/`);

type I18n = Record<CvLang, string>;
type I18nList = Record<CvLang, string[]>;

export interface CvExperience {
  /** Year range as displayed. "present" is rendered separately so it can be
   *  localized. Use the literal "Contract" for the contract block. */
  period: string;
  /** When true the period uses the contract style + the label is rendered
   *  via {@link cvData.contractLabel}. */
  contract?: boolean;
  role: I18n;
  /** Company name: proper noun, no translation. */
  company: string;
  /** Bullet copy per language. Order matters; same length across langs. */
  bullets: I18nList;
}

export interface CvEducation {
  degree: I18n;
  school: string;
  year: string;
}

export interface CvLanguageRow {
  name: I18n;
  level: I18n;
}

export interface CvData {
  meta: { title: I18n; description: I18n };
  header: {
    tagline: I18n;
    interactiveVersion: I18n;
    openToRelocation: I18n;
  };
  sections: {
    experience: I18n;
    keySkills: I18n;
    tools: I18n;
    education: I18n;
    languages: I18n;
    certifications: I18n;
  };
  presentLabel: I18n;
  contractLabel: I18n;
  printButton: I18n;
  experience: CvExperience[];
  skills: I18nList;
  /** Tools: kept untranslated (brand names). */
  tools: string[];
  education: CvEducation[];
  languages: CvLanguageRow[];
  certifications: Array<{ name: string; issuer: string }>;
}

export const cvData: CvData = {
  meta: {
    title: {
      en: 'Wojciech Łuszczyński · CV',
      pl: 'Wojciech Łuszczyński · CV',
      de: 'Wojciech Łuszczyński · Lebenslauf',
      dk: 'Wojciech Łuszczyński · CV',
      no: 'Wojciech Łuszczyński · CV',
      jp: 'Wojciech Łuszczyński · 職務経歴書',
      it: 'Wojciech Łuszczyński · CV',
      es: 'Wojciech Łuszczyński · CV',
    },
    description: {
      en: 'CV of Wojciech Łuszczyński, GTM Architect and Growth Operator. AI-native revenue systems for B2B SaaS. 20 years marketing, 10 years B2B SaaS growth.',
      pl: 'CV Wojciecha Łuszczyńskiego, GTM Architect i Growth Operator. AI-native systemy przychodowe dla B2B SaaS. 20 lat marketingu, 10 lat growth w B2B SaaS.',
      de: 'Lebenslauf von Wojciech Łuszczyński, GTM Architect und Growth Operator. AI-native Revenue-Systeme für B2B SaaS. 20 Jahre Marketing, 10 Jahre B2B SaaS Growth.',
      dk: 'CV for Wojciech Łuszczyński, GTM Architect og Growth Operator. AI-native revenue-systemer til B2B SaaS. 20 år med marketing, 10 år med B2B SaaS growth.',
      no: 'CV for Wojciech Łuszczyński, GTM Architect og Growth Operator. AI-native revenue-systemer for B2B SaaS. 20 år med markedsføring, 10 år med B2B SaaS growth.',
      jp: 'Wojciech Łuszczyńskiの職務経歴書。GTM Architect、Growth Operator。B2B SaaS向けのAI-native revenue systems。マーケティング20年、B2B SaaS growth 10年。',
      it: 'CV di Wojciech Łuszczyński, GTM Architect e Growth Operator. Sistemi di ricavo AI-native per B2B SaaS. 20 anni di marketing, 10 anni di growth in B2B SaaS.',
      es: 'CV de Wojciech Łuszczyński, GTM Architect y Growth Operator. Sistemas de revenue AI-native para B2B SaaS. 20 años en marketing, 10 años en growth B2B SaaS.',
    },
  },
  header: {
    tagline: {
      en: 'Growth operator · GTM architect · AI-native builder',
      pl: 'Growth operator · architekt GTM · AI-native builder',
      de: 'Growth Operator · GTM-Architekt · AI-native Builder',
      dk: 'Growth operator · GTM-arkitekt · AI-native builder',
      no: 'Growth operator · GTM-arkitekt · AI-native builder',
      jp: 'Growth operator · GTM architect · AI-native builder',
      it: 'Growth operator · architetto GTM · AI-native builder',
      es: 'Growth operator · arquitecto GTM · AI-native builder',
    },
    interactiveVersion: {
      en: 'interactive version',
      pl: 'wersja interaktywna',
      de: 'interaktive Version',
      dk: 'interaktiv version',
      no: 'interaktiv versjon',
      jp: 'インタラクティブ版',
      it: 'versione interattiva',
      es: 'versión interactiva',
    },
    openToRelocation: {
      en: 'Remote · Open to relocation',
      pl: 'Zdalnie · Otwarty na relokację',
      de: 'Remote · offen für Relocation',
      dk: 'Remote · åben for relocation',
      no: 'Remote · åpen for relocation',
      jp: 'リモート · 移住も検討可能',
      it: 'Da remoto · Disponibile a trasferimento',
      es: 'Remote · abierto a relocation',
    },
  },
  sections: {
    experience: { en: 'Experience', pl: 'Doświadczenie', de: 'Erfahrung', dk: 'Erfaring', no: 'Erfaring', jp: '職務経験', it: 'Esperienza', es: 'Experiencia' },
    keySkills: { en: 'Key skills', pl: 'Kluczowe kompetencje', de: 'Kernkompetenzen', dk: 'Nøglekompetencer', no: 'Nøkkelkompetanse', jp: '主要スキル', it: 'Competenze chiave', es: 'Competencias clave' },
    tools: { en: 'Tools & platforms', pl: 'Narzędzia i platformy', de: 'Tools & Plattformen', dk: 'Værktøjer & platforme', no: 'Verktøy & plattformer', jp: 'ツール & プラットフォーム', it: 'Strumenti e piattaforme', es: 'Herramientas y plataformas' },
    education: { en: 'Education', pl: 'Wykształcenie', de: 'Ausbildung', dk: 'Uddannelse', no: 'Utdanning', jp: '学歴', it: 'Istruzione', es: 'Formación' },
    languages: { en: 'Languages', pl: 'Języki', de: 'Sprachen', dk: 'Sprog', no: 'Språk', jp: '言語', it: 'Lingue', es: 'Idiomas' },
    certifications: { en: 'Certifications', pl: 'Certyfikaty', de: 'Zertifizierungen', dk: 'Certificeringer', no: 'Sertifiseringer', jp: '認定資格', it: 'Certificazioni', es: 'Certificaciones' },
  },
  presentLabel: { en: 'present', pl: 'obecnie', de: 'heute', dk: 'nu', no: 'nå', jp: '現在', it: 'oggi', es: 'actualidad' },
  contractLabel: { en: 'Contract', pl: 'Kontrakt', de: 'Vertrag', dk: 'Kontrakt', no: 'Kontrakt', jp: '契約', it: 'Contratto', es: 'Contrato' },
  printButton: { en: 'Save as PDF →', pl: 'Zapisz jako PDF →', de: 'Als PDF speichern →', dk: 'Gem som PDF →', no: 'Lagre som PDF →', jp: 'PDFとして保存 →', it: 'Salva come PDF →', es: 'Guardar como PDF →' },

  experience: [
    {
      period: '2025 –\npresent',
      role: { en: 'Head of Marketing', pl: 'Head of Marketing', de: 'Head of Marketing', dk: 'Head of Marketing', no: 'Head of Marketing', jp: 'Head of Marketing', it: 'Head of Marketing', es: 'Head of Marketing' },
      company: 'WebWave / WeNet Group',
      bullets: {
        en: [
          'Leading global marketing and growth for an AI-powered no-code website builder',
          'GTM strategy, commercial messaging, and data-driven growth engine',
          'Full-funnel ownership: SEO, content, paid, automation, and lifecycle',
        ],
        pl: [
          'Prowadzę globalny marketing i growth dla no-code builderu stron z AI',
          'Strategia GTM, komunikacja sprzedażowa i engine growthowy oparty na danych',
          'Pełna własność lejka: SEO, content, paid, automatyzacja, lifecycle',
        ],
        de: [
          'Globale Marketing- und Growth-Arbeit für einen AI-powered No-Code Website Builder',
          'GTM-Strategie, kommerzielles Messaging und datengetriebener Growth Engine',
          'Full-funnel Ownership: SEO, Content, Paid, Automatisierung und Lifecycle',
        ],
        dk: [
          'Leder global marketing og growth for en AI-powered no-code website builder',
          'GTM-strategi, kommercielt messaging og datadrevet growth engine',
          'Full-funnel ownership: SEO, content, paid, automatisering og lifecycle',
        ],
        no: [
          'Leder global marketing og growth for en AI-powered no-code website builder',
          'GTM-strategi, kommersielt messaging og datadrevet growth engine',
          'Full-funnel ownership: SEO, content, paid, automatisering og lifecycle',
        ],
        jp: [
          'AI-powered no-code website builderのグローバルmarketingとgrowthをリード',
          'GTM戦略、商業的messaging、データドリブンなgrowth engine',
          'SEO、content、paid、automation、lifecycleまでfull-funnelで担当',
        ],
        it: [
          'Guido marketing e growth globali per un website builder no-code basato su AI',
          'Strategia GTM, messaging commerciale e motore di crescita data-driven',
          'Ownership dell’intero funnel: SEO, content, paid, automation, lifecycle',
        ],
        es: [
          'Lidero marketing y growth global para un website builder no-code con IA',
          'Estrategia GTM, messaging comercial y motor de growth basado en datos',
          'Ownership full-funnel: SEO, content, paid, automatización y lifecycle',
        ],
      },
    },
    {
      period: '2024 –\n2025',
      role: {
        en: 'Head of Growth & Web Development',
        pl: 'Head of Growth i Web Development',
        de: 'Head of Growth & Web Development',
        dk: 'Head of Growth & Web Development',
        no: 'Head of Growth & Web Development',
        jp: 'Head of Growth & Web Development',
        it: 'Head of Growth & Web Development',
        es: 'Head of Growth & Web Development',
      },
      company: 'Symfonia',
      bullets: {
        en: [
          'Increased organic traffic by 40% through SEO and technical improvements',
          'Increased lead generation by 30% with high-converting landing pages and A/B testing',
          'Grew blog traffic by 50% through automation-driven content strategies',
          'Optimised website speed by 25%, enhancing user experience and engagement',
          'Streamlined workflows integrating marketing, product, and web development',
        ],
        pl: [
          'Wzrost ruchu organicznego o 40% dzięki SEO i poprawkom technicznym',
          'Wzrost lead generation o 30%: konwertujące landingi i testy A/B',
          'Wzrost ruchu na blogu o 50% dzięki contentowi opartemu na automatyzacji',
          'Optymalizacja prędkości strony o 25%, lepsze UX i zaangażowanie',
          'Spięcie workflow marketingu, produktu i web developmentu',
        ],
        de: [
          'Organischer Traffic um 40% gesteigert durch SEO und technische Verbesserungen',
          'Lead Generation um 30% gesteigert mit konvertierenden Landing Pages und A/B-Tests',
          'Blog-Traffic um 50% gesteigert durch automation-driven Content-Strategien',
          'Website-Speed um 25% optimiert, mit besserer UX und höherem Engagement',
          'Workflows zwischen Marketing, Produkt und Web Development gestrafft',
        ],
        dk: [
          'Øgede organisk trafik med 40% gennem SEO og tekniske forbedringer',
          'Øgede lead generation med 30% med højkonverterende landingssider og A/B-tests',
          'Øgede blogtrafik med 50% gennem automation-driven content-strategier',
          'Optimerede website speed med 25%, med bedre UX og engagement',
          'Strømlinede workflows på tværs af marketing, produkt og web development',
        ],
        no: [
          'Økte organisk trafikk med 40% gjennom SEO og tekniske forbedringer',
          'Økte lead generation med 30% med landingssider med høy konvertering og A/B-tester',
          'Økte bloggtrafikk med 50% gjennom automation-driven content-strategier',
          'Optimaliserte website speed med 25%, med bedre UX og engasjement',
          'Strømlinjeformet workflows mellom marketing, produkt og web development',
        ],
        jp: [
          'SEOと技術改善によりorganic trafficを40%増加',
          '高CVRのlanding pagesとA/B testingでlead generationを30%増加',
          'automation-driven content strategyでブログtrafficを50%増加',
          'サイト速度を25%最適化し、UXとengagementを改善',
          'marketing、product、web developmentをつなぐworkflowを整備',
        ],
        it: [
          'Aumento del traffico organico del 40% con SEO e ottimizzazioni tecniche',
          'Aumento della lead generation del 30% con landing ad alta conversione e test A/B',
          'Crescita del traffico del blog del 50% grazie a content strategy automatizzate',
          'Ottimizzazione della velocità del sito del 25%, miglior UX ed engagement',
          'Workflow integrati tra marketing, prodotto e web development',
        ],
        es: [
          'Aumenté el tráfico orgánico un 40% con SEO y mejoras técnicas',
          'Aumenté la lead generation un 30% con landing pages de alta conversión y tests A/B',
          'Aumenté el tráfico del blog un 50% con estrategias de content automation',
          'Optimicé la velocidad del sitio un 25%, mejorando UX y engagement',
          'Integré workflows entre marketing, producto y web development',
        ],
      },
    },
    {
      period: '2020 –\n2024',
      role: { en: 'Global Head of Growth', pl: 'Global Head of Growth', de: 'Global Head of Growth', dk: 'Global Head of Growth', no: 'Global Head of Growth', jp: 'Global Head of Growth', it: 'Global Head of Growth', es: 'Global Head of Growth' },
      company: 'SentiOne',
      bullets: {
        en: [
          'Built B2B SaaS GTM across Europe, UK, US, UAE, and LATAM',
          '50% surge in website traffic via SEO, redesign, and content strategy',
          'Accelerated customer acquisition by 80% using precision-targeted communications',
          '20% lift in sales leads through strategic collaboration with sales teams',
          'Amplified brand recognition by 60% through tailored global strategies',
        ],
        pl: [
          'Zbudowany GTM B2B SaaS w Europie, UK, USA, ZEA i LATAM',
          'Wzrost ruchu na stronie o 50% dzięki SEO, redesignowi i strategii contentowej',
          'Przyspieszone pozyskiwanie klientów o 80% dzięki precyzyjnej komunikacji',
          'Wzrost leadów sprzedażowych o 20% przez strategiczną współpracę z sales',
          'Wzrost rozpoznawalności marki o 60% dzięki dopasowanym strategiom per rynek',
        ],
        de: [
          'B2B SaaS GTM in Europa, UK, USA, VAE und LATAM aufgebaut',
          'Website-Traffic um 50% gesteigert durch SEO, Redesign und Content-Strategie',
          'Customer Acquisition um 80% beschleunigt durch präzise Zielgruppenkommunikation',
          'Sales Leads um 20% erhöht durch strategische Zusammenarbeit mit Sales-Teams',
          'Brand Recognition um 60% gesteigert durch marktangepasste globale Strategien',
        ],
        dk: [
          'Byggede B2B SaaS GTM på tværs af Europa, UK, USA, UAE og LATAM',
          'Øgede website traffic med 50% gennem SEO, redesign og content strategy',
          'Accelererede customer acquisition med 80% via præcist målrettet kommunikation',
          'Øgede sales leads med 20% gennem strategisk samarbejde med sales teams',
          'Øgede brand recognition med 60% gennem skræddersyede globale strategier',
        ],
        no: [
          'Bygget B2B SaaS GTM på tvers av Europa, UK, USA, UAE og LATAM',
          'Økte website traffic med 50% gjennom SEO, redesign og content strategy',
          'Akselererte customer acquisition med 80% gjennom presis målrettet kommunikasjon',
          'Økte sales leads med 20% gjennom strategisk samarbeid med sales teams',
          'Økte brand recognition med 60% gjennom tilpassede globale strategier',
        ],
        jp: [
          'Europe、UK、US、UAE、LATAMでB2B SaaS GTMを構築',
          'SEO、redesign、content strategyによりwebsite trafficを50%増加',
          '精密なターゲットcommunicationでcustomer acquisitionを80%加速',
          'sales teamとの戦略的連携でsales leadsを20%増加',
          '市場別のglobal strategyでbrand recognitionを60%向上',
        ],
        it: [
          'GTM B2B SaaS costruito in Europa, UK, USA, EAU e America Latina',
          'Aumento del traffico web del 50% con SEO, redesign e content strategy',
          'Acquisizione clienti accelerata dell’80% con comunicazione di precisione',
          'Aumento dei lead commerciali del 20% grazie alla collaborazione con il sales',
          'Riconoscibilità del marchio aumentata del 60% con strategie globali su misura',
        ],
        es: [
          'Construí GTM B2B SaaS en Europa, UK, US, UAE y LATAM',
          'Aumenté el tráfico web un 50% con SEO, redesign y content strategy',
          'Aceleré la adquisición de clientes un 80% con comunicaciones de precisión',
          'Aumenté los sales leads un 20% mediante colaboración estratégica con sales',
          'Elevé el reconocimiento de marca un 60% con estrategias globales adaptadas',
        ],
      },
    },
    {
      period: '2019 –\n2020',
      role: {
        en: 'Head of Lifecycle Marketing',
        pl: 'Head of Lifecycle Marketing',
        de: 'Head of Lifecycle Marketing',
        dk: 'Head of Lifecycle Marketing',
        no: 'Head of Lifecycle Marketing',
        jp: 'Head of Lifecycle Marketing',
        it: 'Head of Lifecycle Marketing',
        es: 'Head of Lifecycle Marketing',
      },
      company: 'GetResponse',
      bullets: {
        en: [
          'Elevated customer engagement and revenue by 30% through CRM-led lifecycle marketing',
          'Implemented CRM for 25% conversion uplift via customer insights and segmentation',
          'Led A/B tests achieving a 20% increase in conversion rates',
          'Orchestrated global campaigns with successful market penetration in US, LATAM, EU',
        ],
        pl: [
          'Wzrost engagementu i przychodu o 30% dzięki lifecycle marketingowi opartemu na CRM',
          'Wdrożenie CRM, wzrost konwersji o 25% dzięki insightom i segmentacji',
          'Testy A/B osiągające wzrost konwersji o 20%',
          'Globalne kampanie z udaną ekspansją w USA, LATAM, UE',
        ],
        de: [
          'Customer Engagement und Revenue um 30% gesteigert durch CRM-led Lifecycle Marketing',
          'CRM eingeführt, 25% Conversion-Uplift durch Customer Insights und Segmentierung',
          'A/B-Tests geleitet, die Conversion Rates um 20% erhöhten',
          'Globale Kampagnen orchestriert mit erfolgreicher Marktdurchdringung in USA, LATAM und EU',
        ],
        dk: [
          'Øgede customer engagement og revenue med 30% gennem CRM-led lifecycle marketing',
          'Implementerede CRM med 25% conversion uplift via customer insights og segmentering',
          'Ledte A/B-tests med 20% stigning i conversion rates',
          'Orkestrerede globale kampagner med stærk markedsindtrængning i USA, LATAM og EU',
        ],
        no: [
          'Økte customer engagement og revenue med 30% gjennom CRM-led lifecycle marketing',
          'Implementerte CRM med 25% conversion uplift via customer insights og segmentering',
          'Ledet A/B-tester som ga 20% økning i conversion rates',
          'Orkestrerte globale kampanjer med vellykket markedsinntreden i USA, LATAM og EU',
        ],
        jp: [
          'CRM-led lifecycle marketingでcustomer engagementとrevenueを30%向上',
          'customer insightsとsegmentationを活用したCRM導入でconversionを25%向上',
          'A/B testsをリードし、conversion ratesを20%増加',
          'US、LATAM、EUで市場浸透に成功したglobal campaignsを推進',
        ],
        it: [
          'Engagement clienti e revenue aumentati del 30% con lifecycle marketing su CRM',
          'CRM implementato, aumento conversioni del 25% con insight e segmentazione',
          'Test A/B che hanno portato a un aumento del 20% del tasso di conversione',
          'Campagne globali con penetrazione di successo in USA, America Latina, UE',
        ],
        es: [
          'Aumenté customer engagement y revenue un 30% con lifecycle marketing guiado por CRM',
          'Implementé CRM con un 25% de conversion uplift mediante insights y segmentación',
          'Lideré tests A/B que elevaron conversion rates un 20%',
          'Orquesté campañas globales con entrada efectiva en USA, LATAM y UE',
        ],
      },
    },
    {
      period: 'Contract',
      contract: true,
      role: {
        en: 'AI & Innovation Manager · Fractional CMO · Head of Marketing',
        pl: 'AI & Innovation Manager · Fractional CMO · Head of Marketing',
        de: 'AI & Innovation Manager · Fractional CMO · Head of Marketing',
        dk: 'AI & Innovation Manager · Fractional CMO · Head of Marketing',
        no: 'AI & Innovation Manager · Fractional CMO · Head of Marketing',
        jp: 'AI & Innovation Manager · Fractional CMO · Head of Marketing',
        it: 'AI & Innovation Manager · CMO frazionale · Head of Marketing',
        es: 'AI & Innovation Manager · Fractional CMO · Head of Marketing',
      },
      company: 'Gi Group Holding · Tekhuset · Lilla House Digital',
      bullets: {
        en: [
          'AI-driven workflow transformation and ATS unification at Gi Group (2k+ employees)',
          'AR / metaverse project exploration and action planning',
          'Growth, SEO, and A/B testing optimisation at Tekhuset',
          'Digital marketing and revenue campaigns at Lilla House Digital',
        ],
        pl: [
          'Transformacja workflow oparta na AI i ujednolicenie ATS w Gi Group (2k+ pracowników)',
          'Eksploracja projektów AR / metaverse i plan działania',
          'Growth, SEO i optymalizacja testów A/B w Tekhuset',
          'Marketing cyfrowy i kampanie revenue w Lilla House Digital',
        ],
        de: [
          'AI-driven Workflow-Transformation und ATS-Vereinheitlichung bei Gi Group (2k+ Mitarbeitende)',
          'AR / Metaverse-Projektexploration und Action Planning',
          'Growth, SEO und A/B-Testing-Optimierung bei Tekhuset',
          'Digital Marketing und Revenue-Kampagnen bei Lilla House Digital',
        ],
        dk: [
          'AI-driven workflow transformation og ATS-unificering hos Gi Group (2k+ medarbejdere)',
          'AR / metaverse project exploration og action planning',
          'Growth, SEO og A/B-testing optimering hos Tekhuset',
          'Digital marketing og revenue-kampagner hos Lilla House Digital',
        ],
        no: [
          'AI-driven workflow transformation og ATS-samling i Gi Group (2k+ ansatte)',
          'AR / metaverse project exploration og action planning',
          'Growth, SEO og A/B-testing optimalisering hos Tekhuset',
          'Digital marketing og revenue-kampanjer hos Lilla House Digital',
        ],
        jp: [
          'Gi GroupでAI-driven workflow transformationとATS統合を推進 (2k+ employees)',
          'AR / metaverse project explorationとaction planning',
          'Tekhusetでgrowth、SEO、A/B testing最適化',
          'Lilla House Digitalでdigital marketingとrevenue campaignsを推進',
        ],
        it: [
          'Trasformazione workflow AI e unificazione ATS in Gi Group (2k+ dipendenti)',
          'Esplorazione progetti AR / metaverso e action plan',
          'Growth, SEO e ottimizzazione test A/B in Tekhuset',
          'Marketing digitale e campagne revenue in Lilla House Digital',
        ],
        es: [
          'Transformación de workflows con IA y unificación de ATS en Gi Group (2k+ empleados)',
          'Exploración de proyectos AR / metaverse y action planning',
          'Optimización de growth, SEO y A/B testing en Tekhuset',
          'Marketing digital y campañas de revenue en Lilla House Digital',
        ],
      },
    },
    {
      period: '2018 –\n2019',
      role: { en: 'Head of Digital', pl: 'Head of Digital', de: 'Head of Digital', dk: 'Head of Digital', no: 'Head of Digital', jp: 'Head of Digital', it: 'Head of Digital', es: 'Head of Digital' },
      company: 'Marquard Media Group',
      bullets: {
        en: [
          'Led digital strategy for 9 portals with a 21-person team across EU markets',
          'Launched a mobile app expanding B2C and B2B reach',
          'Optimised SEO, PPC, UX/UI, and conversion funnels',
          'Developed product roadmaps aligned with market trends',
        ],
        pl: [
          'Strategia cyfrowa dla 9 portali, zespół 21 osób, rynki UE',
          'Wdrożenie aplikacji mobilnej zwiększającej zasięg B2C i B2B',
          'Optymalizacja SEO, PPC, UX/UI i lejków konwersji',
          'Roadmapy produktowe dopasowane do trendów rynkowych',
        ],
        de: [
          'Digitale Strategie für 9 Portale mit einem 21-köpfigen Team in EU-Märkten geleitet',
          'Mobile App gelauncht, die B2C- und B2B-Reichweite erweitert hat',
          'SEO, PPC, UX/UI und Conversion Funnels optimiert',
          'Product Roadmaps entlang von Markttrends entwickelt',
        ],
        dk: [
          'Ledte digital strategi for 9 portaler med et team på 21 personer på tværs af EU-markeder',
          'Lancerede en mobilapp, der udvidede B2C- og B2B-rækkevidde',
          'Optimerede SEO, PPC, UX/UI og conversion funnels',
          'Udviklede product roadmaps tilpasset markedstendenser',
        ],
        no: [
          'Ledet digital strategi for 9 portaler med et team på 21 personer på tvers av EU-markeder',
          'Lanserte en mobilapp som utvidet B2C- og B2B-rekkevidde',
          'Optimaliserte SEO, PPC, UX/UI og conversion funnels',
          'Utviklet product roadmaps tilpasset markedstrender',
        ],
        jp: [
          'EU市場で21名チームを率い、9つのportalのdigital strategyを推進',
          'B2CとB2Bのreachを広げるmobile appをローンチ',
          'SEO、PPC、UX/UI、conversion funnelsを最適化',
          '市場トレンドに沿ったproduct roadmapsを策定',
        ],
        it: [
          'Strategia digitale per 9 portali con un team di 21 persone nei mercati UE',
          'Lancio di un’app mobile che ha esteso la copertura B2C e B2B',
          'Ottimizzazione di SEO, PPC, UX/UI e funnel di conversione',
          'Roadmap di prodotto allineate ai trend di mercato',
        ],
        es: [
          'Lideré la estrategia digital de 9 portales con un equipo de 21 personas en mercados UE',
          'Lancé una app móvil que amplió el alcance B2C y B2B',
          'Optimicé SEO, PPC, UX/UI y conversion funnels',
          'Desarrollé product roadmaps alineados con tendencias de mercado',
        ],
      },
    },
    {
      period: '2015 –\n2018',
      role: {
        en: 'Head of Marketing Communications',
        pl: 'Head of Marketing Communications',
        de: 'Head of Marketing Communications',
        dk: 'Head of Marketing Communications',
        no: 'Head of Marketing Communications',
        jp: 'Head of Marketing Communications',
        it: 'Head of Marketing Communications',
        es: 'Head of Marketing Communications',
      },
      company: 'City of Łódź Office',
      bullets: {
        en: [
          'Surpassed marketing communication goals by 25% within budget constraints',
          'Exceeded marketing targets by 30% through strategic planning and execution',
          'Secured 50+ media placements across broadcast, print, and digital channels',
          '15% rise in operational efficiency through team integration initiatives',
        ],
        pl: [
          'Przekroczenie celów komunikacji marketingowej o 25% przy ograniczonym budżecie',
          'Przekroczenie celów marketingowych o 30% dzięki planowaniu i egzekucji',
          '50+ publikacji w mediach TV, prasie i digital',
          '15% wzrost efektywności operacyjnej dzięki integracji zespołów',
        ],
        de: [
          'Marketing-Communication-Ziele trotz Budgetgrenzen um 25% übertroffen',
          'Marketingziele um 30% übertroffen durch strategische Planung und Umsetzung',
          '50+ Medienplatzierungen in Broadcast, Print und Digital gesichert',
          'Operative Effizienz durch Team-Integration um 15% gesteigert',
        ],
        dk: [
          'Overgik marketing communication goals med 25% inden for stramme budgetter',
          'Overgik marketing targets med 30% gennem strategisk planlægning og eksekvering',
          'Sikrede 50+ media placements på broadcast, print og digital',
          '15% stigning i operationel effektivitet gennem team-integration',
        ],
        no: [
          'Overgikk marketing communication goals med 25% innenfor budsjettbegrensninger',
          'Overgikk marketing targets med 30% gjennom strategisk planlegging og gjennomføring',
          'Sikret 50+ media placements på broadcast, print og digital',
          '15% økning i operasjonell effektivitet gjennom team-integrasjon',
        ],
        jp: [
          '限られた予算内でmarketing communication goalsを25%超過達成',
          'strategic planningとexecutionでmarketing targetsを30%超過達成',
          'broadcast、print、digitalで50+ media placementsを獲得',
          'team integrationによりoperational efficiencyを15%向上',
        ],
        it: [
          'Obiettivi di comunicazione marketing superati del 25% nei limiti di budget',
          'Obiettivi marketing superati del 30% con pianificazione ed esecuzione strategica',
          '50+ apparizioni nei media (broadcast, stampa, digital)',
          'Aumento del 15% dell’efficienza operativa con iniziative di integrazione del team',
        ],
        es: [
          'Superé los objetivos de marketing communication un 25% dentro de límites de presupuesto',
          'Superé marketing targets un 30% mediante planificación y ejecución estratégica',
          'Aseguré 50+ media placements en broadcast, prensa y digital',
          'Elevé la eficiencia operativa un 15% mediante integración de equipos',
        ],
      },
    },
    {
      period: '2010 –\n2015',
      role: { en: 'PR Manager', pl: 'PR Manager', de: 'PR Manager', dk: 'PR Manager', no: 'PR Manager', jp: 'PR Manager', it: 'PR Manager', es: 'PR Manager' },
      company: 'City of Łódź Office',
      bullets: {
        en: [
          '20% growth in social media audience through team leadership and brand strategy',
          '40% spike in media coverage through engaging content production',
          '95% adherence to PR campaign KPIs; 95% success rate in project execution',
          'Five strategic partnerships boosting brand and community engagement',
        ],
        pl: [
          '20% wzrost audiencji social media dzięki przywództwu i strategii marki',
          '40% wzrost obecności w mediach dzięki produkcji angażującego contentu',
          '95% realizacji KPI kampanii PR; 95% skuteczności egzekucji projektów',
          'Pięć partnerstw strategicznych wzmacniających markę i engagement społeczności',
        ],
        de: [
          'Social-Media-Audience um 20% gesteigert durch Teamführung und Brand Strategy',
          'Media Coverage um 40% erhöht durch Produktion von engaging Content',
          '95% Erfüllung der PR-Kampagnen-KPIs; 95% Erfolgsrate in der Projektumsetzung',
          'Fünf strategische Partnerschaften zur Stärkung von Brand und Community Engagement',
        ],
        dk: [
          '20% vækst i social media audience gennem team leadership og brand strategy',
          '40% stigning i media coverage gennem engagerende content production',
          '95% adherence til PR campaign KPIs; 95% success rate i project execution',
          'Fem strategiske partnerskaber, der styrkede brand og community engagement',
        ],
        no: [
          '20% vekst i social media audience gjennom team leadership og brand strategy',
          '40% økning i media coverage gjennom engasjerende content production',
          '95% adherence til PR campaign KPIs; 95% success rate i project execution',
          'Fem strategiske partnerskap som styrket brand og community engagement',
        ],
        jp: [
          'team leadershipとbrand strategyによりsocial media audienceを20%増加',
          'engaging content productionによりmedia coverageを40%増加',
          'PR campaign KPIsの95%を達成、project execution成功率95%',
          'brandとcommunity engagementを高める5つのstrategic partnerships',
        ],
        it: [
          'Crescita del 20% dell’audience social grazie a leadership di team e brand strategy',
          'Aumento del 40% della copertura mediatica con contenuti coinvolgenti',
          '95% di KPI di campagne PR raggiunti; 95% di successo nell’esecuzione progetti',
          'Cinque partnership strategiche che hanno aumentato brand engagement e comunità',
        ],
        es: [
          '20% de crecimiento de social media audience mediante team leadership y brand strategy',
          '40% de aumento en media coverage mediante producción de contenido atractivo',
          '95% de cumplimiento de KPIs de campañas PR; 95% de éxito en project execution',
          'Cinco alianzas estratégicas que impulsaron brand y community engagement',
        ],
      },
    },
  ],

  skills: {
    en: [
      'Revenue architecture',
      'GTM systems',
      'AI workflows',
      'B2B SaaS',
      'Growth strategy',
      'SEO',
      'CRO',
      'CRM',
      'Outbound',
      'Lifecycle marketing',
      'PPC',
      'UX / UI',
      'Data analysis',
      'Leadership',
      'Project management',
      'Brand management',
      'Media monitoring',
      'Crisis comms',
    ],
    pl: [
      'Architektura przychodów',
      'Systemy GTM',
      'Workflow AI',
      'B2B SaaS',
      'Strategia growth',
      'SEO',
      'CRO',
      'CRM',
      'Outbound',
      'Lifecycle marketing',
      'PPC',
      'UX / UI',
      'Analiza danych',
      'Przywództwo',
      'Project management',
      'Zarządzanie marką',
      'Monitoring mediów',
      'Komunikacja kryzysowa',
    ],
    de: [
      'Revenue-Architektur',
      'GTM-Systeme',
      'AI-Workflows',
      'B2B SaaS',
      'Growth-Strategie',
      'SEO',
      'CRO',
      'CRM',
      'Outbound',
      'Lifecycle Marketing',
      'PPC',
      'UX / UI',
      'Datenanalyse',
      'Leadership',
      'Project Management',
      'Brand Management',
      'Media Monitoring',
      'Krisenkommunikation',
    ],
    dk: [
      'Revenue architecture',
      'GTM-systemer',
      'AI-workflows',
      'B2B SaaS',
      'Growth strategy',
      'SEO',
      'CRO',
      'CRM',
      'Outbound',
      'Lifecycle marketing',
      'PPC',
      'UX / UI',
      'Dataanalyse',
      'Leadership',
      'Project management',
      'Brand management',
      'Media monitoring',
      'Crisis comms',
    ],
    no: [
      'Revenue architecture',
      'GTM-systemer',
      'AI-workflows',
      'B2B SaaS',
      'Growth strategy',
      'SEO',
      'CRO',
      'CRM',
      'Outbound',
      'Lifecycle marketing',
      'PPC',
      'UX / UI',
      'Dataanalyse',
      'Leadership',
      'Project management',
      'Brand management',
      'Media monitoring',
      'Crisis comms',
    ],
    jp: [
      'Revenue architecture',
      'GTM systems',
      'AI workflows',
      'B2B SaaS',
      'Growth strategy',
      'SEO',
      'CRO',
      'CRM',
      'Outbound',
      'Lifecycle marketing',
      'PPC',
      'UX / UI',
      'Data analysis',
      'Leadership',
      'Project management',
      'Brand management',
      'Media monitoring',
      'Crisis comms',
    ],
    it: [
      'Architettura del revenue',
      'Sistemi GTM',
      'Workflow AI',
      'B2B SaaS',
      'Strategia di growth',
      'SEO',
      'CRO',
      'CRM',
      'Outbound',
      'Lifecycle marketing',
      'PPC',
      'UX / UI',
      'Analisi dati',
      'Leadership',
      'Project management',
      'Brand management',
      'Media monitoring',
      'Comunicazione di crisi',
    ],
    es: [
      'Revenue architecture',
      'Sistemas GTM',
      'AI workflows',
      'B2B SaaS',
      'Growth strategy',
      'SEO',
      'CRO',
      'CRM',
      'Outbound',
      'Lifecycle marketing',
      'PPC',
      'UX / UI',
      'Análisis de datos',
      'Leadership',
      'Project management',
      'Brand management',
      'Media monitoring',
      'Crisis comms',
    ],
  },

  tools: [
    'Claude', 'Claude Code', 'ChatGPT', 'Perplexity', 'NotebookLM',
    'n8n', 'Make', 'Zapier', 'Clay',
    'HubSpot', 'Salesforce', 'Klaviyo', 'Intercom',
    'GA4', 'Mixpanel', 'PostHog', 'Looker Studio', 'Hotjar',
    'Ahrefs', 'SEMrush', 'Brand24',
    'Google Ads', 'Linear', 'Figma', 'Notion', 'Cursor',
  ],

  education: [
    {
      degree: {
        en: 'Executive MBA',
        pl: 'Executive MBA',
        de: 'Executive MBA',
        dk: 'Executive MBA',
        no: 'Executive MBA',
        jp: 'Executive MBA',
        it: 'Executive MBA',
        es: 'Executive MBA',
      },
      school: 'Collegium Humanum',
      year: '2021',
    },
    {
      degree: {
        en: 'MSc Journalism & Social Comms',
        pl: 'Mgr Dziennikarstwa i Komunikacji Społecznej',
        de: 'MSc Journalismus & Sozialkommunikation',
        dk: 'MSc Journalism & Social Comms',
        no: 'MSc Journalism & Social Comms',
        jp: 'MSc Journalism & Social Comms',
        it: 'Master in Giornalismo e Comunicazione Sociale',
        es: 'Máster en Periodismo y Comunicación Social',
      },
      school: 'University of Łódź',
      year: '2021 – 2022',
    },
    {
      degree: {
        en: 'Post-graduate · Public Relations',
        pl: 'Studia podyplomowe · Public Relations',
        de: 'Postgraduate · Public Relations',
        dk: 'Postgraduate · Public Relations',
        no: 'Postgraduate · Public Relations',
        jp: 'Postgraduate · Public Relations',
        it: 'Master post-laurea · Public Relations',
        es: 'Postgrado · Public Relations',
      },
      school: 'Warsaw School of Economics',
      year: '2016 – 2017',
    },
    {
      degree: {
        en: 'BSc International Relations',
        pl: 'Lic. Stosunki Międzynarodowe',
        de: 'BSc Internationale Beziehungen',
        dk: 'BSc International Relations',
        no: 'BSc International Relations',
        jp: 'BSc International Relations',
        it: 'Laurea in Relazioni Internazionali',
        es: 'Grado en Relaciones Internacionales',
      },
      school: 'University of Łódź',
      year: '2007 – 2010',
    },
  ],

  languages: [
    {
      name: { en: 'Polish', pl: 'Polski', de: 'Polnisch', dk: 'Polsk', no: 'Polsk', jp: 'ポーランド語', it: 'Polacco', es: 'Polaco' },
      level: { en: 'Native', pl: 'Ojczysty', de: 'Muttersprache', dk: 'Modersmål', no: 'Morsmål', jp: 'ネイティブ', it: 'Madrelingua', es: 'Nativo' },
    },
    {
      name: { en: 'English', pl: 'Angielski', de: 'Englisch', dk: 'Engelsk', no: 'Engelsk', jp: '英語', it: 'Inglese', es: 'Inglés' },
      level: { en: 'Native', pl: 'Ojczysty', de: 'Muttersprache', dk: 'Modersmål', no: 'Morsmål', jp: 'ネイティブ', it: 'Madrelingua', es: 'Nativo' },
    },
    {
      name: { en: 'German', pl: 'Niemiecki', de: 'Deutsch', dk: 'Tysk', no: 'Tysk', jp: 'ドイツ語', it: 'Tedesco', es: 'Alemán' },
      level: { en: 'Basic', pl: 'Podstawowy', de: 'Grundkenntnisse', dk: 'Basis', no: 'Grunnleggende', jp: '基礎', it: 'Base', es: 'Básico' },
    },
    {
      name: { en: 'French', pl: 'Francuski', de: 'Französisch', dk: 'Fransk', no: 'Fransk', jp: 'フランス語', it: 'Francese', es: 'Francés' },
      level: { en: 'Basic', pl: 'Podstawowy', de: 'Grundkenntnisse', dk: 'Basis', no: 'Grunnleggende', jp: '基礎', it: 'Base', es: 'Básico' },
    },
  ],

  certifications: [
    { name: 'GA4 Advanced Academy', issuer: 'Google' },
    { name: 'Fundamentals of Digital Marketing', issuer: 'Google' },
    { name: 'Growth-Driven Design Academy', issuer: 'HubSpot' },
    { name: 'Inbound Marketing Academy', issuer: 'HubSpot' },
    { name: 'Bing Ads Accredited Professional', issuer: 'Microsoft' },
    { name: 'Advanced Growth Series', issuer: 'Reforge' },
    { name: 'Content Marketing & SEO', issuer: 'SEMrush' },
    { name: 'PPC Automation Academy', issuer: 'SEMrush' },
    { name: 'Elements of AI Certificate', issuer: 'Univ. Helsinki' },
  ],
};
