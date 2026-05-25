/**
 * CV data, single source of truth for /cv (EN) and /pl/cv, /it/cv.
 *
 * Proper nouns (companies, schools, certification names, tool brands) stay
 * untranslated. Section labels, role titles, bullet descriptions, language
 * levels and education degrees translate fully.
 */

export type CvLang = 'en' | 'pl' | 'it';

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
  /** Company name — proper noun, no translation. */
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
  /** Tools — kept untranslated (brand names). */
  tools: string[];
  education: CvEducation[];
  languages: CvLanguageRow[];
  certifications: Array<{ name: string; issuer: string }>;
}

export const cvData: CvData = {
  meta: {
    title: {
      en: 'Wojciech Łuszczyński — CV',
      pl: 'Wojciech Łuszczyński — CV',
      it: 'Wojciech Łuszczyński — CV',
    },
    description: {
      en: 'CV of Wojciech Łuszczyński — GTM Architect and Growth Operator. AI-native revenue systems for B2B SaaS. 20 years marketing, 10 years B2B SaaS growth.',
      pl: 'CV Wojciecha Łuszczyńskiego — GTM Architect i Growth Operator. AI-native systemy przychodowe dla B2B SaaS. 20 lat marketingu, 10 lat growth w B2B SaaS.',
      it: 'CV di Wojciech Łuszczyński — GTM Architect e Growth Operator. Sistemi di ricavo AI-native per B2B SaaS. 20 anni di marketing, 10 anni di growth in B2B SaaS.',
    },
  },
  header: {
    tagline: {
      en: 'Growth operator · GTM architect · AI-native builder',
      pl: 'Growth operator · architekt GTM · AI-native builder',
      it: 'Growth operator · architetto GTM · AI-native builder',
    },
    interactiveVersion: {
      en: 'interactive version',
      pl: 'wersja interaktywna',
      it: 'versione interattiva',
    },
    openToRelocation: {
      en: 'Remote · Open to relocation',
      pl: 'Zdalnie · Otwarty na relokację',
      it: 'Da remoto · Disponibile a trasferimento',
    },
  },
  sections: {
    experience: { en: 'Experience', pl: 'Doświadczenie', it: 'Esperienza' },
    keySkills: { en: 'Key skills', pl: 'Kluczowe kompetencje', it: 'Competenze chiave' },
    tools: { en: 'Tools & platforms', pl: 'Narzędzia i platformy', it: 'Strumenti e piattaforme' },
    education: { en: 'Education', pl: 'Wykształcenie', it: 'Istruzione' },
    languages: { en: 'Languages', pl: 'Języki', it: 'Lingue' },
    certifications: { en: 'Certifications', pl: 'Certyfikaty', it: 'Certificazioni' },
  },
  presentLabel: { en: 'present', pl: 'obecnie', it: 'oggi' },
  contractLabel: { en: 'Contract', pl: 'Kontrakt', it: 'Contratto' },
  printButton: { en: 'Save as PDF →', pl: 'Zapisz jako PDF →', it: 'Salva come PDF →' },

  experience: [
    {
      period: '2025 –\npresent',
      role: { en: 'Head of Marketing', pl: 'Head of Marketing', it: 'Head of Marketing' },
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
        it: [
          'Guido marketing e growth globali per un website builder no-code basato su AI',
          'Strategia GTM, messaging commerciale e motore di crescita data-driven',
          'Ownership dell’intero funnel: SEO, content, paid, automation, lifecycle',
        ],
      },
    },
    {
      period: '2024 –\n2025',
      role: {
        en: 'Head of Growth & Web Development',
        pl: 'Head of Growth i Web Development',
        it: 'Head of Growth & Web Development',
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
          'Wzrost lead generation o 30% — konwertujące landingi i testy A/B',
          'Wzrost ruchu na blogu o 50% dzięki contentowi opartemu na automatyzacji',
          'Optymalizacja prędkości strony o 25%, lepsze UX i zaangażowanie',
          'Spięcie workflow marketingu, produktu i web developmentu',
        ],
        it: [
          'Aumento del traffico organico del 40% con SEO e ottimizzazioni tecniche',
          'Aumento della lead generation del 30% con landing ad alta conversione e test A/B',
          'Crescita del traffico del blog del 50% grazie a content strategy automatizzate',
          'Ottimizzazione della velocità del sito del 25%, miglior UX ed engagement',
          'Workflow integrati tra marketing, prodotto e web development',
        ],
      },
    },
    {
      period: '2020 –\n2024',
      role: { en: 'Global Head of Growth', pl: 'Global Head of Growth', it: 'Global Head of Growth' },
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
        it: [
          'GTM B2B SaaS costruito in Europa, UK, USA, EAU e America Latina',
          'Aumento del traffico web del 50% con SEO, redesign e content strategy',
          'Acquisizione clienti accelerata dell’80% con comunicazione di precisione',
          'Aumento dei lead commerciali del 20% grazie alla collaborazione con il sales',
          'Riconoscibilità del marchio aumentata del 60% con strategie globali su misura',
        ],
      },
    },
    {
      period: '2019 –\n2020',
      role: {
        en: 'Head of Lifecycle Marketing',
        pl: 'Head of Lifecycle Marketing',
        it: 'Head of Lifecycle Marketing',
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
        it: [
          'Engagement clienti e revenue aumentati del 30% con lifecycle marketing su CRM',
          'CRM implementato, aumento conversioni del 25% con insight e segmentazione',
          'Test A/B che hanno portato a un aumento del 20% del tasso di conversione',
          'Campagne globali con penetrazione di successo in USA, America Latina, UE',
        ],
      },
    },
    {
      period: 'Contract',
      contract: true,
      role: {
        en: 'AI & Innovation Manager · Fractional CMO · Head of Marketing',
        pl: 'AI & Innovation Manager · Fractional CMO · Head of Marketing',
        it: 'AI & Innovation Manager · CMO frazionale · Head of Marketing',
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
        it: [
          'Trasformazione workflow AI e unificazione ATS in Gi Group (2k+ dipendenti)',
          'Esplorazione progetti AR / metaverso e action plan',
          'Growth, SEO e ottimizzazione test A/B in Tekhuset',
          'Marketing digitale e campagne revenue in Lilla House Digital',
        ],
      },
    },
    {
      period: '2018 –\n2019',
      role: { en: 'Head of Digital', pl: 'Head of Digital', it: 'Head of Digital' },
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
        it: [
          'Strategia digitale per 9 portali con un team di 21 persone nei mercati UE',
          'Lancio di un’app mobile che ha esteso la copertura B2C e B2B',
          'Ottimizzazione di SEO, PPC, UX/UI e funnel di conversione',
          'Roadmap di prodotto allineate ai trend di mercato',
        ],
      },
    },
    {
      period: '2015 –\n2018',
      role: {
        en: 'Head of Marketing Communications',
        pl: 'Head of Marketing Communications',
        it: 'Head of Marketing Communications',
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
        it: [
          'Obiettivi di comunicazione marketing superati del 25% nei limiti di budget',
          'Obiettivi marketing superati del 30% con pianificazione ed esecuzione strategica',
          '50+ apparizioni nei media (broadcast, stampa, digital)',
          'Aumento del 15% dell’efficienza operativa con iniziative di integrazione del team',
        ],
      },
    },
    {
      period: '2010 –\n2015',
      role: { en: 'PR Manager', pl: 'PR Manager', it: 'PR Manager' },
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
        it: [
          'Crescita del 20% dell’audience social grazie a leadership di team e brand strategy',
          'Aumento del 40% della copertura mediatica con contenuti coinvolgenti',
          '95% di KPI di campagne PR raggiunti; 95% di successo nell’esecuzione progetti',
          'Cinque partnership strategiche che hanno aumentato brand engagement e comunità',
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
        it: 'Executive MBA',
      },
      school: 'Collegium Humanum',
      year: '2021',
    },
    {
      degree: {
        en: 'MSc Journalism & Social Comms',
        pl: 'Mgr Dziennikarstwa i Komunikacji Społecznej',
        it: 'Master in Giornalismo e Comunicazione Sociale',
      },
      school: 'University of Łódź',
      year: '2021 – 2022',
    },
    {
      degree: {
        en: 'Post-graduate — Public Relations',
        pl: 'Studia podyplomowe — Public Relations',
        it: 'Master post-laurea — Public Relations',
      },
      school: 'Warsaw School of Economics',
      year: '2016 – 2017',
    },
    {
      degree: {
        en: 'BSc International Relations',
        pl: 'Lic. Stosunki Międzynarodowe',
        it: 'Laurea in Relazioni Internazionali',
      },
      school: 'University of Łódź',
      year: '2007 – 2010',
    },
  ],

  languages: [
    { name: { en: 'Polish', pl: 'Polski', it: 'Polacco' }, level: { en: 'Native', pl: 'Ojczysty', it: 'Madrelingua' } },
    { name: { en: 'English', pl: 'Angielski', it: 'Inglese' }, level: { en: 'Native', pl: 'Ojczysty', it: 'Madrelingua' } },
    { name: { en: 'German', pl: 'Niemiecki', it: 'Tedesco' }, level: { en: 'Basic', pl: 'Podstawowy', it: 'Base' } },
    { name: { en: 'French', pl: 'Francuski', it: 'Francese' }, level: { en: 'Basic', pl: 'Podstawowy', it: 'Base' } },
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
