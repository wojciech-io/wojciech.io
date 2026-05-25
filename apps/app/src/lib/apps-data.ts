export type AppStatus = 'live' | 'in-progress' | 'private-mvp' | 'private-beta' | 'soon';
export type AppFilter = 'b2b' | 'consumer' | 'booking' | 'brand' | 'productivity';

export interface AppEntry {
  id: string;
  name: string;
  initials: string;
  category: string;
  badge: string;
  tagline: { en: string; pl: string; it: string };
  tags: string;
  searchName: string;
  tech: { label: string; accent?: true }[];
  url?: string;
  urlLabel?: { en: string; pl: string; it: string };
  status: AppStatus;
  // Color palette — drives card-screen gradients, icon box, app-icon chip
  palette: {
    screenFrom: string;  // dark bg gradient start
    screenTo: string;    // dark bg gradient end
    glowRgba: string;    // radial overlay rgba (accent glow)
    iconFrom: string;    // icon-box gradient start
    iconTo: string;      // icon-box gradient end
    shadowRgba: string;  // icon-box shadow rgba
    chipBg: string;      // small app-icon chip color (solid or gradient)
  };
  icon: string; // inner SVG markup (no outer <svg>)
}

const ICON = {
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  trendUp: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  monitor: '<rect x="2" y="3" width="20" height="13" rx="2"/><path d="M2 19h20"/><path d="M8 23h8"/><rect x="10" y="5" width="4" height="2" rx="1" fill="currentColor" stroke="none" opacity="0.6"/>',
  truck: '<rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 4v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  list: '<path d="M3 6h18M3 12h18M3 18h18"/><circle cx="7" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="7" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="7" cy="18" r="1" fill="currentColor" stroke="none"/>',
  lightning: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
};

export const apps: AppEntry[] = [
  {
    id: 'sabiszop',
    name: 'SabiSzop',
    initials: 'SS',
    category: 'Marketplace · B2C',
    badge: 'Marketplace',
    tagline: {
      en: 'Smart shopping lists, receipts & recipes. Grocery-inspired UI with AI suggestions.',
      pl: 'Smart listy zakupów, paragony i przepisy. Grocery inspired dark glassmorphism UI z AI sugestiami.',
      it: 'Liste della spesa intelligenti, scontrini e ricette. UI glassmorphism con suggerimenti AI.',
    },
    tags: 'consumer pwa react typescript supabase',
    searchName: 'sabiszop sabi szop grocery shopping',
    tech: [{ label: 'React 18' }, { label: 'TypeScript' }, { label: 'Supabase' }, { label: 'Recharts' }, { label: 'Netlify' }],
    url: 'https://sabiszop.netlify.app/',
    urlLabel: { en: 'Open', pl: 'Otwórz', it: 'Apri' },
    status: 'live',
    palette: {
      screenFrom: '#030919', screenTo: '#05122e',
      glowRgba: 'rgba(28,105,212,0.45)',
      iconFrom: '#2e7de8', iconTo: '#1C69D4',
      shadowRgba: 'rgba(28,105,212,0.4)',
      chipBg: '#1C69D4',
    },
    icon: ICON.cart,
  },
  {
    id: 'growthhub',
    name: 'GrowthHub',
    initials: 'GH',
    category: 'Growth · B2B SaaS',
    badge: 'SaaS',
    tagline: {
      en: 'Growth dashboard for demand gen, lead scoring and revenue tracking in one place. Currently being rebuilt on Claude, stripped of legacy branding.',
      pl: 'Growth dashboard dla demand gen, lead scoringu i revenue trackingu w jednym miejscu. Aktualnie przepisywany na Claude, bez wcześniejszego brandingu.',
      it: 'Growth dashboard per demand gen, lead scoring e revenue tracking in un unico posto. Attualmente in ricostruzione su Claude, senza branding precedente.',
    },
    tags: 'b2b saas growth marketing analytics dashboard',
    searchName: 'growthhub growth hub dashboard',
    tech: [{ label: 'React' }, { label: 'TypeScript' }, { label: 'Claude' }],
    url: 'https://gh.wojciech.io/demo/',
    urlLabel: { en: 'Demo', pl: 'Demo', it: 'Demo' },
    status: 'in-progress',
    palette: {
      screenFrom: '#031011', screenTo: '#05211f',
      glowRgba: 'rgba(16,185,129,0.45)',
      iconFrom: '#14d498', iconTo: '#10b981',
      shadowRgba: 'rgba(16,185,129,0.4)',
      chipBg: '#10b981',
    },
    icon: ICON.trendUp,
  },
  {
    id: 'hireme',
    name: 'HireMe',
    initials: 'HM',
    category: 'Recruitment · SaaS',
    badge: 'SaaS',
    tagline: {
      en: 'Job search command centre with funnel, priorities and activity in one view.',
      pl: 'Tracker aplikacji o pracę jako centrum dowodzenia poszukiwań pracy. Lejek, priorytety, aktywność.',
      it: 'Centro di controllo ricerca lavoro con funnel, priorità e attività in un\'unica vista.',
    },
    tags: 'b2b saas recruitment hr ats jobs pwa',
    searchName: 'hireme hire me rekrutacja recruitment ats',
    tech: [{ label: 'React' }, { label: 'TypeScript' }, { label: 'Supabase' }, { label: 'Netlify' }],
    url: 'https://hireme-amber.vercel.app/login',
    urlLabel: { en: 'Open', pl: 'Otwórz', it: 'Apri' },
    status: 'live',
    palette: {
      screenFrom: '#030d12', screenTo: '#051a20',
      glowRgba: 'rgba(13,148,136,0.45)',
      iconFrom: '#11aba0', iconTo: '#0d9488',
      shadowRgba: 'rgba(13,148,136,0.4)',
      chipBg: '#0d9488',
    },
    icon: ICON.users,
  },
  {
    id: 'an-projekt',
    name: 'AN Projekt',
    initials: 'AN',
    category: 'Website · Interior Design',
    badge: 'Website',
    tagline: {
      en: 'Interior design studio website. Interiors tailored to your life.',
      pl: 'Strona internetowa pracowni projektowania wnętrz. Wnętrza dopasowane do Twojego życia.',
      it: 'Sito web dello studio di interior design. Interni su misura per la tua vita.',
    },
    tags: 'brand website interior design react vite lovable strona-www',
    searchName: 'an projekt an-projekt strona internetowa website',
    tech: [{ label: 'React' }, { label: 'Vite' }, { label: 'Lovable' }, { label: 'Tailwind' }],
    url: 'https://an-projekt.com.pl/',
    urlLabel: { en: 'Open', pl: 'Otwórz', it: 'Apri' },
    status: 'live',
    palette: {
      screenFrom: '#150613', screenTo: '#2a0c23',
      glowRgba: 'rgba(236,72,153,0.45)',
      iconFrom: '#f660a8', iconTo: '#ec4899',
      shadowRgba: 'rgba(236,72,153,0.4)',
      chipBg: '#ec4899',
    },
    icon: ICON.home,
  },
  {
    id: 'ciryam',
    name: 'Ciryam',
    initials: 'CI',
    category: 'Website · Music Band',
    badge: 'Website',
    tagline: {
      en: 'Official website of a Polish rock band with concerts, music, tickets and merch store.',
      pl: 'Oficjalna strona polskiego zespołu rockowego z koncertami, muzyką, biletami i sklepem z merch.',
      it: 'Sito ufficiale di una band rock polacca con concerti, musica, biglietti e negozio merch.',
    },
    tags: 'brand website music band rock react vite',
    searchName: 'ciryam band music website strona',
    tech: [{ label: 'React' }, { label: 'Vite' }, { label: 'Tailwind' }],
    url: 'https://ciryam.eu',
    urlLabel: { en: 'Open', pl: 'Otwórz', it: 'Apri' },
    status: 'live',
    palette: {
      screenFrom: '#14030c', screenTo: '#280514',
      glowRgba: 'rgba(225,29,72,0.45)',
      iconFrom: '#f52e57', iconTo: '#e11d48',
      shadowRgba: 'rgba(225,29,72,0.4)',
      chipBg: '#e11d48',
    },
    icon: ICON.music,
  },
  {
    id: 'dzialkometr',
    name: 'Działkometr',
    initials: 'DZ',
    category: 'Real Estate · PWA',
    badge: 'PWA',
    tagline: {
      en: 'Plot value calculator with location analysis, utilities, MPZP and property valuation in one view.',
      pl: 'Kalkulator wartości działek z analizą lokalizacji, mediami, MPZP i wyceną nieruchomości.',
      it: 'Calcolatore del valore del terreno con analisi posizione, utenze e valutazione.',
    },
    tags: 'consumer pwa react vite supabase real-estate nieruchomosci dzialka kalkulator',
    searchName: 'dzialkomierz dzialka nieruchomosci kalkulator',
    tech: [{ label: 'React' }, { label: 'Vite' }, { label: 'Supabase' }, { label: 'Mapbox' }, { label: 'Netlify' }],
    url: 'https://dzialkometr.netlify.app/auth/login?next=%2Fapp',
    urlLabel: { en: 'Open', pl: 'Otwórz', it: 'Apri' },
    status: 'live',
    palette: {
      screenFrom: '#0b0e08', screenTo: '#161c0c',
      glowRgba: 'rgba(124,158,0,0.45)',
      iconFrom: '#92bb00', iconTo: '#7c9e00',
      shadowRgba: 'rgba(124,158,0,0.4)',
      chipBg: '#7c9e00',
    },
    icon: ICON.pin,
  },
  {
    id: 'ads-assistant',
    name: 'Ads Assistant',
    initials: 'AA',
    category: 'Marketing AI · B2B SaaS',
    badge: 'SaaS',
    tagline: {
      en: 'Google Ads dashboard with AI ICP lead scoring (0-100). Shifts optimisation from CPL to CPL-ICP-fit.',
      pl: 'Dashboard Google Ads z AI ICP lead scoringiem (0-100). Przesuwa optymalizację z CPL na CPL-ICP-fit.',
      it: 'Dashboard Google Ads con AI ICP lead scoring (0-100). Sposta l\'ottimizzazione da CPL a CPL-ICP-fit.',
    },
    tags: 'b2b saas ai google-ads marketing automation analytics icp',
    searchName: 'ads assistant google ads dashboard marketing ai performance',
    tech: [{ label: 'React' }, { label: 'TypeScript' }, { label: 'Vite' }, { label: 'Tailwind' }, { label: 'Vercel' }],
    url: 'https://ads-assistant-three.vercel.app',
    urlLabel: { en: 'Open', pl: 'Otwórz', it: 'Apri' },
    status: 'live',
    palette: {
      screenFrom: '#160e08', screenTo: '#2c1c0c',
      glowRgba: 'rgba(245,158,11,0.45)',
      iconFrom: '#ffb420', iconTo: '#f59e0b',
      shadowRgba: 'rgba(245,158,11,0.4)',
      chipBg: '#f59e0b',
    },
    icon: ICON.target,
  },
  {
    id: 'notchcue',
    name: 'NotchCue',
    initials: 'NC',
    category: 'Desktop Utility · macOS',
    badge: 'macOS',
    tagline: {
      en: 'Native macOS teleprompter placing private notes under the MacBook camera notch. Keeps eye contact during calls and demos.',
      pl: 'Natywny teleprompter macOS umieszczający prywatne notatki pod notchem kamery MacBooka.',
      it: 'Teleprompter nativo macOS che posiziona note private sotto il notch della fotocamera MacBook.',
    },
    tags: 'productivity macos native swift desktop utility teleprompter privacy local-first',
    searchName: 'notchcue notch cue macos teleprompter prompter',
    tech: [{ label: 'Swift 5.10' }, { label: 'AppKit' }, { label: 'AVFoundation' }, { label: 'macOS 14+' }],
    url: 'https://notch.wojciech.io',
    urlLabel: { en: 'Landing', pl: 'Strona', it: 'Landing' },
    status: 'live',
    palette: {
      screenFrom: '#08081a', screenTo: '#101031',
      glowRgba: 'rgba(94,92,230,0.45)',
      iconFrom: '#4a4a4c', iconTo: '#1C1C1E',
      shadowRgba: 'rgba(94,92,230,0.35)',
      chipBg: '#1C1C1E',
    },
    icon: ICON.monitor,
  },
  {
    id: 'camper-rental',
    name: 'Camper Rental',
    initials: 'CR',
    category: 'Booking Engine · Consumer',
    badge: 'Booking',
    tagline: {
      en: 'Camper rental booking engine with dynamic pricing, availability management and a clean reservation flow.',
      pl: 'Booking engine do wynajmu kamperów z dynamicznymi cenami, zarządzaniem dostępnością i czystym flow rezerwacji.',
      it: 'Motore di prenotazione per noleggio camper con prezzi dinamici, gestione disponibilità e flusso di prenotazione semplice.',
    },
    tags: 'booking consumer react typescript supabase vercel rental',
    searchName: 'camper rental kamperownia booking engine',
    tech: [{ label: 'React' }, { label: 'TypeScript' }, { label: 'Supabase' }, { label: 'Vercel' }],
    url: 'https://camper-rental-weld.vercel.app/',
    urlLabel: { en: 'Open', pl: 'Otwórz', it: 'Apri' },
    status: 'live',
    palette: {
      screenFrom: '#051215', screenTo: '#0a2329',
      glowRgba: 'rgba(6,182,212,0.45)',
      iconFrom: '#22d3ee', iconTo: '#06b6d4',
      shadowRgba: 'rgba(6,182,212,0.4)',
      chipBg: '#06b6d4',
    },
    icon: ICON.truck,
  },
  {
    id: 'klaro',
    name: 'Klaro',
    initials: 'KL',
    category: 'Mac Utility · macOS native',
    badge: 'macOS',
    tagline: {
      en: 'Local-first Mac audit with cleanup preview and HTML report. Files move to Trash — nothing disappears silently.',
      pl: 'Lokalny audyt Maca z podglądem czyszczenia i raportem HTML. Pliki trafiają do Kosza — nic nie znika po cichu.',
      it: 'Audit Mac locale con anteprima pulizia e report HTML. I file vanno nel Cestino, niente sparisce in silenzio.',
    },
    tags: 'productivity macos native swift desktop utility cleaner storage privacy local-first',
    searchName: 'klaro mac cleaner cleanup storage utility swift swiftui macos native',
    tech: [{ label: 'SwiftUI', accent: true }, { label: 'macOS', accent: true }, { label: 'CLI' }, { label: 'Codex' }],
    status: 'private-mvp',
    palette: {
      screenFrom: '#04101a', screenTo: '#082030',
      glowRgba: 'rgba(8,145,178,0.45)',
      iconFrom: '#0ea5e9', iconTo: '#0891b2',
      shadowRgba: 'rgba(8,145,178,0.4)',
      chipBg: 'linear-gradient(135deg,#0ea5e9,#0891b2)',
    },
    icon: ICON.list,
  },
  {
    id: 'wojciech-coach',
    name: 'Wojciech Coach',
    initials: 'WC',
    category: 'Fitness · iPhone · Apple Watch · Mac',
    badge: 'iOS / watchOS / Mac',
    tagline: {
      en: 'Private running and activity coach for the Apple ecosystem. HealthKit, live workout on Watch, adaptive plan, maps, badges and analysis on Mac.',
      pl: 'Prywatny trener biegania i aktywności dla ekosystemu Apple. Apple Health, trening live na Watchu, plan adaptacyjny, mapy, odznaki i analiza na Macu.',
      it: 'Coach privato per corsa e attività per l\'ecosistema Apple. HealthKit, allenamento live su Watch, piano adattivo, mappe, badge e analisi su Mac.',
    },
    tags: 'consumer ios macos watchos health fitness swift apple xcode codex',
    searchName: 'wojciech coach running health apple watch iphone fitness tracker coaching',
    tech: [{ label: 'SwiftUI', accent: true }, { label: 'HealthKit', accent: true }, { label: 'watchOS', accent: true }, { label: 'Xcode' }, { label: 'Codex' }],
    url: 'https://coach.wojciech.io',
    urlLabel: { en: 'Landing', pl: 'Landing', it: 'Landing' },
    status: 'private-beta',
    palette: {
      screenFrom: '#060b18', screenTo: '#0d1a35',
      glowRgba: 'rgba(59,130,246,0.45)',
      iconFrom: '#3b82f6', iconTo: '#1d4ed8',
      shadowRgba: 'rgba(59,130,246,0.4)',
      chipBg: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
    },
    icon: ICON.lightning,
  },
];
