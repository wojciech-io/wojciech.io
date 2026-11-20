// Lead magnets: checklists, schemas and sheets that sit under /resources/<slug>/.
// One data file feeds the page template (src/pages/resources/[slug].astro), the
// /resources/ index cards and the tests, so copy and file lists cannot drift.
//
// Rules (docs/10-tone-of-voice.md, plan of 2026-11-20):
// - Only fictional data. No client names, no results quoted as outcomes.
// - Exactly one call to action per page: the booking link. The sign-up form is
//   the gate for a download, not a second call to action.
// - `gated: true` shows the AI Espresso sign-up first and reveals the files after
//   it succeeds. This is a soft gate: the files are static and their URLs are
//   public. A hard gate needs the mailing app to deliver the file after the
//   double opt-in confirmation.

export interface MagnetFile {
  /** Path under /public, served as-is. */
  href: string;
  label: string;
  /** Short description of what is inside. */
  note: string;
}

export interface LeadMagnet {
  slug: string;
  title: string;
  /** One or two sentences. The answer comes before the description. */
  inShort: string;
  /** Four to six points on what the reader gets. */
  gets: string[];
  files: MagnetFile[];
  gated: boolean;
  /** Extra block above the call to action. Omitted on pages without an offer. */
  offer?: { heading: string; body: string };
  cta: { heading: string; button: string };
  meta: { title: string; description: string };
  /** Short label for the /resources/ card. */
  card: { description: string; tags: string[]; label: string };
}

export const LEAD_MAGNETS: LeadMagnet[] = [
  {
    slug: 'form-to-crm-handoff-audit',
    title: 'Form-to-CRM handoff audit',
    inShort:
      'A 15-point checklist and a test-submission sheet that show whether a website enquiry reaches your CRM with its source, an owner and a response clock. Run it on one form in an afternoon.',
    gets: [
      'A 15-point checklist grouped into fields, source and UTM, owner, SLA, record and test, each with a pass condition and what a failure looks like.',
      'Four points marked as stop points, because a failure there means leads can go missing. You know what to fix first.',
      'A test-submission sheet with one row per test, including the fields most setups skip: first-touch UTM, consent, measured time to owner notice, event count.',
      'Test scenarios aimed at the weak spots: a repeat visitor with no UTM, a lead that no routing rule matches, a very long message.',
      'Example rows on fictional data, so you see what a filled sheet looks like before you start.',
    ],
    files: [
      {
        href: '/downloads/form-to-crm-handoff-audit/form-to-crm-handoff-audit-checklist.md',
        label: 'Checklist',
        note: '15 points, stop rule, scoring, sheet columns (Markdown)',
      },
      {
        href: '/downloads/form-to-crm-handoff-audit/test-submission-sheet.csv',
        label: 'Test-submission sheet',
        note: 'One row per test, with fictional example rows (CSV)',
      },
    ],
    gated: true,
    offer: {
      heading: 'Audit in a week',
      body: 'Want this done for you? In five working days I test every form on your site into your CRM, rank what breaks and write the routing rule down. Fixed scope, read-only.',
    },
    cta: {
      heading: 'Want me to run this on your stack in a week?',
      button: 'Book a call',
    },
    meta: {
      title: 'Form-to-CRM handoff audit: 15-point checklist',
      description:
        'A 15-point checklist and test-submission sheet to check that a website form reaches your CRM with its source, owner and response clock.',
    },
    card: {
      description:
        'A 15-point checklist and a test-submission sheet that show whether a website enquiry reaches your CRM with its source, an owner and a response clock.',
      tags: ['RevOps', 'CRM', 'Forms', 'Checklist'],
      label: 'Get the audit',
    },
  },
  {
    slug: 'review-gate-for-ai-crm-writes',
    title: 'Review gate for AI that writes to your CRM',
    inShort:
      'Ten rules, a write-proposal schema and an evaluator prompt that keep an AI step from changing your CRM until a person has approved one specific version. Built for agents that draft lead and meeting updates.',
    gets: [
      'One page of ten rules. They cover the single write boundary, evidence for every field, approval tied to a revision and a write that is safe to repeat.',
      'A JSON Schema for the proposal. It rejects a field with a value and no evidence, and an "observed" claim that came from the seller.',
      'A valid example proposal on a fictional enquiry, including the gaps and the questions that fill them.',
      'An evaluator prompt that grades a proposal against its source and reports any instruction hidden in the source text.',
      'A table of the checks your write service should run in code, and a layered test plan that starts with scripted tests and ends with a reviewed pilot.',
    ],
    files: [
      {
        href: '/downloads/review-gate-for-ai-crm-writes/review-gate-rules.md',
        label: 'Rules and test plan',
        note: 'Ten rules, write-boundary checks, layered evaluation (Markdown)',
      },
      {
        href: '/downloads/review-gate-for-ai-crm-writes/write-proposal.schema.json',
        label: 'Write-proposal schema',
        note: 'JSON Schema, draft 2020-12',
      },
      {
        href: '/downloads/review-gate-for-ai-crm-writes/example-proposal.json',
        label: 'Example proposal',
        note: 'A valid proposal on a fictional enquiry',
      },
      {
        href: '/downloads/review-gate-for-ai-crm-writes/evaluator-prompt.md',
        label: 'Evaluator prompt',
        note: 'Grades a proposal against its source',
      },
    ],
    // Schema and prompt are public on purpose: models can cite them, and the
    // sign-up gate is kept for checklists and workbooks.
    gated: false,
    offer: {
      heading: 'Audit in a week',
      body: 'Have an AI step that drafts CRM updates? In five working days I test its write boundary, evidence handling and approvals against ambiguous inputs, and give you a ranked list of gaps. Fixed scope, read-only.',
    },
    cta: {
      heading: 'Want me to audit your AI step in a week?',
      button: 'Book a call',
    },
    meta: {
      title: 'Review gate for AI that writes to your CRM',
      description:
        'Ten rules, a write-proposal schema and an evaluator prompt that put a person between an AI draft and a CRM update.',
    },
    card: {
      description:
        'Ten rules, a write-proposal schema and an evaluator prompt that keep an AI step from changing your CRM until a person has approved one version.',
      tags: ['AI agents', 'CRM', 'Schema', 'Prompt'],
      label: 'Open the kit',
    },
  },
  {
    slug: 'ai-search-visibility-test-set',
    title: 'AI search visibility test set',
    inShort:
      'A sheet of 30 repeatable buyer questions and a counting method that tell you whether AI answers cite a correct page on your site, and whether that turns into visits. Run it monthly and change one thing at a time.',
    gets: [
      '30 question templates in six clusters (problem, category, how-to, evaluation, comparison, brand), so a gain in one intent cannot hide a loss in another.',
      'Definitions for a run, a mention, a usable link, a correct citation and a correct answer, so two people count the same way.',
      'A method that sets AI citations next to the visits and next steps your analytics already measures, without treating one as the other.',
      'A monthly run log and summary sheet with example rows on a fictional company.',
      'A table that maps what you see to the first thing to check. Causes covered include an unclear page, a fact buried too low, a missing comparison page and a public URL that cannot be fetched.',
    ],
    files: [
      {
        href: '/downloads/ai-search-visibility-test-set/ai-search-visibility-method.md',
        label: 'Method',
        note: 'Question clusters, definitions, counting, visits (Markdown)',
      },
      {
        href: '/downloads/ai-search-visibility-test-set/test-set-30-questions.csv',
        label: '30-question sheet',
        note: 'Templates with fictional filled examples (CSV)',
      },
      {
        href: '/downloads/ai-search-visibility-test-set/monthly-run-log-template.csv',
        label: 'Monthly run log',
        note: 'One row per run (CSV)',
      },
      {
        href: '/downloads/ai-search-visibility-test-set/monthly-summary-template.csv',
        label: 'Monthly summary',
        note: 'One row per engine per month (CSV)',
      },
    ],
    gated: true,
    cta: {
      heading: 'Want me to run this on your pages?',
      button: 'Book a call',
    },
    meta: {
      title: 'AI search visibility test set: 30 questions and a method',
      description:
        'A 30-question sheet, counting method and monthly log to check whether AI answers cite a correct page on your site.',
    },
    card: {
      description:
        'A sheet of 30 repeatable buyer questions and a counting method for AI citations and the visits they bring.',
      tags: ['AI search', 'GEO', 'SEO', 'Workbook'],
      label: 'Get the test set',
    },
  },
];

export function getMagnet(slug: string): LeadMagnet | undefined {
  return LEAD_MAGNETS.find((m) => m.slug === slug);
}
