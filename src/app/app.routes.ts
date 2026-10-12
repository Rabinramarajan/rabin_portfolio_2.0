import { ResolveFn, Route, Routes } from '@angular/router';
import { RouteSeoData } from './core/seo/route-seo';
import { defaultSeo } from './data/profile';
import {
  breadcrumbJsonLd,
  caseStudyJsonLd,
  contactPageJsonLd,
  personJsonLd,
  profilePageJsonLd,
  serviceJsonLd,
  websiteJsonLd,
} from './core/seo/json-ld';

const NOT_FOUND_SEO: RouteSeoData = {
  title: 'Page not found',
  description: 'This page does not exist. Browse selected work, services and engineering insights instead.',
  noindex: true,
};

// Resolvers import content lazily so case studies, articles and legal copy stay out of the initial bundle.

const projectSeo: ResolveFn<RouteSeoData> = async (route) => {
  const { getProject } = await import('./data/projects');
  const project = getProject(route.paramMap.get('slug') ?? '');
  if (!project) return NOT_FOUND_SEO;
  const path = `/work/${project.slug}`;
  return {
    title: project.seo.title,
    description: project.seo.description,
    type: 'article',
    image: project.cover?.src,
    jsonLd: [
      caseStudyJsonLd({
        name: project.title,
        description: project.seo.description,
        path,
        image: project.cover?.src,
        year: project.year,
        technologies: project.technologies,
      }),
      breadcrumbJsonLd([{ name: 'Work', path: '/work' }, { name: project.title, path }]),
    ],
  };
};

const serviceSeo: ResolveFn<RouteSeoData> = async (route) => {
  const { getServiceRoute } = await import('./data/service-routes');
  const service = getServiceRoute(route.paramMap.get('slug') ?? '');
  if (!service) return NOT_FOUND_SEO;
  const path = `/services/${service.slug}`;
  return {
    title: service.title,
    description: service.description,
    image: service.service.image.src,
    jsonLd: [
      serviceJsonLd({
        name: service.title,
        description: service.description,
        path,
        image: service.service.image.src,
        serviceType: service.service.title,
      }),
      breadcrumbJsonLd([{ name: 'Services', path: '/services' }, { name: service.title, path }]),
    ],
  };
};

const insightSeo: ResolveFn<RouteSeoData> = async (route) => {
  const { getInsight, insightJsonLd } = await import('./features/insights/insight-utils');
  const insight = getInsight(route.paramMap.get('slug') ?? '');
  if (!insight) return NOT_FOUND_SEO;
  return {
    title: insight.seoTitle ?? insight.title ?? 'Insight',
    description: insight.seoDescription ?? insight.dek ?? '',
    type: 'article',
    publishedTime: insight.datePublished,
    modifiedTime: insight.dateModified ?? insight.datePublished,
    image: insight.cover?.src,
    jsonLd: [
      insightJsonLd(insight),
      breadcrumbJsonLd([
        { name: 'Insights', path: '/insights' },
        { name: insight.title ?? 'Insight', path: `/insights/${insight.id}` },
      ]),
    ],
  };
};

type LegalId = 'privacy' | 'terms';

function legalRoute(id: LegalId): Route {
  const load = () => import('./data/legal').then((m) => m[id]);
  return {
    path: id,
    loadComponent: () => import('./features/legal/legal-page').then((m) => m.LegalPage),
    resolve: {
      document: load,
      seo: async (): Promise<RouteSeoData> => {
        const doc = await load();
        return { title: doc.title, description: doc.description };
      },
    },
  };
}

/**
 * Every path the live site has indexed is kept exactly, so rankings and inbound
 * links survive the rewrite. All routes are prerendered (see app.routes.server.ts).
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    data: {
      seo: {
        title: defaultSeo.title,
        description: defaultSeo.description,
        jsonLd: [personJsonLd(), websiteJsonLd()],
      } satisfies RouteSeoData,
    },
  },
  {
    path: 'work',
    loadComponent: () => import('./features/projects/work-page').then((m) => m.WorkPage),
    data: {
      seo: {
        title: 'Angular Case Studies — Enterprise Work',
        description:
          'Angular and enterprise work by Rabin R — Fiji immigration platforms, the PRIMS pension portal, the VNPF mobile app and insurance consoles.',
        jsonLd: breadcrumbJsonLd([{ name: 'Work', path: '/work' }]),
      } satisfies RouteSeoData,
    },
  },
  {
    path: 'work/:slug',
    loadComponent: () => import('./features/projects/project-detail/project-detail').then((m) => m.ProjectDetail),
    resolve: { seo: projectSeo },
  },
  {
    path: 'services',
    loadComponent: () => import('./features/services/services-page').then((m) => m.ServicesPage),
    data: {
      seo: {
        title: 'Angular & Frontend Engineering Services',
        description:
          'Four services: Angular engineering, frontend architecture, performance optimization and Ionic cross-platform mobile — for enterprise and government products.',
        jsonLd: breadcrumbJsonLd([{ name: 'Services', path: '/services' }]),
      } satisfies RouteSeoData,
    },
  },
  {
    path: 'services/:slug',
    loadComponent: () => import('./features/services/service-detail/service-detail').then((m) => m.ServiceDetail),
    resolve: { seo: serviceSeo },
  },
  {
    path: 'insights',
    loadComponent: () => import('./features/insights/insights-page').then((m) => m.InsightsPage),
    data: {
      seo: {
        title: 'Insights — Angular Engineering Notes',
        description:
          'Engineering notes from Rabin R on Angular architecture, Signals, rendering performance and quiet interfaces — positions taken from shipped production work.',
        jsonLd: breadcrumbJsonLd([{ name: 'Insights', path: '/insights' }]),
      } satisfies RouteSeoData,
    },
  },
  {
    path: 'insights/:slug',
    loadComponent: () => import('./features/insights/article/article-page').then((m) => m.ArticlePage),
    resolve: { seo: insightSeo },
  },
  {
    path: 'experience',
    loadComponent: () => import('./features/experience/experience-page').then((m) => m.ExperiencePage),
    data: {
      seo: {
        title: 'Experience — Angular & Frontend Roles',
        description:
          "Rabin R's frontend engineering experience — from 2021 to Angular architecture in 2026, across government, pension and insurance in three countries.",
        jsonLd: breadcrumbJsonLd([{ name: 'Experience', path: '/experience' }]),
      } satisfies RouteSeoData,
    },
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about-page').then((m) => m.AboutPage),
    data: {
      seo: {
        title: 'About — Frontend Angular Consultant',
        description:
          'Frontend Angular consultant in Chennai — 4+ years across government, pension, insurance and healthcare platforms in three countries.',
        jsonLd: [profilePageJsonLd(), breadcrumbJsonLd([{ name: 'About', path: '/about' }])],
      } satisfies RouteSeoData,
    },
  },
  {
    path: 'process',
    loadComponent: () => import('./features/process/process-page').then((m) => m.ProcessPage),
    data: {
      seo: {
        title: 'Process — How an Engagement Runs',
        description:
          'How Rabin R runs an engagement — discover, define, design, build, test, launch and evolve — so frontend work stays predictable from first call to production.',
        jsonLd: breadcrumbJsonLd([{ name: 'Process', path: '/process' }]),
      } satisfies RouteSeoData,
    },
  },
  {
    path: 'pricing',
    loadComponent: () => import('./features/pricing/pricing-page').then((m) => m.PricingPage),
    data: {
      seo: {
        title: 'Engagement Models & Pricing',
        description:
          'Indicative INR engagement models for Angular and frontend work with Rabin R — project, retainer and consulting shapes, and what each one includes.',
        jsonLd: breadcrumbJsonLd([{ name: 'Pricing', path: '/pricing' }]),
      } satisfies RouteSeoData,
    },
  },
  {
    path: 'resume',
    loadComponent: () => import('./features/resume/resume-page').then((m) => m.ResumePage),
    data: {
      seo: {
        title: 'Resume — Frontend Angular Consultant',
        description:
          'Resume of Rabin R — Frontend Angular Consultant in Chennai, India, with roles, responsibilities, delivered projects and the full technology stack.',
        jsonLd: breadcrumbJsonLd([{ name: 'Résumé', path: '/resume' }]),
      } satisfies RouteSeoData,
    },
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact-page').then((m) => m.ContactPage),
    data: {
      seo: {
        title: 'Contact — Angular Consulting Enquiries',
        description:
          "Ready to collaborate? Reach out with your project ideas, challenges, or opportunities. Let's create something impactful together.",
        jsonLd: [contactPageJsonLd(), breadcrumbJsonLd([{ name: 'Contact', path: '/contact' }])],
      } satisfies RouteSeoData,
    },
  },
  legalRoute('privacy'),
  legalRoute('terms'),
  // Paths that only ever existed on this Angular branch, never on the indexed site
  { path: 'projects', redirectTo: 'work', pathMatch: 'full' },
  { path: 'skills', redirectTo: '/', pathMatch: 'full' },
  {
    path: '404',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
    data: { seo: NOT_FOUND_SEO },
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
    data: { seo: NOT_FOUND_SEO },
  },
];
