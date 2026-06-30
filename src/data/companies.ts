// Real brand marks for the "where I've operated" strip. Rendered as a uniform
// monochrome silhouette in BrandLogos.astro, so mixed source colours read as one
// set in both themes.
//
// Ordered by category, then alphabetically within each category, so the strip
// reads as an intentional portfolio rather than a random pile: B2B SaaS & tech
// first, then commerce & consumer, then media & publishing.
export interface CompanyLogo {
  name: string;
  /** Grouping key. Drives order; available if the strip ever renders sections. */
  category: 'SaaS & tech' | 'Commerce & consumer' | 'Media & publishing';
  src: string;
}

export const companyLogos: CompanyLogo[] = [
  // B2B SaaS & tech
  { name: 'CodiLime', category: 'SaaS & tech', src: '/images/logos/codilime.svg' },
  { name: 'GetResponse', category: 'SaaS & tech', src: '/images/logos/getresponse.svg' },
  { name: 'SentiOne', category: 'SaaS & tech', src: '/images/logos/sentione.png' },
  { name: 'Symfonia', category: 'SaaS & tech', src: '/images/logos/symfonia.webp' },
  { name: 'WebWave', category: 'SaaS & tech', src: '/images/logos/webwave.svg' },

  // Commerce & consumer
  { name: 'Gi Group', category: 'Commerce & consumer', src: '/images/logos/gigroup.png' },
  { name: 'iviSkin', category: 'Commerce & consumer', src: '/images/logos/iviskin.png' },
  { name: 'Neatsvor', category: 'Commerce & consumer', src: '/images/logos/neatsvor.png' },

  // Media & publishing
  { name: 'Cosmopolitan', category: 'Media & publishing', src: '/images/logos/cosmopolitan.svg' },
  { name: 'Esquire', category: 'Media & publishing', src: '/images/logos/esquire.svg' },
  { name: "Harper's Bazaar", category: 'Media & publishing', src: '/images/logos/harpersbazaar.svg' },
  { name: 'Joy', category: 'Media & publishing', src: '/images/logos/joy.png' },
  { name: 'Playboy', category: 'Media & publishing', src: '/images/logos/playboy.svg' },
];
