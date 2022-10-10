import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';

if (environment.production) {
  Sentry.init({
    dsn: environment.sentryDsn,
    integrations: [
      new BrowserTracing({
        tracingOrigins: [environment.sentryTracingUrl],
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],
    tracesSampleRate: 0.2,
  });

  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
