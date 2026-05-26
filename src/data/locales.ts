export type LocaleKey = 'de' | 'dk' | 'no' | 'jp';

export interface LocalizedHomeCopy {
  key: LocaleKey;
  path: LocaleKey;
  code: string;
  label: string;
  htmlLang: string;
  hreflang: string;
  ogLocale: string;
  title: string;
  description: string;
  eyebrow: string;
  h1Primary: string;
  h1Secondary: string;
  lead: string;
  primaryCta: string;
  secondaryCta: string;
  proof: Array<{ value: string; label: string }>;
  sectionEyebrow: string;
  sectionTitlePrimary: string;
  sectionTitleSecondary: string;
  steps: Array<{ step: string; title: string; body: string }>;
  finalHeading: string;
  finalSubtext: string;
}

export const localizedHome: Record<LocaleKey, LocalizedHomeCopy> = {
  de: {
    key: 'de',
    path: 'de',
    code: 'DE',
    label: 'Deutsch',
    htmlLang: 'de-DE',
    hreflang: 'de-DE',
    ogLocale: 'de_DE',
    title: 'Wojciech Łuszczyński · AI-native GTM Operator',
    description: 'AI-native Revenue-Systeme für B2B SaaS: GTM, CRM, Automatisierung, Paid Acquisition und AI Workflows als ein Betriebsmodell.',
    eyebrow: 'GTM Architect · Growth Operator',
    h1Primary: 'Ich baue Revenue-Systeme.',
    h1Secondary: 'Dann betreibe ich sie.',
    lead: 'GTM, CRM, AI Workflows und Automatisierung als ein Betriebsmodell. Ich verbinde die fehlenden Teile, messe alles und bleibe, bis es funktioniert.',
    primaryCta: 'Arbeit ansehen',
    secondaryCta: 'Call buchen',
    proof: [
      { value: '20', label: 'Jahre Marketing & Digital' },
      { value: '10', label: 'Jahre B2B SaaS' },
      { value: '10', label: 'Jahre GTM' },
      { value: '3x', label: 'durchschn. Pipeline-Lift' },
    ],
    sectionEyebrow: 'Arbeitsweise',
    sectionTitlePrimary: 'Kein Berater.',
    sectionTitleSecondary: 'Ein Operator.',
    steps: [
      { step: '01', title: 'Diagnose', body: 'Audit der Revenue-Architektur: Pipeline, CRM, GTM Motion und Attribution. Erst wird sichtbar, wo das Signal bricht.' },
      { step: '02', title: 'Design', body: 'Systemdesign: was verbunden wird, was gemessen wird, was automatisiert wird und in welcher Reihenfolge gebaut wird.' },
      { step: '03', title: 'Implementierung', body: 'Sequenzen, Dashboards, CRM Operating Model und Tooling. Ich baue selbst oder arbeite direkt mit dem Team.' },
      { step: '04', title: 'Lücke schließen', body: 'Wenn das passende Tool fehlt, entsteht es: AI Agents, interne Apps, MCP Workflows und saubere Automatisierung.' },
    ],
    finalHeading: 'Gibt es ein System, das repariert werden sollte?',
    finalSubtext: 'Schick mir Kontext, Engpass und bestehenden Stack. Ich sage dir, wo ich anfangen würde.',
  },
  dk: {
    key: 'dk',
    path: 'dk',
    code: 'DK',
    label: 'Dansk',
    htmlLang: 'da-DK',
    hreflang: 'da-DK',
    ogLocale: 'da_DK',
    title: 'Wojciech Łuszczyński · AI-native GTM operator',
    description: 'AI-native revenue-systemer for B2B SaaS: GTM, CRM, automation, paid acquisition og AI workflows samlet i én driftsmodel.',
    eyebrow: 'GTM architect · Growth operator',
    h1Primary: 'Jeg bygger revenue-systemer.',
    h1Secondary: 'Og får dem i drift.',
    lead: 'GTM, CRM, AI workflows og automation som én samlet model. Jeg forbinder de manglende led, instrumenterer det hele og bliver, indtil det skaber momentum.',
    primaryCta: 'Se arbejdet',
    secondaryCta: 'Book et call',
    proof: [
      { value: '20', label: 'år med marketing & digital' },
      { value: '10', label: 'år med B2B SaaS' },
      { value: '10', label: 'år med GTM' },
      { value: '3x', label: 'gns. pipeline-løft' },
    ],
    sectionEyebrow: 'Sådan arbejder jeg',
    sectionTitlePrimary: 'Ikke en konsulent.',
    sectionTitleSecondary: 'En operator.',
    steps: [
      { step: '01', title: 'Diagnose', body: 'Audit af revenue-arkitekturen: pipeline, CRM, GTM motions og attribution. Først finder vi, hvor signalet knækker.' },
      { step: '02', title: 'Design', body: 'Systemdesign: hvad skal forbindes, hvad skal måles, hvad skal automatiseres, og hvad bygges først.' },
      { step: '03', title: 'Implementering', body: 'Sekvenser, dashboards, CRM operating model og tooling. Jeg bygger selv eller sammen med jeres team.' },
      { step: '04', title: 'Luk hullet', body: 'Når det rigtige værktøj ikke findes, bygger jeg det: AI agents, interne apps, MCP workflows og automation.' },
    ],
    finalHeading: 'Har du et system, der er værd at fikse?',
    finalSubtext: 'Send kontekst, flaskehals og nuværende stack. Jeg fortæller, hvor jeg ville starte.',
  },
  no: {
    key: 'no',
    path: 'no',
    code: 'NO',
    label: 'Norsk',
    htmlLang: 'nb-NO',
    hreflang: 'nb-NO',
    ogLocale: 'nb_NO',
    title: 'Wojciech Łuszczyński · AI-native GTM-operatør',
    description: 'AI-native revenue-systemer for B2B SaaS: GTM, CRM, automasjon, paid acquisition og AI workflows i én operativ modell.',
    eyebrow: 'GTM-arkitekt · Growth-operatør',
    h1Primary: 'Jeg bygger revenue-systemer.',
    h1Secondary: 'Deretter driver jeg dem.',
    lead: 'GTM, CRM, AI workflows og automasjon som én operativ modell. Jeg kobler det som mangler, måler alt og blir til systemet fungerer.',
    primaryCta: 'Se arbeidet',
    secondaryCta: 'Book en samtale',
    proof: [
      { value: '20', label: 'år med marketing & digital' },
      { value: '10', label: 'år med B2B SaaS' },
      { value: '10', label: 'år med GTM' },
      { value: '3x', label: 'snitt pipeline-løft' },
    ],
    sectionEyebrow: 'Slik jobber jeg',
    sectionTitlePrimary: 'Ikke en konsulent.',
    sectionTitleSecondary: 'En operatør.',
    steps: [
      { step: '01', title: 'Diagnose', body: 'Audit av revenue-arkitekturen: pipeline, CRM, GTM motions og attribution. Først finner vi hvor signalet bryter.' },
      { step: '02', title: 'Design', body: 'Systemdesign: hva kobles sammen, hva måles, hva automatiseres, og hvilken rekkefølge gir mest effekt.' },
      { step: '03', title: 'Implementering', body: 'Sekvenser, dashboards, CRM operating model og tooling. Jeg bygger selv eller sammen med teamet.' },
      { step: '04', title: 'Lukk gapet', body: 'Når riktig verktøy ikke finnes, bygger jeg det: AI agents, interne apper, MCP workflows og automasjon.' },
    ],
    finalHeading: 'Har du et system som bør fikses?',
    finalSubtext: 'Send kontekst, flaskehals og eksisterende stack. Jeg sier hvor jeg ville startet.',
  },
  jp: {
    key: 'jp',
    path: 'jp',
    code: 'JP',
    label: '日本語',
    htmlLang: 'ja-JP',
    hreflang: 'ja-JP',
    ogLocale: 'ja_JP',
    title: 'Wojciech Łuszczyński · AI-native GTM Operator',
    description: 'B2B SaaS向けのAI-native revenue system。GTM、CRM、自動化、paid acquisition、AI workflowを一つの運用モデルにまとめます。',
    eyebrow: 'GTM Architect · Growth Operator',
    h1Primary: 'Revenue systemを構築します。',
    h1Secondary: 'そして運用まで担います。',
    lead: 'GTM、CRM、AI workflow、自動化を一つの運用モデルへ。足りない接続を作り、計測を整え、成果が積み上がるまで伴走します。',
    primaryCta: '実績を見る',
    secondaryCta: '相談を予約',
    proof: [
      { value: '20', label: 'marketing & digital経験' },
      { value: '10', label: 'B2B SaaS経験' },
      { value: '10', label: 'GTM経験' },
      { value: '3x', label: '平均pipeline lift' },
    ],
    sectionEyebrow: '進め方',
    sectionTitlePrimary: 'コンサルではなく、',
    sectionTitleSecondary: 'オペレーターとして動きます。',
    steps: [
      { step: '01', title: '診断', body: 'Pipeline、CRM、GTM motion、attributionを監査し、どこでsignalが途切れているかを先に特定します。' },
      { step: '02', title: '設計', body: '何を接続し、何を計測し、何を自動化し、どの順番で構築するかを設計します。' },
      { step: '03', title: '実装', body: 'Sequences、dashboards、CRM operating model、toolingを構築。必要ならチームに入り一緒に作ります。' },
      { step: '04', title: 'ギャップを埋める', body: '必要なツールがなければ作ります。AI agents、internal apps、MCP workflows、自動化まで含めます。' },
    ],
    finalHeading: '直す価値のあるシステムがありますか？',
    finalSubtext: '状況、ボトルネック、既存スタックを送ってください。どこから始めるべきかを返します。',
  },
};

export const localizedHomeList = Object.values(localizedHome);

export const homeAlternates = [
  { lang: 'x-default', href: 'https://wojciech.io/' },
  { lang: 'en', href: 'https://wojciech.io/' },
  ...localizedHomeList.map((locale) => ({
    lang: locale.hreflang,
    href: `https://wojciech.io/${locale.path}/`,
  })),
];
