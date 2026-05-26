import { localizedHome, localizedHomeList, type LocaleKey } from './locales';

export type LocalizedPageSlug = 'about' | 'work' | 'ai-systems' | 'contact' | 'insights';

export interface LocalizedPageCopy {
  locale: LocaleKey;
  slug: LocalizedPageSlug;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lead: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  stats: Array<{ value: string; label: string }>;
  sections: Array<{ title: string; body: string; items?: string[] }>;
}

export const localizedPageSlugs: LocalizedPageSlug[] = [
  'about',
  'work',
  'ai-systems',
  'contact',
  'insights',
];

const pageCopy: Record<LocaleKey, Record<LocalizedPageSlug, Omit<LocalizedPageCopy, 'locale' | 'slug'>>> = {
  de: {
    about: {
      title: 'Über Wojciech · AI-native GTM Operator',
      description: 'Profil von Wojciech Łuszczyński: GTM Architect, Growth Operator und Builder von AI-native Revenue-Systemen für B2B SaaS.',
      eyebrow: 'Profil',
      h1: 'GTM-Architektur, Growth-Execution und AI-Systeme in einer Person.',
      lead: 'Ich arbeite dort, wo Strategie, Daten, Tools und Umsetzung zusammenkommen. Mein Fokus: B2B SaaS Teams, die ein echtes Produkt haben, aber ein stabileres Revenue-System brauchen.',
      primaryCta: 'Arbeit ansehen',
      primaryHref: '/de/work/',
      secondaryCta: 'Call buchen',
      secondaryHref: '/de/contact/',
      stats: [
        { value: '20', label: 'Jahre Marketing & Digital' },
        { value: '10', label: 'Jahre B2B SaaS' },
        { value: '10', label: 'Jahre GTM' },
      ],
      sections: [
        { title: 'Wie ich arbeite', body: 'Ich diagnostiziere zuerst das System: ICP, Pipeline, CRM, Attribution, Content, Paid Acquisition und Automatisierung. Danach baue ich die fehlenden Teile in der Reihenfolge, die am schnellsten operative Klarheit bringt.' },
        { title: 'Was ich liefere', body: 'Keine isolierten Taktiken. Ich liefere ein Operating Model: Prozesse, Dashboards, Sequenzen, Automatisierung, AI Workflows und klare Verantwortlichkeiten.' },
        { title: 'Für wen', body: 'B2B SaaS, Technologieunternehmen und Gründerteams, die schneller bauen wollen, ohne ihr GTM in Tool-Chaos zu verwandeln.' },
      ],
    },
    work: {
      title: 'GTM Systeme & Case Studies',
      description: 'Ausgewählte Systeme: AI-native GTM, CRM, Automatisierung, Content, Paid Acquisition und interne Tools.',
      eyebrow: 'Arbeit',
      h1: 'Ausgewählte Revenue-Systeme, Produkte und Operating Models.',
      lead: 'Die Beispiele zeigen das Muster: klares Problem, messbare Architektur, schnelle Umsetzung, langfristig nutzbare Infrastruktur.',
      primaryCta: 'AI Systeme ansehen',
      primaryHref: '/de/ai-systems/',
      secondaryCta: 'Call buchen',
      secondaryHref: '/de/contact/',
      stats: [
        { value: 'B2B', label: 'SaaS & Technologie' },
        { value: 'AI', label: 'Workflows und Agents' },
        { value: 'CRM', label: 'Revenue Operations' },
      ],
      sections: [
        { title: 'Revenue Architecture', body: 'Pipeline, CRM, Attribution und GTM Motion werden als ein System betrachtet. Ziel ist ein wiederholbarer operating rhythm, nicht ein weiteres Dashboard.' },
        { title: 'AI-native Execution', body: 'Claude Code, MCP, Automatisierung und interne Apps werden dort eingesetzt, wo sie echte Hebel bringen: Research, CRM Hygiene, Content Ops, Sales Enablement und Reporting.' },
        { title: 'Products as proof', body: 'Die Produkte im Ökosystem zeigen, wie schnell operator-led Systeme gebaut, getestet und ausgeliefert werden können.' },
      ],
    },
    'ai-systems': {
      title: 'AI Systeme · Workflows, Agents & Leverage',
      description: 'AI-native Workflows, GTM Agents und Automatisierung für Marketing, Sales und Operations.',
      eyebrow: 'AI Systeme',
      h1: 'AI ist kein Add-on. Es ist eine neue Betriebsschicht.',
      lead: 'Ich baue AI Workflows dort, wo sie im System verankert sind: Daten, Kontext, Regeln, QA und klare Übergabe an Menschen.',
      primaryCta: 'Insights lesen',
      primaryHref: '/de/insights/',
      secondaryCta: 'System besprechen',
      secondaryHref: '/de/contact/',
      stats: [
        { value: 'Agents', label: 'Research und GTM' },
        { value: 'MCP', label: 'Tool Orchestration' },
        { value: 'QA', label: 'Human-in-the-loop' },
      ],
      sections: [
        { title: 'Context first', body: 'Gute AI Systeme starten nicht mit Prompts. Sie starten mit sauberen Daten, klaren Rollen, Constraints und messbarer Qualität.' },
        { title: 'Operator workflows', body: 'Die besten Workflows sind klein genug, um verlässlich zu laufen, und groß genug, um echte Arbeit aus dem System zu nehmen.' },
        { title: 'Build when needed', body: 'Wenn SaaS Tools nicht passen, baue ich interne Tools oder Agents, die direkt an CRM, Content Ops und Analytics anschließen.' },
      ],
    },
    contact: {
      title: 'Call buchen · GTM & AI Systeme',
      description: '30-Minuten-Call für GTM Audits, AI Workflow Design, CRM Architektur und Produkt-Scoping.',
      eyebrow: 'Kontakt',
      h1: 'Wenn das System klemmt, sprechen wir konkret.',
      lead: 'Schick Kontext, Stack und Engpass. Im Call klären wir, ob ein Audit, ein Build Sprint oder ein klarer Fix der richtige nächste Schritt ist.',
      primaryCta: '30 Minuten buchen',
      primaryHref: '/contact/#book-call',
      secondaryCta: 'LinkedIn öffnen',
      secondaryHref: 'https://www.linkedin.com/in/wojciech-luszczynski/',
      stats: [
        { value: '30m', label: 'Erster Call' },
        { value: '24h', label: 'Antwortzeit' },
        { value: 'EU', label: 'Remote-first' },
      ],
      sections: [
        { title: 'Gute Themen', body: 'GTM Audit, CRM Operating Model, AI Workflow Design, Content Operations, Paid Acquisition, Pipeline Diagnose und interne Tools.' },
        { title: 'Was ich vorher brauche', body: 'Kurz: was ihr verkauft, an wen, wo Pipeline bricht, welche Tools laufen und welche Entscheidung ansteht.' },
        { title: 'Was nicht passt', body: 'Lose Ideation ohne Owner, reine Tool-Implementierung ohne GTM Kontext oder Projekte, bei denen Datenschutz und Zugriff nicht sauber geregelt sind.' },
      ],
    },
    insights: {
      title: 'AI & GTM Insights · Operator Notes',
      description: 'Praxisnotizen zu AI Systemen, GTM Architektur und Revenue-Systemen.',
      eyebrow: 'Insights',
      h1: 'Operator Notes zu AI, GTM und Revenue Architecture.',
      lead: 'Die Beiträge zeigen Architektur, Entscheidungen und Lessons aus Systemen, die tatsächlich gebaut und betrieben werden.',
      primaryCta: 'Alle Artikel ansehen',
      primaryHref: '/insights/',
      secondaryCta: 'Call buchen',
      secondaryHref: '/de/contact/',
      stats: [
        { value: 'MDX', label: 'Komponenten' },
        { value: 'AI', label: 'Production stack' },
        { value: 'GTM', label: 'Operator notes' },
      ],
      sections: [
        { title: 'Was du findest', body: 'Build-vs-buy Entscheidungen, CRM-first AI Adoption, Claude Code in GTM Work und reale Production-Stack Entscheidungen.' },
        { title: 'Wie die Texte geschrieben sind', body: 'Keine Thought Leadership Verpackung. Jede Notiz erklärt ein System, eine Entscheidung oder eine operative Lektion.' },
        { title: 'Für wen', body: 'Founder, GTM Leads, RevOps Teams und Operatoren, die AI nicht als Demo, sondern als Arbeitsinfrastruktur einsetzen wollen.' },
      ],
    },
  },
  dk: {
    about: {
      title: 'Om Wojciech · AI-native GTM operator',
      description: 'Profil af Wojciech Łuszczyński: GTM architect, growth operator og builder af AI-native revenue-systemer for B2B SaaS.',
      eyebrow: 'Profil',
      h1: 'GTM-arkitektur, growth execution og AI-systemer i samme operatør.',
      lead: 'Jeg arbejder dér, hvor strategi, data, tools og execution mødes. Fokus er B2B SaaS teams med et rigtigt produkt, men uden et stabilt revenue-system.',
      primaryCta: 'Se arbejdet',
      primaryHref: '/dk/work/',
      secondaryCta: 'Book et call',
      secondaryHref: '/dk/contact/',
      stats: [
        { value: '20', label: 'år marketing & digital' },
        { value: '10', label: 'år B2B SaaS' },
        { value: '10', label: 'år GTM' },
      ],
      sections: [
        { title: 'Sådan arbejder jeg', body: 'Først diagnosticerer jeg systemet: ICP, pipeline, CRM, attribution, content, paid acquisition og automation. Derefter bygger jeg de manglende dele i den rækkefølge, der giver hurtigst operationel klarhed.' },
        { title: 'Hvad jeg leverer', body: 'Ikke isolerede taktikker. Jeg leverer et operating model: processer, dashboards, sequences, automation, AI workflows og klare ownership-regler.' },
        { title: 'For hvem', body: 'B2B SaaS, tech companies og founder-teams, der vil bygge hurtigere uden at gøre GTM til tool-kaos.' },
      ],
    },
    work: {
      title: 'GTM systemer & cases',
      description: 'Udvalgte systemer: AI-native GTM, CRM, automation, content, paid acquisition og interne tools.',
      eyebrow: 'Arbejde',
      h1: 'Udvalgte revenue-systemer, produkter og operating models.',
      lead: 'Eksemplerne følger samme mønster: klart problem, målbar arkitektur, hurtig execution og infrastruktur, der kan bruges længe.',
      primaryCta: 'Se AI systemer',
      primaryHref: '/dk/ai-systems/',
      secondaryCta: 'Book et call',
      secondaryHref: '/dk/contact/',
      stats: [
        { value: 'B2B', label: 'SaaS & tech' },
        { value: 'AI', label: 'Workflows og agents' },
        { value: 'CRM', label: 'Revenue operations' },
      ],
      sections: [
        { title: 'Revenue architecture', body: 'Pipeline, CRM, attribution og GTM motion behandles som ét system. Målet er en gentagelig operating rhythm, ikke endnu et dashboard.' },
        { title: 'AI-native execution', body: 'Claude Code, MCP, automation og interne apps bruges dér, hvor de skaber reel leverage: research, CRM hygiene, content ops, sales enablement og reporting.' },
        { title: 'Products as proof', body: 'Produkterne i økosystemet viser, hvor hurtigt operator-led systemer kan bygges, testes og shippe.' },
      ],
    },
    'ai-systems': {
      title: 'AI systemer · Workflows, agents & leverage',
      description: 'AI-native workflows, GTM agents og automation for marketing, sales og operations.',
      eyebrow: 'AI systemer',
      h1: 'AI er ikke et add-on. Det er et nyt operationelt lag.',
      lead: 'Jeg bygger AI workflows, hvor de er forankret i systemet: data, kontekst, regler, QA og tydelig overlevering til mennesker.',
      primaryCta: 'Læs insights',
      primaryHref: '/dk/insights/',
      secondaryCta: 'Drøft systemet',
      secondaryHref: '/dk/contact/',
      stats: [
        { value: 'Agents', label: 'Research og GTM' },
        { value: 'MCP', label: 'Tool orchestration' },
        { value: 'QA', label: 'Human-in-the-loop' },
      ],
      sections: [
        { title: 'Context first', body: 'Gode AI-systemer starter ikke med prompts. De starter med rene data, klare roller, constraints og målbar kvalitet.' },
        { title: 'Operator workflows', body: 'De bedste workflows er små nok til at køre stabilt og store nok til at fjerne rigtigt arbejde fra systemet.' },
        { title: 'Build when needed', body: 'Når SaaS tools ikke passer, bygger jeg interne tools eller agents, der kobler direkte til CRM, content ops og analytics.' },
      ],
    },
    contact: {
      title: 'Book et call · GTM & AI systemer',
      description: '30-minutters call om GTM audits, AI workflow design, CRM architecture og produkt scoping.',
      eyebrow: 'Kontakt',
      h1: 'Når systemet sidder fast, taler vi konkret.',
      lead: 'Send kontekst, stack og flaskehals. På call’et afklarer vi, om næste skridt er audit, build sprint eller et konkret fix.',
      primaryCta: 'Book 30 minutter',
      primaryHref: '/contact/#book-call',
      secondaryCta: 'Åbn LinkedIn',
      secondaryHref: 'https://www.linkedin.com/in/wojciech-luszczynski/',
      stats: [
        { value: '30m', label: 'Første call' },
        { value: '24h', label: 'Svarvindue' },
        { value: 'EU', label: 'Remote-first' },
      ],
      sections: [
        { title: 'Gode emner', body: 'GTM audit, CRM operating model, AI workflow design, content operations, paid acquisition, pipeline diagnose og interne tools.' },
        { title: 'Hvad jeg skal bruge', body: 'Kort: hvad I sælger, til hvem, hvor pipeline knækker, hvilke tools der kører, og hvilken beslutning der skal træffes.' },
        { title: 'Hvad passer ikke', body: 'Løs ideation uden owner, ren tool-implementering uden GTM kontekst eller projekter uden klare data- og adgangsregler.' },
      ],
    },
    insights: {
      title: 'AI & GTM insights · Operator notes',
      description: 'Praktiske noter om AI systemer, GTM architecture og revenue-systemer.',
      eyebrow: 'Insights',
      h1: 'Operator notes om AI, GTM og revenue architecture.',
      lead: 'Artiklerne viser arkitektur, beslutninger og lessons fra systemer, der faktisk er bygget og kørt.',
      primaryCta: 'Se alle artikler',
      primaryHref: '/insights/',
      secondaryCta: 'Book et call',
      secondaryHref: '/dk/contact/',
      stats: [
        { value: 'MDX', label: 'Komponenter' },
        { value: 'AI', label: 'Production stack' },
        { value: 'GTM', label: 'Operator notes' },
      ],
      sections: [
        { title: 'Hvad du finder', body: 'Build-vs-buy beslutninger, CRM-first AI adoption, Claude Code i GTM work og praktiske production-stack valg.' },
        { title: 'Hvordan teksterne er skrevet', body: 'Ingen thought-leadership emballage. Hver note forklarer et system, en beslutning eller en operationel lesson.' },
        { title: 'For hvem', body: 'Founders, GTM leads, RevOps teams og operators, der vil bruge AI som arbejdsinfrastruktur, ikke kun demo.' },
      ],
    },
  },
  no: {
    about: {
      title: 'Om Wojciech · AI-native GTM-operatør',
      description: 'Profil av Wojciech Łuszczyński: GTM-arkitekt, growth-operatør og builder av AI-native revenue-systemer for B2B SaaS.',
      eyebrow: 'Profil',
      h1: 'GTM-arkitektur, growth execution og AI-systemer i samme operatør.',
      lead: 'Jeg jobber der strategi, data, verktøy og execution møtes. Fokus er B2B SaaS-team med et ekte produkt, men uten et stabilt revenue-system.',
      primaryCta: 'Se arbeidet',
      primaryHref: '/no/work/',
      secondaryCta: 'Book en samtale',
      secondaryHref: '/no/contact/',
      stats: [
        { value: '20', label: 'år marketing & digital' },
        { value: '10', label: 'år B2B SaaS' },
        { value: '10', label: 'år GTM' },
      ],
      sections: [
        { title: 'Slik jobber jeg', body: 'Først diagnostiserer jeg systemet: ICP, pipeline, CRM, attribution, content, paid acquisition og automasjon. Deretter bygger jeg delene som mangler i rekkefølgen som gir raskest operativ klarhet.' },
        { title: 'Hva jeg leverer', body: 'Ikke isolerte taktikker. Jeg leverer et operating model: prosesser, dashboards, sequences, automasjon, AI workflows og tydelig eierskap.' },
        { title: 'For hvem', body: 'B2B SaaS, teknologiselskaper og founder-team som vil bygge raskere uten å gjøre GTM til verktøykaos.' },
      ],
    },
    work: {
      title: 'GTM-systemer & case studies',
      description: 'Utvalgte systemer: AI-native GTM, CRM, automasjon, content, paid acquisition og interne verktøy.',
      eyebrow: 'Arbeid',
      h1: 'Utvalgte revenue-systemer, produkter og operating models.',
      lead: 'Eksemplene følger samme mønster: klart problem, målbar arkitektur, rask execution og infrastruktur som varer.',
      primaryCta: 'Se AI-systemer',
      primaryHref: '/no/ai-systems/',
      secondaryCta: 'Book en samtale',
      secondaryHref: '/no/contact/',
      stats: [
        { value: 'B2B', label: 'SaaS & teknologi' },
        { value: 'AI', label: 'Workflows og agents' },
        { value: 'CRM', label: 'Revenue operations' },
      ],
      sections: [
        { title: 'Revenue architecture', body: 'Pipeline, CRM, attribution og GTM motion behandles som ett system. Målet er en repeterbar operating rhythm, ikke enda et dashboard.' },
        { title: 'AI-native execution', body: 'Claude Code, MCP, automasjon og interne apper brukes der de gir reell leverage: research, CRM hygiene, content ops, sales enablement og reporting.' },
        { title: 'Products as proof', body: 'Produktene i økosystemet viser hvor raskt operator-led systemer kan bygges, testes og lanseres.' },
      ],
    },
    'ai-systems': {
      title: 'AI-systemer · Workflows, agents & leverage',
      description: 'AI-native workflows, GTM agents og automasjon for marketing, sales og operations.',
      eyebrow: 'AI-systemer',
      h1: 'AI er ikke et tillegg. Det er et nytt operativt lag.',
      lead: 'Jeg bygger AI workflows der de er forankret i systemet: data, kontekst, regler, QA og tydelig overlevering til mennesker.',
      primaryCta: 'Les insights',
      primaryHref: '/no/insights/',
      secondaryCta: 'Diskuter systemet',
      secondaryHref: '/no/contact/',
      stats: [
        { value: 'Agents', label: 'Research og GTM' },
        { value: 'MCP', label: 'Tool orchestration' },
        { value: 'QA', label: 'Human-in-the-loop' },
      ],
      sections: [
        { title: 'Context first', body: 'Gode AI-systemer starter ikke med prompts. De starter med rene data, klare roller, constraints og målbar kvalitet.' },
        { title: 'Operator workflows', body: 'De beste workflowene er små nok til å kjøre stabilt og store nok til å fjerne ekte arbeid fra systemet.' },
        { title: 'Build when needed', body: 'Når SaaS-verktøy ikke passer, bygger jeg interne verktøy eller agents som kobler direkte til CRM, content ops og analytics.' },
      ],
    },
    contact: {
      title: 'Book en samtale · GTM & AI-systemer',
      description: '30-minutters samtale for GTM audits, AI workflow design, CRM architecture og produkt scoping.',
      eyebrow: 'Kontakt',
      h1: 'Når systemet sitter fast, snakker vi konkret.',
      lead: 'Send kontekst, stack og flaskehals. I samtalen avklarer vi om neste steg er audit, build sprint eller et konkret fix.',
      primaryCta: 'Book 30 minutter',
      primaryHref: '/contact/#book-call',
      secondaryCta: 'Åpne LinkedIn',
      secondaryHref: 'https://www.linkedin.com/in/wojciech-luszczynski/',
      stats: [
        { value: '30m', label: 'Første samtale' },
        { value: '24h', label: 'Svarvindu' },
        { value: 'EU', label: 'Remote-first' },
      ],
      sections: [
        { title: 'Gode temaer', body: 'GTM audit, CRM operating model, AI workflow design, content operations, paid acquisition, pipeline diagnose og interne verktøy.' },
        { title: 'Hva jeg trenger', body: 'Kort: hva dere selger, til hvem, hvor pipeline bryter, hvilke verktøy som kjører og hvilken beslutning som skal tas.' },
        { title: 'Hva passer ikke', body: 'Løs ideation uten owner, ren tool-implementering uten GTM-kontekst eller prosjekter uten klare regler for data og tilgang.' },
      ],
    },
    insights: {
      title: 'AI & GTM insights · Operator notes',
      description: 'Praktiske notater om AI-systemer, GTM-arkitektur og revenue-systemer.',
      eyebrow: 'Insights',
      h1: 'Operator notes om AI, GTM og revenue architecture.',
      lead: 'Artiklene viser arkitektur, beslutninger og lessons fra systemer som faktisk er bygget og kjørt.',
      primaryCta: 'Se alle artikler',
      primaryHref: '/insights/',
      secondaryCta: 'Book en samtale',
      secondaryHref: '/no/contact/',
      stats: [
        { value: 'MDX', label: 'Komponenter' },
        { value: 'AI', label: 'Production stack' },
        { value: 'GTM', label: 'Operator notes' },
      ],
      sections: [
        { title: 'Hva du finner', body: 'Build-vs-buy beslutninger, CRM-first AI adoption, Claude Code i GTM work og praktiske production-stack valg.' },
        { title: 'Hvordan tekstene er skrevet', body: 'Ingen thought-leadership innpakning. Hver note forklarer et system, en beslutning eller en operativ lesson.' },
        { title: 'For hvem', body: 'Founders, GTM leads, RevOps-team og operators som vil bruke AI som arbeidsinfrastruktur, ikke bare demo.' },
      ],
    },
  },
  jp: {
    about: {
      title: 'Wojciechについて · AI-native GTM Operator',
      description: 'Wojciech Łuszczyńskiのプロフィール。B2B SaaS向けにAI-native revenue systemを構築するGTM architect / growth operator。',
      eyebrow: 'プロフィール',
      h1: 'GTM設計、growth execution、AI systemを一つの運用モデルとして扱います。',
      lead: '戦略、データ、ツール、実装が交差する場所で働きます。対象は、良いプロダクトはあるが、まだ安定したrevenue systemを持っていないB2B SaaSチームです。',
      primaryCta: '実績を見る',
      primaryHref: '/jp/work/',
      secondaryCta: '相談を予約',
      secondaryHref: '/jp/contact/',
      stats: [
        { value: '20', label: 'marketing & digital経験' },
        { value: '10', label: 'B2B SaaS経験' },
        { value: '10', label: 'GTM経験' },
      ],
      sections: [
        { title: '進め方', body: '最初にsystemを診断します。ICP、pipeline、CRM、attribution、content、paid acquisition、automationを見て、どこから作ると最も早く運用が安定するかを決めます。' },
        { title: '提供するもの', body: '単発の施策ではなく、operating modelを作ります。Process、dashboard、sequence、automation、AI workflow、owner設計まで含めます。' },
        { title: '対象', body: 'B2B SaaS、technology company、founder team。速く作りたいが、GTMをtool chaosにしたくないチーム向けです。' },
      ],
    },
    work: {
      title: 'GTM Systems & Case Studies',
      description: 'AI-native GTM、CRM、automation、content、paid acquisition、internal toolsの実績とシステム。',
      eyebrow: '実績',
      h1: 'Revenue system、product、operating modelの実例。',
      lead: '共通パターンは明確です。問題を絞り、測定できるarchitectureにし、速く実装し、長く使えるinfrastructureにします。',
      primaryCta: 'AI systemを見る',
      primaryHref: '/jp/ai-systems/',
      secondaryCta: '相談を予約',
      secondaryHref: '/jp/contact/',
      stats: [
        { value: 'B2B', label: 'SaaS & technology' },
        { value: 'AI', label: 'Workflow / agent' },
        { value: 'CRM', label: 'Revenue operations' },
      ],
      sections: [
        { title: 'Revenue architecture', body: 'Pipeline、CRM、attribution、GTM motionを一つのsystemとして扱います。目的はdashboardを増やすことではなく、再現できるoperating rhythmを作ることです。' },
        { title: 'AI-native execution', body: 'Claude Code、MCP、automation、internal appsは、research、CRM hygiene、content ops、sales enablement、reportingなど実務に効く場所に使います。' },
        { title: 'Products as proof', body: '公開されているプロダクトは、operator-led systemをどれだけ速く構築、検証、公開できるかの証拠です。' },
      ],
    },
    'ai-systems': {
      title: 'AI Systems · Workflows, Agents & Leverage',
      description: 'Marketing、sales、operationsのためのAI-native workflow、GTM agent、automation。',
      eyebrow: 'AI Systems',
      h1: 'AIは追加機能ではありません。新しい運用レイヤーです。',
      lead: 'AI workflowは、data、context、rules、QA、人へのhandoffまで含めてsystemに埋め込む必要があります。',
      primaryCta: 'Insightsを読む',
      primaryHref: '/jp/insights/',
      secondaryCta: 'Systemを相談',
      secondaryHref: '/jp/contact/',
      stats: [
        { value: 'Agents', label: 'Research / GTM' },
        { value: 'MCP', label: 'Tool orchestration' },
        { value: 'QA', label: 'Human-in-the-loop' },
      ],
      sections: [
        { title: 'Context first', body: '良いAI systemはpromptから始まりません。きれいなdata、明確なrole、constraint、測定できるqualityから始まります。' },
        { title: 'Operator workflows', body: '良いworkflowは、安定して動くほど小さく、実際の仕事を減らすほど十分に大きいものです。' },
        { title: 'Build when needed', body: '既存SaaSが合わない場合は、CRM、content ops、analyticsに直接接続するinternal toolやagentを作ります。' },
      ],
    },
    contact: {
      title: '相談を予約 · GTM & AI Systems',
      description: 'GTM audit、AI workflow design、CRM architecture、product scopingのための30分相談。',
      eyebrow: 'Contact',
      h1: 'Systemが詰まっているなら、具体的に話しましょう。',
      lead: 'Context、stack、bottleneckを送ってください。Audit、build sprint、または具体的なfixのどれが次に必要かを判断します。',
      primaryCta: '30分を予約',
      primaryHref: '/contact/#book-call',
      secondaryCta: 'LinkedInを見る',
      secondaryHref: 'https://www.linkedin.com/in/wojciech-luszczynski/',
      stats: [
        { value: '30m', label: '初回相談' },
        { value: '24h', label: '返信目安' },
        { value: 'EU', label: 'Remote-first' },
      ],
      sections: [
        { title: '相談に合うテーマ', body: 'GTM audit、CRM operating model、AI workflow design、content operations、paid acquisition、pipeline diagnose、internal tools。' },
        { title: '事前に必要な情報', body: '何を売っているか、誰に売っているか、pipelineがどこで止まるか、使っているtools、今決めたいこと。' },
        { title: '合わないテーマ', body: 'Ownerのない抽象的なideation、GTM contextなしの単純なtool導入、data/access governanceが曖昧なproject。' },
      ],
    },
    insights: {
      title: 'AI & GTM Insights · Operator Notes',
      description: 'AI system、GTM architecture、revenue systemに関する実務メモ。',
      eyebrow: 'Insights',
      h1: 'AI、GTM、revenue architectureのoperator notes。',
      lead: '記事では、実際に構築し運用しているsystemのarchitecture、意思決定、lessonを説明します。',
      primaryCta: 'すべての記事を見る',
      primaryHref: '/insights/',
      secondaryCta: '相談を予約',
      secondaryHref: '/jp/contact/',
      stats: [
        { value: 'MDX', label: 'Components' },
        { value: 'AI', label: 'Production stack' },
        { value: 'GTM', label: 'Operator notes' },
      ],
      sections: [
        { title: '読める内容', body: 'Build-vs-buy decision、CRM-first AI adoption、Claude Code in GTM work、production stackの実務的な選択。' },
        { title: '書き方', body: '抽象的なthought leadershipではありません。各noteはsystem、decision、operational lessonを説明します。' },
        { title: '対象読者', body: 'Founder、GTM lead、RevOps team、AIをdemoではなくwork infrastructureとして使いたいoperator。' },
      ],
    },
  },
};

export const localizedPages: LocalizedPageCopy[] = localizedHomeList.flatMap((locale) =>
  localizedPageSlugs.map((slug) => ({
    locale: locale.key,
    slug,
    ...pageCopy[locale.key][slug],
  })),
);

export function getLocalizedPage(locale: LocaleKey, slug: LocalizedPageSlug): LocalizedPageCopy {
  return {
    locale,
    slug,
    ...pageCopy[locale][slug],
  };
}

export function localizedPageAlternates(slug: LocalizedPageSlug) {
  return [
    { lang: 'x-default', href: `https://wojciech.io/${slug}/` },
    { lang: 'en', href: `https://wojciech.io/${slug}/` },
    ...localizedHomeList.map((locale) => ({
      lang: locale.hreflang,
      href: `https://wojciech.io/${locale.path}/${slug}/`,
    })),
  ];
}

export function htmlLangForLocale(locale: LocaleKey) {
  return localizedHome[locale].htmlLang;
}

export function ogLocaleForLocale(locale: LocaleKey) {
  return localizedHome[locale].ogLocale;
}
