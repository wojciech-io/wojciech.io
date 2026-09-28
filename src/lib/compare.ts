import type { CollectionEntry } from 'astro:content';
import { insightSlug } from './insights';

type Post = CollectionEntry<'insights'>;

/**
 * The model comparisons are the only part of this site search has ever cared
 * about: in the 28 days to 28 September 2026 they took 189 of 206 clicks and
 * 19,833 of 20,619 impressions, against three clicks for every other article
 * put together. What they lacked was a home. Each one sat on the insights
 * index as one row among thirty, reachable by exactly one internal link, and
 * twenty-two of them held a search position around six and took no clicks at
 * all.
 *
 * This module backs `/compare/`, which lists the same articles once per model
 * they weigh rather than once each. A piece on Astra against Opus 5.5 is then
 * reachable from Astra and from Opus 5.5, which is both how people look for it
 * and the cheapest link equity available to a page already on page one.
 *
 * Grouping reads the `models` frontmatter, not the title. Parsing seoTitle is
 * what the index's own table does, and it is fine there because a row only
 * needs the two halves of "A vs B: angle". It cannot carry a hub: three titles
 * in this corpus name three models, and one names "Claude" without saying
 * which.
 */

export type Vendor = 'Anthropic' | 'OpenAI' | 'Google' | 'Meta' | 'xAI' | 'DeepSeek';

const VENDOR_OF: Record<string, Vendor> = {
  'Claude Opus 5.5': 'Anthropic',
  'Claude Opus 5': 'Anthropic',
  'Claude Opus 4.8': 'Anthropic',
  'Claude Sonnet 5': 'Anthropic',
  'Claude Sonnet 4.6': 'Anthropic',
  'Claude Haiku 4.5': 'Anthropic',
  'Claude Fable 5.1': 'Anthropic',
  'Claude Fable 5': 'Anthropic',
  'Claude Mythos 5.1': 'Anthropic',
  'Claude Mythos 5': 'Anthropic',
  'Claude Code': 'Anthropic',
  'GPT-6 Astra': 'OpenAI',
  'GPT-6 Sol': 'OpenAI',
  'GPT-6 Luna': 'OpenAI',
  'GPT-5.6 Sol': 'OpenAI',
  'GPT-5.6 Luna': 'OpenAI',
  'GPT-5.6 Terra': 'OpenAI',
  Codex: 'OpenAI',
  'Gemini 3.8 Flash': 'Google',
  'Muse Spark 1.3': 'Meta',
  'Grok 4.6': 'xAI',
  'DeepSeek V4.1 Flash': 'DeepSeek',
};

/**
 * Models a reader can still buy today. A superseded model keeps its group,
 * because people search for the pair they are actually running, but the group
 * is marked and sorted below the current ones rather than hidden.
 */
const CURRENT = new Set([
  'Claude Opus 5.5',
  'Claude Sonnet 5',
  'Claude Haiku 4.5',
  'Claude Fable 5.1',
  'Claude Mythos 5.1',
  'Claude Code',
  'GPT-6 Astra',
  'GPT-6 Sol',
  'GPT-6 Luna',
  'Codex',
  'Gemini 3.8 Flash',
  'Muse Spark 1.3',
  'Grok 4.6',
  'DeepSeek V4.1 Flash',
]);

export const VENDOR_ORDER: Vendor[] = ['Anthropic', 'OpenAI', 'Google', 'Meta', 'xAI', 'DeepSeek'];

export interface ModelGroup {
  model: string;
  vendor: Vendor | 'Other';
  current: boolean;
  posts: Post[];
}

export function vendorOf(model: string): Vendor | 'Other' {
  return VENDOR_OF[model] ?? 'Other';
}

export function isCurrent(model: string): boolean {
  return CURRENT.has(model);
}

/** Every post carrying a `models` list, newest first. */
export function comparisonPosts(posts: Post[]): Post[] {
  return posts
    .filter((p) => (p.data.models?.length ?? 0) > 0)
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

/**
 * One group per model, ordered so a reader scanning for a model they run finds
 * it near the top: current models first, then by how much has been written
 * about them, then alphabetically so the order does not shuffle between builds
 * when two models tie.
 */
export function modelGroups(posts: Post[]): ModelGroup[] {
  const byModel = new Map<string, Post[]>();
  for (const post of comparisonPosts(posts)) {
    for (const model of post.data.models ?? []) {
      const list = byModel.get(model);
      if (list) list.push(post);
      else byModel.set(model, [post]);
    }
  }
  return [...byModel.entries()]
    .map(([model, list]) => ({
      model,
      vendor: vendorOf(model),
      current: isCurrent(model),
      posts: list,
    }))
    .sort(
      (a, b) =>
        Number(b.current) - Number(a.current) ||
        b.posts.length - a.posts.length ||
        a.model.localeCompare(b.model)
    );
}

/** The other model in a pair, for a link label inside a model's own group. */
export function opponents(post: Post, model: string): string {
  const others = (post.data.models ?? []).filter((m) => m !== model);
  return others.length ? others.join(', ') : model;
}

export function comparePath(post: Post, locale: string): string {
  return locale === 'en'
    ? `/insights/${insightSlug(post)}/`
    : `/${locale}/insights/${insightSlug(post)}/`;
}

/**
 * Copy for the localized hubs. Model names are proper nouns and stay in
 * English in every locale, so only the scaffolding is translated; the grouping
 * itself is identical everywhere.
 */
export const compareLabels = {
  en: {
    title: 'AI model comparisons · price, score, and cost per finished task',
    description:
      'Every model comparison I have run, indexed by model. Published price, the independent Artificial Analysis score, and what a finished task actually cost.',
    eyebrow: 'Model comparisons',
    h1a: 'Which model, and what it costs',
    h1b: 'to finish the job.',
    lead: 'Every pair I have run, indexed by model. Published price, the independent score, and the number that decides it in practice: what one finished task cost, not what a million tokens list for.',
    count: (n: number, m: number) =>
      `${n} comparisons across ${m} models. Each one is rewritten when the numbers move, not left to rot.`,
    byModel: 'Pick the model you run',
    byModelLead: 'Models you can buy today. Each one lists what I have measured it against.',
    past: 'Models that have been replaced',
    pastLead:
      'Still here, because people run what they already bought. Each article says what took its place.',
    all: 'In the order I ran them',
    allLead: 'Newest first, with the verdict on one line.',
    unit: 'comparisons',
    unitOne: 'comparison',
    ctaLead: 'The systems behind these numbers are the actual work.',
    ctaBody:
      'Model choice is one decision inside a revenue system. The rest of what I build and run is in the field notes.',
    ctaLink: 'Read the field notes',
  },
  pl: {
    title: 'Porównania modeli AI · cena, wynik i koszt ukończonego zadania',
    description:
      'Wszystkie porównania modeli, które przeprowadziłem, ułożone według modelu. Cena z cennika, niezależny wynik Artificial Analysis i to, ile realnie kosztowało ukończone zadanie.',
    eyebrow: 'Porównania modeli',
    h1a: 'Który model i ile kosztuje',
    h1b: 'dowiezienie roboty.',
    lead: 'Każda para, którą przeliczyłem, ułożona według modelu. Cena z cennika, niezależny wynik i liczba, która rozstrzyga w praktyce: ile kosztowało jedno ukończone zadanie, a nie ile na cenniku stoi milion tokenów.',
    count: (n: number, m: number) =>
      `${n} porównań na ${m} modelach. Każde poprawiam, kiedy liczby się zmienią, zamiast zostawiać je na zepsucie.`,
    byModel: 'Wybierz model, na którym pracujesz',
    byModelLead: 'Modele, które można dziś kupić. Przy każdym to, z czym go zmierzyłem.',
    past: 'Modele, które zostały zastąpione',
    pastLead:
      'Zostają, bo ludzie pracują na tym, co już kupili. Każdy tekst mówi, co weszło na to miejsce.',
    all: 'W kolejności, w jakiej je robiłem',
    allLead: 'Od najnowszych, z rozstrzygnięciem w jednej linii.',
    unit: 'porównań',
    unitOne: 'porównanie',
    ctaLead: 'Systemy stojące za tymi liczbami to jest właściwa robota.',
    ctaBody:
      'Wybór modelu to jedna decyzja wewnątrz systemu przychodowego. Reszta tego, co buduję i utrzymuję, jest w notatkach operatora.',
    ctaLink: 'Przeczytaj notatki operatora',
  },
  de: {
    title: 'KI-Modellvergleiche · Preis, Score und Kosten pro erledigter Aufgabe',
    description:
      'Alle Modellvergleiche, die ich gerechnet habe, nach Modell sortiert. Listenpreis, der unabhängige Artificial-Analysis-Score und was eine erledigte Aufgabe tatsächlich gekostet hat.',
    eyebrow: 'Modellvergleiche',
    h1a: 'Welches Modell, und was es kostet,',
    h1b: 'die Arbeit fertigzustellen.',
    lead: 'Jedes Paar, das ich gerechnet habe, nach Modell sortiert. Listenpreis, unabhängiger Score und die Zahl, die in der Praxis entscheidet: was eine fertige Aufgabe gekostet hat, nicht was eine Million Tokens auf der Preisliste kostet.',
    count: (n: number, m: number) =>
      `${n} Vergleiche über ${m} Modelle. Jeder wird überarbeitet, wenn sich die Zahlen bewegen.`,
    byModel: 'Wähle das Modell, das du einsetzt',
    byModelLead: 'Modelle, die heute erhältlich sind. Bei jedem steht, wogegen ich es gemessen habe.',
    past: 'Modelle, die ersetzt wurden',
    pastLead:
      'Sie bleiben, weil Teams das betreiben, was sie schon gekauft haben. Jeder Artikel nennt den Nachfolger.',
    all: 'In der Reihenfolge, in der ich sie gerechnet habe',
    allLead: 'Neueste zuerst, mit dem Fazit in einer Zeile.',
    unit: 'Vergleiche',
    unitOne: 'Vergleich',
    ctaLead: 'Die Systeme hinter diesen Zahlen sind die eigentliche Arbeit.',
    ctaBody:
      'Die Modellwahl ist eine Entscheidung innerhalb eines Revenue-Systems. Der Rest steht in den Feldnotizen.',
    ctaLink: 'Feldnotizen lesen',
  },
  es: {
    title: 'Comparativas de modelos de IA · precio, puntuación y coste por tarea terminada',
    description:
      'Todas las comparativas de modelos que he hecho, ordenadas por modelo. Precio de lista, la puntuación independiente de Artificial Analysis y lo que costó de verdad una tarea terminada.',
    eyebrow: 'Comparativas de modelos',
    h1a: 'Qué modelo, y cuánto cuesta',
    h1b: 'terminar el trabajo.',
    lead: 'Cada par que he medido, ordenado por modelo. Precio de lista, puntuación independiente y el número que decide en la práctica: lo que costó una tarea terminada, no lo que cuesta un millón de tokens.',
    count: (n: number, m: number) =>
      `${n} comparativas sobre ${m} modelos. Cada una se reescribe cuando los números se mueven.`,
    byModel: 'Elige el modelo que usas',
    byModelLead: 'Modelos que se pueden comprar hoy. En cada uno, contra qué lo he medido.',
    past: 'Modelos que han sido reemplazados',
    pastLead:
      'Siguen aquí porque la gente trabaja con lo que ya compró. Cada artículo dice qué ocupó su lugar.',
    all: 'En el orden en que las hice',
    allLead: 'Las más recientes primero, con el veredicto en una línea.',
    unit: 'comparativas',
    unitOne: 'comparativa',
    ctaLead: 'Los sistemas detrás de estos números son el trabajo de verdad.',
    ctaBody:
      'Elegir modelo es una decisión dentro de un sistema de ingresos. El resto está en las notas de campo.',
    ctaLink: 'Leer las notas de campo',
  },
  it: {
    title: 'Confronti tra modelli AI · prezzo, punteggio e costo per attività completata',
    description:
      'Tutti i confronti tra modelli che ho fatto, ordinati per modello. Prezzo di listino, il punteggio indipendente di Artificial Analysis e quanto è costata davvero un attività completata.',
    eyebrow: 'Confronti tra modelli',
    h1a: 'Quale modello, e quanto costa',
    h1b: 'portare a termine il lavoro.',
    lead: 'Ogni coppia che ho misurato, ordinata per modello. Prezzo di listino, punteggio indipendente e il numero che decide nella pratica: quanto è costata un attività completata, non quanto costa un milione di token.',
    count: (n: number, m: number) =>
      `${n} confronti su ${m} modelli. Ognuno viene riscritto quando i numeri cambiano.`,
    byModel: 'Scegli il modello che usi',
    byModelLead: 'Modelli acquistabili oggi. Per ognuno, contro cosa l ho misurato.',
    past: 'Modelli che sono stati sostituiti',
    pastLead:
      'Restano qui perché si lavora con quello che si è già comprato. Ogni articolo dice cosa ha preso il suo posto.',
    all: 'Nell ordine in cui li ho fatti',
    allLead: 'Dai più recenti, con il verdetto in una riga.',
    unit: 'confronti',
    unitOne: 'confronto',
    ctaLead: 'I sistemi dietro questi numeri sono il lavoro vero.',
    ctaBody:
      'Scegliere il modello è una decisione dentro un sistema di ricavi. Il resto è nelle note operative.',
    ctaLink: 'Leggi le note operative',
  },
} as const;

export interface GroupEntry {
  post: Post;
  label: string;
  /** Set only when the same opponent appears twice in one group. */
  note?: string;
}

/**
 * Two articles can weigh the same pair at different times. Inside a model's
 * list they then render as the same line twice, with nothing to choose
 * between them: Fable 5.1 shipped with "vs GPT-6 Astra" listed twice, once for
 * the launch-week piece and once for the index rerun. A date is added only to
 * the labels that actually collide, so the common case stays clean.
 */
export function groupEntries(group: ModelGroup, formatDate: (d: Date) => string): GroupEntry[] {
  const seen = new Map<string, number>();
  for (const post of group.posts) {
    const label = opponents(post, group.model);
    seen.set(label, (seen.get(label) ?? 0) + 1);
  }
  return group.posts.map((post) => {
    const label = opponents(post, group.model);
    return (seen.get(label) ?? 0) > 1
      ? { post, label, note: formatDate(post.data.publishedAt) }
      : { post, label };
  });
}
