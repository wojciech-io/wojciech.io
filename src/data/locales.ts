export type LocaleKey = 'de' | 'dk' | 'no' | 'jp' | 'it' | 'es' | 'pl';

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
  projectsEyebrow: string;
  projectsHeading1: string;
  projectsHeading2: string;
  projectsLink: string;
  aiEyebrow: string;
  aiHeading1: string;
  aiHeading2: string;
  testimonialsEyebrow: string;
  testimonialsHeading1: string;
  testimonialsHeading2: string;
  insightsEyebrow: string;
  insightsHeading: string;
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
    lead: 'GTM, CRM, AI-Workflows, Automatisierung: ein Operating Model. Ich stelle die fehlenden Verbindungen her, mache alles messbar und bleibe, bis es läuft.',
    primaryCta: 'Arbeit ansehen',
    secondaryCta: 'Termin vereinbaren',
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
    projectsEyebrow: 'Ausgewählte Arbeiten',
    projectsHeading1: 'Projekte, die live gegangen sind.',
    projectsHeading2: 'Systeme, die noch laufen.',
    projectsLink: 'Alle Arbeiten →',
    aiEyebrow: 'AI-Systeme',
    aiHeading1: 'AI in der Architektur.',
    aiHeading2: 'Nicht am Ende draufgeschraubt.',
    testimonialsEyebrow: 'Referenzen',
    testimonialsHeading1: 'Wie die Zusammenarbeit',
    testimonialsHeading2: 'mit mir ist.',
    insightsEyebrow: 'Schreiben',
    insightsHeading: 'Notizen eines Operators.',
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
    projectsEyebrow: 'Udvalgt arbejde',
    projectsHeading1: 'Projekter der shipped.',
    projectsHeading2: 'Systemer der stadig kører.',
    projectsLink: 'Alt arbejde →',
    aiEyebrow: 'AI-systemer',
    aiHeading1: 'AI i arkitekturen.',
    aiHeading2: 'Ikke boltet på til sidst.',
    testimonialsEyebrow: 'Anbefalinger',
    testimonialsHeading1: 'Hvordan det er',
    testimonialsHeading2: 'at arbejde med mig.',
    insightsEyebrow: 'Skriveri',
    insightsHeading: 'Operatørens noter.',
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
    projectsEyebrow: 'Utvalgt arbeid',
    projectsHeading1: 'Prosjekter som ble levert.',
    projectsHeading2: 'Systemer som fortsatt kjører.',
    projectsLink: 'Alt arbeid →',
    aiEyebrow: 'AI-systemer',
    aiHeading1: 'AI i arkitekturen.',
    aiHeading2: 'Ikke boltet på til slutt.',
    testimonialsEyebrow: 'Anbefalinger',
    testimonialsHeading1: 'Hvordan det er',
    testimonialsHeading2: 'å jobbe med meg.',
    insightsEyebrow: 'Skriving',
    insightsHeading: 'Operatørens notater.',
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
    description: 'B2B SaaS向けAIネイティブRevenue system：GTM、CRM、自動化、有料獲得、AIワークフローを1つのオペレーティングモデルとして提供。',
    eyebrow: 'GTMアーキテクト・グロースオペレーター',
    h1Primary: 'Revenue systemを構築します。',
    h1Secondary: 'そして、運用まで担います。',
    lead: 'GTM、CRM、AIワークフロー、自動化を、ひとつのオペレーティングモデルに。欠けている接続をつくり、すべてを計測できるようにし、うまく回るまで伴走します。',
    primaryCta: '実績を見る',
    secondaryCta: '相談を予約',
    proof: [
      { value: '20', label: '年 マーケティング＆デジタル' },
      { value: '10', label: '年 B2B SaaS' },
      { value: '10', label: '年 GTM' },
      { value: '3x', label: '平均パイプライン成長' },
    ],
    sectionEyebrow: '私の仕事',
    sectionTitlePrimary: 'コンサルタントではない。',
    sectionTitleSecondary: 'オペレーター。',
    steps: [
      { step: '01', title: '診断', body: 'Revenue architectureの監査：パイプライン、CRM、GTMモーション、アトリビューション。まず、シグナルが途切れる場所を見つけます。' },
      { step: '02', title: '設計', body: 'システム設計：何を接続し、何を測定し、何を自動化し、何から構築するか。' },
      { step: '03', title: '構築', body: 'シーケンス、ダッシュボード、CRMのオペレーティングモデル、ツール。自分で組むか、チームと直接組んで進めます。' },
      { step: '04', title: 'ギャップを埋める', body: '適切なツールがなければ、自分で作ります。AIエージェント、社内アプリ、MCPワークフロー、無駄のない自動化。' },
    ],
    finalHeading: '立て直す価値のあるシステムはありますか？',
    finalSubtext: 'コンテキスト、ボトルネック、現在のスタックを送ってください。どこから手をつけるかをお伝えします。',
    projectsEyebrow: '実績紹介',
    projectsHeading1: '出荷されたプロジェクト。',
    projectsHeading2: '今も稼働するシステム。',
    projectsLink: 'すべての実績 →',
    aiEyebrow: 'AIシステム',
    aiHeading1: 'AIをアーキテクチャの中に。',
    aiHeading2: '後付けではなく。',
    testimonialsEyebrow: '推薦の声',
    testimonialsHeading1: '私との仕事は',
    testimonialsHeading2: 'どんな感じか。',
    insightsEyebrow: 'ライティング',
    insightsHeading: 'オペレーターの記録。',
  },
  it: {
    key: 'it',
    path: 'it',
    code: 'IT',
    label: 'Italiano',
    htmlLang: 'it-IT',
    hreflang: 'it-IT',
    ogLocale: 'it_IT',
    title: 'Wojciech Łuszczyński · AI-native GTM Operator',
    description: 'Sistemi di ricavo AI-native per SaaS B2B: GTM, CRM, automazione, acquisizione a pagamento e flussi AI come un unico modello operativo.',
    eyebrow: 'Architetto GTM · Growth Operator',
    h1Primary: 'Costruisco sistemi di ricavo.',
    h1Secondary: 'Poi li gestisco.',
    lead: 'GTM, CRM, flussi di lavoro AI, automazione: un unico modello operativo. Costruisco i collegamenti mancanti, strumento tutto e rimango finché non porta risultati.',
    primaryCta: 'Guarda il lavoro',
    secondaryCta: 'Prenota una chiamata',
    proof: [
      { value: '20', label: 'anni marketing & digitale' },
      { value: '10', label: 'anni B2B SaaS' },
      { value: '10', label: 'anni GTM' },
      { value: '3x', label: 'crescita media del pipeline' },
    ],
    sectionEyebrow: 'Come lavoro',
    sectionTitlePrimary: 'Non un consulente.',
    sectionTitleSecondary: 'Un operatore.',
    steps: [
      { step: '01', title: 'Diagnosi', body: 'Verifica dell\'architettura dei ricavi: pipeline, CRM, GTM motion e attribuzione. Prima individuiamo dove si interrompe il segnale.' },
      { step: '02', title: 'Design', body: 'Progettazione del sistema: cosa collegare, cosa misurare, cosa automatizzare e da cosa iniziare.' },
      { step: '03', title: 'Costruire', body: 'Sequenze, dashboard, modello operativo CRM e strumenti. Li realizzo personalmente o lavoro direttamente con il team.' },
      { step: '04', title: 'Colmare il divario', body: 'Quando lo strumento giusto non esiste, lo creo io: agenti AI, app interne, flussi di lavoro MCP e automazione pulita.' },
    ],
    finalHeading: 'C\'è un sistema che vale la pena riparare?',
    finalSubtext: 'Inviami il contesto, il punto critico e lo stack attuale. Ti dirò da dove inizierei.',
    projectsEyebrow: 'Lavori selezionati',
    projectsHeading1: 'Progetti consegnati.',
    projectsHeading2: 'Sistemi ancora in funzione.',
    projectsLink: 'Tutti i lavori →',
    aiEyebrow: 'Sistemi AI',
    aiHeading1: 'AI nell\'architettura.',
    aiHeading2: 'Non aggiunta alla fine.',
    testimonialsEyebrow: 'Testimonianze',
    testimonialsHeading1: 'Com\'è lavorare',
    testimonialsHeading2: 'con me.',
    insightsEyebrow: 'Scrittura',
    insightsHeading: 'Note dell\'operatore.',
  },
  es: {
    key: 'es',
    path: 'es',
    code: 'ES',
    label: 'Español',
    htmlLang: 'es-ES',
    hreflang: 'es-ES',
    ogLocale: 'es_ES',
    title: 'Wojciech Łuszczyński · AI-native GTM Operator',
    description: 'Sistemas de ingresos AI-native para SaaS B2B: GTM, CRM, automatización, adquisición de pago y flujos AI como un único modelo operativo.',
    eyebrow: 'Arquitecto GTM · Growth Operator',
    h1Primary: 'Construyo sistemas de ingresos.',
    h1Secondary: 'Luego los ejecuto.',
    lead: 'GTM, CRM, flujos de trabajo de IA, automatización: un único modelo operativo. Establezco las conexiones que faltan, configuro todo y me quedo hasta que da resultados.',
    primaryCta: 'Ver el trabajo',
    secondaryCta: 'Reserva una llamada',
    proof: [
      { value: '20', label: 'años marketing & digital' },
      { value: '10', label: 'años B2B SaaS' },
      { value: '10', label: 'años GTM' },
      { value: '3x', label: 'mejora media del pipeline' },
    ],
    sectionEyebrow: 'Cómo trabajo',
    sectionTitlePrimary: 'No soy consultor.',
    sectionTitleSecondary: 'Soy operador.',
    steps: [
      { step: '01', title: 'Diagnóstico', body: 'Auditoría de la arquitectura de ingresos: pipeline, CRM, GTM motion y atribución. Primero identificamos dónde se pierde la señal.' },
      { step: '02', title: 'Diseño', body: 'Diseño del sistema: qué se conecta, qué se mide, qué se automatiza y qué se construye primero.' },
      { step: '03', title: 'Construir', body: 'Secuencias, paneles de control, modelo operativo de CRM y herramientas. Los desarrollo yo mismo o colaboro directamente con el equipo.' },
      { step: '04', title: 'Cerrar la brecha', body: 'Cuando la herramienta adecuada no existe, la creo yo: agentes de IA, apps internas, flujos de trabajo MCP y automatización limpia.' },
    ],
    finalHeading: '¿Hay un sistema que merezca la pena arreglar?',
    finalSubtext: 'Envía el contexto, el cuello de botella y el stack actual. Te diré por dónde empezaría.',
    projectsEyebrow: 'Trabajo seleccionado',
    projectsHeading1: 'Proyectos que salieron.',
    projectsHeading2: 'Sistemas que siguen funcionando.',
    projectsLink: 'Todo el trabajo →',
    aiEyebrow: 'Sistemas AI',
    aiHeading1: 'AI en la arquitectura.',
    aiHeading2: 'No pegada al final.',
    testimonialsEyebrow: 'Testimonios',
    testimonialsHeading1: 'Cómo es trabajar',
    testimonialsHeading2: 'conmigo.',
    insightsEyebrow: 'Escritura',
    insightsHeading: 'Notas del operador.',
  },
  pl: {
    key: 'pl',
    path: 'pl',
    code: 'PL',
    label: 'Polski',
    htmlLang: 'pl',
    hreflang: 'pl',
    ogLocale: 'pl_PL',
    title: 'Wojciech Łuszczyński · AI-native GTM Operator',
    description: 'AI-native systemy przychodowe dla B2B SaaS: GTM, CRM, automatyzacja, płatne pozyskiwanie i workflowy AI jako jeden model operacyjny.',
    eyebrow: 'Architekt GTM · Growth Operator',
    h1Primary: 'Buduję systemy przychodowe.',
    h1Secondary: 'Potem nimi operuję.',
    lead: 'GTM, CRM, workflowy AI, automatyzacja: jeden model operacyjny. Tworzę brakujące połączenia, instrumentuję całość i zostaję, aż wszystko zacznie działać.',
    primaryCta: 'Zobacz realizacje',
    secondaryCta: 'Umów rozmowę',
    proof: [
      {
        value: '20',
        label: 'lat w marketingu i digitalu'
      },
      {
        value: '10',
        label: 'lat w B2B SaaS'
      },
      {
        value: '10',
        label: 'lat w GTM'
      },
      {
        value: '3x',
        label: 'średni wzrost pipeline'
      }
    ],
    sectionEyebrow: 'Jak pracuję',
    sectionTitlePrimary: 'Nie doradca.',
    sectionTitleSecondary: 'Operator.',
    steps: [
      {
        step: '01',
        title: 'Diagnoza',
        body: 'Audyt architektury przychodowej: pipeline, CRM, GTM motion i atrybucja. Najpierw ustalamy, gdzie gubi się sygnał.'
      },
      {
        step: '02',
        title: 'Projekt',
        body: 'Projekt systemu: co połączyć, co mierzyć, co zautomatyzować i co zbudować najpierw.'
      },
      {
        step: '03',
        title: 'Budowa',
        body: 'Procesy, dashboardy, model operacyjny CRM i narzędzia. Buduję je sam albo razem z zespołem.'
      },
      {
        step: '04',
        title: 'Domknięcie luki',
        body: 'Jeśli odpowiedniego narzędzia nie ma, buduję je: agenty AI, wewnętrzne aplikacje, workflowy MCP i czysta automatyzacja.'
      }
    ],
    finalHeading: 'Masz system, który warto naprawić?',
    finalSubtext: 'Prześlij kontekst, wąskie gardło i obecny stack. Powiem, od czego bym zaczął.'
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
