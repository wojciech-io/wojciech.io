// Single source of truth for the site's locale codes.
//
// Before this file the list was declared independently in content.config.ts,
// data/locales.ts, data/cv.ts and astro.config.mjs, and the copies had already
// drifted once. Add or remove a locale HERE and only here; everything else
// derives from these two constants.
export const NON_EN_LOCALES = ['de', 'dk', 'no', 'jp', 'it', 'es', 'pl'] as const;
export const ALL_LOCALES = ['en', ...NON_EN_LOCALES] as const;

export type LocaleKey = (typeof NON_EN_LOCALES)[number];
export type SiteLocale = (typeof ALL_LOCALES)[number];
