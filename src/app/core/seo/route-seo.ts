import { inject, provideAppInitializer } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { PageSeo, SeoService } from './seo.service';

/** Static pages declare their metadata as route data; slug pages call SeoService themselves. */
export type RouteSeoData = Omit<PageSeo, 'path'>;

function deepestChild(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
  let route = snapshot;
  while (route.firstChild) route = route.firstChild;
  return route;
}

/** Applies `data.seo` from the active route after every navigation, including prerender. */
export function provideRouteSeo() {
  return provideAppInitializer(() => {
    const router = inject(Router);
    const seo = inject(SeoService);

    router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      const route = deepestChild(router.routerState.snapshot.root);
      const data = route.data['seo'] as RouteSeoData | undefined;
      if (!data) return;
      seo.update({ ...data, path: event.urlAfterRedirects.split(/[?#]/)[0] });
    });
  });
}
