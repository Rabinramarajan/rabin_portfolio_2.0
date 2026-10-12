import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay, withIncrementalHydration } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideRouteSeo } from './core/seo/route-seo';
import { provideMediaImages } from './core/images/image-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideRouteSeo(),
    provideMediaImages(),
  ],
};
