import type { CollectionEntry } from 'astro:content';
import { insightSlug } from './insights';

type Post = CollectionEntry<'insights'>;

/**
 * The insights index used to have two shelves: model comparisons, which carry
 * the traffic (189 of 206 clicks in the 28 days to 28 September 2026), and
 * "playbooks", which was everything else. Everything else turned out to be two
 * different things. A dozen pieces about GTM and revenue systems that search
 * has never surfaced, and a smaller group about agents and coding tools that
 * is the part of the corpus closest to what people already search for.
 *
 * Folding both into one list buried the second group under the first. This
 * module names it so the index can give it its own band, ahead of the
 * playbooks and after the comparisons, in the order the demand runs.
 *
 * The list is explicit rather than tag-derived on purpose. Tags on this site
 * are free text ("Agents", "Claude Code", "MCP"), and a predicate over them
 * would quietly pull in a piece that only mentions a tool in passing. A slug
 * that is misspelled here fails the test in `clusters.test.ts` instead.
 */
export const AGENT_SLUGS: ReadonlySet<string> = new Set([
  'autonomous-ai-agents-compared',
  'claude-code-vs-codex',
  'claude-code-vs-clay',
  'claude-code-client-gtm',
  'ai-content-studio-approval-workflow',
  'ai-cmo-claude-skills-marketing-system',
  'gtm-ai-agent-four-layer-architecture-guide',
  'how-to-build-gtm-ai-agent-outbound-crm',
  'ai-production-stack',
]);

export function isAgentPiece(post: Post): boolean {
  return AGENT_SLUGS.has(insightSlug(post));
}
