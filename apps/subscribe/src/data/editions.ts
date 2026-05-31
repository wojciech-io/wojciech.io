/**
 * AI Espresso — recent issues.
 *
 * Curated from the sent editions (HTML lives outside the repo, in the Codex
 * automation workdir, so it cannot be read at build time). Keep newest first.
 * `tag` is a short topic label; `lead` is the issue's one-line standfirst.
 */
export interface Edition {
  /** ISO date the issue went out. */
  date: string;
  /** Short topic label, uppercased in the UI. */
  tag: string;
  /** Issue headline, as sent. */
  title: string;
  /** One-line standfirst. */
  lead: string;
}

export const editions: Edition[] = [
  {
    date: '2026-05-27',
    tag: 'Runtime',
    title: 'Trwały runtime dla agentów.',
    lead: 'Sygnały o agentach, narzędziach i automatyzacjach. Tylko to, co da się wdrożyć.',
  },
  {
    date: '2026-05-26',
    tag: 'MCP',
    title: 'MCP bez sesji.',
    lead: 'Stateless MCP wchodzi do stacku. Mniej stanu, więcej przewidywalności.',
  },
  {
    date: '2026-05-25',
    tag: 'Governance',
    title: 'Governance dla agentów.',
    lead: 'Polityki, uprawnienia i audyt obok modelu, nie zamiast niego.',
  },
  {
    date: '2026-05-24',
    tag: 'Security',
    title: 'Agenci za firewallem.',
    lead: 'Agent stack zamknięty w sieci firmy. Tak, żeby dało się to wdrożyć.',
  },
  {
    date: '2026-05-22',
    tag: 'Ops',
    title: 'Agent ops w terminalu.',
    lead: 'Krótko o modelach, narzędziach i operacji. Tak, żeby dało się to wdrożyć.',
  },
  {
    date: '2026-05-21',
    tag: 'MCP',
    title: 'MCP zamiast bety.',
    lead: 'MCP i agent hosty przechodzą z demo do operacji.',
  },
  {
    date: '2026-05-20',
    tag: 'Stack',
    title: 'Zaufanie i koszty w stacku.',
    lead: 'Rośnie znaczenie zaufania do treści, jakości SDK i przewidywalnych kosztów.',
  },
  {
    date: '2026-05-19',
    tag: 'Cost',
    title: 'Kontekst i koszty w ryzach.',
    lead: 'Agenci dostają lepszy kontekst, stabilniejsze sesje i twardsze zasady kosztu.',
  },
  {
    date: '2026-05-18',
    tag: 'Platform',
    title: 'Agenci przechodzą na platformę.',
    lead: 'Agent stack przenosi się z edytora do platformy, polityk i automatyzacji.',
  },
  {
    date: '2026-05-15',
    tag: 'Cost',
    title: 'Koszt agenta staje się policzalny.',
    lead: 'Jak mierzyć koszty agentów, bezpiecznie podpinać narzędzia i domykać governance.',
  },
];

/** Total issues sent to date (inbox shows a recent slice of this). */
export const totalIssues = 17;
