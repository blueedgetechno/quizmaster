// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://dcf7564c88f7767c151b10c33fb6e128@o4508117103476736.ingest.us.sentry.io/4508117203419136',

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
})
