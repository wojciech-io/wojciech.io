// Explicit ICP-fit scoring rules. v1: hard-coded weights. Recalculated on every
// upsert from the CRM adapter. No client data inherited from prior tool.
//
// Total score = round(0.6 * icp + 0.4 * behaviour).
// Range 0-100 each.

export interface ScoringInput {
  industry: string | null;
  company_size: string | null;
  role: string | null;
  source: string | null;
  // Optional behaviour signals (set when we have them)
  visited_pricing?: boolean;
  visited_demo_request?: boolean;
  episodes_listened?: number;
}

const ICP_INDUSTRY: Record<string, number> = {
  'B2B SaaS': 25,
  'Fintech': 20,
  'DevTools': 22,
  'MarTech': 18,
  'Cybersecurity': 16,
  'AI / ML': 18,
};

const ICP_SIZE: Record<string, number> = {
  '10-50': 12,
  '20-50': 14,
  '50-200': 22,
  '200-500': 18,
  '500+': 10,
};

const ICP_ROLE: Record<string, number> = {
  'Head of Growth': 22,
  'VP Marketing': 22,
  'CMO': 22,
  'Head of Demand Gen': 20,
  'Growth Lead': 18,
  'Marketing Lead': 14,
  'Founder': 16,
};

const SOURCE_BEHAVIOUR: Record<string, number> = {
  'demo-request': 40,
  'inbound-form': 28,
  'newsletter': 14,
  'manual': 0,
};

export function scoreLead(input: ScoringInput): { icp: number; behaviour: number; total: number } {
  const icp = Math.min(100,
    (ICP_INDUSTRY[input.industry || ''] || 0) +
    (ICP_SIZE[input.company_size || ''] || 0) +
    (ICP_ROLE[input.role || ''] || 0)
  );
  let behaviour = SOURCE_BEHAVIOUR[input.source || ''] || 0;
  if (input.visited_pricing) behaviour += 15;
  if (input.visited_demo_request) behaviour += 20;
  if (input.episodes_listened) behaviour += Math.min(25, input.episodes_listened * 5);
  behaviour = Math.min(100, behaviour);
  const total = Math.round(0.6 * icp + 0.4 * behaviour);
  return { icp, behaviour, total };
}
