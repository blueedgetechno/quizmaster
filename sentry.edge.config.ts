// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://dcf7564c88f7767c151b10c33fb6e128@o4508117103476736.ingest.us.sentry.io/4508117203419136',

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
})
