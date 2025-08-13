// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/graphql',
  uploadUrl: 'http://localhost:3000/upload',
  webUrl: 'http://localhost:4200/',
  // storageUrl: 'https://plezanje.net/storage',
  storageUrl: 'assets', // TODO: this is a test
  storageKeyPrefix: 'plezanje-local-1',
  sentryDsn:
    'https://a6bd493f5c044c419cadb227cfe067f6@o1179288.ingest.sentry.io/6291581',
  sentryTracingUrl: 'https://plezanje.net/graphql',
  guidebookScanURL:
    'https://n8n-kkcc40kwskwcgkk4gokkkgos.ademsar.eu/webhook/ab7371f8-7b31-40c4-ac53-b1db3e292ed4',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
