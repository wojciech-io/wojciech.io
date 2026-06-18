import type { LocaleKey, SiteLocale } from './locale-codes';

export type { LocaleKey } from './locale-codes';

export interface SectionStrings {
  work: { eyebrow: string; title: string; titleSecondary: string; allLink: string; ctaEyebrow: string; ctaHeading: string; ctaBody: string; ctaLink: string };
  ai: { eyebrow: string; title: string; titleSecondary: string; link: string; stackLabel: string; body: string; allSystemsLink: string; rows: Array<{ label: string; before: string; after: string }>; roles: string[]; stackStatus: string; bridgeStatus: string; activeLabel: string };
  writing: { eyebrow: string; title: string; allLink: string; readLink: string; ctaBody: string };
  testimonials: { eyebrow: string; title: string; titleSecondary: string };
}

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
  sections: SectionStrings;
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
    eyebrow: 'AI-native Revenue Operator',
    h1Primary: 'Ich baue Revenue-Systeme.',
    h1Secondary: 'Dann betreibe ich sie.',
    lead: 'Zwanzig Jahre in GTM, Marketing und Growth. Ich verbinde sie zu einem AI-native Operating Model, baue, was fehlt, und bleibe, bis es läuft.',
    primaryCta: 'Arbeit ansehen',
    secondaryCta: 'Termin vereinbaren',
    proof: [
      { value: '20', label: 'Jahre Marketing & Digital' },
      { value: '10', label: 'Jahre B2B SaaS' },
      { value: '10', label: 'Jahre GTM' },
      { value: '3×', label: 'durchschnittlicher Pipeline-Lift' },
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
    sections: {
      work: { eyebrow: 'Ausgewählte Projekte', title: 'Projekte, die live gingen.', titleSecondary: 'Systeme, die noch laufen.', allLink: 'Alle Projekte →', ctaEyebrow: 'Zusammenarbeiten', ctaHeading: 'Ein Revenue-Problem, das sich lohnt?', ctaBody: '30 Minuten. Wir finden den Engpass und ob sich die Zusammenarbeit lohnt.', ctaLink: 'Termin vereinbaren →' },
      ai: { eyebrow: 'AI-Systeme', title: 'AI in der Architektur.', titleSecondary: 'Nicht nachträglich angeschraubt.', link: 'Wie ich mit AI baue →', stackLabel: 'Tech Stack', body: 'Nicht für schnellere Texte. Für ein anderes Betriebsmodell. AI steckt in Prospecting, Anreicherung, Sequenzen und Scoring. Die ganze Maschine läuft schneller. Nicht nur eine Aufgabe auf der Liste.', allSystemsLink: 'Alle AI-Systeme →', rows: [ { label: 'Anzeigenerstellung', before: 'Tage', after: 'Minuten' }, { label: 'CRM-Anreicherung', before: 'Manuell / BDR-Zeit', after: 'Automatisiert' }, { label: 'SEO-Brief → Entwurf', before: 'Woche', after: 'Stunden' }, { label: 'Outbound-Sequenzen', before: 'Templates', after: 'AI-personalisiert' } ], roles: ['Agent-Kern', 'Tool-Bridge', 'CRM + Sequenzen', 'Paid Acquisition', 'Edge + Workers', 'Site-Layer'], stackStatus: 'Operator-Stack · immer aktiv', bridgeStatus: 'MCP-Bridge · live', activeLabel: 'aktiv' },
      writing: { eyebrow: 'Texte', title: 'Operator-Notizen.', allLink: 'Alle Artikel →', readLink: 'Lesen →', ctaBody: 'Neue Artikel zu AI-Systemen, GTM-Architektur und Growth-Modellen.' },
      testimonials: { eyebrow: 'Referenzen', title: 'Wie es ist,', titleSecondary: 'mit mir zu arbeiten.' },
    },
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
    eyebrow: 'AI-native revenue operator',
    h1Primary: 'Jeg bygger revenue-systemer.',
    h1Secondary: 'Så kører jeg dem.',
    lead: 'Tyve år på tværs af GTM, marketing og growth. Jeg samler dem i én AI-native operating model, bygger det, der mangler, og bliver, til det virker.',
    primaryCta: 'Se arbejdet',
    secondaryCta: 'Book et opkald',
    proof: [
      { value: '20', label: 'år marketing & digital' },
      { value: '10', label: 'år B2B SaaS' },
      { value: '10', label: 'år GTM' },
      { value: '3×', label: 'gns. pipeline-løft' },
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
    sections: {
      work: { eyebrow: 'Udvalgt arbejde', title: 'Projekter, der gik live.', titleSecondary: 'Systemer, der stadig kører.', allLink: 'Alt arbejde →', ctaEyebrow: 'Samarbejde', ctaHeading: 'Et revenue-problem, der er værd at løse?', ctaBody: '30 minutter. Vi finder flaskehalsen og om det giver mening at arbejde sammen.', ctaLink: 'Book et opkald →' },
      ai: { eyebrow: 'AI-systemer', title: 'AI i arkitekturen.', titleSecondary: 'Ikke boltet på bagefter.', link: 'Hvordan jeg bygger med AI →', stackLabel: 'Tech stack', body: 'Ikke for hurtigere tekster. For en anden driftsmodel. AI indgår i prospecting, berigelse, sekvenser og scoring. Hele maskinen kører hurtigere. Ikke bare én opgave på listen.', allSystemsLink: 'Alle AI-systemer →', rows: [ { label: 'Annonceproduktion', before: 'Dage', after: 'Minutter' }, { label: 'CRM-berigelse', before: 'Manuelt / BDR-tid', after: 'Automatiseret' }, { label: 'SEO-brief → udkast', before: 'Uge', after: 'Timer' }, { label: 'Outbound-sekvenser', before: 'Skabeloner', after: 'AI-personaliseret' } ], roles: ['agentkerne', 'værktøjsbro', 'CRM + sekvenser', 'betalt acquisition', 'edge + workers', 'sitelag'], stackStatus: 'operatorstack · altid aktiv', bridgeStatus: 'MCP-bro · live', activeLabel: 'aktiv' },
      writing: { eyebrow: 'Skriveri', title: 'Operator-noter.', allLink: 'Alle artikler →', readLink: 'Læs →', ctaBody: 'Nye artikler om AI-systemer, GTM-arkitektur og growth-modeller.' },
      testimonials: { eyebrow: 'Anbefalinger', title: 'Hvordan det er', titleSecondary: 'at arbejde med mig.' },
    },
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
    eyebrow: 'AI-native revenue operator',
    h1Primary: 'Jeg bygger revenue-systemer.',
    h1Secondary: 'Så kjører jeg dem.',
    lead: 'Tjue år på tvers av GTM, marketing og growth. Jeg samler dem i én AI-native operating model, bygger det som mangler, og blir til det fungerer.',
    primaryCta: 'Se arbeidet',
    secondaryCta: 'Bestill en samtale',
    proof: [
      { value: '20', label: 'år markedsføring & digital' },
      { value: '10', label: 'år B2B SaaS' },
      { value: '10', label: 'år GTM' },
      { value: '3×', label: 'gjennomsnittlig pipeline-løft' },
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
    sections: {
      work: { eyebrow: 'Utvalgt arbeid', title: 'Prosjekter som ble levert.', titleSecondary: 'Systemer som fortsatt kjører.', allLink: 'Alt arbeid →', ctaEyebrow: 'Samarbeid', ctaHeading: 'Et revenue-problem verdt å løse?', ctaBody: '30 minutter. Vi finner flaskehalsen og om det er verdt å jobbe sammen.', ctaLink: 'Bestill en samtale →' },
      ai: { eyebrow: 'AI-systemer', title: 'AI i arkitekturen.', titleSecondary: 'Ikke boltet på i etterkant.', link: 'Hvordan jeg bygger med AI →', stackLabel: 'Tech stack', body: 'Ikke for raskere tekster. For en annen driftsmodell. AI inngår i prospecting, berikelse, sekvenser og scoring. Hele maskinen går raskere. Ikke bare én oppgave på listen.', allSystemsLink: 'Alle AI-systemer →', rows: [ { label: 'Annonseproduksjon', before: 'Dager', after: 'Minutter' }, { label: 'CRM-berikelse', before: 'Manuelt / BDR-tid', after: 'Automatisert' }, { label: 'SEO-brief → utkast', before: 'Uke', after: 'Timer' }, { label: 'Outbound-sekvenser', before: 'Maler', after: 'AI-personalisert' } ], roles: ['agentkjerne', 'verktøybro', 'CRM + sekvenser', 'betalt akkvisisjon', 'edge + workers', 'sitelag'], stackStatus: 'operatorstack · alltid aktiv', bridgeStatus: 'MCP-bro · live', activeLabel: 'aktiv' },
      writing: { eyebrow: 'Skriving', title: 'Operator-notater.', allLink: 'Alle artikler →', readLink: 'Les →', ctaBody: 'Nye artikler om AI-systemer, GTM-arkitektur og growth-modeller.' },
      testimonials: { eyebrow: 'Anbefalinger', title: 'Hvordan det er', titleSecondary: 'å jobbe med meg.' },
    },
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
    eyebrow: 'AI-native revenue operator',
    h1Primary: 'Revenue systemを構築します。',
    h1Secondary: 'そして、運用まで担います。',
    lead: '20年にわたるGTM・マーケティング・グロース。ひとつのAI-nativeオペレーティングモデルにまとめ、足りない部分をつくり、回るまで伴走します。',
    primaryCta: '実績を見る',
    secondaryCta: '相談を予約',
    proof: [
      { value: '20', label: '年 マーケティング＆デジタル' },
      { value: '10', label: '年 B2B SaaS' },
      { value: '10', label: '年 GTM' },
      { value: '3×', label: '平均パイプライン成長' },
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
    sections: {
      work: { eyebrow: '実績', title: '納品したプロジェクト。', titleSecondary: '今も動いているシステム。', allLink: '全ての実績 →', ctaEyebrow: '一緒に働く', ctaHeading: '解決する価値のある課題がありますか？', ctaBody: '30分の通話。ボトルネックを見つけ、協業する価値があるか判断します。', ctaLink: '相談を予約 →' },
      ai: { eyebrow: 'AIシステム', title: 'アーキテクチャに組み込むAI。', titleSecondary: '後付けではなく。', link: 'AIでの構築方法 →', stackLabel: 'テックスタック', body: '速く書くためではありません。違う運用モデルのためです。AIはプロスペクティング、データ補強、シーケンス、スコアリングに組み込まれます。動き全体が速くなります。リスト上の一つのタスクだけではありません。', allSystemsLink: 'すべてのAIシステム →', rows: [ { label: '広告制作', before: '数日', after: '数分' }, { label: 'CRMエンリッチメント', before: '手作業 / BDRの時間', after: '自動化' }, { label: 'SEOブリーフ → 下書き', before: '1週間', after: '数時間' }, { label: 'アウトバウンド・シーケンス', before: 'テンプレート', after: 'AIパーソナライズ' } ], roles: ['エージェントの中核', 'ツールブリッジ', 'CRM + シーケンス', '有料獲得', 'エッジ + ワーカー', 'サイト層'], stackStatus: 'オペレーター・スタック · 常時稼働', bridgeStatus: 'MCPブリッジ · ライブ', activeLabel: '稼働中' },
      writing: { eyebrow: '記事', title: 'オペレーターノート。', allLink: '全ての記事 →', readLink: '読む →', ctaBody: 'AIシステム、GTMアーキテクチャ、グロースモデルに関する新しい記事。' },
      testimonials: { eyebrow: '推薦の声', title: '一緒に働くと', titleSecondary: 'どうなるか。' },
    },
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
    eyebrow: 'Revenue operator AI-native',
    h1Primary: 'Costruisco sistemi di ricavo.',
    h1Secondary: 'Poi li gestisco.',
    lead: 'Vent\'anni tra GTM, marketing e growth. Li unisco in un unico operating model AI-native, costruisco ciò che manca e resto finché non funziona.',
    primaryCta: 'Guarda il lavoro',
    secondaryCta: 'Prenota una chiamata',
    proof: [
      { value: '20', label: 'anni marketing & digitale' },
      { value: '10', label: 'anni B2B SaaS' },
      { value: '10', label: 'anni GTM' },
      { value: '3×', label: 'crescita media del pipeline' },
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
    sections: {
      work: { eyebrow: 'Lavori selezionati', title: 'Progetti consegnati.', titleSecondary: 'Sistemi ancora in funzione.', allLink: 'Tutti i lavori →', ctaEyebrow: 'Collaborare', ctaHeading: 'Un problema di ricavo che vale la pena risolvere?', ctaBody: '30 minuti. Troviamo il collo di bottiglia e se vale la pena collaborare.', ctaLink: 'Prenota una chiamata →' },
      ai: { eyebrow: 'Sistemi AI', title: 'AI nell\'architettura.', titleSecondary: 'Non aggiunta a posteriori.', link: 'Come costruisco con l\'AI →', stackLabel: 'Tech stack', body: 'Non per testi più veloci. Per un modello operativo diverso. L\'AI entra in prospecting, arricchimento, sequenze e scoring. Tutta la macchina gira più veloce. Non una sola attività della lista.', allSystemsLink: 'Tutti i sistemi AI →', rows: [ { label: 'Creazione annunci', before: 'Giorni', after: 'Minuti' }, { label: 'Arricchimento CRM', before: 'Manuale / tempo BDR', after: 'Automatizzato' }, { label: 'Brief SEO → bozza', before: 'Settimana', after: 'Ore' }, { label: 'Sequenze outbound', before: 'Template', after: 'Personalizzate con AI' } ], roles: ['core agente', 'tool bridge', 'CRM + sequenze', 'acquisizione a pagamento', 'edge + worker', 'layer del sito'], stackStatus: 'stack operatore · sempre attivo', bridgeStatus: 'MCP bridge · live', activeLabel: 'attivo' },
      writing: { eyebrow: 'Articoli', title: 'Note operative.', allLink: 'Tutti gli articoli →', readLink: 'Leggi →', ctaBody: 'Nuovi articoli su sistemi AI, architettura GTM e modelli di crescita.' },
      testimonials: { eyebrow: 'Testimonianze', title: 'Com\'e\'', titleSecondary: 'lavorare con me.' },
    },
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
    eyebrow: 'Operador de revenue AI-native',
    h1Primary: 'Construyo sistemas de ingresos.',
    h1Secondary: 'Luego los ejecuto.',
    lead: 'Veinte años entre GTM, marketing y growth. Los integro en un único operating model AI-native, construyo lo que falta y me quedo hasta que funciona.',
    primaryCta: 'Ver el trabajo',
    secondaryCta: 'Reserva una llamada',
    proof: [
      { value: '20', label: 'años marketing & digital' },
      { value: '10', label: 'años B2B SaaS' },
      { value: '10', label: 'años GTM' },
      { value: '3×', label: 'mejora media del pipeline' },
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
    sections: {
      work: { eyebrow: 'Trabajo seleccionado', title: 'Proyectos entregados.', titleSecondary: 'Sistemas que siguen funcionando.', allLink: 'Todo el trabajo →', ctaEyebrow: 'Colaborar', ctaHeading: '¿Un problema de ingresos que vale la pena resolver?', ctaBody: '30 minutos. Encontramos el cuello de botella y si merece la pena trabajar juntos.', ctaLink: 'Reserva una llamada →' },
      ai: { eyebrow: 'Sistemas AI', title: 'AI en la arquitectura.', titleSecondary: 'No añadida al final.', link: 'Cómo construyo con AI →', stackLabel: 'Tech stack', body: 'No para textos más rápidos. Para un modelo operativo distinto. La AI entra en prospección, enriquecimiento, secuencias y scoring. Toda la maquinaria va más rápido. No una sola tarea de la lista.', allSystemsLink: 'Todos los sistemas AI →', rows: [ { label: 'Creación de anuncios', before: 'Días', after: 'Minutos' }, { label: 'Enriquecimiento CRM', before: 'Manual / tiempo BDR', after: 'Automatizado' }, { label: 'Brief SEO → borrador', before: 'Semana', after: 'Horas' }, { label: 'Secuencias outbound', before: 'Plantillas', after: 'Personalizadas con AI' } ], roles: ['núcleo del agente', 'puente de herramientas', 'CRM + secuencias', 'adquisición de pago', 'edge + workers', 'capa del sitio'], stackStatus: 'stack del operador · siempre activo', bridgeStatus: 'puente MCP · live', activeLabel: 'activo' },
      writing: { eyebrow: 'Escritos', title: 'Notas de operador.', allLink: 'Todos los artículos →', readLink: 'Leer →', ctaBody: 'Nuevos artículos sobre sistemas AI, arquitectura GTM y modelos de crecimiento.' },
      testimonials: { eyebrow: 'Testimonios', title: 'Cómo es', titleSecondary: 'trabajar conmigo.' },
    },
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
    eyebrow: 'Operator revenue AI-native',
    h1Primary: 'Buduję systemy przychodowe.',
    h1Secondary: 'Potem nimi operuję.',
    lead: 'Dwadzieścia lat w GTM, marketingu i growth. Spinam je w jeden model operacyjny AI-native, buduję to, czego brakuje, i zostaję, aż zacznie działać.',
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
        value: '3×',
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
    finalSubtext: 'Prześlij kontekst, wąskie gardło i obecny stack. Powiem, od czego bym zaczął.',
    sections: {
      work: { eyebrow: 'Wybrane projekty', title: 'Projekty, które poszły na produkcję.', titleSecondary: 'Systemy, które wciąż działają.', allLink: 'Wszystkie projekty →', ctaEyebrow: 'Współpraca', ctaHeading: 'Problem z przychodami wart rozwiązania?', ctaBody: '30 minut. Znajdziemy wąskie gardło i ustalimy, czy warto działać razem.', ctaLink: 'Umów rozmowę →' },
      ai: { eyebrow: 'Systemy AI', title: 'AI w architekturze.', titleSecondary: 'Nie doklejone na końcu.', link: 'Jak buduję z AI →', stackLabel: 'Stos technologiczny', body: 'Nie chodzi o szybsze teksty. Chodzi o inny model operacyjny. AI wchodzi w prospecting, wzbogacanie danych, sekwencje i scoring. Cała maszyna działa szybciej. Nie jedno zadanie z listy.', allSystemsLink: 'Wszystkie systemy AI →', rows: [ { label: 'Tworzenie reklam', before: 'Dni', after: 'Minuty' }, { label: 'Wzbogacanie CRM', before: 'Ręcznie / czas BDR', after: 'Automatycznie' }, { label: 'Brief SEO → szkic', before: 'Tydzień', after: 'Godziny' }, { label: 'Sekwencje outbound', before: 'Szablony', after: 'Personalizacja AI' } ], roles: ['rdzeń agenta', 'most narzędziowy', 'CRM + sekwencje', 'płatne pozyskiwanie', 'edge + workery', 'warstwa strony'], stackStatus: 'stack operatora · zawsze aktywny', bridgeStatus: 'most MCP · live', activeLabel: 'aktywny' },
      writing: { eyebrow: 'Artykuły', title: 'Notatki operatora.', allLink: 'Wszystkie artykuły →', readLink: 'Czytaj →', ctaBody: 'Nowe artykuły o systemach AI, architekturze GTM i modelach wzrostu.' },
      testimonials: { eyebrow: 'Rekomendacje', title: 'Jak to jest', titleSecondary: 'ze mną pracować.' },
    },
  },
};

export const localizedHomeList = Object.values(localizedHome);

// UI chrome for the projects section (proof labels + CTAs + the "Featured"
// eyebrow). Localized for all eight locales so the scaffolding always matches
// the page language; the project prose itself stays English (EN+PL deep-content
// policy), exactly like the insights preview.
export interface ProjectChrome {
  problem: string;
  system: string;
  artifact: string;
  outcome: string;
  featured: string;
  viewProject: string;
  explore: string;
  caseStudy: string;
}

export const projectChrome: Record<SiteLocale, ProjectChrome> = {
  en: { problem: 'Problem', system: 'System', artifact: 'Artifact', outcome: 'Outcome', featured: 'Featured', viewProject: 'View project', explore: 'Explore', caseStudy: 'See case study' },
  de: { problem: 'Problem', system: 'System', artifact: 'Artefakt', outcome: 'Ergebnis', featured: 'Ausgewählt', viewProject: 'Projekt ansehen', explore: 'Ansehen', caseStudy: 'Fallstudie ansehen' },
  dk: { problem: 'Problem', system: 'System', artifact: 'Artefakt', outcome: 'Resultat', featured: 'Udvalgt', viewProject: 'Se projekt', explore: 'Udforsk', caseStudy: 'Se case' },
  no: { problem: 'Problem', system: 'System', artifact: 'Artefakt', outcome: 'Resultat', featured: 'Utvalgt', viewProject: 'Se prosjekt', explore: 'Utforsk', caseStudy: 'Se case' },
  jp: { problem: '課題', system: 'システム', artifact: '成果物', outcome: '結果', featured: '注目', viewProject: 'プロジェクトを見る', explore: '見る', caseStudy: 'ケーススタディ' },
  it: { problem: 'Problema', system: 'Sistema', artifact: 'Artefatto', outcome: 'Risultato', featured: 'In evidenza', viewProject: 'Vedi progetto', explore: 'Esplora', caseStudy: 'Vedi case study' },
  es: { problem: 'Problema', system: 'Sistema', artifact: 'Artefacto', outcome: 'Resultado', featured: 'Destacado', viewProject: 'Ver proyecto', explore: 'Explorar', caseStudy: 'Ver caso' },
  pl: { problem: 'Problem', system: 'System', artifact: 'Artefakt', outcome: 'Rezultat', featured: 'Wyróżnione', viewProject: 'Zobacz projekt', explore: 'Zobacz', caseStudy: 'Studium przypadku' },
};

// hreflang code → Open Graph locale (e.g. 'de-DE' → 'de_DE'). English is the
// site default (en_US); the rest derive from the locale registry. Used by
// SEOHead to emit og:locale:alternate for the translated versions of a page.
export const hreflangToOgLocale: Record<string, string> = {
  en: 'en_US',
  ...Object.fromEntries(localizedHomeList.map((locale) => [locale.hreflang, locale.ogLocale])),
};

export const homeAlternates = [
  { lang: 'x-default', href: 'https://wojciech.io/' },
  { lang: 'en', href: 'https://wojciech.io/' },
  ...localizedHomeList.map((locale) => ({
    lang: locale.hreflang,
    href: `https://wojciech.io/${locale.path}/`,
  })),
];
