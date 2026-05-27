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
    "about": {
      title: 'Über Wojciech · AI-native GTM Operator',
      description: 'Profil von Wojciech Łuszczyński: GTM-Architekt, Wachstumsunternehmer und Entwickler von AI-native Umsatzsystemen für B2B-SaaS.',
      eyebrow: 'Profil',
      h1: 'GTM-Architektur, Growth Execution und AI-Systeme in einem Operator.',
      lead: 'Ich arbeite dort, wo Strategie, Daten, Tools und Umsetzung aufeinandertreffen. Mein Fokus liegt auf B2B-SaaS-Teams mit einem echten Produkt, aber ohne stabiles Revenue-System.',
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
      secondaryCta: 'Call buchen',
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
      primaryHref: '/de/insights/',
      secondaryCta: 'System besprechen',
      secondaryHref: '/de/contact/',
      stats: [
        { value: 'Agents', label: 'Research & GTM' },
        { value: 'MCP', label: 'Tool Orchestration' },
        { value: 'QA', label: 'Human-in-the-loop' },
      ],
      sections: [
        { title: 'Kontext zuerst', body: 'Gute AI-Systeme beginnen nicht mit Eingabeaufforderungen. Sie beginnen mit sauberen Daten, klaren Rollen, Beschränkungen und messbarer Qualität.' },
        { title: 'Operator-Workflows', body: 'Die besten Workflows sind klein genug, um zuverlässig zu laufen, und groß genug, um dem System echte Arbeit abzunehmen.' },
        { title: 'Bei Bedarf bauen', body: 'Wenn SaaS-Tools nicht passen, baue ich interne Tools oder Agenten, die direkt mit CRM, Content Ops und Analytics verbunden sind.' },
      ],
    },
    "contact": {
      title: 'Call buchen · GTM & AI Systems',
      description: '30-minütiger Anruf für GTM-Audits, AI-Workflow-Design, CRM-Architektur und Produkt-Scoping.',
      eyebrow: 'Kontakt',
      h1: 'Wenn das System feststeckt, reden wir ganz konkret.',
      lead: 'Schick Kontext, Stack und Bottleneck. Bei dem Anruf legen wir fest, ob der nächste Schritt ein Audit, ein Build Sprint oder eine konkrete Lösung ist.',
      primaryCta: '30 Minuten buchen',
      primaryHref: '/de/contact/#book-call',
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
      primaryHref: '/de/insights/',
      secondaryCta: 'Call buchen',
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
        { value: 'CRM', label: 'Indtægtsdækket virksomhed' },
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
      primaryHref: '/dk/insights/',
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
      primaryHref: '/dk/contact/#book-call',
      secondaryCta: 'Åbn LinkedIn',
      secondaryHref: 'https://www.linkedin.com/in/wojciech-luszczynski/',
      stats: [
        { value: '30m', label: 'Første opkald' },
        { value: '24h', label: 'Svartid' },
        { value: 'EU', label: 'Fjernbetjening først' },
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
      primaryHref: '/dk/insights/',
      secondaryCta: 'Book et opkald',
      secondaryHref: '/dk/contact/',
      stats: [
        { value: 'MDX', label: 'Komponenter' },
        { value: 'AI', label: 'Produktionsstakken' },
        { value: 'GTM', label: 'Bemærkninger til operatøren' },
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
        { value: 'CRM', label: 'Driftsinntekter' },
      ],
      sections: [
        { title: 'revenue-arkitektur', body: 'Pipeline, CRM, attribusjon og GTM motion behandles som ett system. Målet er en repeterbar driftsrytme, ikke et nytt dashbord.' },
        { title: 'AI-innfødt utførelse', body: 'Claude Code, MCP, automatisering og interne apper brukes der de virkelig gir resultater: research, CRM-hygiene, innholdsoperasjoner, salgsaktivering og rapportering.' },
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
      primaryHref: '/no/insights/',
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
      primaryHref: '/no/contact/#book-call',
      secondaryCta: 'Åpne LinkedIn',
      secondaryHref: 'https://www.linkedin.com/in/wojciech-luszczynski/',
      stats: [
        { value: '30m', label: 'Første samtale' },
        { value: '24h', label: 'Svartid' },
        { value: 'EU', label: 'Fjernstyrt først' },
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
      primaryHref: '/no/insights/',
      secondaryCta: 'Bestill en samtale',
      secondaryHref: '/no/contact/',
      stats: [
        { value: 'MDX', label: 'Komponenter' },
        { value: 'AI', label: 'Produksjonsstabel' },
        { value: 'GTM', label: 'Notater fra operatøren' },
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
      h1: 'GTMアーキテクチャー、グロースエグゼキューション、AIシステムが1つのオペレーターに。',
      lead: '私は、戦略、データ、ツール、実行が出会う場所で働いています。製品はあるが安定したRevenue systemを持たないB2B SaaSチームにフォーカスしています。',
      primaryCta: '実績を見る',
      primaryHref: '/jp/work/',
      secondaryCta: '相談を予約',
      secondaryHref: '/jp/contact/',
      stats: [
        { value: '20', label: 'マーケティング＆デジタル' },
        { value: '10', label: '年 B2B SaaS' },
        { value: '10', label: '年 GTM' },
      ],
      sections: [
        { title: '私の仕事', body: '私はまずシステムを診断する：ICP、パイプライン、CRM、アトリビューション、コンテンツ、有料獲得、オートメーション。そして、不足している部分を、最も早く運用を明確にすることができる順番で構築していく。' },
        { title: '私が提供するもの', body: '孤立した戦術ではない。プロセス、ダッシュボード、シーケンス、自動化、AIワークフロー、そして明確なオーナーシップ。' },
        { title: '誰のために', body: 'B2B SaaS、テクノロジー企業、創業者チームは、GTMをツールのカオスにすることなく、より迅速な構築を望んでいる。' },
      ],
    },
    "work": {
      title: 'GTMシステム＆ケーススタディ',
      description: '厳選されたシステムAIネイティブGTM、CRM、オートメーション、コンテンツ、有料獲得、社内ツール。',
      eyebrow: '仕事',
      h1: '厳選されたRevenue system、製品、オペレーティング・モデル。',
      lead: '明確な問題、測定可能なアーキテクチャー、迅速な実行、長持ちするインフラストラクチャー。',
      primaryCta: 'AIシステムを見る',
      primaryHref: '/jp/ai-systems/',
      secondaryCta: '相談を予約',
      secondaryHref: '/jp/contact/',
      stats: [
        { value: 'B2B', label: 'SaaSとテクノロジー' },
        { value: 'AI', label: 'ワークフローとエージェント' },
        { value: 'CRM', label: '収益事業' },
      ],
      sections: [
        { title: 'Revenue architecture', body: 'パイプライン、CRM、アトリビューション、GTMの動きは一つのシステムとして扱われる。目標は、ダッシュボードではなく、再現可能な営業リズムである。' },
        { title: 'AIネイティブの実行', body: 'クロード・コード、MCP、オートメーション、社内アプリは、リサーチ、CRMの衛生管理、コンテンツ運用、営業支援、レポーティングなど、実際に活用できる場所で使用されている。' },
        { title: '証明としての製品', body: 'エコシステム内の製品は、オペレーター主導のシステムがいかに速く構築、テスト、出荷できるかを示している。' },
      ],
    },
    "ai-systems": {
      title: 'AIシステム - ワークフロー、エージェント、レバレッジ',
      description: 'AIネイティブなワークフロー、GTMエージェント、マーケティング、セールス、オペレーションの自動化。',
      eyebrow: 'AIシステム',
      h1: 'AIはアドオンではない。新しいオペレーティング・レイヤーなのだ。',
      lead: 'データ、コンテキスト、ルール、QA、そして人間への明確なハンドオフ。',
      primaryCta: '洞察力を読む',
      primaryHref: '/jp/insights/',
      secondaryCta: 'システムについて話し合う',
      secondaryHref: '/jp/contact/',
      stats: [
        { value: 'Agents', label: 'Research & GTM' },
        { value: 'MCP', label: 'ツール・オーケストレーション' },
        { value: 'QA', label: 'ヒューマン・イン・ザ・ループ' },
      ],
      sections: [
        { title: 'コンテクスト・ファースト', body: '優れたAIシステムは、プロンプトから始まるのではない。クリーンなデータ、明確な役割、制約、測定可能な品質から始まる。' },
        { title: 'オペレーター・ワークフロー', body: '最良のワークフローは、確実に実行するには十分小さく、システムから実際の作業を取り除くには十分大きい。' },
        { title: '必要なときに作る', body: 'SaaSツールが合わない場合は、CRM、コンテンツ運用、アナリティクスに直接接続する内部ツールやエージェントを構築する。' },
      ],
    },
    "contact": {
      title: '電話予約 - GTM & AIシステム',
      description: 'GTM監査、AIワークフロー設計、CRMアーキテクチャ、製品スコーピングのための30分の通話。',
      eyebrow: '連絡先',
      h1: 'システムが行き詰まったとき、私たちは具体的な話をする。',
      lead: 'コンテキスト、スタック、ボトルネックを送信する。電話では、次のステップが監査なのか、ビルドスプリントなのか、それとも具体的な修正なのかを決定する。',
      primaryCta: '予約 30分',
      primaryHref: '/jp/contact/#book-call',
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
        { title: '合わないもの', body: 'オーナーのいない緩やかなアイデア出し、GTMのコンテクストのない純粋なツールの導入、明確なデータとアクセスガバナンスのないプロジェクト。' },
      ],
    },
    "insights": {
      title: 'AI & GTM Insights · Operator Notes',
      description: 'AIシステム、GTMアーキテクチャ、Revenue systemに関する実践的なメモ。',
      eyebrow: 'Insights',
      h1: 'AI、GTM、Revenue architectureーに関するオペレーターの注意事項。',
      lead: '記事には、実際に構築され運用されているシステムのアーキテクチャ、決定事項、教訓が示されている。',
      primaryCta: 'すべての記事を見る',
      primaryHref: '/jp/insights/',
      secondaryCta: '相談を予約',
      secondaryHref: '/jp/contact/',
      stats: [
        { value: 'MDX', label: 'コンポーネント' },
        { value: 'AI', label: '生産スタック' },
        { value: 'GTM', label: 'オペレーターメモ' },
      ],
      sections: [
        { title: '見つけたもの', body: 'ビルド対バイの決断、CRMファーストのAI採用、GTM作業におけるクロード・コード、そして実際の生産スタックの選択。' },
        { title: '記事の書き方', body: 'ソート・リーダーシップのパッケージはない。各ノートは、システム、決定、または業務上の教訓を説明している。' },
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
      primaryHref: '/it/insights/',
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
      primaryHref: '/it/contact/#book-call',
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
      primaryHref: '/it/insights/',
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
      primaryHref: '/es/insights/',
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
      primaryHref: '/es/contact/#book-call',
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
      primaryHref: '/es/insights/',
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
