// The part of the Sentry setup that costs bytes. sentry.client.config.js loads this file after the page
// has finished loading. It imports the SDK statically on purpose: a dynamic import of the whole package
// keeps every export (about 138 KB over the wire) while a static one keeps only what is used (about 53 KB).
import * as Sentry from '@sentry/astro';

export function start() {
  Sentry.init({
    dsn: 'https://eeed3e8af9a62f73f7ae309873dddc50@o4511411558678528.ingest.de.sentry.io/4511411564314704',
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}

export const capture = Sentry.captureException;
