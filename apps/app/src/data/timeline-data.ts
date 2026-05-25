export interface TimelineEntry {
  name: { pl: string; en: string; it: string } | string;
  badge: string;
  badgeStyle?: 'shipped' | 'default';
  note: { pl: string; en: string; it: string };
  tech?: string[];
  isMilestone?: boolean;
}

export interface TimelineYear {
  year: number;
  entries: TimelineEntry[];
}

export const timelineData: TimelineYear[] = [
  {
    year: 2026,
    entries: [
      {
        name: 'AI-native SaaS platform shipped',
        badge: 'Shipped',
        badgeStyle: 'shipped',
        note: {
          pl: 'AI-native SaaS z brand intelligence, automatycznymi briefami i CRM relationship graph dla B2B.',
          en: 'AI-native SaaS with brand intelligence, automated briefs and B2B relationship graph CRM.',
          it: 'SaaS AI-native con brand intelligence, brief automatici e CRM relationship graph per B2B.',
        },
        tech: ['React', 'Supabase', 'Anthropic', 'OpenAI', 'Vercel'],
        isMilestone: true,
      },
      {
        name: 'SEO-first B2B product sites',
        badge: 'Shipped',
        badgeStyle: 'shipped',
        note: {
          pl: 'SEO-first strony dla B2B ze structured data i LLM discoverability, każda zbudowana w 2h.',
          en: 'SEO-first B2B product sites with structured data and LLM discoverability, each built in under 2h.',
          it: 'Siti prodotto SEO-first per B2B con dati strutturati e LLM discoverability, ciascuno costruito in 2h.',
        },
        tech: ['React', 'Vercel', 'Claude'],
        isMilestone: true,
      },
      {
        name: 'Native macOS desktop utility shipped',
        badge: 'Shipped',
        badgeStyle: 'shipped',
        note: {
          pl: 'Natywna aplikacja macOS jako teleprompter umieszczający notatki pod notchem kamery MacBooka. Swift, AppKit, local-first, własny DMG pipeline.',
          en: 'Native macOS teleprompter placing private notes under the MacBook camera notch. Swift, AppKit, local-first, custom DMG build pipeline.',
          it: 'Teleprompter macOS nativo che posiziona note private sotto il notch della fotocamera MacBook. Swift, AppKit, local-first, pipeline DMG personalizzato.',
        },
        tech: ['Swift', 'AppKit', 'AVFoundation', 'macOS 14+'],
        isMilestone: true,
      },
      {
        name: 'Agentic workflows',
        badge: 'AI',
        note: {
          pl: 'Claude Code + MCP + własne narzędzia. Kod pisany, testowany i deployowany z pomocą agentów.',
          en: 'Claude Code + MCP + custom tools. Code written, tested and deployed with agent assistance.',
          it: 'Claude Code + MCP + strumenti propri. Codice scritto, testato e deployato con agenti.',
        },
      },
    ],
  },
  {
    year: 2025,
    entries: [
      {
        name: 'Consumer SaaS with Stripe subscriptions',
        badge: 'Shipped',
        badgeStyle: 'shipped',
        note: {
          pl: 'Tracker rekrutacyjny i platforma kursów audio z certyfikacją jako pierwsze produkty consumer z Stripe.',
          en: 'Recruitment tracker and audio course platform with certification as first consumer products with Stripe.',
          it: 'Tracker di recruiting e piattaforma di corsi audio con certificazione come primi prodotti consumer con Stripe.',
        },
        tech: ['React', 'Supabase', 'Stripe', 'Vercel'],
        isMilestone: true,
      },
      {
        name: 'Consumer apps with AI features',
        badge: 'Shipped',
        badgeStyle: 'shipped',
        note: {
          pl: 'Consumer apps z AI, smart listy zakupów i platforma kolarskiej społeczności z asystentem AREK.',
          en: 'Consumer apps with AI, smart shopping lists and a cycling community with AI assistant AREK.',
          it: 'App consumer con AI, liste della spesa intelligenti e comunità ciclistica con assistente AREK.',
        },
        tech: ['React', 'Supabase', 'OpenAI', 'PWA'],
        isMilestone: true,
      },
      {
        name: 'Client sites, rapid delivery model',
        badge: 'Shipped',
        badgeStyle: 'shipped',
        note: {
          pl: 'Strony dla klientów: pracownia wnętrz, zaproszenie ślubne, zespół rockowy, klubokawiarnia.',
          en: 'Client sites for interior design studio, wedding hub, rock band and club-café. Zero to deployed fast.',
          it: 'Siti per clienti: studio di design, hub matrimoniale, band rock, club-café. Da zero al deploy rapidamente.',
        },
        tech: ['React', 'Lovable', 'Vercel'],
        isMilestone: true,
      },
      {
        name: 'Claude Code + Lovable / Base44',
        badge: 'AI Dev',
        note: {
          pl: 'AI-assisted development jako standard. MVP dla klienta w 1 dzień, złożone features w godziny.',
          en: 'AI-assisted development as the default. Client MVP in 1 day, complex features in hours.',
          it: 'Sviluppo assistito da AI come standard. MVP per cliente in 1 giorno, funzionalità complesse in ore.',
        },
      },
      {
        name: 'shadcn/ui + Resend',
        badge: 'Frontend',
        note: {
          pl: 'Komponenty jako kod i transakcyjne maile. Design system + email w każdym nowym projekcie.',
          en: 'Components as code and transactional email. Design system + email in every new project.',
          it: 'Componenti come codice e email transazionali. Design system + email in ogni nuovo progetto.',
        },
      },
    ],
  },
  {
    year: 2024,
    entries: [
      {
        name: 'First internal SaaS dashboard',
        badge: 'Shipped',
        badgeStyle: 'shipped',
        note: {
          pl: 'Pierwszy własny dashboard SaaS dla demand gen, lead scoringu i revenue trackingu w B2B SaaS scale-upie.',
          en: 'First own SaaS dashboard for demand gen, lead scoring and revenue tracking in a B2B SaaS scale-up.',
          it: 'Primo dashboard SaaS per demand gen, lead scoring e revenue tracking in uno scale-up B2B SaaS.',
        },
        tech: ['React', 'Supabase', 'GA4', 'Netlify'],
        isMilestone: true,
      },
      {
        name: 'Data-heavy PWA with geo-analysis',
        badge: 'Shipped',
        badgeStyle: 'shipped',
        note: {
          pl: 'Kalkulator wartości działek z analizą lokalizacji, mediami i wyceną nieruchomości.',
          en: 'Plot value calculator with location analysis, utilities and property valuation in one view.',
          it: 'Calcolatore del valore dei terreni con analisi della posizione e valutazione immobiliare.',
        },
        tech: ['React', 'Supabase', 'Mapbox', 'Vercel'],
        isMilestone: true,
      },
      {
        name: 'Multi-account performance dashboard',
        badge: 'Shipped',
        badgeStyle: 'shipped',
        note: {
          pl: 'Google Ads multi-konto z AI ICP scoringiem, ROAS tracking i creative fatigue alertami.',
          en: 'Multi-account Google Ads dashboard with AI ICP scoring, ROAS tracking and creative fatigue alerts.',
          it: 'Dashboard Google Ads multi-account con AI ICP scoring, ROAS tracking e creative fatigue alerts.',
        },
        tech: ['React', 'FastAPI', 'BigQuery', 'Cloud Run', 'OpenAI'],
        isMilestone: true,
      },
      {
        name: 'FastAPI + BigQuery + Cloud Run',
        badge: 'Backend',
        note: {
          pl: 'Własny backend poza Supabase. Konteneryzacja, analytics na milionach wierszy, zarządzanie IAM.',
          en: 'Custom backend beyond Supabase. Containerisation, analytics at scale, IAM management.',
          it: 'Backend personalizzato oltre Supabase. Containerizzazione, analytics su milioni di righe, IAM.',
        },
      },
      {
        name: 'Stripe',
        badge: 'Payments',
        note: {
          pl: 'Pierwsze płatności w produkcie. Webhooks, Customer Portal, PCI compliance od razu.',
          en: 'First payments in a product. Webhooks, Customer Portal, PCI compliance from the start.',
          it: 'Primi pagamenti in un prodotto. Webhook, Customer Portal, conformità PCI da subito.',
        },
      },
    ],
  },
  {
    year: 2023,
    entries: [
      {
        name: {
          pl: 'Pierwsze narzędzia wewnętrzne',
          en: 'First internal tools',
          it: 'Primi strumenti interni',
        },
        badge: 'Start',
        badgeStyle: 'shipped',
        note: {
          pl: 'Google Ads na skali, analityka i dashboardy w B2B SaaS scale-upie. Stąd potrzeba własnych narzędzi.',
          en: 'Google Ads at scale, analytics and dashboards at a B2B SaaS scale-up. The itch to build proper tools started here.',
          it: 'Google Ads in scala, analytics e dashboard in uno scale-up B2B SaaS. Qui nasce l\'esigenza di strumenti propri.',
        },
        isMilestone: true,
      },
      {
        name: 'React + Vite + TypeScript',
        badge: 'Frontend',
        note: {
          pl: 'Pierwszy framework JS. Zamiast kursów od razu projekty.',
          en: 'First JS framework. No courses, straight to building.',
          it: 'Primo framework JS. Niente corsi, subito a costruire.',
        },
      },
      {
        name: 'Supabase',
        badge: 'Backend',
        note: {
          pl: 'Baza danych i auth bez serwera. Postgres + RLS od pierwszego projektu.',
          en: 'Database and auth without managing a server. Postgres + RLS from day one.',
          it: 'Database e auth senza server. Postgres + RLS dal primo progetto.',
        },
      },
    ],
  },
];
