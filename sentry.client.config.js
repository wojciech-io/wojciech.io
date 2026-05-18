import * as Sentry from '@sentry/astro';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://eeed3e8af9a62f73f7ae309873dddc50@o4511411558678528.ingest.de.sentry.io/4511411564314704',
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}
