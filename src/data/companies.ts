// Real brand marks for the "where I've operated" strip. Rendered as a uniform
// monochrome silhouette in BrandLogos.astro, so mixed source colours read as one
// set in both themes. Order roughly follows recency / recognisability.
export interface CompanyLogo {
  name: string;
  src: string;
}

export const companyLogos: CompanyLogo[] = [
  { name: 'CodiLime', src: '/images/logos/codilime.svg' },
  { name: 'WebWave', src: '/images/logos/webwave.svg' },
  { name: 'Symfonia', src: '/images/logos/symfonia.webp' },
  { name: 'SentiOne', src: '/images/logos/sentione.png' },
  { name: 'GetResponse', src: '/images/logos/getresponse.svg' },
  { name: 'Gi Group', src: '/images/logos/gigroup.png' },
  { name: 'Tekhuset', src: '/images/logos/tekhuset.png' },
  { name: 'Marquard', src: '/images/logos/marquard.svg' },
  { name: 'Lilla House', src: '/images/logos/lillahouse.svg' },
];
