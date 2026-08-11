import { localizedHome, localizedHomeList, type LocaleKey } from './locales';

export type CorePageSlug = 'about' | 'work' | 'ai-systems' | 'contact' | 'insights';
export type LensPageSlug = 'gtm' | 'marketing' | 'growth';
export type LocalizedPageSlug = CorePageSlug | LensPageSlug;

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
  'gtm',
  'marketing',
  'growth',
  'ai-systems',
  'contact',
  'insights',
];

const pageCopy: Record<LocaleKey, Record<CorePageSlug, Omit<LocalizedPageCopy, 'locale' | 'slug'>>> = {
  de: {
    "about": {
      title: 'Über Wojciech · AI-native GTM Operator',
      description: 'Profil von Wojciech Łuszczyński: GTM-Architekt, Growth Operator und Entwickler von AI-native Revenue-Systemen für B2B SaaS.',
      eyebrow: 'Profil',
      h1: 'GTM-Architektur, Growth Execution und AI-Systeme in einem Operator.',
      lead: 'Ich arbeite dort, wo Strategie, Daten, Tools und Umsetzung aufeinandertreffen. Mein Fokus liegt auf B2B-SaaS-Teams mit einem echten Produkt, aber ohne stabiles Revenue-System.',
      primaryCta: 'Arbeit ansehen',
      primaryHref: '/de/work/',
      secondaryCta: 'Termin vereinbaren',
      secondaryHref: '/de/contact/',
      stats: [
        { value: '20', label: 'Jahre Marketing & Digital' },
        { value: '10', label: 'Jahre B2B SaaS' },
        { value: '10', label: 'Jahre GTM' },
      ],
      sections: [
        { title: 'Wie ich arbeite', body: 'Ich diagnostiziere das System zuerst: ICP, Pipeline, CRM, Attribution, Content, bezahlte Akquise und Automatisierung. Dann baue ich die fehlenden Teile in der Reihenfolge auf, die am schnellsten operative Klarheit schafft.' },
        { title: 'Was ich liefere', body: 'Keine isolierten Taktiken. Ich liefere ein Operating Model: Prozesse, Dashboards, Abläufe, Automatisierung, AI-Workflows und klare Verantwortlichkeiten.' },
        { title: 'Für wen', body: 'B2B SaaS, Technologieunternehmen und Gründerteams, die schneller bauen wollen, ohne GTM in ein Toolchaos zu verwandeln.' },
      ],
    },
    "work": {
      title: 'GTM-Systeme & Case Studies',
      description: 'Ausgewählte Systeme: AI-native GTM, CRM, Automatisierung, Content, bezahlte Akquise und interne Tools.',
      eyebrow: 'Arbeit',
      h1: 'Ausgewählte Revenue-Systeme, Produkte und Operating Models.',
      lead: 'Die Beispiele folgen dem gleichen Muster: klares Problem, messbare Architektur, schnelle Umsetzung und eine dauerhafte Infrastruktur.',
      primaryCta: 'AI-Systeme ansehen',
      primaryHref: '/de/ai-systems/',
      secondaryCta: 'Termin vereinbaren',
      secondaryHref: '/de/contact/',
      stats: [
        { value: 'B2B', label: 'SaaS & Technologie' },
        { value: 'AI', label: 'Workflows & Agents' },
        { value: 'CRM', label: 'Revenue Operations' },
      ],
      sections: [
        { title: 'Revenue-Architektur', body: 'Pipeline, CRM, Attribution und GTM Motion werden als ein System behandelt. Das Ziel ist ein wiederholbarer Arbeitsrhythmus, nicht ein weiteres Dashboard.' },
        { title: 'AI-native Ausführung', body: 'Claude Code, MCP, Automatisierung und interne Apps werden dort eingesetzt, wo sie einen echten Nutzen bringen: Forschung, CRM-Hygiene, Content Ops, Sales Enablement und Reporting.' },
        { title: 'Produkte als Beweis', body: 'Die Produkte im Ökosystem zeigen, wie schnell operator-led Systeme gebaut, getestet und ausgeliefert werden können.' },
      ],
    },
    "ai-systems": {
      title: 'AI-Systeme · Workflows, Agents & Leverage',
      description: 'AI-native Workflows, GTM-Agenten und Automatisierung für Marketing, Vertrieb und Betrieb.',
      eyebrow: 'AI-Systeme',
      h1: 'AI ist kein Add-on. Sie ist eine neue Betriebsebene.',
      lead: 'Ich baue AI-Workflows so auf, dass sie im System verankert sind: Daten, Kontext, Regeln, Qualitätssicherung und eine klare Übergabe an Menschen.',
      primaryCta: 'Insights lesen',
      primaryHref: '/insights/',
      secondaryCta: 'System besprechen',
      secondaryHref: '/de/contact/',
      stats: [
        { value: 'Agents', label: 'Research & GTM' },
        { value: 'MCP', label: 'Tool Orchestration' },
        { value: 'QA', label: 'Human-in-the-loop' },
      ],
      sections: [
        { title: 'Kontext zuerst', body: 'Gute AI-Systeme beginnen nicht mit Prompts. Sie beginnen mit sauberen Daten, klaren Rollen, Beschränkungen und messbarer Qualität.' },
        { title: 'Operator-Workflows', body: 'Die besten Workflows sind klein genug, um zuverlässig zu laufen, und groß genug, um dem System echte Arbeit abzunehmen.' },
        { title: 'Bei Bedarf bauen', body: 'Wenn SaaS-Tools nicht passen, baue ich interne Tools oder Agenten, die direkt mit CRM, Content Ops und Analytics verbunden sind.' },
      ],
    },
    "contact": {
      title: 'Termin vereinbaren · GTM & AI Systems',
      description: '30-minütiger Anruf für GTM-Audits, AI-Workflow-Design, CRM-Architektur und Produkt-Scoping.',
      eyebrow: 'Kontakt',
      h1: 'Wenn das System feststeckt, reden wir ganz konkret.',
      lead: 'Schick Kontext, Stack und Bottleneck. Bei dem Anruf legen wir fest, ob der nächste Schritt ein Audit, ein Build Sprint oder eine konkrete Lösung ist.',
      primaryCta: '30 Minuten buchen',
      primaryHref: 'https://cal.com/wojciech-luszczynski/30min',
      secondaryCta: 'LinkedIn öffnen',
      secondaryHref: 'https://www.linkedin.com/in/wojciech-luszczynski/',
      stats: [
        { value: '30m', label: 'Erster Anruf' },
        { value: '24h', label: 'Reaktionszeit' },
        { value: 'EU', label: 'Remote-first' },
      ],
      sections: [
        { title: 'Gute Themen', body: 'GTM-Audit, CRM-Operating Model, AI-Workflow-Design, Content Operations, bezahlte Akquise, Pipeline-Diagnose und interne Tools.' },
        { title: 'Was ich im Vorfeld brauche', body: 'Kurz gesagt: was du verkaufst, an wen, wo die Pipeline bricht, welche Tools laufen und welche Entscheidung getroffen werden muss.' },
        { title: 'Was nicht passt', body: 'Lose Ideenfindung ohne Eigentümer, reine Tool-Implementierung ohne GTM-Kontext oder Projekte ohne klare Daten- und Zugriffssteuerung.' },
      ],
    },
    "insights": {
      title: 'AI & GTM Insights · Operator Notes',
      description: 'Praktische Hinweise zu AI-Systemen, GTM-Architektur und Umsatzsystemen.',
      eyebrow: 'Insights',
      h1: 'Operator Notes zu AI, GTM und Revenue-Architektur.',
      lead: 'Die Artikel zeigen die Architektur, Entscheidungen und Lektionen von Systemen, die tatsächlich gebaut und betrieben werden.',
      primaryCta: 'Alle Artikel ansehen',
      primaryHref: '/insights/',
      secondaryCta: 'Termin vereinbaren',
      secondaryHref: '/de/contact/',
      stats: [
        { value: 'MDX', label: 'Komponenten' },
        { value: 'AI', label: 'Production Stack' },
        { value: 'GTM', label: 'Operator Notes' },
      ],
      sections: [
        { title: 'Was du findest', body: 'Build- vs. Buy-Entscheidungen, die Einführung von CRM-AI, Claude Code in der GTM-Arbeit und echte Produktionsentscheidungen.' },
        { title: 'Wie die Artikel geschrieben werden', body: 'Keine Thought Leadership Verpackung. Jede Notiz erklärt ein System, eine Entscheidung oder eine betriebliche Lektion.' },
        { title: 'Für wen', body: 'Gründer, GTM-Leads, RevOps-Teams und Operators, die AI als Arbeitsinfrastruktur nutzen wollen, nicht nur als Demo.' },
      ],
    },
  },
  dk: {
    "about": {
      title: 'Om Wojciech - AI-nativ GTM-operator',
      description: 'Profil af Wojciech Łuszczyński: GTM-arkitekt, vækstoperatør og opbygger af AI-native revenue-systemer til B2B SaaS.',
      eyebrow: 'Profil',
      h1: 'GTM-arkitektur, væksteksekvering og AI-systemer i én operator.',
      lead: 'Jeg arbejder, hvor strategi, data, værktøjer og udførelse mødes. Fokus er B2B SaaS-teams med et rigtigt produkt, men uden et stabilt revenue-system.',
      primaryCta: 'Se arbejdet',
      primaryHref: '/dk/work/',
      secondaryCta: 'Book et opkald',
      secondaryHref: '/dk/contact/',
      stats: [
        { value: '20', label: 'år marketing & digital' },
        { value: '10', label: 'år B2B SaaS' },
        { value: '10', label: 'år GTM' },
      ],
      sections: [
        { title: 'Hvordan jeg arbejder', body: 'Jeg diagnosticerer systemet først: ICP, pipeline, CRM, attribution, content, paid acquisition og automation. Derefter bygger jeg de manglende dele i den rækkefølge, der hurtigst giver operationel klarhed.' },
        { title: 'Hvad jeg leverer', body: 'Ikke isolerede taktikker. Jeg leverer en operating model: processer, dashboards, sekvenser, automatisering, AI-workflows og klart ejerskab.' },
        { title: 'For hvem', body: 'B2B SaaS, teknologivirksomheder og grundlæggerteams, der ønsker at bygge hurtigere uden at gøre GTM til et værktøjskaos.' },
      ],
    },
    "work": {
      title: 'GTM-systemer og casestudier',
      description: 'Udvalgte systemer: AI-native GTM, CRM, automatisering, indhold, betalt erhvervelse og interne værktøjer.',
      eyebrow: 'Arbejde',
      h1: 'Udvalgte revenue-systemer, produkter og driftsmodeller.',
      lead: 'Eksemplerne følger det samme mønster: klart problem, målbar arkitektur, hurtig udførelse og infrastruktur, der holder.',
      primaryCta: 'Se AI-systemer',
      primaryHref: '/dk/ai-systems/',
      secondaryCta: 'Book et opkald',
      secondaryHref: '/dk/contact/',
      stats: [
        { value: 'B2B', label: 'SaaS og teknologi' },
        { value: 'AI', label: 'Arbejdsgange og agenter' },
        { value: 'CRM', label: 'Revenue Operations' },
      ],
      sections: [
        { title: 'revenue-arkitektur', body: 'Pipeline, CRM, attribution og GTM motion behandles som ét system. Målet er en gentagelig driftsrytme, ikke endnu et dashboard.' },
        { title: 'AI-native udførelse', body: 'Claude Code, MCP, automatisering og interne apps bruges der, hvor de skaber reel effekt: research, CRM-hygiejne, content ops, salgsaktivering og rapportering.' },
        { title: 'Produkter som bevis', body: 'Produkterne i økosystemet viser, hvor hurtigt operatørstyrede systemer kan bygges, testes og sendes ud.' },
      ],
    },
    "ai-systems": {
      title: 'AI-systemer - arbejdsgange, agenter og løftestangseffekt',
      description: 'AI-native workflows, GTM-agenter og automatisering til marketing, salg og drift.',
      eyebrow: 'AI-systemer',
      h1: 'AI er ikke en tilføjelse. Det er et nyt driftslag.',
      lead: 'Jeg bygger AI-arbejdsgange, hvor de er forankret i systemet: data, kontekst, regler, QA og en klar overdragelse til mennesker.',
      primaryCta: 'Læs indsigt',
      primaryHref: '/insights/',
      secondaryCta: 'Diskuter systemet',
      secondaryHref: '/dk/contact/',
      stats: [
        { value: 'Agents', label: 'Research & GTM' },
        { value: 'MCP', label: 'Orkestrering af værktøjer' },
        { value: 'QA', label: 'Mennesket i kredsløbet' },
      ],
      sections: [
        { title: 'Kontekst først', body: 'Gode AI-systemer starter ikke med instruktioner. De starter med rene data, klare roller, begrænsninger og målbar kvalitet.' },
        { title: 'Arbejdsgange for operatører', body: 'De bedste workflows er små nok til at køre pålideligt og store nok til at fjerne reelt arbejde fra systemet.' },
        { title: 'Byg, når det er nødvendigt', body: 'Når SaaS-værktøjer ikke passer, bygger jeg interne værktøjer eller agenter, der forbinder direkte til CRM, content ops og analytics.' },
      ],
    },
    "contact": {
      title: 'Book et opkald - GTM & AI-systemer',
      description: '30 minutters opkald til GTM-audits, design af AI-arbejdsgange, CRM-arkitektur og produktscoping.',
      eyebrow: 'Kontakt',
      h1: 'Når systemet sidder fast, taler vi konkret.',
      lead: 'Send kontekst, stak og flaskehals. Under samtalen afgør vi, om næste skridt er en audit, en build sprint eller en konkret løsning.',
      primaryCta: 'Book 30 minutter',
      primaryHref: 'https://cal.com/wojciech-luszczynski/30min',
      secondaryCta: 'Åbn LinkedIn',
      secondaryHref: 'https://www.linkedin.com/in/wojciech-luszczynski/',
      stats: [
        { value: '30m', label: 'Første opkald' },
        { value: '24h', label: 'Svartid' },
        { value: 'EU', label: 'Remote-first' },
      ],
      sections: [
        { title: 'Gode emner', body: 'GTM-revision, CRM-operating model, AI-workflow-design, indholdsdrift, betalt erhvervelse, pipeline-diagnose og interne værktøjer.' },
        { title: 'Hvad jeg har brug for på forhånd', body: 'Kort sagt: hvad du sælger, til hvem, hvor pipelinen går i stykker, hvilke værktøjer der kører, og hvilken beslutning der skal træffes.' },
        { title: 'Hvad der ikke passer', body: 'Løs idéudvikling uden en ejer, ren værktøjsimplementering uden GTM-kontekst eller projekter uden klar data- og adgangsstyring.' },
      ],
    },
    "insights": {
      title: 'Indsigt i AI og GTM - operatørens noter',
      description: 'Praktiske noter om AI-systemer, GTM-arkitektur og revenue-systemer.',
      eyebrow: 'Insights',
      h1: 'Operator Notes om AI, GTM og revenue-arkitektur.',
      lead: 'Artiklerne viser arkitektur, beslutninger og erfaringer fra systemer, der rent faktisk er bygget og kører.',
      primaryCta: 'Se alle artikler',
      primaryHref: '/insights/',
      secondaryCta: 'Book et opkald',
      secondaryHref: '/dk/contact/',
      stats: [
        { value: 'MDX', label: 'Komponenter' },
        { value: 'AI', label: 'Produktionsstakken' },
        { value: 'GTM', label: 'Operator-noter' },
      ],
      sections: [
        { title: 'Hvad du finder', body: 'Build-vs-buy-beslutninger, CRM-første AI-anvendelse, Claude Code i GTM-arbejde og reelle valg af produktionsstack.' },
        { title: 'Hvordan artiklerne er skrevet', body: 'Ingen indpakning af tankelederskab. Hver note forklarer et system, en beslutning eller en operationel lektion.' },
        { title: 'For hvem', body: 'Stiftere, GTM-ledere, RevOps-teams og operatører, der ønsker at bruge AI som arbejdsinfrastruktur, ikke bare en demo.' },
      ],
    },
  },
  no: {
    "about": {
      title: 'Om Wojciech - AI-nativ GTM-operator',
      description: 'Profil av Wojciech Łuszczyński: GTM-arkitekt, vekstoperatør og utvikler av AI-native revenue-systemer for B2B SaaS.',
      eyebrow: 'Profil',
      h1: 'GTM-arkitektur, vekstgjennomføring og AI-systemer i én og samme operator.',
      lead: 'Jeg jobber der strategi, data, verktøy og gjennomføring møtes. Fokus er B2B SaaS-team med et ekte produkt, men uten et stabilt revenue-system.',
      primaryCta: 'Se arbeidet',
      primaryHref: '/no/work/',
      secondaryCta: 'Bestill en samtale',
      secondaryHref: '/no/contact/',
      stats: [
        { value: '20', label: 'år markedsføring & digital' },
        { value: '10', label: 'år B2B SaaS' },
        { value: '10', label: 'år GTM' },
      ],
      sections: [
        { title: 'Hvordan jeg jobber', body: 'Jeg diagnostiserer systemet først: ICP, pipeline, CRM, attribusjon, innhold, betalt akkvisisjon og automatisering. Deretter bygger jeg de manglende delene i den rekkefølgen som gir raskest klarhet i driften.' },
        { title: 'Hva jeg leverer', body: 'Ikke isolerte taktikker. Jeg leverer en operating model: prosesser, dashbord, sekvenser, automatisering, AI-arbeidsflyter og tydelig eierskap.' },
        { title: 'For hvem', body: 'B2B SaaS, teknologiselskaper og grunnleggerteam som ønsker å bygge raskere uten å gjøre GTM til et verktøykaos.' },
      ],
    },
    "work": {
      title: 'GTM-systemer og casestudier',
      description: 'Utvalgte systemer: AI-native GTM, CRM, automatisering, innhold, betalt oppkjøp og interne verktøy.',
      eyebrow: 'Arbeid',
      h1: 'Utvalgte revenue-systemer, produkter og driftsmodeller.',
      lead: 'Eksemplene følger det samme mønsteret: tydelig problemstilling, målbar arkitektur, rask gjennomføring og infrastruktur som varer.',
      primaryCta: 'Se AI-systemer',
      primaryHref: '/no/ai-systems/',
      secondaryCta: 'Bestill en samtale',
      secondaryHref: '/no/contact/',
      stats: [
        { value: 'B2B', label: 'SaaS og teknologi' },
        { value: 'AI', label: 'Arbeidsflyter og agenter' },
        { value: 'CRM', label: 'Revenue Operations' },
      ],
      sections: [
        { title: 'revenue-arkitektur', body: 'Pipeline, CRM, attribusjon og GTM motion behandles som ett system. Målet er en repeterbar driftsrytme, ikke et nytt dashbord.' },
        { title: 'AI-native utførelse', body: 'Claude Code, MCP, automatisering og interne apper brukes der de virkelig gir resultater: research, CRM-hygiene, innholdsoperasjoner, salgsaktivering og rapportering.' },
        { title: 'Produkter som bevis', body: 'Produktene i økosystemet viser hvor raskt operatørstyrte systemer kan bygges, testes og leveres.' },
      ],
    },
    "ai-systems": {
      title: 'AI-systemer - arbeidsflyter, agenter og utnyttelse',
      description: 'AI-native arbeidsflyter, GTM-agenter og automatisering for markedsføring, salg og drift.',
      eyebrow: 'AI-systemer',
      h1: 'AI er ikke et tillegg. Det er et nytt driftslag.',
      lead: 'Jeg bygger AI-arbeidsflyter der de er forankret i systemet: data, kontekst, regler, kvalitetssikring og en tydelig overlevering til mennesker.',
      primaryCta: 'Les innsikt',
      primaryHref: '/insights/',
      secondaryCta: 'Diskuter systemet',
      secondaryHref: '/no/contact/',
      stats: [
        { value: 'Agents', label: 'Research & GTM' },
        { value: 'MCP', label: 'Orkestrering av verktøy' },
        { value: 'QA', label: 'Mennesket i loopen' },
      ],
      sections: [
        { title: 'Konteksten først', body: 'Gode AI-systemer starter ikke med instruksjoner. De starter med rene data, tydelige roller, begrensninger og målbar kvalitet.' },
        { title: 'Arbeidsflyt for operatører', body: 'De beste arbeidsflytene er små nok til å kjøre pålitelig og store nok til å fjerne reelt arbeid fra systemet.' },
        { title: 'Bygg når det trengs', body: 'Når SaaS-verktøy ikke passer, bygger jeg interne verktøy eller agenter som kobles direkte til CRM, innholdsoperasjoner og analyse.' },
      ],
    },
    "contact": {
      title: 'Bestill en samtale - GTM- og AI-systemer',
      description: '30-minutters samtale for GTM-revisjoner, design av AI-arbeidsflyt, CRM-arkitektur og produktscoping.',
      eyebrow: 'Kontakt',
      h1: 'Når systemet sitter fast, snakker vi konkret.',
      lead: 'Send kontekst, stakk og flaskehals. Under samtalen avgjør vi om neste trinn er en revisjon, en byggespurt eller en konkret løsning.',
      primaryCta: 'Bestill 30 minutter',
      primaryHref: 'https://cal.com/wojciech-luszczynski/30min',
      secondaryCta: 'Åpne LinkedIn',
      secondaryHref: 'https://www.linkedin.com/in/wojciech-luszczynski/',
      stats: [
        { value: '30m', label: 'Første samtale' },
        { value: '24h', label: 'Svartid' },
        { value: 'EU', label: 'Remote-first' },
      ],
      sections: [
        { title: 'Gode temaer', body: 'GTM-revisjon, CRM-operating model, AI-arbeidsflytdesign, innholdsoperasjoner, betalt anskaffelse, pipeline-diagnose og interne verktøy.' },
        { title: 'Hva jeg trenger på forhånd', body: 'Kort fortalt: hva du selger, til hvem, hvor pipelinen går i stykker, hvilke verktøy som kjører, og hvilke beslutninger som må tas.' },
        { title: 'Det som ikke passer', body: 'Løs idéutvikling uten en eier, ren verktøyimplementering uten GTM-kontekst, eller prosjekter uten klar styring av data og tilgang.' },
      ],
    },
    "insights": {
      title: 'Innsikt i AI og GTM - Operator Notes',
      description: 'Praktiske merknader om AI-systemer, GTM-arkitektur og revenue-systemer.',
      eyebrow: 'Innsikt',
      h1: 'Operator Notes om AI, GTM og revenue-arkitektur.',
      lead: 'Artiklene viser arkitektur, beslutninger og erfaringer fra systemer som faktisk er bygget og i drift.',
      primaryCta: 'Se alle artikler',
      primaryHref: '/insights/',
      secondaryCta: 'Bestill en samtale',
      secondaryHref: '/no/contact/',
      stats: [
        { value: 'MDX', label: 'Komponenter' },
        { value: 'AI', label: 'Produksjonsstabel' },
        { value: 'GTM', label: 'Operator-notater' },
      ],
      sections: [
        { title: 'Hva du finner', body: 'Avgjørelser om å bygge eller kjøpe, CRM-først AI-innføring, Claude Code i GTM-arbeid og reelle valg av produksjonsstack.' },
        { title: 'Hvordan artiklene er skrevet', body: 'Ingen innpakning av tankelederskap. Hvert notat forklarer et system, en beslutning eller en operasjonell lærdom.' },
        { title: 'For hvem', body: 'Gründere, GTM-ledere, RevOps-team og operatører som ønsker å bruke AI som arbeidsinfrastruktur, ikke bare som en demo.' },
      ],
    },
  },
  jp: {
    "about": {
      title: 'ヴォイチェフについて - AIネイティブGTMオペレーター',
      description: 'Wojciech Łuszczyńskiのプロフィール：GTMアーキテクト、グロースオペレーター、B2B SaaS向けAIネイティブRevenue system構築者。',
      eyebrow: 'プロフィール',
      h1: 'GTM設計、グロース実行、AIシステムを、ひとりのオペレーターに。',
      lead: '戦略、データ、ツール、実行が交わる場所で動いています。フォーカスは、製品はあるのに安定したRevenue systemがないB2B SaaSチームです。',
      primaryCta: '実績を見る',
      primaryHref: '/jp/work/',
      secondaryCta: '相談を予約',
      secondaryHref: '/jp/contact/',
      stats: [
        { value: '20', label: '年 マーケティング＆デジタル' },
        { value: '10', label: '年 B2B SaaS' },
        { value: '10', label: '年 GTM' },
      ],
      sections: [
        { title: '私の進め方', body: 'まずシステムを診断します。ICP、パイプライン、CRM、アトリビューション、コンテンツ、有料獲得、自動化。そのうえで、最も早く運用の見通しが立つ順番で、足りない部分を組み上げていきます。' },
        { title: 'お渡しするもの', body: 'バラバラな施策ではありません。お渡しするのはオペレーティングモデルです。プロセス、ダッシュボード、シーケンス、自動化、AIワークフロー、そして責任の所在の明確化。' },
        { title: '誰のために', body: 'GTMをツールの混沌にせず、もっと速くつくりたいB2B SaaS・テクノロジー企業・創業チームのために。' },
      ],
    },
    "work": {
      title: 'GTMシステム＆ケーススタディ',
      description: '厳選されたシステムAIネイティブGTM、CRM、オートメーション、コンテンツ、有料獲得、社内ツール。',
      eyebrow: '仕事',
      h1: '厳選したRevenue system、プロダクト、オペレーティングモデル。',
      lead: '事例はどれも同じ型です。明確な課題、測定できるアーキテクチャ、速い実行、そして長く使えるインフラ。',
      primaryCta: 'AIシステムを見る',
      primaryHref: '/jp/ai-systems/',
      secondaryCta: '相談を予約',
      secondaryHref: '/jp/contact/',
      stats: [
        { value: 'B2B', label: 'SaaSとテクノロジー' },
        { value: 'AI', label: 'ワークフローとエージェント' },
        { value: 'CRM', label: '収益オペレーション' },
      ],
      sections: [
        { title: 'Revenue architecture', body: 'パイプライン、CRM、アトリビューション、GTMモーションを、ひとつのシステムとして扱います。狙いは、もう一つのダッシュボードではなく、再現できる運用リズムです。' },
        { title: 'AIネイティブの実行', body: 'Claude Code、MCP、自動化、社内アプリは、実際に効果が出る場所で使います。リサーチ、CRMの整備、コンテンツ運用、セールスイネーブルメント、レポーティング。' },
        { title: '裏付けとしてのプロダクト', body: 'エコシステムのプロダクトが、オペレーター主導のシステムをどれだけ速く作り、試し、リリースできるかを示します。' },
      ],
    },
    "ai-systems": {
      title: 'AIシステム - ワークフロー、エージェント、レバレッジ',
      description: 'AIネイティブなワークフロー、GTMエージェント、マーケティング、セールス、オペレーションの自動化。',
      eyebrow: 'AIシステム',
      h1: 'AIはアドオンではない。新しいオペレーティングレイヤーだ。',
      lead: 'AIワークフローは、システムに根を張る形で作ります。データ、コンテキスト、ルール、QA、そして人へのきれいな引き継ぎ。',
      primaryCta: 'インサイトを読む',
      primaryHref: '/insights/',
      secondaryCta: 'システムについて話す',
      secondaryHref: '/jp/contact/',
      stats: [
        { value: 'Agents', label: 'Research & GTM' },
        { value: 'MCP', label: 'ツール・オーケストレーション' },
        { value: 'QA', label: 'ヒューマン・イン・ザ・ループ' },
      ],
      sections: [
        { title: 'コンテキストが先', body: '優れたAIシステムは、プロンプトから始まりません。クリーンなデータ、明確な役割、制約、そして測定できる品質から始まります。' },
        { title: 'オペレーターのワークフロー', body: '最良のワークフローは、確実に回るほど小さく、それでいてシステムから実作業を引き取れるほど大きい。' },
        { title: '必要なときに作る', body: 'SaaSツールが合わなければ、CRM、コンテンツ運用、アナリティクスに直接つながる社内ツールやエージェントを作ります。' },
      ],
    },
    "contact": {
      title: '相談を予約 · GTM & AIシステム',
      description: 'GTM監査、AIワークフロー設計、CRMアーキテクチャ、製品スコーピングのための30分の通話。',
      eyebrow: '連絡先',
      h1: 'システムが行き詰まったら、具体的に話しましょう。',
      lead: 'コンテキスト、スタック、ボトルネックを送ってください。通話で、次の一手が監査か、ビルドスプリントか、具体的な打ち手かを一緒に決めます。',
      primaryCta: '30分を予約',
      primaryHref: 'https://cal.com/wojciech-luszczynski/30min',
      secondaryCta: 'LinkedInを開く',
      secondaryHref: 'https://www.linkedin.com/in/wojciech-luszczynski/',
      stats: [
        { value: '30m', label: 'ファーストコール' },
        { value: '24h', label: '応答時間' },
        { value: 'EU', label: 'リモート・ファースト' },
      ],
      sections: [
        { title: '良い話題', body: 'GTM監査、CRM運用モデル、AIワークフロー設計、コンテンツ運用、有料獲得、パイプライン診断、社内ツール。' },
        { title: '事前に必要なもの', body: '簡単に言うと、誰に何を売っているのか、パイプラインはどこで途切れているのか、どのツールを使っているのか、どんな決断が必要なのか。' },
        { title: '合わないもの', body: '持ち主のいないふわっとしたアイデア出し、GTMの文脈がないツール導入だけの案件、データとアクセス権限の管理が曖昧なプロジェクト。' },
      ],
    },
    "insights": {
      title: 'AI & GTM Insights · Operator Notes',
      description: 'AIシステム、GTMアーキテクチャ、Revenue systemに関する実践的なメモ。',
      eyebrow: 'Insights',
      h1: 'AI、GTM、Revenue architectureに関するオペレーターノート。',
      lead: '記事では、実際に構築して運用しているシステムのアーキテクチャ、判断、教訓を示します。',
      primaryCta: 'すべての記事を見る',
      primaryHref: '/insights/',
      secondaryCta: '相談を予約',
      secondaryHref: '/jp/contact/',
      stats: [
        { value: 'MDX', label: 'コンポーネント' },
        { value: 'AI', label: '本番スタック' },
        { value: 'GTM', label: 'オペレーターノート' },
      ],
      sections: [
        { title: 'ここで読めること', body: '内製か購入かの判断、CRM起点のAI導入、GTM業務でのClaude Code、そして実際の本番スタックの選び方。' },
        { title: '記事の書き方', body: 'もっともらしいソートリーダーシップの飾りはなし。どのノートも、ひとつのシステム、ひとつの判断、ひとつの運用上の学びを説明します。' },
        { title: '誰のために', body: '創業者、GTMリード、RevOpsチーム、そしてAIを単なるデモではなく、仕事のインフラとして使いたいオペレーター。' },
      ],
    },
  },
  it: {
    "about": {
      title: 'Chi sono · Wojciech, GTM Operator AI-native',
      description: 'Profilo di Wojciech Łuszczyński: architetto GTM, growth operator e costruttore di sistemi di revenue AI-native per B2B SaaS.',
      eyebrow: 'Profilo',
      h1: 'Architettura GTM, esecuzione della crescita e sistemi AI in un unico operatore.',
      lead: 'Lavoro dove strategia, dati, strumenti ed esecuzione si incontrano. Mi concentro su team B2B SaaS con un prodotto reale ma senza un sistema di revenue stabile.',
      primaryCta: 'Vedi il lavoro',
      primaryHref: '/it/work/',
      secondaryCta: 'Prenota una call',
      secondaryHref: '/it/contact/',
      stats: [
        { value: '20', label: 'anni marketing & digital' },
        { value: '10', label: 'anni B2B SaaS' },
        { value: '10', label: 'anni GTM' },
      ],
      sections: [
        { title: 'Come lavoro', body: 'Prima diagnostico il sistema: ICP, pipeline, CRM, attribuzione, contenuti, acquisizione a pagamento e automazione. Poi costruisco le parti mancanti nell\'ordine che crea più chiarezza operativa nel minor tempo.' },
        { title: 'Cosa consegno', body: 'Niente tattiche isolate. Consegno un operating model: processi, dashboard, flussi, automazione, workflow AI e responsabilità chiare.' },
        { title: 'Per chi', body: 'B2B SaaS, aziende tecnologiche e team fondatori che vogliono costruire più velocemente senza trasformare il GTM in un caos di strumenti.' },
      ],
    },
    "work": {
      title: 'Sistemi GTM & Case Study · Wojciech',
      description: 'Sistemi selezionati: GTM AI-native, CRM, automazione, contenuti, acquisizione a pagamento e strumenti interni.',
      eyebrow: 'Lavoro',
      h1: 'Sistemi di revenue selezionati, prodotti e operating model.',
      lead: 'Gli esempi seguono lo stesso schema: problema chiaro, architettura misurabile, esecuzione rapida e infrastruttura duratura.',
      primaryCta: 'Vedi i sistemi AI',
      primaryHref: '/it/ai-systems/',
      secondaryCta: 'Prenota una call',
      secondaryHref: '/it/contact/',
      stats: [
        { value: 'B2B', label: 'SaaS & Tecnologia' },
        { value: 'AI', label: 'Workflow & Agenti' },
        { value: 'CRM', label: 'Revenue Operations' },
      ],
      sections: [
        { title: 'Architettura revenue', body: 'Pipeline, CRM, attribuzione e GTM motion vengono trattati come un unico sistema. L\'obiettivo è un ritmo di lavoro ripetibile, non un altro dashboard.' },
        { title: 'Esecuzione AI-native', body: 'Claude Code, MCP, automazione e app interne vengono utilizzati dove apportano valore reale: ricerca, igiene CRM, content ops, sales enablement e reporting.' },
        { title: 'Prodotti come prova', body: 'I prodotti nell\'ecosistema dimostrano quanto velocemente possono essere costruiti, testati e consegnati sistemi guidati dall\'operatore.' },
      ],
    },
    "ai-systems": {
      title: 'Sistemi AI · Workflow, Agenti & Leva',
      description: 'Workflow AI-native, agenti GTM e automazione per marketing, vendite e operations.',
      eyebrow: 'Sistemi AI',
      h1: 'L\'AI non è un componente aggiuntivo. È un nuovo livello operativo.',
      lead: 'Costruisco workflow AI ancorati al sistema: dati, contesto, regole, controllo qualità e un passaggio chiaro agli esseri umani.',
      primaryCta: 'Leggi gli insights',
      primaryHref: '/insights/',
      secondaryCta: 'Discuti il sistema',
      secondaryHref: '/it/contact/',
      stats: [
        { value: 'Agenti', label: 'Ricerca & GTM' },
        { value: 'MCP', label: 'Orchestrazione strumenti' },
        { value: 'QA', label: 'Human-in-the-loop' },
      ],
      sections: [
        { title: 'Il contesto prima di tutto', body: 'I buoni sistemi AI non iniziano dai prompt. Iniziano da dati puliti, ruoli chiari, vincoli e qualità misurabile.' },
        { title: 'Workflow dell\'operatore', body: 'I migliori workflow sono abbastanza piccoli da funzionare in modo affidabile e abbastanza grandi da togliere al sistema lavoro reale.' },
        { title: 'Costruire quando serve', body: 'Quando gli strumenti SaaS non si adattano, costruisco strumenti interni o agenti collegati direttamente a CRM, content ops e analytics.' },
      ],
    },
    "contact": {
      title: 'Prenota una call · GTM & Sistemi AI',
      description: 'Call di 30 minuti per audit GTM, progettazione di workflow AI, architettura CRM e scoping di prodotto.',
      eyebrow: 'Contatto',
      h1: 'Se il sistema è bloccato, parliamo concretamente.',
      lead: 'Invia contesto, stack e collo di bottiglia. Durante la call stabiliamo se il prossimo passo è un audit, uno sprint di build o una soluzione concreta.',
      primaryCta: 'Prenota 30 minuti',
      primaryHref: 'https://cal.com/wojciech-luszczynski/30min',
      secondaryCta: 'Apri LinkedIn',
      secondaryHref: 'https://www.linkedin.com/in/wojciech-luszczynski/',
      stats: [
        { value: '30m', label: 'Prima call' },
        { value: '24h', label: 'Tempo di risposta' },
        { value: 'EU', label: 'Remote-first' },
      ],
      sections: [
        { title: 'Buoni argomenti', body: 'Audit GTM, operating model CRM, progettazione workflow AI, content operations, acquisizione a pagamento, diagnosi pipeline e strumenti interni.' },
        { title: 'Cosa mi serve in anticipo', body: 'In breve: cosa vendi, a chi, dove si rompe la pipeline, quali strumenti stai usando e quale decisione deve essere presa.' },
        { title: 'Cosa non si adatta', body: 'Brainstorming libero senza proprietario, implementazione di strumenti pura senza contesto GTM, o progetti senza controllo chiaro di dati e accesso.' },
      ],
    },
    "insights": {
      title: 'Appunti operatore · AI & GTM',
      description: 'Note pratiche su sistemi AI, architettura GTM e sistemi di revenue.',
      eyebrow: 'Insights',
      h1: 'Note dell\'operatore su AI, GTM e architettura revenue.',
      lead: 'Gli articoli mostrano architettura, decisioni e lezioni di sistemi effettivamente costruiti e operati.',
      primaryCta: 'Vedi tutti gli articoli',
      primaryHref: '/insights/',
      secondaryCta: 'Prenota una call',
      secondaryHref: '/it/contact/',
      stats: [
        { value: 'MDX', label: 'Componenti' },
        { value: 'AI', label: 'Stack di produzione' },
        { value: 'GTM', label: 'Note operatore' },
      ],
      sections: [
        { title: 'Cosa trovi', body: 'Decisioni build vs buy, adozione AI nel CRM, Claude Code nel lavoro GTM e scelte reali di produzione.' },
        { title: 'Come sono scritti gli articoli', body: 'Nessun packaging di thought leadership. Ogni nota spiega un sistema, una decisione o una lezione operativa.' },
        { title: 'Per chi', body: 'Fondatori, GTM lead, team RevOps e operatori che vogliono usare l\'AI come infrastruttura di lavoro, non solo come demo.' },
      ],
    },
  },
  es: {
    "about": {
      title: 'Sobre Wojciech · Operador GTM AI-native',
      description: 'Perfil de Wojciech Łuszczyński: arquitecto GTM, operador de crecimiento y constructor de sistemas de revenue AI-native para B2B SaaS.',
      eyebrow: 'Perfil',
      h1: 'Arquitectura GTM, ejecución del crecimiento y sistemas AI en un solo operador.',
      lead: 'Trabajo donde estrategia, datos, herramientas y ejecución se encuentran. Me centro en equipos B2B SaaS con un producto real pero sin un sistema de revenue estable.',
      primaryCta: 'Ver el trabajo',
      primaryHref: '/es/work/',
      secondaryCta: 'Reservar una llamada',
      secondaryHref: '/es/contact/',
      stats: [
        { value: '20', label: 'años marketing & digital' },
        { value: '10', label: 'años B2B SaaS' },
        { value: '10', label: 'años GTM' },
      ],
      sections: [
        { title: 'Cómo trabajo', body: 'Primero diagnostico el sistema: ICP, pipeline, CRM, atribución, contenido, adquisición de pago y automatización. Luego construyo las piezas que faltan en el orden que crea más claridad operativa en el menor tiempo.' },
        { title: 'Qué entrego', body: 'Sin tácticas aisladas. Entrego un operating model: procesos, dashboards, flujos, automatización, workflows AI y responsabilidades claras.' },
        { title: 'Para quién', body: 'B2B SaaS, empresas tecnológicas y equipos fundadores que quieren construir más rápido sin convertir el GTM en un caos de herramientas.' },
      ],
    },
    "work": {
      title: 'Sistemas GTM & Casos de Estudio · Wojciech',
      description: 'Sistemas seleccionados: GTM AI-native, CRM, automatización, contenido, adquisición de pago y herramientas internas.',
      eyebrow: 'Trabajo',
      h1: 'Sistemas de revenue seleccionados, productos y operating models.',
      lead: 'Los ejemplos siguen el mismo patrón: problema claro, arquitectura medible, ejecución rápida e infraestructura duradera.',
      primaryCta: 'Ver sistemas AI',
      primaryHref: '/es/ai-systems/',
      secondaryCta: 'Reservar una llamada',
      secondaryHref: '/es/contact/',
      stats: [
        { value: 'B2B', label: 'SaaS & Tecnología' },
        { value: 'AI', label: 'Workflows & Agentes' },
        { value: 'CRM', label: 'Revenue Operations' },
      ],
      sections: [
        { title: 'Arquitectura revenue', body: 'Pipeline, CRM, atribución y GTM motion se tratan como un único sistema. El objetivo es un ritmo de trabajo repetible, no otro dashboard.' },
        { title: 'Ejecución AI-native', body: 'Claude Code, MCP, automatización y apps internas se usan donde aportan valor real: investigación, higiene CRM, content ops, sales enablement e informes.' },
        { title: 'Productos como prueba', body: 'Los productos del ecosistema demuestran la rapidez con la que se pueden construir, probar y entregar sistemas liderados por operadores.' },
      ],
    },
    "ai-systems": {
      title: 'Sistemas AI · Flujos, Agentes & Palanca',
      description: 'Workflows AI-native, agentes GTM y automatización para marketing, ventas y operaciones.',
      eyebrow: 'Sistemas AI',
      h1: 'La AI no es un complemento. Es una nueva capa operativa.',
      lead: 'Construyo workflows AI anclados al sistema: datos, contexto, reglas, control de calidad y un traspaso claro a los humanos.',
      primaryCta: 'Leer insights',
      primaryHref: '/insights/',
      secondaryCta: 'Discutir el sistema',
      secondaryHref: '/es/contact/',
      stats: [
        { value: 'Agentes', label: 'Investigación & GTM' },
        { value: 'MCP', label: 'Orquestación de herramientas' },
        { value: 'QA', label: 'Human-in-the-loop' },
      ],
      sections: [
        { title: 'El contexto primero', body: 'Los buenos sistemas AI no empiezan con prompts. Empiezan con datos limpios, roles claros, restricciones y calidad medible.' },
        { title: 'Workflows del operador', body: 'Los mejores workflows son lo suficientemente pequeños para funcionar de forma fiable y lo suficientemente grandes para quitarle al sistema trabajo real.' },
        { title: 'Construir cuando hace falta', body: 'Cuando las herramientas SaaS no encajan, construyo herramientas internas o agentes conectados directamente a CRM, content ops y analytics.' },
      ],
    },
    "contact": {
      title: 'Reservar una llamada · GTM & Sistemas AI',
      description: 'Llamada de 30 minutos para auditorías GTM, diseño de workflows AI, arquitectura CRM y scoping de producto.',
      eyebrow: 'Contacto',
      h1: 'Si el sistema está atascado, hablamos concretamente.',
      lead: 'Envía contexto, stack y cuello de botella. En la llamada determinamos si el siguiente paso es una auditoría, un sprint de build o una solución concreta.',
      primaryCta: 'Reservar 30 minutos',
      primaryHref: 'https://cal.com/wojciech-luszczynski/30min',
      secondaryCta: 'Abrir LinkedIn',
      secondaryHref: 'https://www.linkedin.com/in/wojciech-luszczynski/',
      stats: [
        { value: '30m', label: 'Primera llamada' },
        { value: '24h', label: 'Tiempo de respuesta' },
        { value: 'EU', label: 'Remote-first' },
      ],
      sections: [
        { title: 'Buenos temas', body: 'Auditoría GTM, operating model CRM, diseño de workflow AI, content operations, adquisición de pago, diagnóstico de pipeline y herramientas internas.' },
        { title: 'Qué necesito de antemano', body: 'En resumen: qué vendes, a quién, dónde se rompe la pipeline, qué herramientas están en uso y qué decisión hay que tomar.' },
        { title: 'Qué no encaja', body: 'Brainstorming libre sin propietario, implementación de herramientas pura sin contexto GTM, o proyectos sin control claro de datos y acceso.' },
      ],
    },
    "insights": {
      title: 'Notas del operador · AI & GTM',
      description: 'Notas prácticas sobre sistemas AI, arquitectura GTM y sistemas de revenue.',
      eyebrow: 'Insights',
      h1: 'Notas del operador sobre AI, GTM y arquitectura revenue.',
      lead: 'Los artículos muestran arquitectura, decisiones y lecciones de sistemas realmente construidos y operados.',
      primaryCta: 'Ver todos los artículos',
      primaryHref: '/insights/',
      secondaryCta: 'Reservar una llamada',
      secondaryHref: '/es/contact/',
      stats: [
        { value: 'MDX', label: 'Componentes' },
        { value: 'AI', label: 'Stack de producción' },
        { value: 'GTM', label: 'Notas del operador' },
      ],
      sections: [
        { title: 'Qué encuentras', body: 'Decisiones build vs buy, adopción de AI en CRM, Claude Code en el trabajo GTM y elecciones reales de producción.' },
        { title: 'Cómo están escritos los artículos', body: 'Sin packaging de thought leadership. Cada nota explica un sistema, una decisión o una lección operativa.' },
        { title: 'Para quién', body: 'Fundadores, GTM leads, equipos RevOps y operadores que quieren usar la AI como infraestructura de trabajo, no solo como demo.' },
      ],
    },
  },
  pl: {
    about: {
      title: 'O mnie · Operator GTM, AI-native',
      description: 'Wojciech Łuszczyński: architekt GTM, growth operator i budowniczy AI-native revenue systems dla B2B SaaS.',
      eyebrow: 'O mnie',
      h1: 'Architektura GTM, egzekucja wzrostu i systemy AI w jednym operatorze.',
      lead: 'Pracuję tam, gdzie stykają się strategia, dane, narzędzia i egzekucja. Skupiam się na zespołach B2B SaaS z realnym produktem, ale bez stabilnego systemu przychodów.',
      primaryCta: 'Zobacz realizacje',
      primaryHref: '/pl/work/',
      secondaryCta: 'Umów rozmowę',
      secondaryHref: '/pl/contact/',
      stats: [
        {
          value: '20',
          label: 'lat marketing & digital'
        },
        {
          value: '10',
          label: 'lat B2B SaaS'
        },
        {
          value: '10',
          label: 'lat GTM'
        }
      ],
      sections: [
        {
          title: 'Jak pracuję',
          body: 'Najpierw diagnozuję system: ICP, pipeline, CRM, atrybucja, content, paid acquisition, automatyzacja. Potem buduję brakujące elementy w kolejności, która daje najszybszą widoczność operacyjną.'
        },
        {
          title: 'Co dostarczam',
          body: 'Żadnych izolowanych taktyk. Dostarczam model operacyjny: procesy, dashboardy, workflow, automatyzację, AI workflows i jasne ownership.'
        },
        {
          title: 'Dla kogo',
          body: 'B2B SaaS, firmy tech i zespoły founderskie, które chcą budować szybciej bez zamieniania GTM w bałagan narzędziowy.'
        }
      ]
    },
    work: {
      title: 'Systemy GTM i case studies',
      description: 'Wybrane systemy: AI-native GTM, CRM, automatyzacja, content, paid acquisition i narzędzia wewnętrzne.',
      eyebrow: 'Realizacje',
      h1: 'Wybrane revenue systems, produkty i modele operacyjne.',
      lead: 'Każdy przykład trzyma się tego samego schematu: jasny problem, mierzalna architektura, szybki ship i trwała infrastruktura.',
      primaryCta: 'Zobacz systemy AI',
      primaryHref: '/pl/ai-systems/',
      secondaryCta: 'Umów rozmowę',
      secondaryHref: '/pl/contact/',
      stats: [
        {
          value: 'B2B',
          label: 'SaaS i tech'
        },
        {
          value: 'AI',
          label: 'Workflows i agenci'
        },
        {
          value: 'CRM',
          label: 'Revenue operations'
        }
      ],
      sections: [
        {
          title: 'Revenue architecture',
          body: 'Pipeline, CRM, atrybucja i GTM motions traktowane jako jeden system. Cel to powtarzalna kadencja operacyjna, nie kolejny dashboard.'
        },
        {
          title: 'AI-native design',
          body: 'Claude Code, MCP, automatyzacja i wewnętrzne apki używane tam, gdzie dają realną wartość: research, higiena CRM, content ops, sales enablement, reporting.'
        },
        {
          title: 'Produkty jako dowód',
          body: 'Produkty w ekosystemie pokazują, jak szybko można budować, testować i shipować systemy prowadzone przez operatora.'
        }
      ]
    },
    'ai-systems': {
      title: 'Systemy AI: workflows, agenci i dźwignia',
      description: 'AI-native workflows, agenci GTM i automatyzacja dla marketingu, sprzedaży i operacji.',
      eyebrow: 'Systemy AI',
      h1: 'AI to nie dodatek. To nowa warstwa operacyjna.',
      lead: 'Buduję AI workflows zakotwiczone w systemie: dane, kontekst, reguły, QA i jasne handoffy do ludzi.',
      primaryCta: 'Czytaj artykuły',
      primaryHref: '/pl/insights/',
      secondaryCta: 'Pogadajmy o systemie',
      secondaryHref: '/pl/contact/',
      stats: [
        {
          value: 'Agenci',
          label: 'Research i GTM'
        },
        {
          value: 'MCP',
          label: 'Orkiestracja narzędzi'
        },
        {
          value: 'QA',
          label: 'Human-in-the-loop'
        }
      ],
      sections: [
        {
          title: 'Najpierw kontekst',
          body: 'Dobre systemy AI nie zaczynają od promptu. Zaczynają od czystych danych, jasnych ról, ograniczeń i mierzalnej jakości.'
        },
        {
          title: 'Operator workflows',
          body: 'Najlepsze workflows są wystarczająco małe, żeby chodzić niezawodnie, i wystarczająco duże, żeby robić realną robotę dla systemu.'
        },
        {
          title: 'Build on demand',
          body: 'Jeśli SaaS nie pasuje, buduję wewnętrzne narzędzia albo agentów wpiętych bezpośrednio w CRM, content ops i analitykę.'
        }
      ]
    },
    contact: {
      title: 'Umów rozmowę: systemy GTM i AI',
      description: '30 minut na audyt GTM, AI workflow design, architekturę CRM albo scoping produktu.',
      eyebrow: 'Kontakt',
      h1: 'Kiedy system się blokuje, rozmawiamy konkretnie.',
      lead: 'Wyślij kontekst, stos i wąskie gardło. Na rozmowie ustalamy, czy następny krok to audyt, build sprint, czy konkretny fix.',
      primaryCta: 'Zarezerwuj 30 minut',
      primaryHref: 'https://cal.com/wojciech-luszczynski/30min',
      secondaryCta: 'LinkedIn',
      secondaryHref: 'https://www.linkedin.com/in/wojciech-luszczynski/',
      stats: [
        {
          value: '30m',
          label: 'Pierwsza rozmowa'
        },
        {
          value: '24h',
          label: 'Czas odpowiedzi'
        },
        {
          value: 'EU',
          label: 'Remote-first'
        }
      ],
      sections: [
        {
          title: 'Dobre tematy',
          body: 'Audyt GTM, model operacyjny CRM, AI workflow design, content ops, paid acquisition, diagnostyka pipeline, narzędzia wewnętrzne.'
        },
        {
          title: 'Czego potrzebuję wcześniej',
          body: 'W skrócie: co sprzedajesz, komu, gdzie urywa się pipeline, jakie narzędzia działają i jaką decyzję trzeba podjąć.'
        },
        {
          title: 'Co nie pasuje',
          body: 'Luźny brainstorming bez ownera, czysta implementacja narzędzia bez kontekstu GTM, projekty bez jasnych danych i dostępów.'
        }
      ]
    },
    insights: {
      title: 'AI & GTM Insights: notatki operatora',
      description: 'Praktyczne notatki o systemach AI, architekturze GTM i revenue systems.',
      eyebrow: 'Insights',
      h1: 'Notatki operatora o AI, GTM i architekturze przychodów.',
      lead: 'Artykuły pokazują architekturę, decyzje i wnioski z systemów, które realnie buduję i prowadzę.',
      primaryCta: 'Wszystkie artykuły',
      primaryHref: '/pl/insights/',
      secondaryCta: 'Umów rozmowę',
      secondaryHref: '/pl/contact/',
      stats: [
        {
          value: 'MDX',
          label: 'Komponenty'
        },
        {
          value: 'AI',
          label: 'Production stack'
        },
        {
          value: 'GTM',
          label: 'Operator notes'
        }
      ],
      sections: [
        {
          title: 'Co znajdziesz',
          body: 'Decyzje build vs. buy, AI adoption w CRM, Claude Code w GTM i realne decyzje produkcyjne.'
        },
        {
          title: 'Jak pisane są artykuły',
          body: 'Zero thought leadership opakowań. Każda notatka opisuje system, decyzję albo lekcję operacyjną.'
        },
        {
          title: 'Dla kogo',
          body: 'Founderzy, GTM leadzi, zespoły RevOps i operatorzy, którzy chcą używać AI jako roboczej infrastruktury, nie tylko jako demo.'
        }
      ]
    }
  },
};

/* ── Lens pillars (GTM / Marketing / Growth), localized 1-1 with EN/AR. ──
   Only the translatable prose lives here; stat values and CTA hrefs are
   assembled below so the table stays small. B2B terms (GTM, CRM, RevOps, ICP,
   SEO, outbound, paid, pipeline, lifecycle, A/B, LTV, ARR) stay in English. */
type LensProse = {
  title: string; description: string; eyebrow: string; h1: string; lead: string;
  primaryCta: string; secondaryCta: string;
  statLabels: [string, string, string];
  s: [string, string, string];
  b: [string, string, string];
};
const lensStatValues: Record<LensPageSlug, [string, string, string]> = {
  gtm: ['CRM', 'AI', '1'],
  marketing: ['ICP', 'SEO', 'POV'],
  growth: ['A/B', 'LTV', 'ARR'],
};
const lensProse: Record<LocaleKey, Record<LensPageSlug, LensProse>> = {
  de: {
    gtm: { title: 'GTM-Systeme · Pipeline, die hält', description: 'AI-native GTM: CRM, Outbound, Paid und RevOps in einer Pipeline, der du vertrauen kannst.', eyebrow: 'GTM', h1: 'Pipeline, die sich aufbaut. Nicht vier Dashboards.', lead: 'CRM, Outbound und Paid in einem System. Eine Quelle der Wahrheit, gebaut und betrieben, bis die Pipeline trägt.', primaryCta: 'Arbeit ansehen', secondaryCta: 'Termin vereinbaren', statLabels: ['Pipeline & RevOps', 'Outbound, angereichert', 'Quelle der Wahrheit'], s: ['Pipeline-Architektur', 'RevOps & Attribution', 'Outbound, das ankommt'], b: ['CRM, Outbound und Paid als ein Operating Model. Eine Quelle der Wahrheit statt vier getrennter Dashboards.', 'Lifecycle-Stufen, Routing und Reporting, die genau zeigen, wo das Signal bricht.', 'Sequenzen und Targeting auf echtem ICP-Signal, mit AI angereichert und personalisiert. Kein Spray.'] },
    marketing: { title: 'Marketing · Nachfrage, keine Impressionen', description: 'B2B-Marketing, das Pipeline erzeugt: Positionierung, Nachfrage und Marke, bis zum Umsatz nachverfolgbar.', eyebrow: 'Marketing', h1: 'Nachfrage, keine Impressionen.', lead: 'Positionierung, Content und Marke, die nachverfolgbare Pipeline erzeugen. Gebaut zum Laufen, nicht für die Slide.', primaryCta: 'Arbeit ansehen', secondaryCta: 'Termin vereinbaren', statLabels: ['Positionierung', 'Content & Nachfrage', 'Marke'], s: ['Positionierung mit Biss', 'Nachfrage, keine Impressionen', 'Marke, die sich summiert'], b: ['Ein Satz, den ein Käufer dir wiederholt. Der Rest der Seite führt dorthin.', 'Content und Kanäle, die Pipeline erzeugen, die du wirklich nachverfolgen kannst.', 'Eine Haltung, konsequent veröffentlicht, damit der Markt dich zwischen den Kaufzyklen erinnert.'] },
    growth: { title: 'Growth · Experimente, die liefern', description: 'Growth als System: Experimente, Aktivierung, Retention und Lifecycle-Loops, gemessen in Umsatz, nicht in Vanity-Metriken.', eyebrow: 'Growth', h1: 'Experimente, die liefern.', lead: 'Aktivierung, Retention und Lifecycle-Loops, wöchentlich betrieben und in Umsatz gemessen. Die Loops, die entscheiden, ob Akquise sich je rechnet.', primaryCta: 'Arbeit ansehen', secondaryCta: 'Termin vereinbaren', statLabels: ['Experimente', 'Aktivierung & Retention', 'In Umsatz gemessen'], s: ['Experimente, die liefern', 'Aktivierung & Retention', 'Lifecycle, der von selbst läuft'], b: ['Ein Backlog nach Impact bewertet, im Wochenrhythmus betrieben, in Umsatz gemessen.', 'Die Loops, die entscheiden, ob Akquise sich je auszahlt. Gefunden, instrumentiert, behoben.', 'Getriggerte, verhaltensbasierte Kommunikation, die das System besitzt, nicht eine Person und ein Spreadsheet.'] },
  },
  dk: {
    gtm: { title: 'GTM-systemer · Pipeline der holder', description: 'AI-native GTM: CRM, outbound, paid og RevOps i én pipeline, du kan stole på.', eyebrow: 'GTM', h1: 'Pipeline der vokser. Ikke fire dashboards.', lead: 'CRM, outbound og paid i ét system. Én kilde til sandhed, bygget og drevet indtil pipelinen holder.', primaryCta: 'Se arbejdet', secondaryCta: 'Book et opkald', statLabels: ['Pipeline & RevOps', 'Outbound, beriget', 'Kilde til sandhed'], s: ['Pipeline-arkitektur', 'RevOps & attribution', 'Outbound der lander'], b: ['CRM, outbound og paid som én operating model. Én kilde til sandhed i stedet for fire adskilte dashboards.', 'Lifecycle-trin, routing og rapportering der viser præcis hvor signalet brister.', 'Sekvenser og targeting bygget på ægte ICP-signal, beriget og personaliseret med AI. Ikke spray.'] },
    marketing: { title: 'Marketing · Efterspørgsel, ikke visninger', description: 'B2B-marketing bygget til at skabe pipeline: positionering, efterspørgsel og brand du kan spore til omsætning.', eyebrow: 'Marketing', h1: 'Efterspørgsel, ikke visninger.', lead: 'Positionering, content og brand designet til at skabe sporbar pipeline. Bygget til at køre, ikke til en slide.', primaryCta: 'Se arbejdet', secondaryCta: 'Book et opkald', statLabels: ['Positionering', 'Content & efterspørgsel', 'Brand'], s: ['Positionering der bider', 'Efterspørgsel, ikke visninger', 'Brand der lægger sig sammen'], b: ['Én sætning en køber gentager til dig. Resten af sitet fører derhen.', 'Content og kanaler designet til at skabe pipeline du faktisk kan spore.', 'Et synspunkt udgivet konsekvent, så markedet husker dig mellem købscyklusser.'] },
    growth: { title: 'Growth · Eksperimenter der leverer', description: 'Growth som system: eksperimenter, aktivering, retention og lifecycle-loops målt i omsætning, ikke vanity-metrikker.', eyebrow: 'Growth', h1: 'Eksperimenter der leverer.', lead: 'Aktivering, retention og lifecycle-loops, kørt ugentligt og målt i omsætning. De loops der afgør om acquisition nogensinde betaler sig.', primaryCta: 'Se arbejdet', secondaryCta: 'Book et opkald', statLabels: ['Eksperimenter', 'Aktivering & retention', 'Målt i omsætning'], s: ['Eksperimenter der leverer', 'Aktivering & retention', 'Lifecycle der kører selv'], b: ['Et backlog scoret efter impact, kørt i en ugentlig kadence, målt i omsætning.', 'De loops der afgør om acquisition nogensinde betaler sig. Fundet, instrumenteret, fikset.', 'Triggede, adfærdsbaserede beskeder ejet af systemet, ikke af én person og et regneark.'] },
  },
  no: {
    gtm: { title: 'GTM-systemer · Pipeline som holder', description: 'AI-native GTM: CRM, outbound, paid og RevOps i én pipeline du kan stole på.', eyebrow: 'GTM', h1: 'Pipeline som vokser. Ikke fire dashboards.', lead: 'CRM, outbound og paid i ett system. Én kilde til sannhet, bygget og driftet til pipelinen holder.', primaryCta: 'Se arbeidet', secondaryCta: 'Book en samtale', statLabels: ['Pipeline & RevOps', 'Outbound, beriket', 'Kilde til sannhet'], s: ['Pipeline-arkitektur', 'RevOps & attribusjon', 'Outbound som lander'], b: ['CRM, outbound og paid som én operating model. Én kilde til sannhet i stedet for fire adskilte dashboards.', 'Lifecycle-trinn, routing og rapportering som viser nøyaktig hvor signalet brister.', 'Sekvenser og targeting bygget på ekte ICP-signal, beriket og personalisert med AI. Ikke spray.'] },
    marketing: { title: 'Marketing · Etterspørsel, ikke visninger', description: 'B2B-markedsføring bygget for å skape pipeline: posisjonering, etterspørsel og merkevare du kan spore til inntekt.', eyebrow: 'Marketing', h1: 'Etterspørsel, ikke visninger.', lead: 'Posisjonering, innhold og merkevare designet for å skape sporbar pipeline. Bygget for å kjøre, ikke for en slide.', primaryCta: 'Se arbeidet', secondaryCta: 'Book en samtale', statLabels: ['Posisjonering', 'Innhold & etterspørsel', 'Merkevare'], s: ['Posisjonering som biter', 'Etterspørsel, ikke visninger', 'Merkevare som bygger seg opp'], b: ['Én setning en kjøper gjentar til deg. Resten av siden leder dit.', 'Innhold og kanaler designet for å skape pipeline du faktisk kan spore.', 'Et ståsted publisert konsekvent, så markedet husker deg mellom kjøpssykluser.'] },
    growth: { title: 'Growth · Eksperimenter som leverer', description: 'Growth som system: eksperimenter, aktivering, retention og lifecycle-loops målt i inntekt, ikke vanity-metrikker.', eyebrow: 'Growth', h1: 'Eksperimenter som leverer.', lead: 'Aktivering, retention og lifecycle-loops, kjørt ukentlig og målt i inntekt. Loopene som avgjør om acquisition noen gang lønner seg.', primaryCta: 'Se arbeidet', secondaryCta: 'Book en samtale', statLabels: ['Eksperimenter', 'Aktivering & retention', 'Målt i inntekt'], s: ['Eksperimenter som leverer', 'Aktivering & retention', 'Lifecycle som går av seg selv'], b: ['En backlog scoret etter impact, kjørt i ukentlig kadens, målt i inntekt.', 'Loopene som avgjør om acquisition noen gang lønner seg. Funnet, instrumentert, fikset.', 'Trigget, atferdsbasert kommunikasjon eid av systemet, ikke av én person og et regneark.'] },
  },
  jp: {
    gtm: { title: 'GTMシステム · 機能するパイプライン', description: 'AIネイティブなGTM:CRM、アウトバウンド、ペイド、RevOpsを信頼できる一つのパイプラインに。', eyebrow: 'GTM', h1: '積み上がるパイプライン。4つのダッシュボードではなく。', lead: 'CRM、アウトバウンド、ペイドを一つのシステムに。唯一の信頼できる情報源を、パイプラインが機能するまで構築し運用する。', primaryCta: '実績を見る', secondaryCta: '相談を予約', statLabels: ['パイプライン & RevOps', 'エンリッチ済みアウトバウンド', '唯一の情報源'], s: ['パイプライン設計', 'RevOpsとアトリビューション', '届くアウトバウンド'], b: ['CRM、アウトバウンド、ペイドを一つのオペレーティングモデルに。分断された4つのダッシュボードではなく、唯一の情報源を。', 'どこでシグナルが途切れるかを正確に示すライフサイクル段階、ルーティング、レポーティング。', '本物のICPシグナルに基づき、AIでエンリッチ・パーソナライズしたシーケンスとターゲティング。やみくもな配信ではない。'] },
    marketing: { title: 'マーケティング · 印象ではなく需要', description: 'パイプラインを生むB2Bマーケティング:収益まで追跡できるポジショニング、需要、ブランド。', eyebrow: 'マーケティング', h1: '印象ではなく、需要。', lead: '追跡可能なパイプラインを生むよう設計したポジショニング、コンテンツ、ブランド。スライドではなく、動くために作る。', primaryCta: '実績を見る', secondaryCta: '相談を予約', statLabels: ['ポジショニング', 'コンテンツと需要', 'ブランド'], s: ['刺さるポジショニング', '印象ではなく需要', '積み上がるブランド'], b: ['買い手があなたに繰り返す一文。サイトの残りはそこへ向かって積み上がる。', '実際に追跡できるパイプラインを生むよう設計したコンテンツとチャネル。', '一貫して発信する視点。購買サイクルの間も市場があなたを覚えている。'] },
    growth: { title: 'グロース · 実装される実験', description: 'システムとしてのグロース:実験、アクティベーション、リテンション、ライフサイクルループを虚栄の指標ではなく収益で測る。', eyebrow: 'グロース', h1: '実装される実験。', lead: 'アクティベーション、リテンション、ライフサイクルループを毎週回し、収益で測る。獲得が報われるかを決めるループ。', primaryCta: '実績を見る', secondaryCta: '相談を予約', statLabels: ['実験', 'アクティベーションとリテンション', '収益で測定'], s: ['実装される実験', 'アクティベーションとリテンション', '自走するライフサイクル'], b: ['インパクトでスコア付けしたバックログを、週次のリズムで回し、収益で測る。', '獲得が報われるかを決めるループ。発見し、計測し、修正する。', 'トリガー型の行動ベース配信を、一人と表計算ではなくシステムが担う。'] },
  },
  it: {
    gtm: { title: 'Sistemi GTM · Pipeline che regge', description: 'GTM AI-native: CRM, outbound, paid e RevOps in un\'unica pipeline di cui fidarti.', eyebrow: 'GTM', h1: 'Pipeline che si accumula. Non quattro dashboard.', lead: 'CRM, outbound e paid in un solo sistema. Un\'unica fonte di verità, costruita e gestita finché la pipeline regge.', primaryCta: 'Vedi i lavori', secondaryCta: 'Prenota una call', statLabels: ['Pipeline e RevOps', 'Outbound, arricchito', 'Fonte di verità'], s: ['Architettura della pipeline', 'RevOps e attribuzione', 'Outbound che arriva'], b: ['CRM, outbound e paid come un solo operating model. Un\'unica fonte di verità invece di quattro dashboard scollegate.', 'Fasi del lifecycle, routing e reporting che mostrano esattamente dove si rompe il segnale.', 'Sequenze e targeting costruiti su segnale ICP reale, arricchiti e personalizzati con l\'AI. Non spray.'] },
    marketing: { title: 'Marketing · Domanda, non impression', description: 'Marketing B2B costruito per generare pipeline: posizionamento, domanda e brand tracciabili fino al fatturato.', eyebrow: 'Marketing', h1: 'Domanda, non impression.', lead: 'Posizionamento, contenuti e brand progettati per generare pipeline tracciabile. Costruiti per funzionare, non per una slide.', primaryCta: 'Vedi i lavori', secondaryCta: 'Prenota una call', statLabels: ['Posizionamento', 'Contenuti e domanda', 'Brand'], s: ['Posizionamento che morde', 'Domanda, non impression', 'Brand che si accumula'], b: ['Una frase che un buyer ti ripete. Il resto del sito porta lì.', 'Contenuti e canali progettati per generare pipeline che puoi davvero tracciare.', 'Un punto di vista pubblicato con costanza, così il mercato ti ricorda tra un ciclo d\'acquisto e l\'altro.'] },
    growth: { title: 'Growth · Esperimenti che vanno in produzione', description: 'Growth come sistema: esperimenti, attivazione, retention e loop di lifecycle misurati in fatturato, non in vanity metric.', eyebrow: 'Growth', h1: 'Esperimenti che vanno in produzione.', lead: 'Attivazione, retention e loop di lifecycle, eseguiti ogni settimana e misurati in fatturato. I loop che decidono se l\'acquisizione ripaga.', primaryCta: 'Vedi i lavori', secondaryCta: 'Prenota una call', statLabels: ['Esperimenti', 'Attivazione e retention', 'Misurato in fatturato'], s: ['Esperimenti che vanno in produzione', 'Attivazione e retention', 'Lifecycle che gira da solo'], b: ['Un backlog valutato per impatto, eseguito a cadenza settimanale, misurato in fatturato.', 'I loop che decidono se l\'acquisizione ripaga. Trovati, strumentati, sistemati.', 'Messaggi comportamentali attivati da trigger, gestiti dal sistema, non da una persona e un foglio di calcolo.'] },
  },
  es: {
    gtm: { title: 'Sistemas GTM · Pipeline que aguanta', description: 'GTM AI-native: CRM, outbound, paid y RevOps en un único pipeline en el que confiar.', eyebrow: 'GTM', h1: 'Pipeline que se acumula. No cuatro dashboards.', lead: 'CRM, outbound y paid en un solo sistema. Una única fuente de verdad, construida y operada hasta que el pipeline aguanta.', primaryCta: 'Ver el trabajo', secondaryCta: 'Reservar una llamada', statLabels: ['Pipeline y RevOps', 'Outbound, enriquecido', 'Fuente de verdad'], s: ['Arquitectura del pipeline', 'RevOps y atribución', 'Outbound que llega'], b: ['CRM, outbound y paid como un solo operating model. Una fuente de verdad en lugar de cuatro dashboards desconectados.', 'Etapas del lifecycle, routing y reporting que muestran exactamente dónde se rompe la señal.', 'Secuencias y targeting sobre señal ICP real, enriquecidos y personalizados con IA. No spray.'] },
    marketing: { title: 'Marketing · Demanda, no impresiones', description: 'Marketing B2B construido para generar pipeline: posicionamiento, demanda y marca que puedes rastrear hasta los ingresos.', eyebrow: 'Marketing', h1: 'Demanda, no impresiones.', lead: 'Posicionamiento, contenido y marca diseñados para generar pipeline rastreable. Hechos para funcionar, no para una slide.', primaryCta: 'Ver el trabajo', secondaryCta: 'Reservar una llamada', statLabels: ['Posicionamiento', 'Contenido y demanda', 'Marca'], s: ['Posicionamiento que muerde', 'Demanda, no impresiones', 'Marca que se acumula'], b: ['Una frase que un comprador te repite. El resto del sitio conduce hasta ahí.', 'Contenido y canales diseñados para generar pipeline que de verdad puedes rastrear.', 'Un punto de vista publicado con constancia, para que el mercado te recuerde entre ciclos de compra.'] },
    growth: { title: 'Growth · Experimentos que se lanzan', description: 'Growth como sistema: experimentos, activación, retención y loops de lifecycle medidos en ingresos, no en métricas de vanidad.', eyebrow: 'Growth', h1: 'Experimentos que se lanzan.', lead: 'Activación, retención y loops de lifecycle, ejecutados cada semana y medidos en ingresos. Los loops que deciden si la adquisición llega a pagarse.', primaryCta: 'Ver el trabajo', secondaryCta: 'Reservar una llamada', statLabels: ['Experimentos', 'Activación y retención', 'Medido en ingresos'], s: ['Experimentos que se lanzan', 'Activación y retención', 'Lifecycle que se ejecuta solo'], b: ['Un backlog puntuado por impacto, ejecutado en cadencia semanal, medido en ingresos.', 'Los loops que deciden si la adquisición llega a pagarse. Encontrados, instrumentados, corregidos.', 'Mensajería conductual activada por triggers, gestionada por el sistema, no por una persona y una hoja de cálculo.'] },
  },
  pl: {
    gtm: { title: 'Systemy GTM · Pipeline, który się trzyma', description: 'GTM AI-native: CRM, outbound, paid i RevOps w jednym pipelinie, któremu możesz ufać.', eyebrow: 'GTM', h1: 'Pipeline, który się kumuluje. Nie cztery dashboardy.', lead: 'CRM, outbound i paid w jednym systemie. Jedno źródło prawdy, zbudowane i prowadzone aż pipeline się utrzyma.', primaryCta: 'Zobacz prace', secondaryCta: 'Umów rozmowę', statLabels: ['Pipeline i RevOps', 'Outbound, wzbogacony', 'Źródło prawdy'], s: ['Architektura pipeline\'u', 'RevOps i atrybucja', 'Outbound, który dociera'], b: ['CRM, outbound i paid jako jeden operating model. Jedno źródło prawdy zamiast czterech rozłącznych dashboardów.', 'Etapy lifecycle, routing i raportowanie, które pokazują dokładnie, gdzie urywa się sygnał.', 'Sekwencje i targetowanie na realnym sygnale ICP, wzbogacone i spersonalizowane AI. Nie spray.'] },
    marketing: { title: 'Marketing · Popyt, nie wyświetlenia', description: 'Marketing B2B budowany pod pipeline: pozycjonowanie, popyt i marka, które dociągniesz do przychodu.', eyebrow: 'Marketing', h1: 'Popyt, nie wyświetlenia.', lead: 'Pozycjonowanie, treści i marka zaprojektowane tak, by tworzyć śledzony pipeline. Zbudowane, żeby działać, nie żeby leżeć w decku.', primaryCta: 'Zobacz prace', secondaryCta: 'Umów rozmowę', statLabels: ['Pozycjonowanie', 'Treści i popyt', 'Marka'], s: ['Pozycjonowanie, które gryzie', 'Popyt, nie wyświetlenia', 'Marka, która się kumuluje'], b: ['Jedno zdanie, które kupujący powtarza tobie. Reszta strony do niego prowadzi.', 'Treści i kanały zaprojektowane tak, by tworzyć pipeline, który naprawdę da się śledzić.', 'Punkt widzenia publikowany konsekwentnie, żeby rynek pamiętał cię między cyklami zakupowymi.'] },
    growth: { title: 'Growth · Eksperymenty, które shipują', description: 'Growth jako system: eksperymenty, aktywacja, retencja i pętle lifecycle mierzone w przychodzie, nie w metrykach próżności.', eyebrow: 'Growth', h1: 'Eksperymenty, które shipują.', lead: 'Aktywacja, retencja i pętle lifecycle prowadzone co tydzień i mierzone w przychodzie. Pętle, które decydują, czy akwizycja kiedykolwiek się zwróci.', primaryCta: 'Zobacz prace', secondaryCta: 'Umów rozmowę', statLabels: ['Eksperymenty', 'Aktywacja i retencja', 'Mierzone w przychodzie'], s: ['Eksperymenty, które shipują', 'Aktywacja i retencja', 'Lifecycle, który działa sam'], b: ['Backlog oceniony po wpływie, prowadzony w tygodniowym rytmie, mierzony w przychodzie.', 'Pętle, które decydują, czy akwizycja się zwróci. Znalezione, oprzyrządowane, naprawione.', 'Wyzwalana, behawioralna komunikacja, którą posiada system, nie jedna osoba i arkusz.'] },
  },
};

const lensCopy = Object.fromEntries(
  localizedHomeList.map((locale) => {
    const built = (Object.keys(lensProse[locale.key]) as LensPageSlug[]).reduce((acc, slug) => {
      const p = lensProse[locale.key][slug];
      acc[slug] = {
        title: p.title,
        description: p.description,
        eyebrow: p.eyebrow,
        h1: p.h1,
        lead: p.lead,
        primaryCta: p.primaryCta,
        primaryHref: `/${locale.path}/work/`,
        secondaryCta: p.secondaryCta,
        secondaryHref: `/${locale.path}/contact/`,
        stats: lensStatValues[slug].map((value, i) => ({ value, label: p.statLabels[i] })),
        sections: p.s.map((title, i) => ({ title, body: p.b[i] })),
      };
      return acc;
    }, {} as Record<LensPageSlug, Omit<LocalizedPageCopy, 'locale' | 'slug'>>);
    return [locale.key, built];
  }),
) as Record<LocaleKey, Record<LensPageSlug, Omit<LocalizedPageCopy, 'locale' | 'slug'>>>;

const allCopy = Object.fromEntries(
  localizedHomeList.map((locale) => [locale.key, { ...pageCopy[locale.key], ...lensCopy[locale.key] }]),
) as Record<LocaleKey, Record<LocalizedPageSlug, Omit<LocalizedPageCopy, 'locale' | 'slug'>>>;

export const localizedPages: LocalizedPageCopy[] = localizedHomeList.flatMap((locale) =>
  localizedPageSlugs.map((slug) => ({
    locale: locale.key,
    slug,
    ...allCopy[locale.key][slug],
  })),
);

export function getLocalizedPage(locale: LocaleKey, slug: LocalizedPageSlug): LocalizedPageCopy {
  return {
    locale,
    slug,
    ...allCopy[locale][slug],
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
