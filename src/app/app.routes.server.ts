import { RenderMode, ServerRoute } from '@angular/ssr';
import { projects } from './data/projects';
import { serviceRoutes } from './data/service-routes';
import { insights, isPublished } from './data/insights';

/**
 * Everything is prerendered to static HTML at build time (outputMode: "static"),
 * so crawlers and social previews get full content and per-page metadata.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'work/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => projects.map((project) => ({ slug: project.slug })),
  },
  {
    path: 'services/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => serviceRoutes.map((route) => ({ slug: route.slug })),
  },
  {
    path: 'insights/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      insights.filter((insight) => isPublished(insight)).map((insight) => ({ slug: insight.id })),
  },
  // Rendered once as /404/index.html; the build copies it to /404.html for Cloudflare.
  { path: '404', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Prerender },
];
