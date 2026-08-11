/**
 * CV data, single source of truth for /cv and localized CV pages.
 *
 * Proper nouns (companies, schools, certification names, tool brands) stay
 * untranslated. Section labels, role titles, bullet descriptions, language
 * levels and education degrees translate fully.
 */

import type { SiteLocale } from './locale-codes';

export type CvLang = SiteLocale;

// Explicit order (en, pl first) kept for the hreflang alternates; `satisfies`
// pins every entry to the locale source of truth so a drifted code fails to compile.
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
      period: '2025 –\n2026',
      contract: true,
      role: { en: 'Fractional GTM & Growth Lead', pl: 'Fractional GTM & Growth Lead', de: 'Fractional GTM & Growth Lead', dk: 'Fractional GTM & Growth Lead', no: 'Fractional GTM & Growth Lead', jp: 'Fractional GTM & Growth Lead', it: 'Fractional GTM & Growth Lead', es: 'Fractional GTM & Growth Lead' },
      company: 'CodiLime',
      bullets: {
        en: [
          'Owned end to end GTM across content, SEO, paid, lifecycle automation and pipeline activation',
          'Built AI growth loops with lead scoring, funnel measurement and sales follow up signals',
          'Shipped lead magnets, landing pages and conversion paths for technical buying teams',
          'Ran weekly dashboards for priorities, campaign learning, pipeline and revenue reviews',
        ],
        pl: [
          'Odpowiadałem za całe GTM: content, SEO, paid, automatyzację lifecycle i aktywację pipeline’u',
          'Zbudowałem pętle wzrostu z AI: scoring leadów, pomiar lejka i sygnały do followupu sprzedaży',
          'Dowoziłem lead magnety, landingi i ścieżki konwersji dla technicznych zespołów zakupowych',
          'Prowadziłem cotygodniowe dashboardy: priorytety, wnioski z kampanii, pipeline i przychód',
        ],
        de: [
          'Verantwortete GTM end to end über Content, SEO, Paid, Lifecycle-Automatisierung und Pipeline-Aktivierung',
          'Baute AI-Growth-Loops mit Lead Scoring, Funnel-Messung und Signalen für das Sales-Follow-up',
          'Lieferte Lead Magnets, Landingpages und Conversion-Pfade für technische Buying-Teams',
          'Führte wöchentliche Dashboards für Prioritäten, Kampagnen-Learnings, Pipeline und Umsatz',
        ],
        dk: [
          'Ejede GTM fra ende til anden på tværs af content, SEO, paid, lifecycle-automatisering og pipeline-aktivering',
          'Byggede AI-vækstsløjfer med lead scoring, funnel-måling og signaler til salgets opfølgning',
          'Leverede lead magnets, landingssider og konverteringsveje til tekniske indkøbsteams',
          'Kørte ugentlige dashboards for prioriteter, kampagnelæring, pipeline og omsætning',
        ],
        no: [
          'Eide GTM fra ende til annen på tvers av content, SEO, paid, lifecycle-automatisering og pipeline-aktivering',
          'Bygde AI-vekstsløyfer med lead scoring, funnelmåling og signaler til salgets oppfølging',
          'Leverte lead magnets, landingssider og konverteringsveier for tekniske innkjøpsteam',
          'Kjørte ukentlige dashbord for prioriteringer, kampanjelæring, pipeline og inntekt',
        ],
        jp: [
          'コンテンツ、SEO、ペイド、ライフサイクル自動化、パイプライン活性化までGTMを一貫して担当',
          'リードスコアリング、ファネル計測、営業フォローアップのシグナルでAIグロースループを構築',
          '技術購買チーム向けにリードマグネット、ランディングページ、コンバージョン導線を実装',
          '優先順位、キャンペーンの学び、パイプライン、売上を週次ダッシュボードでレビュー',
        ],
        it: [
          'Ho gestito il GTM end to end su content, SEO, paid, automazione lifecycle e attivazione della pipeline',
          'Ho costruito loop di crescita AI con lead scoring, misurazione del funnel e segnali per il follow up commerciale',
          'Ho rilasciato lead magnet, landing page e percorsi di conversione per team di acquisto tecnici',
          'Ho tenuto dashboard settimanali su priorità, apprendimenti di campagna, pipeline e ricavi',
        ],
        es: [
          'Asumí el GTM de principio a fin en contenido, SEO, paid, automatización de lifecycle y activación de pipeline',
          'Construí bucles de crecimiento con IA: scoring de leads, medición del funnel y señales para el seguimiento comercial',
          'Entregué lead magnets, landings y rutas de conversión para equipos de compra técnicos',
          'Dirigí dashboards semanales de prioridades, aprendizajes de campaña, pipeline e ingresos',
        ],
      },
    },
    {
      period: '2025',
      contract: true,
      role: { en: 'Fractional Head of Marketing', pl: 'Fractional Head of Marketing', de: 'Fractional Head of Marketing', dk: 'Fractional Head of Marketing', no: 'Fractional Head of Marketing', jp: 'Fractional Head of Marketing', it: 'Fractional Head of Marketing', es: 'Fractional Head of Marketing' },
      company: 'WebWave',
      bullets: {
        en: [
          'Led AI GTM positioning and commercial messaging for website builder adoption and trials',
          'Ran the acquisition cadence across paid, SEO, activation, product loops and pipeline follow up',
          'Built a data led engine for product growth, B2B funnels, partner demand and reporting',
          'Aligned website funnels, CRM follow up and product messaging for SaaS conversion growth',
        ],
        pl: [
          'Prowadziłem pozycjonowanie AI GTM i komunikację sprzedażową pod adopcję i triale kreatora stron',
          'Prowadziłem rytm akwizycji: paid, SEO, aktywacja, pętle produktowe i followup pipeline’u',
          'Zbudowałem silnik oparty na danych: wzrost produktu, lejki B2B, popyt partnerski i raportowanie',
          'Spinałem lejki na stronie, followup w CRM i komunikację produktu pod konwersję SaaS',
        ],
        de: [
          'Führte AI-GTM-Positionierung und kommerzielles Messaging für Adoption und Trials des Website-Builders',
          'Steuerte die Akquise-Kadenz über Paid, SEO, Aktivierung, Produkt-Loops und Pipeline-Follow-up',
          'Baute eine datengetriebene Engine für Produktwachstum, B2B-Funnels, Partner-Demand und Reporting',
          'Brachte Website-Funnels, CRM-Follow-up und Produkt-Messaging für SaaS-Conversion zusammen',
        ],
        dk: [
          'Ledte AI-GTM-positionering og kommercielt budskab for adoption og trials af website-builderen',
          'Kørte akkvisitionskadencen på tværs af paid, SEO, aktivering, produktsløjfer og pipeline-opfølgning',
          'Byggede en datadrevet motor til produktvækst, B2B-funnels, partner-demand og rapportering',
          'Samlede website-funnels, CRM-opfølgning og produktbudskab til SaaS-konvertering',
        ],
        no: [
          'Ledet AI-GTM-posisjonering og kommersielt budskap for adopsjon og trials av nettstedsbyggeren',
          'Kjørte akkvisisjonskadensen på tvers av paid, SEO, aktivering, produktsløyfer og pipelineoppfølging',
          'Bygde en datadrevet motor for produktvekst, B2B-funneler, partnerdemand og rapportering',
          'Samlet nettstedsfunneler, CRM-oppfølging og produktbudskap for SaaS-konvertering',
        ],
        jp: [
          'ウェブサイトビルダーの導入とトライアルに向けたAI GTMポジショニングと商用メッセージを主導',
          'ペイド、SEO、アクティベーション、プロダクトループ、パイプラインのフォローアップまで獲得の運用リズムを設計',
          'プロダクト成長、B2Bファネル、パートナー需要、レポーティングのためのデータ駆動基盤を構築',
          'サイトのファネル、CRMフォローアップ、プロダクトメッセージをSaaSのコンバージョンに合わせて統一',
        ],
        it: [
          'Ho guidato il posizionamento AI GTM e il messaggio commerciale per adozione e trial del website builder',
          'Ho gestito la cadenza di acquisizione tra paid, SEO, attivazione, loop di prodotto e follow up della pipeline',
          'Ho costruito un motore data driven per crescita di prodotto, funnel B2B, domanda partner e reporting',
          'Ho allineato funnel del sito, follow up CRM e messaggio di prodotto per la conversione SaaS',
        ],
        es: [
          'Lideré el posicionamiento AI GTM y el mensaje comercial para la adopción y las pruebas del creador de webs',
          'Dirigí la cadencia de adquisición entre paid, SEO, activación, bucles de producto y seguimiento de pipeline',
          'Construí un motor basado en datos para crecimiento de producto, funnels B2B, demanda de partners y reporting',
          'Alineé los funnels del sitio, el seguimiento en CRM y el mensaje de producto para la conversión SaaS',
        ],
      },
    },
    {
      period: '2024 –\n2025',
      role: { en: 'Head of Growth & Web Development', pl: 'Head of Growth & Web Development', de: 'Head of Growth & Web Development', dk: 'Head of Growth & Web Development', no: 'Head of Growth & Web Development', jp: 'Head of Growth & Web Development', it: 'Head of Growth & Web Development', es: 'Head of Growth & Web Development' },
      company: 'Symfonia',
      bullets: {
        en: [
          'Lifted lead generation +30% with segmented landing pages, CRO tests and CRM routing',
          'Led web strategy across brand, SEO, buyer journeys, CMS and conversion architecture',
          'Improved organic visibility with SEO automation, governance and content operations',
          'Ran a website migration with CMS integration and monitoring, without disruption',
        ],
        pl: [
          'Podniosłem generowanie leadów o 30% dzięki segmentacji landingów, testom CRO i routingowi w CRM',
          'Prowadziłem strategię web: marka, SEO, ścieżki zakupowe, CMS i architektura konwersji',
          'Poprawiłem widoczność organiczną automatyzacją SEO, governance i operacjami contentowymi',
          'Przeprowadziłem migrację serwisu z integracją CMS i monitoringiem, bez przestoju',
        ],
        de: [
          'Steigerte die Leadgenerierung um 30% mit segmentierten Landingpages, CRO-Tests und CRM-Routing',
          'Führte die Web-Strategie über Marke, SEO, Buyer Journeys, CMS und Conversion-Architektur',
          'Verbesserte die organische Sichtbarkeit mit SEO-Automatisierung, Governance und Content-Operations',
          'Führte eine Website-Migration mit CMS-Integration und Monitoring ohne Ausfall durch',
        ],
        dk: [
          'Løftede leadgenerering +30% med segmenterede landingssider, CRO-tests og CRM-routing',
          'Ledte webstrategien på tværs af brand, SEO, købsrejser, CMS og konverteringsarkitektur',
          'Forbedrede organisk synlighed med SEO-automatisering, governance og content-operations',
          'Gennemførte en website-migrering med CMS-integration og overvågning uden nedetid',
        ],
        no: [
          'Løftet leadgenerering +30% med segmenterte landingssider, CRO-tester og CRM-ruting',
          'Ledet nettstrategien på tvers av merkevare, SEO, kjøpsreiser, CMS og konverteringsarkitektur',
          'Forbedret organisk synlighet med SEO-automatisering, styring og innholdsoperasjoner',
          'Gjennomførte en nettstedsmigrering med CMS-integrasjon og overvåking, uten nedetid',
        ],
        jp: [
          'セグメント化したランディングページ、CROテスト、CRMルーティングでリード獲得を30%改善',
          'ブランド、SEO、購買導線、CMS、コンバージョン設計にわたるWeb戦略を主導',
          'SEOの自動化、ガバナンス、コンテンツ運用で自然流入の可視性を改善',
          'CMS統合と監視を伴うサイト移行を、停止なしで完了',
        ],
        it: [
          'Ho aumentato la lead generation del 30% con landing segmentate, test CRO e routing CRM',
          'Ho guidato la strategia web su brand, SEO, buyer journey, CMS e architettura di conversione',
          'Ho migliorato la visibilità organica con automazione SEO, governance e content operations',
          'Ho condotto una migrazione del sito con integrazione CMS e monitoraggio, senza interruzioni',
        ],
        es: [
          'Aumenté la generación de leads un 30% con landings segmentadas, tests de CRO y enrutado en CRM',
          'Lideré la estrategia web en marca, SEO, recorridos de compra, CMS y arquitectura de conversión',
          'Mejoré la visibilidad orgánica con automatización SEO, governance y operaciones de contenido',
          'Ejecuté una migración del sitio con integración de CMS y monitorización, sin interrupciones',
        ],
      },
    },
    {
      period: '2023 –\n2024',
      role: { en: 'Chief Marketing Officer', pl: 'Chief Marketing Officer', de: 'Chief Marketing Officer', dk: 'Chief Marketing Officer', no: 'Chief Marketing Officer', jp: 'Chief Marketing Officer', it: 'Chief Marketing Officer', es: 'Chief Marketing Officer' },
      company: 'Tekhuset',
      bullets: {
        en: [
          'Improved conversion +25% while growing top SERP positions across Nordic ecommerce stores',
          'Owned Nordic growth across SEO, PPC, CRO, content funnels, merchandising and offers',
          'Rebuilt performance analytics for ad spend, conversion, margin and trading decisions',
          'Improved checkout journeys, product pages, tracking and storefront experiments',
        ],
        pl: [
          'Podniosłem konwersję o 25%, jednocześnie budując czołowe pozycje w SERP w sklepach nordyckich',
          'Odpowiadałem za wzrost w Nordics: SEO, PPC, CRO, lejki contentowe, merchandising i oferty',
          'Przebudowałem analitykę efektywności pod wydatki reklamowe, konwersję, marżę i decyzje handlowe',
          'Poprawiłem ścieżki checkoutu, karty produktów, pomiar i eksperymenty w sklepie',
        ],
        de: [
          'Steigerte die Conversion um 25% und baute zugleich Top-SERP-Positionen in nordischen Shops auf',
          'Verantwortete das nordische Wachstum über SEO, PPC, CRO, Content-Funnels, Merchandising und Angebote',
          'Baute die Performance-Analytics für Werbebudget, Conversion, Marge und Handelsentscheidungen neu auf',
          'Verbesserte Checkout-Strecken, Produktseiten, Tracking und Storefront-Experimente',
        ],
        dk: [
          'Forbedrede konverteringen +25% og voksede samtidig til top-SERP-positioner i nordiske webshops',
          'Ejede nordisk vækst på tværs af SEO, PPC, CRO, content-funnels, merchandising og tilbud',
          'Genopbyggede performance-analytics til annoncebudget, konvertering, margin og handelsbeslutninger',
          'Forbedrede checkout-rejser, produktsider, tracking og storefront-eksperimenter',
        ],
        no: [
          'Forbedret konverteringen +25% og bygde samtidig topp-SERP-posisjoner i nordiske nettbutikker',
          'Eide nordisk vekst på tvers av SEO, PPC, CRO, innholdsfunneler, merchandising og tilbud',
          'Bygde om ytelsesanalysen for annonsebudsjett, konvertering, margin og handelsbeslutninger',
          'Forbedret checkout-reiser, produktsider, sporing og eksperimenter i butikkfronten',
        ],
        jp: [
          '北欧ECの上位SERPを伸ばしながら、コンバージョンを25%改善',
          'SEO、PPC、CRO、コンテンツファネル、マーチャンダイジング、オファーまで北欧の成長を統括',
          '広告費、コンバージョン、マージン、商談判断のためにパフォーマンス分析を再構築',
          'チェックアウト導線、商品ページ、計測、ストアフロントの実験を改善',
        ],
        it: [
          'Ho migliorato la conversione del 25% facendo crescere le posizioni SERP negli e-commerce nordici',
          'Ho gestito la crescita nordica su SEO, PPC, CRO, funnel di contenuto, merchandising e offerte',
          'Ho ricostruito le analytics di performance per spesa pubblicitaria, conversione, margine e decisioni commerciali',
          'Ho migliorato percorsi di checkout, pagine prodotto, tracciamento ed esperimenti sullo storefront',
        ],
        es: [
          'Mejoré la conversión un 25% mientras crecían las posiciones SERP en las tiendas nórdicas',
          'Asumí el crecimiento nórdico en SEO, PPC, CRO, funnels de contenido, merchandising y ofertas',
          'Reconstruí la analítica de rendimiento para inversión publicitaria, conversión, margen y decisiones comerciales',
          'Mejoré los recorridos de checkout, fichas de producto, medición y experimentos de tienda',
        ],
      },
    },
    {
      period: '2020 –\n2024',
      role: { en: 'Global Head of Growth', pl: 'Global Head of Growth', de: 'Global Head of Growth', dk: 'Global Head of Growth', no: 'Global Head of Growth', jp: 'Global Head of Growth', it: 'Global Head of Growth', es: 'Global Head of Growth' },
      company: 'SentiOne',
      bullets: {
        en: [
          'Lifted new customers +80% with roadmap aligned GTM comms and lifecycle experiments',
          'Grew brand +60% and traffic +50% through SEO, category content and analyst education',
          'Delivered revenue +10% YoY and +20% sales from landing page and offer experimentation',
          'Built international GTM across EU, UK, US, LATAM and UAE ABM with a shared cadence',
        ],
        pl: [
          'Podniosłem pozyskanie nowych klientów o 80% komunikacją GTM spiętą z roadmapą i eksperymentami lifecycle',
          'Urosłem markę o 60% i ruch o 50% przez SEO, content kategorii i edukację analityków',
          'Dowiozłem +10% przychodu rok do roku i +20% sprzedaży z eksperymentów na landingach i ofertach',
          'Zbudowałem międzynarodowe GTM: EU, UK, US, LATAM i ABM w UAE, na wspólnym rytmie',
        ],
        de: [
          'Steigerte Neukunden um 80% mit roadmap-naher GTM-Kommunikation und Lifecycle-Experimenten',
          'Baute die Marke um 60% und den Traffic um 50% über SEO, Kategorie-Content und Analyst Education aus',
          'Lieferte +10% Umsatz im Jahresvergleich und +20% Sales aus Landingpage- und Angebots-Experimenten',
          'Baute internationales GTM über EU, UK, US, LATAM und UAE-ABM mit gemeinsamer Kadenz auf',
        ],
        dk: [
          'Løftede nye kunder +80% med roadmap-nær GTM-kommunikation og lifecycle-eksperimenter',
          'Voksede brandet +60% og trafikken +50% gennem SEO, kategori-content og analytikeruddannelse',
          'Leverede +10% omsætning år for år og +20% salg fra landingsside- og tilbudseksperimenter',
          'Byggede internationalt GTM på tværs af EU, UK, US, LATAM og UAE-ABM med fælles kadence',
        ],
        no: [
          'Løftet nye kunder +80% med GTM-kommunikasjon tett på veikartet og lifecycle-eksperimenter',
          'Vokste merkevaren +60% og trafikken +50% gjennom SEO, kategoriinnhold og analytikeropplæring',
          'Leverte +10% inntekt år over år og +20% salg fra eksperimenter på landingssider og tilbud',
          'Bygde internasjonalt GTM på tvers av EU, UK, US, LATAM og UAE-ABM med felles kadens',
        ],
        jp: [
          'ロードマップと連動したGTMコミュニケーションとライフサイクル実験で新規顧客を80%増加',
          'SEO、カテゴリコンテンツ、アナリスト向け啓発でブランドを60%、トラフィックを50%成長',
          'ランディングページとオファーの実験から前年比+10%の売上と+20%の受注を実現',
          'EU、UK、US、LATAM、UAEのABMまで共通の運用リズムで国際GTMを構築',
        ],
        it: [
          'Ho aumentato i nuovi clienti dell’80% con comunicazione GTM allineata alla roadmap ed esperimenti lifecycle',
          'Ho fatto crescere il brand del 60% e il traffico del 50% con SEO, contenuti di categoria e analyst education',
          'Ho portato +10% di ricavi anno su anno e +20% di vendite da esperimenti su landing e offerte',
          'Ho costruito il GTM internazionale su EU, UK, US, LATAM e ABM negli Emirati con una cadenza condivisa',
        ],
        es: [
          'Aumenté los nuevos clientes un 80% con comunicación GTM alineada al roadmap y experimentos de lifecycle',
          'Hice crecer la marca un 60% y el tráfico un 50% con SEO, contenido de categoría y formación de analistas',
          'Entregué +10% de ingresos interanuales y +20% de ventas desde experimentos en landings y ofertas',
          'Construí el GTM internacional en UE, Reino Unido, EE. UU., LATAM y ABM en Emiratos con una cadencia común',
        ],
      },
    },
    {
      period: '2019 –\n2020',
      role: { en: 'Head of Lifecycle Marketing', pl: 'Head of Lifecycle Marketing', de: 'Head of Lifecycle Marketing', dk: 'Head of Lifecycle Marketing', no: 'Head of Lifecycle Marketing', jp: 'Head of Lifecycle Marketing', it: 'Head of Lifecycle Marketing', es: 'Head of Lifecycle Marketing' },
      company: 'GetResponse',
      bullets: {
        en: [
          'Owned lifecycle CRM segmentation, A/B testing and global campaign measurement',
          'Ran retention programs across regions, language markets, cohorts and funnel stages',
          'Tied lifecycle to trial to paid conversion, onboarding, activation and expansion journeys',
          'Improved CRM governance across segments, cadence, campaign QA and reporting routines',
        ],
        pl: [
          'Odpowiadałem za segmentację lifecycle w CRM, testy A/B i pomiar kampanii globalnych',
          'Prowadziłem programy retencji w regionach, rynkach językowych, kohortach i etapach lejka',
          'Spinałem lifecycle z konwersją trial na płatny, onboardingiem, aktywacją i ekspansją',
          'Poprawiłem governance CRM: segmenty, rytm, QA kampanii i rutyny raportowe',
        ],
        de: [
          'Verantwortete Lifecycle-CRM-Segmentierung, A/B-Testing und globale Kampagnenmessung',
          'Führte Retention-Programme über Regionen, Sprachmärkte, Kohorten und Funnel-Stufen',
          'Verband Lifecycle mit Trial-to-Paid-Conversion, Onboarding, Aktivierung und Expansion',
          'Verbesserte CRM-Governance über Segmente, Kadenz, Kampagnen-QA und Reporting-Routinen',
        ],
        dk: [
          'Ejede lifecycle-CRM-segmentering, A/B-test og global kampagnemåling',
          'Kørte retention-programmer på tværs af regioner, sprogmarkeder, kohorter og funnel-trin',
          'Bandt lifecycle sammen med trial-til-betalt-konvertering, onboarding, aktivering og ekspansion',
          'Forbedrede CRM-governance på tværs af segmenter, kadence, kampagne-QA og rapporteringsrutiner',
        ],
        no: [
          'Eide lifecycle-CRM-segmentering, A/B-testing og global kampanjemåling',
          'Kjørte retention-programmer på tvers av regioner, språkmarkeder, kohorter og funneltrinn',
          'Knyttet lifecycle til trial-til-betalt-konvertering, onboarding, aktivering og ekspansjon',
          'Forbedret CRM-styring på tvers av segmenter, kadens, kampanje-QA og rapporteringsrutiner',
        ],
        jp: [
          'ライフサイクルCRMのセグメンテーション、A/Bテスト、グローバルなキャンペーン計測を担当',
          '地域、言語市場、コホート、ファネル段階をまたぐリテンション施策を運営',
          'ライフサイクルをトライアルから有料への転換、オンボーディング、活性化、拡大につなげた',
          'セグメント、配信リズム、キャンペーンQA、レポート運用にわたるCRMガバナンスを改善',
        ],
        it: [
          'Ho gestito segmentazione CRM lifecycle, test A/B e misurazione globale delle campagne',
          'Ho condotto programmi di retention su regioni, mercati linguistici, coorti e fasi del funnel',
          'Ho legato il lifecycle alla conversione da trial a pagante, onboarding, attivazione ed espansione',
          'Ho migliorato la governance CRM su segmenti, cadenza, QA delle campagne e routine di reporting',
        ],
        es: [
          'Asumí la segmentación de CRM de lifecycle, los tests A/B y la medición global de campañas',
          'Dirigí programas de retención por regiones, mercados lingüísticos, cohortes y etapas del funnel',
          'Conecté el lifecycle con la conversión de prueba a pago, onboarding, activación y expansión',
          'Mejoré la governance de CRM en segmentos, cadencia, QA de campañas y rutinas de reporting',
        ],
      },
    },
    {
      period: '2022',
      contract: true,
      role: { en: 'Global AI & Innovation Manager', pl: 'Global AI & Innovation Manager', de: 'Global AI & Innovation Manager', dk: 'Global AI & Innovation Manager', no: 'Global AI & Innovation Manager', jp: 'Global AI & Innovation Manager', it: 'Global AI & Innovation Manager', es: 'Global AI & Innovation Manager' },
      company: 'Gi Group Holding',
      bullets: {
        en: [
          'Led enterprise AI initiatives and the internal innovation roadmap for HR operations',
          'Mapped HR processes across country units, shared services, recruiting and delivery flows',
          'Ran AI adoption programs for executives, ops teams, change leads and local markets',
          'Translated AI use cases into recruiting pilots, service workflows and adoption materials',
        ],
        pl: [
          'Prowadziłem inicjatywy AI w korporacji i wewnętrzną roadmapę innowacji dla operacji HR',
          'Zmapowałem procesy HR w jednostkach krajowych, shared services, rekrutacji i dostarczaniu',
          'Prowadziłem programy adopcji AI dla zarządów, zespołów ops, liderów zmiany i rynków lokalnych',
          'Przekładałem przypadki użycia AI na pilotaże rekrutacyjne, workflow usług i materiały wdrożeniowe',
        ],
        de: [
          'Leitete Enterprise-AI-Initiativen und die interne Innovations-Roadmap für HR-Operations',
          'Kartierte HR-Prozesse über Ländereinheiten, Shared Services, Recruiting und Delivery-Flows',
          'Führte AI-Adoption-Programme für Führungskräfte, Ops-Teams, Change Leads und lokale Märkte',
          'Übersetzte AI-Use-Cases in Recruiting-Piloten, Service-Workflows und Adoption-Materialien',
        ],
        dk: [
          'Ledte enterprise-AI-initiativer og den interne innovationsroadmap for HR-operations',
          'Kortlagde HR-processer på tværs af landeenheder, shared services, rekruttering og leveranceflows',
          'Kørte AI-adoptionsprogrammer for ledelse, ops-teams, change leads og lokale markeder',
          'Oversatte AI-use cases til rekrutteringspiloter, serviceworkflows og adoptionsmateriale',
        ],
        no: [
          'Ledet enterprise-AI-initiativer og det interne innovasjonsveikartet for HR-operations',
          'Kartla HR-prosesser på tvers av landenheter, shared services, rekruttering og leveranseflyt',
          'Kjørte AI-adopsjonsprogrammer for ledelse, ops-team, endringsledere og lokale markeder',
          'Oversatte AI-brukstilfeller til rekrutteringspiloter, tjenesteflyt og adopsjonsmateriell',
        ],
        jp: [
          '人事オペレーション向けにエンタープライズAI施策と社内イノベーションのロードマップを主導',
          '各国拠点、シェアードサービス、採用、デリバリーにまたがる人事プロセスを可視化',
          '経営層、運用チーム、変革リーダー、各国市場に向けたAI導入プログラムを実施',
          'AIのユースケースを採用のパイロット、業務フロー、導入用資料に落とし込み',
        ],
        it: [
          'Ho guidato iniziative AI enterprise e la roadmap interna di innovazione per le operations HR',
          'Ho mappato i processi HR su unità nazionali, shared services, recruiting e flussi di delivery',
          'Ho condotto programmi di adozione AI per dirigenti, team ops, change lead e mercati locali',
          'Ho tradotto i casi d’uso AI in pilot di recruiting, workflow di servizio e materiali di adozione',
        ],
        es: [
          'Lideré iniciativas de IA corporativa y la hoja de ruta interna de innovación para operaciones de RR. HH.',
          'Mapeé procesos de RR. HH. en unidades de país, shared services, selección y flujos de entrega',
          'Dirigí programas de adopción de IA para dirección, equipos de operaciones, change leads y mercados locales',
          'Traduje casos de uso de IA en pilotos de selección, flujos de servicio y materiales de adopción',
        ],
      },
    },
    {
      period: '2018 –\n2019',
      role: { en: 'Head of Digital', pl: 'Head of Digital', de: 'Head of Digital', dk: 'Head of Digital', no: 'Head of Digital', jp: 'Head of Digital', it: 'Head of Digital', es: 'Head of Digital' },
      company: 'Marquard Media Group',
      bullets: {
        en: [
          'Owned nine portal strategy across SEO, UX, PPC, audience growth and monetization',
          'Rebuilt SEO operations to lift organic visibility, technical hygiene and content velocity',
          'Standardised attribution reporting for editorial, product and commercial decisions',
          'Coordinated digital teams, vendors, editorial stakeholders and brand owners',
        ],
        pl: [
          'Odpowiadałem za strategię dziewięciu portali: SEO, UX, PPC, wzrost audytorium i monetyzacja',
          'Przebudowałem operacje SEO pod widoczność organiczną, higienę techniczną i tempo contentu',
          'Ujednoliciłem raportowanie atrybucji dla decyzji redakcyjnych, produktowych i handlowych',
          'Koordynowałem zespoły digital, dostawców, interesariuszy redakcji i właścicieli marek',
        ],
        de: [
          'Verantwortete die Strategie für neun Portale über SEO, UX, PPC, Audience-Wachstum und Monetarisierung',
          'Baute die SEO-Operations neu auf für organische Sichtbarkeit, technische Hygiene und Content-Velocity',
          'Vereinheitlichte das Attributions-Reporting für redaktionelle, Produkt- und kommerzielle Entscheidungen',
          'Koordinierte Digital-Teams, Dienstleister, redaktionelle Stakeholder und Markeninhaber',
        ],
        dk: [
          'Ejede strategien for ni portaler på tværs af SEO, UX, PPC, audience-vækst og monetisering',
          'Genopbyggede SEO-operations for organisk synlighed, teknisk hygiejne og content-hastighed',
          'Standardiserede attributionsrapportering til redaktionelle, produkt- og kommercielle beslutninger',
          'Koordinerede digitale teams, leverandører, redaktionelle interessenter og brandejere',
        ],
        no: [
          'Eide strategien for ni portaler på tvers av SEO, UX, PPC, publikumsvekst og monetisering',
          'Bygde om SEO-operasjonene for organisk synlighet, teknisk hygiene og innholdstempo',
          'Standardiserte attribusjonsrapportering for redaksjonelle, produkt- og kommersielle beslutninger',
          'Koordinerte digitale team, leverandører, redaksjonelle interessenter og merkevareeiere',
        ],
        jp: [
          'SEO、UX、PPC、オーディエンス成長、収益化まで9ポータルの戦略を統括',
          '自然流入、技術的な健全性、コンテンツ速度を上げるためSEO運用を再構築',
          '編集、プロダクト、営業の意思決定に向けてアトリビューション報告を標準化',
          'デジタルチーム、ベンダー、編集ステークホルダー、ブランドオーナーを調整',
        ],
        it: [
          'Ho gestito la strategia di nove portali su SEO, UX, PPC, crescita dell’audience e monetizzazione',
          'Ho ricostruito le SEO operations per visibilità organica, igiene tecnica e velocità dei contenuti',
          'Ho standardizzato il reporting di attribuzione per decisioni editoriali, di prodotto e commerciali',
          'Ho coordinato team digital, fornitori, stakeholder editoriali e proprietari dei brand',
        ],
        es: [
          'Asumí la estrategia de nueve portales en SEO, UX, PPC, crecimiento de audiencia y monetización',
          'Reconstruí las operaciones de SEO para visibilidad orgánica, higiene técnica y velocidad de contenido',
          'Estandaricé el reporting de atribución para decisiones editoriales, de producto y comerciales',
          'Coordiné equipos digitales, proveedores, responsables editoriales y dueños de marca',
        ],
      },
    },
    {
      period: '2018',
      contract: true,
      role: { en: 'Head of Marketing', pl: 'Head of Marketing', de: 'Head of Marketing', dk: 'Head of Marketing', no: 'Head of Marketing', jp: 'Head of Marketing', it: 'Head of Marketing', es: 'Head of Marketing' },
      company: 'Lilla House Digital',
      bullets: {
        en: [
          'Built SEO and paid lead generation across local property funnels and sales pages',
          'Optimised offer pages, tracking and local content for conversion and lead quality',
        ],
        pl: [
          'Zbudowałem generowanie leadów z SEO i paid na lokalnych lejkach nieruchomości i stronach sprzedażowych',
          'Zoptymalizowałem strony ofert, pomiar i lokalny content pod konwersję i jakość leadów',
        ],
        de: [
          'Baute SEO- und Paid-Leadgenerierung über lokale Immobilien-Funnels und Verkaufsseiten auf',
          'Optimierte Angebotsseiten, Tracking und lokalen Content für Conversion und Leadqualität',
        ],
        dk: [
          'Byggede SEO- og paid-leadgenerering på tværs af lokale ejendomsfunnels og salgssider',
          'Optimerede tilbudssider, tracking og lokalt content til konvertering og leadkvalitet',
        ],
        no: [
          'Bygde SEO- og paid-leadgenerering på tvers av lokale eiendomsfunneler og salgssider',
          'Optimaliserte tilbudssider, sporing og lokalt innhold for konvertering og leadkvalitet',
        ],
        jp: [
          '地域の不動産ファネルと販売ページでSEOとペイドのリード獲得を構築',
          'オファーページ、計測、ローカルコンテンツをコンバージョンとリード品質のために最適化',
        ],
        it: [
          'Ho costruito lead generation SEO e paid su funnel immobiliari locali e pagine di vendita',
          'Ho ottimizzato pagine offerta, tracciamento e contenuti locali per conversione e qualità dei lead',
        ],
        es: [
          'Construí generación de leads con SEO y paid en funnels inmobiliarios locales y páginas de venta',
          'Optimicé páginas de oferta, medición y contenido local para conversión y calidad de leads',
        ],
      },
    },
    {
      period: '2010 –\n2018',
      role: { en: 'Head of MarComm / Senior PR Manager', pl: 'Head of MarComm / Senior PR Manager', de: 'Head of MarComm / Senior PR Manager', dk: 'Head of MarComm / Senior PR Manager', no: 'Head of MarComm / Senior PR Manager', jp: 'Head of MarComm / Senior PR Manager', it: 'Head of MarComm / Senior PR Manager', es: 'Head of MarComm / Senior PR Manager' },
      company: 'City of Łódź Office',
      bullets: {
        en: [
          'Led city brand marketing communications, PR campaigns and stakeholder narratives',
          'Managed media relations, crisis communication and public messaging across projects',
        ],
        pl: [
          'Prowadziłem komunikację marketingową marki miasta, kampanie PR i narracje dla interesariuszy',
          'Zarządzałem relacjami z mediami, komunikacją kryzysową i przekazem publicznym w projektach',
        ],
        de: [
          'Führte die Marketingkommunikation der Stadtmarke, PR-Kampagnen und Stakeholder-Narrative',
          'Verantwortete Medienarbeit, Krisenkommunikation und öffentliche Botschaften über Projekte hinweg',
        ],
        dk: [
          'Ledte bybrandets marketingkommunikation, PR-kampagner og interessentfortællinger',
          'Håndterede medierelationer, krisekommunikation og offentlige budskaber på tværs af projekter',
        ],
        no: [
          'Ledet bymerkevarens markedskommunikasjon, PR-kampanjer og interessentfortellinger',
          'Håndterte medierelasjoner, krisekommunikasjon og offentlige budskap på tvers av prosjekter',
        ],
        jp: [
          '都市ブランドのマーケティングコミュニケーション、PRキャンペーン、関係者向けの語り口を主導',
          'メディアリレーション、危機広報、複数プロジェクトにわたる公共メッセージを管理',
        ],
        it: [
          'Ho guidato la comunicazione di marketing del brand cittadino, le campagne PR e le narrative per gli stakeholder',
          'Ho gestito relazioni con i media, comunicazione di crisi e messaggi pubblici su più progetti',
        ],
        es: [
          'Lideré la comunicación de marketing de la marca ciudad, las campañas de PR y los relatos para grupos de interés',
          'Gestioné relaciones con medios, comunicación de crisis y mensajes públicos en varios proyectos',
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
