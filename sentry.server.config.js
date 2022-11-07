import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN || 'https://01a2b0593f2a4e599065cd789754c6e6@o1307493.ingest.sentry.io/6557123',
  tracesSampleRate: 0.5,
});
