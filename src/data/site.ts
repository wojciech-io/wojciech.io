export const SITE = {
  name:        'Wojciech Luszczynski',
  nameDisplay: 'Wojciech Łuszczyński',
  tagline:     'GTM Architect · Growth Operator · AI-native Revenue Systems',
  bio:         'I build growth systems for B2B SaaS companies that have a real product but not yet a reliable revenue engine: connecting GTM, marketing, CRM, automation and AI into one operating model.',
  email:       'hello@wojciech.io',

  url:         'https://wojciech.io',
  appUrl:      'https://app.wojciech.io',
  subscribeUrl:'https://subscribe.wojciech.io',
  notchUrl:    'https://notch.wojciech.io',

  linkedin:    'https://www.linkedin.com/in/wojciech-luszczynski/',
  linkedinHandle: 'wojciech-luszczynski',
  github:      'https://github.com/wojciechluszczynski',
  githubHandle:'wojciechluszczynski',
  twitter:     'https://twitter.com/w_luszczynski',
  twitterHandle:'w_luszczynski',
  substack:    'https://substack.com/@wojciechluszczynski',
  medium:      'https://medium.com/@wluszczynski',

  ogImage:     '/og-default.png',
  locale:      'en_US',
} as const;

/** Cal.com booking link ("user/event-slug"). Single source of truth for the
 *  inline calendar on /contact and every popup trigger across the site. */
export const CAL_BOOKING_LINK = 'wojciech-luszczynski/30-minutes';

/** The name as a visitor should read it: Polish diacritics on Polish pages
 *  only, the Latin spelling everywhere else (titles, nav, schema, captions). */
export function personName(locale?: string | null): string {
  return locale === 'pl' ? SITE.nameDisplay : SITE.name;
}
