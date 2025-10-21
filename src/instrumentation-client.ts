import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1,
  enableLogs: true,
  sendDefaultPii: false,
  integrations: [Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] })],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
