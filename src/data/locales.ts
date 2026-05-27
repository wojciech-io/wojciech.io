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
    description: 'AI-native Revenue-Systeme für B2B SaaS: GTM, CRM, Automatisierung, bezahlte Akquise und AI-Workflows als ein Operating Model.',
    eyebrow: 'GTM-Architekt · Growth Operator',
    h1Primary: 'Ich baue Revenue-Systeme.',
    h1Secondary: 'Dann betreibe ich sie.',
    lead: 'GTM, CRM, AI-Workflows, Automatisierung: ein Operating Model. Ich stelle die fehlenden Verbindungen her, instrumentiere alles und bleibe so lange, bis es sich verbindet.',
    primaryCta: 'Arbeit ansehen',
    secondaryCta: 'Call buchen',
    proof: [
      { value: '20', label: 'Jahre Marketing & Digital' },
      { value: '10', label: 'Jahre B2B SaaS' },
      { value: '10', label: 'Jahre GTM' },
      { value: '3x', label: 'durchschnittlicher Pipeline-Lift' },
    ],
    sectionEyebrow: 'Wie ich arbeite',
    sectionTitlePrimary: 'Kein Berater.',
    sectionTitleSecondary: 'Ein Operator.',
    steps: [
      { step: '01', title: 'Diagnose', body: 'Audit der Revenue-Architektur: Pipeline, CRM, GTM-Motion und Attribution. Zuerst finden wir heraus, wo das Signal bricht.' },
      { step: '02', title: 'Design', body: 'Systemdesign: was wird verbunden, was wird gemessen, was wird automatisiert und was wird zuerst gebaut.' },
      { step: '03', title: 'Aufbauen', body: 'Abläufe, Dashboards, CRM-Operating Model und -Werkzeuge. Ich baue sie selbst oder arbeite direkt mit dem Team zusammen.' },
      { step: '04', title: 'Die Lücke schließen', body: 'Wenn es das richtige Werkzeug nicht gibt, baue ich es: AI-Agenten, interne Apps, MCP-Workflows und saubere Automatisierung.' },
    ],
    finalHeading: 'Gibt es ein System, das es wert ist, repariert zu werden?',
    finalSubtext: 'Schick den Kontext, den Engpass und den aktuellen Stack. Ich werde dir sagen, wo ich anfangen würde.',
  },
  dk: {
    key: 'dk',
    path: 'dk',
    code: 'DK',
    label: 'Dansk',
    htmlLang: 'da-DK',
    hreflang: 'da-DK',
    ogLocale: 'da_DK',
    title: 'Wojciech Łuszczyński · AI-native GTM Operator',
    description: 'AI-native revenue-systemer til B2B SaaS: GTM, CRM, automatisering, betalt erhvervelse og AI-arbejdsgange som én operating model.',
    eyebrow: 'GTM-arkitekt · Growth Operator',
    h1Primary: 'Jeg bygger revenue-systemer.',
    h1Secondary: 'Så kører jeg dem.',
    lead: 'GTM, CRM, AI-arbejdsgange, automatisering: én operating model. Jeg opbygger de forbindelser, der mangler, instrumenterer alt og bliver, indtil det virker.',
    primaryCta: 'Se arbejdet',
    secondaryCta: 'Book et opkald',
    proof: [
      { value: '20', label: 'år marketing & digital' },
      { value: '10', label: 'år B2B SaaS' },
      { value: '10', label: 'år GTM' },
      { value: '3x', label: 'gns. pipeline-løft' },
    ],
    sectionEyebrow: 'Hvordan jeg arbejder',
    sectionTitlePrimary: 'Ikke en konsulent.',
    sectionTitleSecondary: 'En operator.',
    steps: [
      { step: '01', title: 'Diagnose', body: 'Audit af revenue-arkitekturen: pipeline, CRM, GTM motion og attribution. Først finder vi ud af, hvor signalet går i stykker.' },
      { step: '02', title: 'Design', body: 'Systemdesign: Hvad bliver forbundet, hvad bliver målt, hvad bliver automatiseret, og hvad bliver bygget først.' },
      { step: '03', title: 'Bygge', body: 'Sekvenser, dashboards, CRM-operating model og værktøjer. Jeg bygger det selv eller arbejder direkte med teamet.' },
      { step: '04', title: 'Luk hullet', body: 'Når det rigtige værktøj ikke findes, bygger jeg det: AI-agenter, interne apps, MCP-workflows og ren automatisering.' },
    ],
    finalHeading: 'Er der et system, der er værd at reparere?',
    finalSubtext: 'Send kontekst, flaskehals og nuværende stak. Jeg vil fortælle dig, hvor jeg ville starte.',
  },
  no: {
    key: 'no',
    path: 'no',
    code: 'NO',
    label: 'Norsk',
    htmlLang: 'nb-NO',
    hreflang: 'nb-NO',
    ogLocale: 'nb_NO',
    title: 'Wojciech Łuszczyński · AI-native GTM Operator',
    description: 'AI-native revenue-systemer for B2B SaaS: GTM, CRM, automatisering, betalt anskaffelse og AI-arbeidsflyter som én operating model.',
    eyebrow: 'GTM-arkitekt · Growth Operator',
    h1Primary: 'Jeg bygger revenue-systemer.',
    h1Secondary: 'Så kjører jeg dem.',
    lead: 'GTM, CRM, AI-arbeidsflyter, automatisering: én operating model. Jeg bygger forbindelsene som mangler, instrumenterer alt og blir der til det fungerer.',
    primaryCta: 'Se arbeidet',
    secondaryCta: 'Bestill en samtale',
    proof: [
      { value: '20', label: 'år markedsføring & digital' },
      { value: '10', label: 'år B2B SaaS' },
      { value: '10', label: 'år GTM' },
      { value: '3x', label: 'gjennomsnittlig pipeline-løft' },
    ],
    sectionEyebrow: 'Hvordan jeg jobber',
    sectionTitlePrimary: 'Ikke en konsulent.',
    sectionTitleSecondary: 'En operator.',
    steps: [
      { step: '01', title: 'Diagnostiser', body: 'Audit av revenue-arkitekturen: pipeline, CRM, GTM motion og attribusjon. Først finner vi ut hvor signalet går i stykker.' },
      { step: '02', title: 'Design', body: 'Systemdesign: hva som kobles til, hva som måles, hva som automatiseres, og hva som bygges først.' },
      { step: '03', title: 'Bygge', body: 'Sekvenser, dashbord, CRM-operating model og verktøy. Jeg bygger det selv eller jobber direkte med teamet.' },
      { step: '04', title: 'Tett gapet', body: 'Når det rette verktøyet ikke finnes, bygger jeg det: AI-agenter, interne apper, MCP-arbeidsflyter og ren automatisering.' },
    ],
    finalHeading: 'Finnes det et system som er verdt å fikse?',
    finalSubtext: 'Send kontekst, flaskehals og nåværende stack. Jeg skal si deg hvor jeg ville begynt.',
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
    description: 'B2B SaaS向けAIネイティブRevenue system：GTM、CRM、オートメーション、有料獲得、AIワークフローを1つのオペレーションモデルとして提供。',
    eyebrow: 'GTMアーキテクト - グロース・オペレーター',
    h1Primary: 'Revenue systemを構築します。',
    h1Secondary: 'そして、運用まで担います。',
    lead: 'GTM、CRM、AIワークフロー、自動化：一つの業務モデル。私は、欠けているコネクションを構築し、すべてを機器化し、それが機能するまで留まる。',
    primaryCta: '実績を見る',
    secondaryCta: '相談を予約',
    proof: [
      { value: '20', label: 'マーケティング＆デジタル' },
      { value: '10', label: '年 B2B SaaS' },
      { value: '10', label: '年 GTM' },
      { value: '3x', label: '平均パイプラインリフト' },
    ],
    sectionEyebrow: '私の仕事',
    sectionTitlePrimary: 'コンサルタントではない。',
    sectionTitleSecondary: 'オペレーター。',
    steps: [
      { step: '01', title: '診断する', body: 'Revenue architectureの監査：パイプライン、CRM、GTMモーション、アトリビューション。まず、シグナルが途切れる場所を見つける。' },
      { step: '02', title: 'デザイン', body: 'システム設計：何を接続し、何を測定し、何を自動化し、何を最初に構築するか。' },
      { step: '03', title: 'ビルド', body: 'シーケンス、ダッシュボード、CRMオペレーティング・モデル、ツール。自分で構築したり、チームと直接作業したりします。' },
      { step: '04', title: 'ギャップを埋める', body: '適切なツールが存在しない場合、私はそれを構築する：AIエージェント、社内アプリ、MCPワークフロー、クリーンオートメーション。' },
    ],
    finalHeading: '修正する価値のあるシステムはあるのか？',
    finalSubtext: 'コンテキスト、ボトルネック、現在のスタックを送信します。私ならどこから始めるか。',
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
