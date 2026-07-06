// Localized UI copy for the /meet scheduler.
//
// Intl handles month/day/time/timezone formatting from the page locale, so this
// table only carries the ~30 chrome labels plus the three meeting-type
// name/desc pairs. Meeting ids, durations and the `featured` flag stay in
// data/booking.ts (shared with the Pages Functions); this file localizes ONLY
// the display strings.
//
// Voice matches docs/10-tone-of-voice.md and reuses vocabulary already shipped
// in data/locales.ts (CTAs) and the contact labels (Name/Email/timezone), so a
// visitor never sees two different words for the same thing across the site.
//
// 'en' is canonical. Any new key MUST exist in 'en' first.

import { ALL_LOCALES, type SiteLocale } from './locale-codes';
import { localizedHome } from './locales';
import { SITE } from './site';
import type { MeetingId } from './booking';

export interface MeetTypeCopy {
  name: string;
  desc: string;
}

export interface MeetStrings {
  /** Layout <title> and meta description. */
  title: string;
  description: string;
  /** Hero. */
  eyebrow: string;
  h1: string;
  lead: string;
  /** Step eyebrows (the "1 · " / "2 · " / "3 · " numeric prefix is added in markup). */
  step1: string;
  step2: string;
  step3: string;
  /** Timezone note: rendered as `${tzLabel}: ${zone}`; tzLocal is the UTC fallback. */
  tzLabel: string;
  tzLocal: string;
  /** Calendar / slots. */
  selectDay: string;
  /** Form. */
  name: string;
  email: string;
  company: string;
  optional: string;
  notesQ: string;
  namePh: string;
  emailPh: string;
  companyPh: string;
  notesPh: string;
  confirm: string;
  booking: string;
  trust: string;
  summaryEmpty: string;
  summaryPickTime: string;
  successTitle: string;
  /** Async status / error strings used inside the client script. */
  loading: string;
  loadingAvail: string;
  loadError: string;
  genericError: string;
  /** Localized name + one-line desc for each meeting type. */
  types: Record<MeetingId, MeetTypeCopy>;
}

const en: MeetStrings = {
  title: 'Book a call',
  description:
    'Book a call with Wojciech Łuszczyński. Pick a format, a day, and a slot. Growth, AI, and GTM systems for SaaS and revenue-focused teams.',
  eyebrow: 'Book a call',
  h1: 'Book a call with Wojciech.',
  lead: 'Growth, AI, and GTM systems for SaaS and revenue-focused teams. Pick the format that fits, then a slot. No pitch deck, no intro slides.',
  step1: 'Choose the format',
  step2: 'Pick a day & time',
  step3: 'Your details',
  tzLabel: 'Times',
  tzLocal: 'Local time',
  selectDay: 'Select a day',
  name: 'Name',
  email: 'Email',
  company: 'Company',
  optional: '(optional)',
  notesQ: 'What do you want to cover?',
  namePh: 'Jane Doe',
  emailPh: 'jane@company.com',
  companyPh: 'Company',
  notesPh: 'One or two lines on the system or problem.',
  confirm: 'Confirm booking',
  booking: 'Booking…',
  trust: 'You get a calendar invite and a confirmation email.',
  summaryEmpty: 'Pick a format and a slot to see your booking summary here.',
  summaryPickTime: 'Now pick a time slot.',
  successTitle: 'You are booked.',
  loading: 'Loading…',
  loadingAvail: 'Loading availability…',
  loadError: 'Could not load availability. Please refresh.',
  genericError: 'Something went wrong. Please try again.',
  types: {
    intro: {
      name: 'Intro / Fit Call',
      desc: 'A short intro. Whether there is a fit, or fast context before a bigger conversation.',
    },
    followup: {
      name: 'Follow-up',
      desc: 'Continuing an existing thread. For people I have already spoken with.',
    },
    systems: {
      name: 'Growth & AI Systems',
      desc: 'The real strategy conversation. GTM, AI, and revenue systems, from your problem.',
    },
  },
};

const de: MeetStrings = {
  title: 'Termin vereinbaren',
  description:
    'Vereinbare einen Termin mit Wojciech Łuszczyński. Format wählen, Tag, Uhrzeit. Growth-, AI- und GTM-Systeme für SaaS und revenue-fokussierte Teams.',
  eyebrow: 'Termin vereinbaren',
  h1: 'Vereinbare einen Termin mit Wojciech.',
  lead: 'Growth-, AI- und GTM-Systeme für SaaS und revenue-fokussierte Teams. Wähle das passende Format, dann einen Slot. Kein Pitch-Deck, keine Intro-Folien.',
  step1: 'Format wählen',
  step2: 'Tag & Uhrzeit wählen',
  step3: 'Deine Angaben',
  tzLabel: 'Zeiten',
  tzLocal: 'Lokale Zeit',
  selectDay: 'Tag wählen',
  name: 'Name',
  email: 'E-Mail',
  company: 'Firma',
  optional: '(optional)',
  notesQ: 'Worum geht es?',
  namePh: 'Max Mustermann',
  emailPh: 'max@firma.de',
  companyPh: 'Firma',
  notesPh: 'Ein, zwei Zeilen zum System oder Problem.',
  confirm: 'Termin bestätigen',
  booking: 'Wird gebucht…',
  trust: 'Du bekommst eine Kalendereinladung und eine Bestätigungs-E-Mail.',
  summaryEmpty: 'Wähle ein Format und einen Slot, dann erscheint hier deine Zusammenfassung.',
  summaryPickTime: 'Jetzt einen Zeit-Slot wählen.',
  successTitle: 'Termin gebucht.',
  loading: 'Lädt…',
  loadingAvail: 'Verfügbarkeit wird geladen…',
  loadError: 'Verfügbarkeit konnte nicht geladen werden. Bitte neu laden.',
  genericError: 'Etwas ist schiefgelaufen. Bitte noch einmal versuchen.',
  types: {
    intro: {
      name: 'Intro / Fit Call',
      desc: 'Ein kurzes Kennenlernen. Passt es, oder schneller Kontext vor einem größeren Gespräch.',
    },
    followup: {
      name: 'Follow-up',
      desc: 'Ein laufender Faden. Für Leute, mit denen ich schon gesprochen habe.',
    },
    systems: {
      name: 'Growth & AI Systems',
      desc: 'Das echte Strategiegespräch. GTM, AI und Revenue-Systeme, ausgehend von deinem Problem.',
    },
  },
};

const dk: MeetStrings = {
  title: 'Book et opkald',
  description:
    'Book et opkald med Wojciech Łuszczyński. Vælg format, dag og tidspunkt. Growth-, AI- og GTM-systemer til SaaS og revenue-fokuserede teams.',
  eyebrow: 'Book et opkald',
  h1: 'Book et opkald med Wojciech.',
  lead: 'Growth-, AI- og GTM-systemer til SaaS og revenue-fokuserede teams. Vælg det format, der passer, og så en tid. Ingen pitch-deck, ingen intro-slides.',
  step1: 'Vælg format',
  step2: 'Vælg dag & tid',
  step3: 'Dine oplysninger',
  tzLabel: 'Tider',
  tzLocal: 'Lokal tid',
  selectDay: 'Vælg en dag',
  name: 'Navn',
  email: 'E-mail',
  company: 'Virksomhed',
  optional: '(valgfrit)',
  notesQ: 'Hvad skal vi tale om?',
  namePh: 'Anne Hansen',
  emailPh: 'anne@virksomhed.dk',
  companyPh: 'Virksomhed',
  notesPh: 'En linje eller to om systemet eller problemet.',
  confirm: 'Bekræft booking',
  booking: 'Booker…',
  trust: 'Du får en kalenderinvitation og en bekræftelsesmail.',
  summaryEmpty: 'Vælg et format og en tid, så vises din opsummering her.',
  summaryPickTime: 'Vælg nu et tidspunkt.',
  successTitle: 'Du er booket.',
  loading: 'Indlæser…',
  loadingAvail: 'Indlæser ledige tider…',
  loadError: 'Kunne ikke indlæse ledige tider. Opdater siden.',
  genericError: 'Noget gik galt. Prøv igen.',
  types: {
    intro: {
      name: 'Intro / Fit Call',
      desc: 'En kort intro. Om der er et match, eller hurtig kontekst før en større samtale.',
    },
    followup: {
      name: 'Follow-up',
      desc: 'En eksisterende tråd, der fortsætter. For folk jeg allerede har talt med.',
    },
    systems: {
      name: 'Growth & AI Systems',
      desc: 'Den rigtige strategisamtale. GTM, AI og revenue-systemer, med udgangspunkt i dit problem.',
    },
  },
};

const no: MeetStrings = {
  title: 'Bestill en samtale',
  description:
    'Bestill en samtale med Wojciech Łuszczyński. Velg format, dag og tid. Growth-, AI- og GTM-systemer for SaaS og revenue-fokuserte team.',
  eyebrow: 'Bestill en samtale',
  h1: 'Bestill en samtale med Wojciech.',
  lead: 'Growth-, AI- og GTM-systemer for SaaS og revenue-fokuserte team. Velg formatet som passer, så en tid. Ingen pitch-deck, ingen intro-slides.',
  step1: 'Velg format',
  step2: 'Velg dag & tid',
  step3: 'Dine opplysninger',
  tzLabel: 'Tider',
  tzLocal: 'Lokal tid',
  selectDay: 'Velg en dag',
  name: 'Navn',
  email: 'E-post',
  company: 'Selskap',
  optional: '(valgfritt)',
  notesQ: 'Hva skal vi snakke om?',
  namePh: 'Ola Nordmann',
  emailPh: 'ola@selskap.no',
  companyPh: 'Selskap',
  notesPh: 'En linje eller to om systemet eller problemet.',
  confirm: 'Bekreft booking',
  booking: 'Booker…',
  trust: 'Du får en kalenderinvitasjon og en bekreftelses-e-post.',
  summaryEmpty: 'Velg et format og en tid, så vises oppsummeringen din her.',
  summaryPickTime: 'Velg nå et tidspunkt.',
  successTitle: 'Du er booket.',
  loading: 'Laster…',
  loadingAvail: 'Laster ledige tider…',
  loadError: 'Kunne ikke laste ledige tider. Last siden på nytt.',
  genericError: 'Noe gikk galt. Prøv igjen.',
  types: {
    intro: {
      name: 'Intro / Fit Call',
      desc: 'En kort intro. Om det er et match, eller rask kontekst før en større samtale.',
    },
    followup: {
      name: 'Follow-up',
      desc: 'En pågående tråd. For folk jeg allerede har snakket med.',
    },
    systems: {
      name: 'Growth & AI Systems',
      desc: 'Den ekte strategisamtalen. GTM, AI og revenue-systemer, med utgangspunkt i problemet ditt.',
    },
  },
};

const jp: MeetStrings = {
  title: '相談を予約',
  description:
    'Wojciech Łuszczyńskiとの相談を予約。形式・日・時間を選ぶだけ。SaaSとrevenue重視のチーム向けのGrowth・AI・GTMシステム。',
  eyebrow: '相談を予約',
  h1: 'Wojciechとの相談を予約。',
  lead: 'SaaSとrevenue重視のチーム向けのGrowth・AI・GTMシステム。合う形式を選び、次に時間枠を。ピッチデックも導入スライドもありません。',
  step1: '形式を選ぶ',
  step2: '日時を選ぶ',
  step3: 'あなたの情報',
  tzLabel: '時間帯',
  tzLocal: '現地時間',
  selectDay: '日付を選択',
  name: '名前',
  email: 'メールアドレス',
  company: '会社',
  optional: '(任意)',
  notesQ: '何について話したいですか?',
  namePh: '山田 太郎',
  emailPh: 'taro@company.jp',
  companyPh: '会社',
  notesPh: 'システムや課題について一言二言。',
  confirm: '予約を確定',
  booking: '予約中…',
  trust: 'カレンダー招待と確認メールが届きます。',
  summaryEmpty: '形式と時間枠を選ぶと、ここに予約内容が表示されます。',
  summaryPickTime: '次に時間枠を選んでください。',
  successTitle: '予約が完了しました。',
  loading: '読み込み中…',
  loadingAvail: '空き状況を読み込み中…',
  loadError: '空き状況を読み込めませんでした。ページを更新してください。',
  genericError: '問題が発生しました。もう一度お試しください。',
  types: {
    intro: {
      name: 'Intro / Fit Call',
      desc: '短いイントロ。相性の確認、または本格的な相談の前の素早いすり合わせ。',
    },
    followup: {
      name: 'Follow-up',
      desc: '進行中の話の続き。すでに話したことのある方向け。',
    },
    systems: {
      name: 'Growth & AI Systems',
      desc: '本題の戦略の会話。あなたの課題を起点に、GTM・AI・revenueシステムを。',
    },
  },
};

const it: MeetStrings = {
  title: 'Prenota una chiamata',
  description:
    'Prenota una chiamata con Wojciech Łuszczyński. Scegli formato, giorno e orario. Sistemi Growth, AI e GTM per SaaS e team orientati al ricavo.',
  eyebrow: 'Prenota una chiamata',
  h1: 'Prenota una chiamata con Wojciech.',
  lead: 'Sistemi Growth, AI e GTM per SaaS e team orientati al ricavo. Scegli il formato adatto, poi un orario. Niente pitch deck, niente slide introduttive.',
  step1: 'Scegli il formato',
  step2: 'Scegli giorno e ora',
  step3: 'I tuoi dati',
  tzLabel: 'Orari',
  tzLocal: 'Ora locale',
  selectDay: 'Seleziona un giorno',
  name: 'Nome',
  email: 'Email',
  company: 'Azienda',
  optional: '(facoltativo)',
  notesQ: 'Di cosa vuoi parlare?',
  namePh: 'Mario Rossi',
  emailPh: 'mario@azienda.it',
  companyPh: 'Azienda',
  notesPh: 'Una o due righe sul sistema o sul problema.',
  confirm: 'Conferma prenotazione',
  booking: 'Prenotazione…',
  trust: 'Ricevi un invito al calendario e un\'email di conferma.',
  summaryEmpty: 'Scegli un formato e un orario per vedere qui il riepilogo.',
  summaryPickTime: 'Ora scegli un orario.',
  successTitle: 'Prenotazione confermata.',
  loading: 'Caricamento…',
  loadingAvail: 'Caricamento disponibilità…',
  loadError: 'Impossibile caricare la disponibilità. Ricarica la pagina.',
  genericError: 'Qualcosa è andato storto. Riprova.',
  types: {
    intro: {
      name: 'Intro / Fit Call',
      desc: 'Una breve introduzione. Se ha senso lavorare insieme, o contesto veloce prima di un confronto più ampio.',
    },
    followup: {
      name: 'Follow-up',
      desc: 'Un filo già avviato che continua. Per chi ho già sentito.',
    },
    systems: {
      name: 'Growth & AI Systems',
      desc: 'La vera conversazione strategica. GTM, AI e sistemi di ricavo, a partire dal tuo problema.',
    },
  },
};

const es: MeetStrings = {
  title: 'Reserva una llamada',
  description:
    'Reserva una llamada con Wojciech Łuszczyński. Elige formato, día y hora. Sistemas Growth, AI y GTM para SaaS y equipos orientados a los ingresos.',
  eyebrow: 'Reserva una llamada',
  h1: 'Reserva una llamada con Wojciech.',
  lead: 'Sistemas Growth, AI y GTM para SaaS y equipos orientados a los ingresos. Elige el formato que encaje y luego una hora. Sin pitch deck, sin diapositivas de intro.',
  step1: 'Elige el formato',
  step2: 'Elige día y hora',
  step3: 'Tus datos',
  tzLabel: 'Horas',
  tzLocal: 'Hora local',
  selectDay: 'Selecciona un día',
  name: 'Nombre',
  email: 'Email',
  company: 'Empresa',
  optional: '(opcional)',
  notesQ: '¿De qué quieres hablar?',
  namePh: 'Ana García',
  emailPh: 'ana@empresa.es',
  companyPh: 'Empresa',
  notesPh: 'Una o dos líneas sobre el sistema o el problema.',
  confirm: 'Confirmar reserva',
  booking: 'Reservando…',
  trust: 'Recibes una invitación de calendario y un email de confirmación.',
  summaryEmpty: 'Elige un formato y una hora para ver aquí tu resumen.',
  summaryPickTime: 'Ahora elige una hora.',
  successTitle: 'Reserva confirmada.',
  loading: 'Cargando…',
  loadingAvail: 'Cargando disponibilidad…',
  loadError: 'No se pudo cargar la disponibilidad. Recarga la página.',
  genericError: 'Algo salió mal. Inténtalo de nuevo.',
  types: {
    intro: {
      name: 'Intro / Fit Call',
      desc: 'Una breve introducción. Ver si encaja, o contexto rápido antes de una conversación mayor.',
    },
    followup: {
      name: 'Follow-up',
      desc: 'Un hilo ya abierto que continúa. Para quien ya he hablado antes.',
    },
    systems: {
      name: 'Growth & AI Systems',
      desc: 'La conversación de estrategia de verdad. GTM, AI y sistemas de ingresos, partiendo de tu problema.',
    },
  },
};

const pl: MeetStrings = {
  title: 'Umów rozmowę',
  description:
    'Umów rozmowę z Wojciechem Łuszczyńskim. Wybierz format, dzień i godzinę. Systemy Growth, AI i GTM dla SaaS i zespołów nastawionych na przychód.',
  eyebrow: 'Umów rozmowę',
  h1: 'Umów rozmowę z Wojciechem.',
  lead: 'Systemy Growth, AI i GTM dla SaaS i zespołów nastawionych na przychód. Wybierz format, który pasuje, potem termin. Bez pitch decka, bez slajdów wprowadzających.',
  step1: 'Wybierz format',
  step2: 'Wybierz dzień i godzinę',
  step3: 'Twoje dane',
  tzLabel: 'Godziny',
  tzLocal: 'Czas lokalny',
  selectDay: 'Wybierz dzień',
  name: 'Imię',
  email: 'Email',
  company: 'Firma',
  optional: '(opcjonalnie)',
  notesQ: 'O czym chcesz porozmawiać?',
  namePh: 'Jan Kowalski',
  emailPh: 'jan@firma.pl',
  companyPh: 'Firma',
  notesPh: 'Linijka lub dwie o systemie albo problemie.',
  confirm: 'Potwierdź rezerwację',
  booking: 'Rezerwuję…',
  trust: 'Dostaniesz zaproszenie do kalendarza i mail z potwierdzeniem.',
  summaryEmpty: 'Wybierz format i termin, a tutaj pojawi się podsumowanie rezerwacji.',
  summaryPickTime: 'Teraz wybierz godzinę.',
  successTitle: 'Zarezerwowane.',
  loading: 'Ładowanie…',
  loadingAvail: 'Ładuję dostępność…',
  loadError: 'Nie udało się załadować dostępności. Odśwież stronę.',
  genericError: 'Coś poszło nie tak. Spróbuj ponownie.',
  types: {
    intro: {
      name: 'Intro / Fit Call',
      desc: 'Krótkie intro. Sprawdzenie dopasowania albo szybki kontekst przed większą rozmową.',
    },
    followup: {
      name: 'Follow-up',
      desc: 'Kontynuacja rozpoczętego wątku. Dla osób, z którymi już rozmawiałem.',
    },
    systems: {
      name: 'Growth & AI Systems',
      desc: 'Właściwa rozmowa strategiczna. GTM, AI i systemy przychodowe, wychodząc od twojego problemu.',
    },
  },
};

export const meetCopy: Record<SiteLocale, MeetStrings> = { en, de, dk, no, jp, it, es, pl };

/** Every locale gets a /meet page: en at /meet, the rest at /<locale>/meet. */
export const MEET_LOCALES = ALL_LOCALES;

export function getMeetCopy(locale: SiteLocale): MeetStrings {
  return meetCopy[locale] ?? meetCopy.en;
}

/** Absolute URL for a locale's scheduler page (en at /meet, rest at /<locale>/meet). */
function meetUrl(locale: SiteLocale): string {
  return locale === 'en' ? `${SITE.url}/meet/` : `${SITE.url}/${locale}/meet/`;
}

/**
 * Page-level JSON-LD for the scheduler: a ContactPage whose mainEntity is
 * Wojciech with a ReserveAction pointing back at the booking page. Gives answer
 * engines and LLMs an explicit "this is where you reserve time with this person"
 * signal on top of the global Person/WebSite schema.
 */
export function meetSchema(locale: SiteLocale): Record<string, unknown> {
  const s = getMeetCopy(locale);
  const url = meetUrl(locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: s.title,
    description: s.description,
    url,
    inLanguage: locale === 'jp' ? 'ja' : locale,
    isPartOf: { '@type': 'WebSite', name: 'wojciech.io', url: `${SITE.url}/` },
    mainEntity: {
      '@type': 'Person',
      name: 'Wojciech Łuszczyński',
      url: `${SITE.url}/`,
      potentialAction: {
        '@type': 'ReserveAction',
        name: s.title,
        target: url,
        result: { '@type': 'Reservation', name: 'Intro or strategy call' },
      },
    },
  };
}

/** Reciprocal hreflang cluster for the scheduler, mirroring homeAlternates. */
export const meetAlternates = [
  { lang: 'x-default', href: `${SITE.url}/meet/` },
  { lang: 'en', href: `${SITE.url}/meet/` },
  ...Object.values(localizedHome).map((locale) => ({
    lang: locale.hreflang,
    href: `${SITE.url}/${locale.path}/meet/`,
  })),
];
