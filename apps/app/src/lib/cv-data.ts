export interface I18n { en: string; pl: string; it: string }

export interface CvRole {
  title: I18n;
  date: string;
  company: string;
  companyUrl?: string;
  location?: string;
  type: I18n;
  badges: string[];
  bullets: I18n[];
}

export type ChipIcon =
  | { type: 'img'; slug: string; color: string }
  | { type: 'initials'; text: string; bg: string; textColor?: string };

export interface Tool { name: string; icon?: ChipIcon; lime?: true }

export interface ToolGroup { label: I18n; tools: Tool[] }

export interface Setup { name: I18n; tools: string[] }

export interface SkillCategory { label: I18n; skills: string }

export interface Cert { name: string; issuer: string; year: string; badge: string; bg: string; textColor?: string }

export interface Education { degree: I18n; school: string; subject: I18n }

export interface Language { flag: string; name: I18n; level: I18n; levelClass: 'cv-lang-level-high' | 'cv-lang-level-mid' | 'cv-lang-level-low' }

// ─── Headline stats ────────────────────────────────────────────────────────

export const stats: { value: string; label: I18n }[] = [
  { value: '20', label: { en: 'Years marketing & digital · 10 SaaS · 10 GTM', pl: 'Lat marketing i digital · 10 SaaS · 10 GTM', it: 'Anni marketing & digital · 10 SaaS · 10 GTM' } },
  { value: '60%', label: { en: 'Brand Lift at SentiOne', pl: 'Brand Lift przy SentiOne', it: 'Brand Lift a SentiOne' } },
  { value: '80%', label: { en: 'Customer Acq. Growth', pl: 'Wzrost pozyskiwania klientów', it: 'Crescita acquisizione clienti' } },
  { value: '150%', label: { en: 'Avg. Revenue Uplift', pl: 'Średni wzrost przychodów', it: 'Crescita media ricavi' } },
];

// ─── Experience ────────────────────────────────────────────────────────────

export const roles: CvRole[] = [
  {
    title: { en: 'Fractional GTM & Growth Lead', pl: 'Fractional GTM & Growth Lead', it: 'Responsabile GTM & Crescita Fractional' },
    date: 'Oct 2025 to Feb 2026',
    company: 'CodiLime', companyUrl: 'https://codilime.com',
    type: { en: 'Contract', pl: 'Kontrakt', it: 'Contratto' },
    badges: ['B2B Tech', 'Fractional GTM'],
    bullets: [
      { en: 'Owned E2E GTM, full-funnel od awareness do pipeline', pl: 'Owned end-to-end GTM, full-funnel od awareness do zamkniętego pipeline', it: 'GTM end-to-end, full-funnel dall\'awareness al pipeline' },
      { en: 'AI content loops reduced production cost by roughly 60%', pl: 'Wdrożenie AI content loops zmniejszyło koszt produkcji o około 60%', it: 'AI content loops con circa 60% di costo produzione in meno' },
      { en: '4 lead magnets in 6 weeks, 35%+ MoM inbound growth', pl: '4 lead magnety w 6 tygodniach dały ponad 35% MoM wzrost inbound leadów', it: '4 lead magnet in 6 settimane con oltre 35% MoM inbound' },
      { en: 'Revenue dashboards connected marketing with closed-won', pl: 'Budowa revenue-linked dashboardów łączących marketing z closed-won', it: 'Dashboard revenue collegati a closed-won' },
      { en: 'Sales and Product partnership cut average deal cycle by 2 weeks', pl: 'Współpraca z Sales & Product skróciła średni deal cycle o 2 tygodnie', it: 'Partnership con Sales & Product, deal cycle medio ridotto di 2 settimane' },
    ],
  },
  {
    title: { en: 'Fractional Head of Marketing', pl: 'Fractional Head of Marketing', it: 'Responsabile Marketing Fractional' },
    date: 'May to Oct 2025',
    company: 'WebWave', companyUrl: 'https://webwave.me', location: 'Berlin, Germany',
    type: { en: 'Contract', pl: 'Kontrakt', it: 'Contratto' },
    badges: ['SaaS B2B', 'Website Builder'],
    bullets: [
      { en: 'GTM pivot from B2C to B2B, 3× pipeline improvement', pl: 'Redesign GTM i pivot B2C do B2B poprawiły pipeline 3×', it: 'Redesign GTM e pivot da B2C a B2B con pipeline 3×' },
      { en: 'Paid + SEO lowered CPL by 40% vs. prior period', pl: 'Paid + SEO obniżyły CPL o 40% względem poprzedniego okresu', it: 'Paid + SEO con CPL inferiore del 40% rispetto al periodo precedente' },
      { en: 'Messaging framework adopted across 6 markets', pl: 'Messaging framework wdrożony na 6 rynkach', it: 'Messaging framework implementato su 6 mercati' },
      { en: '12+ growth experiments w 5 miesiącach', pl: 'Cykl tygodniowych growth experiments: 12+ testów w 5 miesiącach', it: '12+ growth experiment in 5 mesi' },
      { en: 'Budowa działu performance od zera', pl: 'Budowa działu performance marketing od zera', it: 'Costruzione del team performance marketing da zero' },
    ],
  },
  {
    title: { en: 'Head of Growth & Web Development', pl: 'Head of Growth & Web Development', it: 'Head of Growth & Sviluppo Web' },
    date: '2024 to Oct 2025',
    company: 'Symfonia', companyUrl: 'https://symfonia.pl',
    type: { en: 'Full-time', pl: 'Etat', it: 'Tempo pieno' },
    badges: ['ERP / Accounting SaaS', 'Polish Market SEO'],
    bullets: [
      { en: '+85% organic traffic YoY', pl: '+85% organic traffic YoY (technical SEO + content architecture)', it: '+85% traffico organico YoY' },
      { en: 'Website redesign cut bounce rate by 28%', pl: 'Pełen redesign strony obniżył bounce rate o 28%', it: 'Redesign sito con bounce rate inferiore del 28%' },
      { en: '3 landing pages with avg. 7.4% CR', pl: '3 landing pages z avg. 7.4% conversion rate', it: '3 landing page con CR medio 7,4%' },
      { en: '6 projektów web on time i on budget', pl: 'Cross-functional delivery 6 projektów on time i on budget', it: '6 progetti web on time e on budget' },
      { en: 'Jira + agile dla 19-os. działu marketingu', pl: 'Wdrożenie Jira + agile workflows dla 19-osobowego działu marketingu', it: 'Jira + agile per team marketing di 19 persone' },
    ],
  },
  {
    title: { en: 'Chief Marketing Officer', pl: 'Chief Marketing Officer', it: 'Chief Marketing Officer' },
    date: 'Oct 2023 to Dec 2024',
    company: 'Tekhuset AS', companyUrl: 'https://tekhuset.no', location: 'Oslo, Norway',
    type: { en: 'Full-time', pl: 'Etat', it: 'Tempo pieno' },
    badges: ['IT Services', 'Scandinavian Market'],
    bullets: [
      { en: 'Full GTM ownership in the Norwegian market', pl: 'Pełna odpowiedzialność za strategię marketingową i GTM w Norwegii', it: 'Piena responsabilità GTM nel mercato norvegese' },
      { en: 'Brand B2B od zera: identyfikacja, messaging, kanały', pl: 'Budowa marki B2B od podstaw: identyfikacja, messaging, kanały', it: 'Brand B2B da zero: identità, messaging, mix di canali' },
      { en: 'Content + SEO delivered 3× organic visibility in 8 months', pl: 'Wdrożenie content + SEO dało 3× wzrost organic visibility w 8 mies.', it: 'Content + SEO con visibilità organica 3× in 8 mesi' },
      { en: 'P&L marketingowy + pipeline leadowy E2E', pl: 'Zarządzanie budżetem marketingowym i pipeline leadowym', it: 'Budget marketing + pipeline lead E2E' },
    ],
  },
  {
    title: { en: 'Global Head of Growth & Retention', pl: 'Global Head of Growth & Retention', it: 'Global Head of Growth & Retention' },
    date: 'Oct 2020 to Jun 2024',
    company: 'SentiOne', companyUrl: 'https://sentione.com',
    type: { en: 'Full-time', pl: 'Etat', it: 'Tempo pieno' },
    badges: ['AI / NLP SaaS', 'Social Listening', 'Global'],
    bullets: [
      { en: 'Owned global pipeline from MQL through SQL to closed-won', pl: 'Ownership nad globalnym pipeline od MQL przez SQL do closed-won', it: 'Pipeline revenue globale da MQL a SQL a closed-won' },
      { en: '+120% ARR over 3 years, expansion as primary driver', pl: '+120% ARR w 3 latach, z expansion revenue jako głównym driverem', it: '+120% ARR in 3 anni, expansion come principale driver' },
      { en: 'Churn reduced from 18% to 9% with lifecycle + CS playbooks', pl: 'Redukcja churn z 18% do 9% przez lifecycle + CS playbooks', it: 'Churn da 18% a 9% con lifecycle + CS playbook' },
      { en: 'Budowa growth team: 7 osób, 5 rynków', pl: 'Budowa globalnego zespołu growth (7 osób, 5 rynków)', it: 'Costruzione growth team globale: 7 persone, 5 mercati' },
      { en: 'ABM + intent data improved enterprise win rate 2×', pl: 'ABM + intent data poprawiły win rate enterprise dealów 2×', it: 'ABM + intent data con win rate enterprise 2×' },
    ],
  },
  {
    title: { en: 'Global AI & Innovation Manager', pl: 'Global AI & Innovation Manager', it: 'Global AI & Innovation Manager' },
    date: '2022',
    company: 'Gi Group Holding', companyUrl: 'https://gigroupholding.com', location: 'Milan, Italy',
    type: { en: 'Project', pl: 'Projekt', it: 'Progetto' },
    badges: ['HR Tech Enterprise', 'AI Strategy'],
    bullets: [
      { en: '3 inicjatywy AI w 5 jednostkach biznesowych', pl: 'Scope i roadmapa dla 3 inicjatyw AI w 5 jednostkach biznesowych', it: '3 iniziative AI in 5 business unit' },
      { en: 'Mapped business requirements into digital E2E processes', pl: 'Mapowanie wymagań biznesowych na cyfrowe procesy E2E', it: 'Requisiti business trasformati in processi digitali E2E' },
      { en: 'C-suite alignment across 4 countries for €2M+ innovation pipeline', pl: 'C-suite alignment w 4 krajach dla pipeline innowacji €2M+', it: 'C-suite alignment in 4 paesi per pipeline innovazione €2M+' },
      { en: '8 innovation opportunities qualified through discovery sprints', pl: '8 szans innowacyjnych zakwalifikowanych przez discovery sprinty', it: '8 opportunità di innovazione qualificate con discovery sprint' },
      { en: 'Warsztaty cross-country, 40+ stakeholders', pl: 'Warsztaty cross-country z 40+ stakeholderami', it: 'Workshop cross-country, 40+ stakeholder' },
    ],
  },
  {
    title: { en: 'Head of Lifecycle Marketing', pl: 'Head of Lifecycle Marketing', it: 'Head of Lifecycle Marketing' },
    date: 'Oct 2019 to Oct 2020',
    company: 'GetResponse', companyUrl: 'https://getresponse.com',
    type: { en: 'Full-time', pl: 'Etat', it: 'Tempo pieno' },
    badges: ['Email Marketing SaaS', 'PLG · Global'],
    bullets: [
      { en: 'Lifecycle strategy for 350k+ users across 180 countries', pl: 'Strategia lifecycle dla 350k+ aktywnych użytkowników w 180 krajach', it: 'Lifecycle per 350k+ utenti in 180 paesi' },
      { en: '+18% trial-to-paid through onboarding redesign', pl: '+18% trial-to-paid przez redesign sekwencji onboardingowej', it: '+18% trial-to-paid con redesign onboarding' },
      { en: '30+ A/B tests across email, in-app and push improved engagement by 22%', pl: '30+ A/B testów w email, in-app i push poprawiło engagement o 22%', it: '30+ A/B test su email, in-app e push con engagement +22%' },
      { en: 'Automation flows reduced manual campaign work by 40%', pl: 'Marketing automation flows zmniejszyły pracę manualną w kampaniach o 40%', it: 'Automation flow con 40% di lavoro manuale in meno' },
      { en: 'Product + CS collaboration shipped 3 lifecycle features', pl: 'Współpraca Product + CS dała 3 nowe lifecycle features', it: 'Collaborazione Product + CS con 3 lifecycle feature' },
    ],
  },
  {
    title: { en: 'Head of Digital', pl: 'Head of Digital', it: 'Head of Digital' },
    date: '2018 to 2019',
    company: 'Marquard Group', companyUrl: 'https://marquard.de', location: 'Hamburg, Germany',
    type: { en: 'Full-time', pl: 'Etat', it: 'Tempo pieno' },
    badges: ['Media / Publishing', 'B2B + B2C Multi-brand'],
    bullets: [
      { en: '5 teamów (21 osób), 9 portali', pl: '5 teamów (21 osób) to 9 portali i nowe inicjatywy', it: '5 team (21 persone), 9 portali' },
      { en: 'Mobile app reached 25k downloads in 3 months', pl: 'Aplikacja mobilna B2C+B2B osiągnęła 25k pobrań w 3 miesiące', it: 'App B2C + B2B con 25k download in 3 mesi' },
      { en: 'Multichannel funnels improved lead quality by 35%', pl: 'Multichannel funnels poprawiły lead quality score o 35%', it: 'Funnel multicanale con lead quality score +35%' },
      { en: 'GTM dla 2 nowych rynków', pl: 'GTM strategy dla 2 nowych wejść rynkowych', it: 'GTM per 2 nuovi mercati' },
      { en: 'Zarządzanie digital P&L, 9 portali', pl: 'Zarządzanie digital P&L i ad spend na 9 portalach', it: 'Gestione digital P&L, 9 portali' },
    ],
  },
  {
    title: { en: 'Head of Marketing', pl: 'Head of Marketing', it: 'Head of Marketing' },
    date: 'Jan to Dec 2018',
    company: 'Lilla House Digital', location: 'Cracow, Poland',
    type: { en: 'Full-time', pl: 'Etat', it: 'Tempo pieno' },
    badges: ['Digital Agency', 'SMB · Performance'],
    bullets: [
      { en: 'SEO, PPC, email and social for 8 clients simultaneously', pl: 'Zarządzanie SEO, PPC, email i social dla 8 klientów jednocześnie', it: 'SEO, PPC, email, social per 8 clienti in contemporanea' },
      { en: 'Avg. 3.8× ROAS', pl: 'Avg. 3.8× ROAS dla kampanii e-commerce', it: 'Avg. 3,8× ROAS' },
      { en: 'Miesięczne raporty KPI per klient', pl: 'Miesięczne raporty KPI dla każdego klienta', it: 'Report KPI mensili per cliente' },
      { en: 'Koordynacja copy, design, dev w jednym flow', pl: 'Koordynacja produkcji treści: copy, design, dev', it: 'Coordinamento copy, design, dev in un unico flow' },
      { en: 'CRO na landing pages klientów', pl: 'Optymalizacja CRO landing pages klientów', it: 'CRO sulle landing page dei clienti' },
    ],
  },
  {
    title: { en: 'Head of MarComm / Sr PR Manager / PR Manager', pl: 'Head of MarComm / Sr PR Manager / PR Manager', it: 'Head of MarComm / Sr PR Manager / PR Manager' },
    date: '2010 to 2018',
    company: 'City of Łódź Office', companyUrl: 'https://uml.lodz.pl', location: 'Łódź, Poland',
    type: { en: 'Full-time', pl: 'Etat', it: 'Tempo pieno' },
    badges: ['Public Administration', '8 years · 3 promotions'],
    bullets: [
      { en: 'Promoted from PR Mgr to Sr PR Mgr to Head of MarComm', pl: '8 lat w urzędzie, awans od PR Mgr przez Sr PR Mgr do Head of MarComm', it: '8 anni, promozione da PR Mgr a Sr PR Mgr a Head of MarComm' },
      { en: 'Komunikacja zewnętrzna i medialna miasta Łódź', pl: 'Zarządzanie komunikacją zewnętrzną i medialną miasta', it: 'Comunicazione esterna e media della città di Łódź' },
      { en: 'Kampanie: kulturalne, inwestycyjne, turystyczne', pl: 'Kampanie miejskie: kulturalne, inwestycyjne, turystyczne', it: 'Campagne: culturali, investimento, turismo' },
      { en: 'Rzecznictwo prasowe + zarządzanie kryzysowe', pl: 'Rzecznictwo prasowe i zarządzanie kryzysowe', it: 'Relazioni con la stampa + gestione della crisi comunicativa' },
      { en: 'Koordynacja komunikacji, 20+ wydziałów', pl: 'Koordynacja komunikacji dla 20+ wydziałów urzędu', it: 'Coordinamento comunicazioni, 20+ dipartimenti comunali' },
    ],
  },
  {
    title: { en: 'Retail Marketing Specialist', pl: 'Retail Marketing Specialist', it: 'Specialista Marketing Retail' },
    date: '2009 to 2010',
    company: 'mBank S.A.', companyUrl: 'https://mbank.pl',
    type: { en: 'Full-time', pl: 'Etat', it: 'Tempo pieno' },
    badges: ['Banking / FinTech', 'Retail'],
    bullets: [
      { en: 'Kampanie dla segmentu klientów detalicznych', pl: 'Kampanie marketingowe dla segmentu klientów detalicznych', it: 'Campagne per il segmento clienti retail banking' },
      { en: 'Analiza efektywności i raportowanie kampanii', pl: 'Analiza efektywności działań marketingowych i raportowanie', it: 'Analisi performance e reportistica sull\'efficacia del marketing' },
      { en: 'Współpraca z product teams nad positioningiem i komunikacją', pl: 'Współpraca z product teams nad ofertą i komunikacją produktową', it: 'Collaborazione con team product su positioning e comunicazione prodotto' },
    ],
  },
  {
    title: { en: 'IT Lecturer', pl: 'Wykładowca IT', it: 'Docente IT' },
    date: '1997 to 2002',
    company: 'Center of Modern Information Technologies',
    type: { en: 'Education', pl: 'Edukacja', it: 'Istruzione' },
    badges: ['IT Training'],
    bullets: [
      { en: 'Szkolenia IT dla dorosłych uczestników', pl: 'Szkolenia z zakresu technologii informatycznych dla dorosłych', it: 'Formazione IT per adulti' },
      { en: 'Projektowanie i prowadzenie kursów komputerowych', pl: 'Projektowanie i prowadzenie kursów komputerowych', it: 'Progettazione e conduzione di corsi di informatica' },
    ],
  },
];

// ─── Tools & Stack ─────────────────────────────────────────────────────────

const img = (slug: string, color: string): ChipIcon => ({ type: 'img', slug, color });
const ini = (text: string, bg: string, textColor = '#fff'): ChipIcon => ({ type: 'initials', text, bg, textColor });

export const toolGroups: ToolGroup[] = [
  {
    label: { en: 'AI & Automation', pl: 'AI & Automatyzacja', it: 'AI & Automazione' },
    tools: [
      { name: 'Claude',       icon: img('anthropic', 'FF6719'), lime: true },
      { name: 'ChatGPT',      icon: img('openai', '10A37F'),    lime: true },
      { name: 'Gemini',       icon: img('googlegemini', '4285F4'), lime: true },
      { name: 'Perplexity',   icon: img('perplexity', '1FB8CD'),   lime: true },
      { name: 'DeepSeek',     icon: ini('DS', '#4776E6') },
      { name: 'Grok',         icon: ini('Gk', '#1a1a1a') },
      { name: 'NotebookLM',   icon: img('google', '4285F4') },
      { name: 'n8n',          icon: img('n8n', 'EA4B71'),        lime: true },
      { name: 'Make',         icon: img('make', '6366F1') },
      { name: 'Zapier',       icon: img('zapier', 'FF4A00') },
    ],
  },
  {
    label: { en: 'AI Builders', pl: 'AI Buildery', it: 'AI Builder' },
    tools: [
      { name: 'Lovable',      icon: ini('Lv', '#FF6B6B'),   lime: true },
      { name: 'Bolt',         icon: ini('Bt', '#1A1A2E'),   lime: true },
      { name: 'Base44',       icon: ini('B4', '#4F46E5'),   lime: true },
      { name: 'Claude Code',  icon: img('anthropic', 'FF6719'), lime: true },
      { name: 'Cursor',       icon: img('cursor', '888888') },
      { name: 'v0',           icon: ini('v0', '#18181b') },
    ],
  },
  {
    label: { en: 'Analytics & Performance', pl: 'Analityka & Performance', it: 'Analytics & Performance' },
    tools: [
      { name: 'GA4',          icon: img('googleanalytics', 'E37400') },
      { name: 'Amplitude',    icon: ini('Am', '#197EEF') },
      { name: 'Kibana',       icon: img('kibana', 'F04E98'),    lime: true },
      { name: 'Grafana',      icon: img('grafana', 'F46800'),   lime: true },
      { name: 'PostHog',      icon: img('posthog', 'F54E00') },
      { name: 'Mixpanel',     icon: ini('Mx', '#7856FF') },
      { name: 'SEMrush',      icon: ini('Se', '#FF642E') },
      { name: 'Ahrefs',       icon: ini('Ah', '#FF7043') },
      { name: 'Looker Studio', icon: img('looker', '4285F4') },
    ],
  },
  {
    label: { en: 'Infrastructure', pl: 'Infrastruktura', it: 'Infrastruttura' },
    tools: [
      { name: 'Vercel',       icon: img('vercel', '080808'),     lime: true },
      { name: 'Netlify',      icon: img('netlify', '00C7B7'),    lime: true },
      { name: 'GitHub',       icon: img('github', '080808'),     lime: true },
      { name: 'Docker',       icon: img('docker', '2496ED') },
      { name: 'Cloudflare',   icon: img('cloudflare', 'F48120'), lime: true },
    ],
  },
  {
    label: { en: 'Data & Backend', pl: 'Dane & Backend', it: 'Dati & Backend' },
    tools: [
      { name: 'Supabase',     icon: img('supabase', '3ECF8E'),  lime: true },
      { name: 'Stripe',       icon: img('stripe', '635BFF'),    lime: true },
      { name: 'Airtable',     icon: img('airtable', 'FCB400'),  lime: true },
      { name: 'Salesforce',   icon: img('salesforce', '00A1E0') },
    ],
  },
  {
    label: { en: 'Content & Community', pl: 'Treści & Społeczność', it: 'Contenuti & Community' },
    tools: [
      { name: 'Notion',       icon: img('notion', '080808'),    lime: true },
      { name: 'Substack',     icon: img('substack', 'FF6719'),  lime: true },
      { name: 'Discord',      icon: img('discord', '5865F2'),   lime: true },
      { name: 'Figma',        icon: img('figma', 'A259FF') },
      { name: 'Framer',       icon: img('framer', '0055FF') },
      { name: 'Canva',        icon: img('canva', '00C4CC') },
      { name: 'Webflow',      icon: img('webflow', '4353FF') },
    ],
  },
];

// ─── Tool setups ───────────────────────────────────────────────────────────

export const setups: Setup[] = [
  { name: { en: 'Performance Marketing', pl: 'Performance Marketing', it: 'Performance Marketing' }, tools: ['Claude', 'ChatGPT', 'GA4', 'SEMrush', 'Google Ads', 'Grafana', 'Airtable'] },
  { name: { en: 'Demand Gen', pl: 'Demand Gen', it: 'Demand Gen' }, tools: ['Claude', 'Substack', 'LinkedIn', 'n8n', 'Notion', 'Perplexity'] },
  { name: { en: 'Lead Gen', pl: 'Lead Gen', it: 'Lead Gen' }, tools: ['Claude', 'Clay', 'n8n', 'Airtable', 'Kibana', 'GitHub'] },
  { name: { en: 'e-commerce', pl: 'e-commerce', it: 'e-commerce' }, tools: ['Stripe', 'Supabase', 'Vercel', 'Lovable', 'Cloudflare'] },
  { name: { en: 'Marketing Automation', pl: 'Marketing Automation', it: 'Marketing Automation' }, tools: ['n8n', 'Make', 'Airtable', 'GetResponse', 'HubSpot'] },
  { name: { en: 'Strategic Growth', pl: 'Growth Strategiczny', it: 'Crescita Strategica' }, tools: ['Reforge', 'Claude', 'Perplexity', 'NotebookLM', 'Notion'] },
  { name: { en: 'Sales Enablement', pl: 'Sales Enablement', it: 'Sales Enablement' }, tools: ['Clay', 'n8n', 'HubSpot', 'Notion', 'Discord'] },
];

// ─── Key skills ────────────────────────────────────────────────────────────

export const skillCategories: SkillCategory[] = [
  { label: { en: 'Growth & Marketing', pl: 'Growth & Marketing', it: 'Growth & Marketing' }, skills: 'Brand Management · Communications · Digital Advertising · Email Marketing · Go-To-Market Strategy · Partner Marketing · PR · SEO · UX/UI' },
  { label: { en: 'Data & Tools', pl: 'Data & Tools', it: 'Dati & Strumenti' }, skills: 'CRM · Data Analytics · Experimentation · Marketing Automation · A/B Testing · LLM Automation' },
  { label: { en: 'Product & Technology', pl: 'Product & Technology', it: 'Prodotto & Tecnologia' }, skills: 'API · Customer Journey Mapping · Tech Awareness · PLG · SaaS · Product & Marketing Collaboration' },
  { label: { en: 'Leadership & Strategy', pl: 'Leadership & Strategy', it: 'Leadership & Strategia' }, skills: 'Agile · B2B & B2C Marketing · Crisis Management · Leadership · Project Management · Stakeholder Management' },
];

// ─── Certifications ────────────────────────────────────────────────────────

export const certifications: Cert[] = [
  { name: 'Google Analytics Advanced', issuer: 'Google', year: '2021', badge: 'G', bg: '#4285F4' },
  { name: 'Generative AI Skills',      issuer: 'Google', year: '2023', badge: 'G', bg: '#EA4335' },
  { name: 'Google Ads Search & Display', issuer: 'Google Ads', year: '2021', badge: 'G', bg: '#FBBC04', textColor: '#000' },
  { name: 'Advanced Growth Series',    issuer: 'Reforge', year: '2021', badge: 'R', bg: '#FF6B35' },
  { name: 'Retention + Engagement Deep Dive', issuer: 'Reforge', year: '2021', badge: 'R', bg: '#FF6B35' },
  { name: 'Growth-Driven Design',      issuer: 'HubSpot Academy', year: '2021', badge: 'H', bg: '#FF7A59' },
  { name: 'Inbound Marketing',         issuer: 'HubSpot Academy', year: '2020', badge: 'H', bg: '#FF7A59' },
  { name: 'PPC Automation Exam',       issuer: 'SEMrush Academy', year: '2021', badge: 'S', bg: '#FF642E' },
  { name: 'Elements of AI',            issuer: 'Univ. of Helsinki', year: '2021', badge: 'U', bg: '#003580' },
  { name: 'Professional Scrum',        issuer: 'Scrum.org', year: '2020', badge: 'Sc', bg: '#009FDA' },
  { name: 'Google Data Studio',        issuer: 'Google', year: '2019', badge: 'GR', bg: '#F48120' },
  { name: 'Project Management',        issuer: 'Leadership Center', year: '2019', badge: 'PM', bg: '#1e3a5f' },
];

// ─── Education ─────────────────────────────────────────────────────────────

export const education: Education[] = [
  { degree: { en: 'Executive MBA', pl: 'Executive MBA', it: 'Executive MBA' }, school: 'UBINS Varsovia', subject: { en: 'Business Administration · 2021', pl: 'Business Administration · 2021', it: 'Amministrazione Aziendale · 2021' } },
  { degree: { en: 'Master of Science', pl: 'Magister', it: 'Laurea Magistrale' }, school: 'University of Lodz', subject: { en: 'Journalism & Social Comm. · 2020 to 2022', pl: 'Dziennikarstwo i Komunikacja Społeczna · 2020 to 2022', it: 'Giornalismo & Comunicazione Sociale · 2020 to 2022' } },
  { degree: { en: 'Post-graduate', pl: 'Studia Podyplomowe', it: 'Specializzazione Post-laurea' }, school: 'Warsaw School of Economics (SGH)', subject: { en: 'Public Relations · 2016 to 2017', pl: 'Public Relations · 2016 to 2017', it: 'Relazioni Pubbliche · 2016 to 2017' } },
  { degree: { en: 'BA in International Relations', pl: 'Licencjat stosunki międzynarodowe', it: 'Laurea Triennale in Relazioni Internazionali' }, school: 'University of Lodz', subject: { en: 'International Relations · 2007 to 2010', pl: 'Stosunki Międzynarodowe · 2007 to 2010', it: 'Relazioni Internazionali · 2007 to 2010' } },
];

// ─── Languages ─────────────────────────────────────────────────────────────

export const languages: Language[] = [
  { flag: '🇬🇧', name: { en: 'English', pl: 'English', it: 'Inglese' }, level: { en: 'Native / Bilingual', pl: 'Madrelingua / Bilingue', it: 'Madrelingua / Bilingue' }, levelClass: 'cv-lang-level-high' },
  { flag: '🇵🇱', name: { en: 'Polish',  pl: 'Polacco',  it: 'Polacco'  }, level: { en: 'Native / Bilingual', pl: 'Madrelingua / Bilingue', it: 'Madrelingua / Bilingue' }, levelClass: 'cv-lang-level-high' },
  { flag: '🇩🇪', name: { en: 'German',  pl: 'Tedesco',  it: 'Tedesco'  }, level: { en: 'Conversational', pl: 'Conversazionale', it: 'Conversazionale' }, levelClass: 'cv-lang-level-mid' },
  { flag: '🇳🇴', name: { en: 'Norwegian', pl: 'Norvegese', it: 'Norvegese' }, level: { en: 'Basic', pl: 'Base', it: 'Base' }, levelClass: 'cv-lang-level-low' },
  { flag: '🇪🇸', name: { en: 'Spanish', pl: 'Spagnolo', it: 'Spagnolo' }, level: { en: 'Basic', pl: 'Base', it: 'Base' }, levelClass: 'cv-lang-level-low' },
];
