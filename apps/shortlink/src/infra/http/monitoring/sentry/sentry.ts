import * as Sentry from '@sentry/nestjs'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

export async function connectToSentry(DNS: string) {
  // Ensure to call this before requiring any other modules!
  Sentry.init({
    dsn: DNS,
    integrations: [
      // Add our Profiling integration
      nodeProfilingIntegration(),
    ],

    // Add Tracing by setting tracesSampleRate
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Set sampling rate for profiling
    // This is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  })
}
