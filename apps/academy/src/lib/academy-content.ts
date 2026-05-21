export interface Series {
  id: string;
  n: number;
  title: string;
  short: string;
  color: string;
}

export interface Episode {
  id: string;
  seriesId: string;
  number: number;
  title: string;
  duration: string;
  outcome: string;
  tool: string;
}

export const series: Series[] = [
  { id: 's1', n: 1, title: 'AI jako narzędzie operatora', short: 'model, koszt, proces', color: '#ff7a1c' },
  { id: 's2', n: 2, title: 'Outbound jako system', short: 'ICP, sygnały, sekwencje', color: '#ffb01c' },
  { id: 's3', n: 3, title: 'Content jako infrastruktura', short: 'research, dystrybucja, repurpose', color: '#f97316' },
  { id: 's4', n: 4, title: 'Operating system dla GTM', short: 'dashboardy, agenci, rytm', color: '#fb923c' },
];

const episodeTopics = [
  [
    ['Wybierz model do zadania, nie do hypeu', 'Mapa: Claude / GPT / lokalny model', 'Claude'],
    ['Koszt tokenów jako koszt operacyjny', 'Kalkulator kosztu per workflow', 'Sheets'],
    ['Prompt produkcyjny kontra prompt demo', 'Checklist promptów, które przeżyją zespół', 'Claude'],
    ['Jak budować baseline AI w firmie', 'Standard pracy dla całego teamu', 'Notion'],
    ['Bezpieczne dane i granice automatyzacji', 'Reguły: co wolno modelowi widzieć', 'Policy'],
    ['Workflow review: kto robi, kto zatwierdza', 'RACI dla AI w GTM', 'Ops'],
    ['Ewaluacja outputu bez gustologii', 'Scorecard jakości odpowiedzi', 'Scorecard'],
    ['Biblioteka promptów, która nie gnije', 'Struktura wersjonowania promptów', 'Git'],
    ['Pierwszy sprint wdrożeniowy', 'Plan 7 dni bez przebudowy stacku', 'Sprint'],
  ],
  [
    ['ICP jako filtr, nie opis persony', 'Tabela sygnałów i anty-sygnałów', 'ICP'],
    ['Sourcing firm bez list spamowych', 'Pipeline firm z triggerami', 'Clay'],
    ['Enrichment z kontrolą jakości', 'Reguły deduplikacji i confidence score', 'Clay'],
    ['Scoring leadów: fit + zachowanie', 'Model scoringowy 0-100', 'D1'],
    ['Personalizacja, która nie brzmi jak AI', 'Template + guardrails', 'Claude'],
    ['Sekwencja outbound jako eksperyment', 'Plan testów per segment', 'CRM'],
    ['Handoff do CRM', 'Mapowanie pól i stage', 'Pipedrive'],
    ['Feedback loop z odpowiedzi', 'Klasyfikacja reply intent', 'LLM'],
    ['Weekly outbound review', 'Dashboard: volume, fit, replies, SQL', 'GrowthHub'],
  ],
  [
    ['Research jako asset, nie brief', 'Baza insightów pod content', 'Perplexity'],
    ['Editorial angle bez lania wody', 'Matrix: diagnoza / kontrast / proof', 'Docs'],
    ['Draft z modelem, final z człowiekiem', 'Flow redakcyjny bez utraty tonu', 'Claude'],
    ['Jedna idea, osiem formatów', 'Repurpose na LinkedIn/email/SEO', 'Content'],
    ['SEO bez pisania pod robota', 'Topic map + intent', 'Search'],
    ['Dystrybucja jako system', 'Kalendarz sygnałów i kanałów', 'CRM'],
    ['Newsletter jako produkt', 'Segmenty i onboarding', 'Email'],
    ['Content telemetry', 'Co mierzyć po publikacji', 'Analytics'],
    ['Content weekly review', 'Co zabić, co rozwinąć, co sprzedaje', 'Ops'],
  ],
  [
    ['Dashboard jednej prawdy', 'Weekly review na jednym ekranie', 'D1'],
    ['Dane z GA4 i CRM bez BI potwora', 'Minimalny model danych', 'GA4'],
    ['Agent researchowy dla zespołu', 'MCP i dostępy bez chaosu', 'MCP'],
    ['Agent QA dla contentu i outboundu', 'Kontrola tonu, faktów i ryzyka', 'Agent'],
    ['Automatyzacje, które nie psują pipeline', 'Kolejki, retry, ręczny override', 'Workers'],
    ['Rytm adopcji w teamie', 'Meeting cadence i ownership', 'Ops'],
    ['Certyfikacja bez teatru', 'Quizy i evidence of work', 'Academy'],
    ['Executive reporting', 'Raport AI ROI dla zarządu', 'Deck'],
    ['90 dni po wdrożeniu', 'Roadmapa v2 i backlog eksperymentów', 'Roadmap'],
  ],
];

export const episodes: Episode[] = episodeTopics.flatMap((items, seriesIndex) =>
  items.map(([title, outcome, tool], index) => ({
    id: `s${seriesIndex + 1}e${String(index + 1).padStart(2, '0')}`,
    seriesId: `s${seriesIndex + 1}`,
    number: seriesIndex * 9 + index + 1,
    title,
    duration: `${18 + ((seriesIndex * 4 + index * 3) % 17)} min`,
    outcome,
    tool,
  })),
);

export const vaultItems = [
  { tag: 'Prompt pack', title: 'Outbound personalisation guardrails', meta: '12 promptów + QA checklist' },
  { tag: 'Blueprint', title: 'AI GTM operating cadence', meta: 'weekly review, owners, KPIs' },
  { tag: 'Template', title: 'ICP scoring worksheet', meta: 'fit, intent, source confidence' },
  { tag: 'Playbook', title: 'Content repurpose loop', meta: '1 idea -> 8 kanałów' },
  { tag: 'Policy', title: 'Data safety rules for GTM teams', meta: 'co wolno modelowi widzieć' },
  { tag: 'Dashboard', title: 'GrowthHub metric map', meta: 'GA4 + CRM + revenue review' },
];

export function episodeById(id: string): Episode | undefined {
  return episodes.find((episode) => episode.id === id);
}

export function seriesById(id: string): Series | undefined {
  return series.find((item) => item.id === id);
}
