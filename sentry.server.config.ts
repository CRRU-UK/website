import * as Sentry from "@sentry/nextjs";

import { SENTRY_DATA_COLLECTION } from "@/helpers/constants";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1,
  dataCollection: SENTRY_DATA_COLLECTION,
  integrations: [Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] })],
});
