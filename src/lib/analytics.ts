/**
 * Google Analytics event tracking for conversion funnel
 *
 * Events tracked:
 * - view_hero_cta: Hero CTA clicked (View My Work / Let's Talk)
 * - view_work_section: Work section reached (scroll)
 * - view_case_study: Case study opened
 * - start_contact_form: Contact form started
 * - submit_contact_form: Contact form submitted
 * - view_next_project: Next project navigation clicked
 */

export type ConversionEvent =
  | 'view_hero_cta'
  | 'view_work_section'
  | 'view_case_study'
  | 'start_contact_form'
  | 'submit_contact_form'
  | 'view_next_project'
  | 'view_experience_section'
  | 'click_experience_cta';

export interface EventParams {
  [key: string]: string | number | boolean;
}

/**
 * Track a conversion event with Google Analytics.
 * Falls back gracefully if GA is not available.
 */
export function trackEvent(eventName: ConversionEvent, params?: EventParams) {
  if (typeof window === 'undefined') return;

  // Use gtag if available (from Google Analytics script)
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Analytics: ${eventName}`, params);
  }
}

/**
 * Track when a user views a section (for funnel analysis)
 */
export function trackSectionView(sectionId: string) {
  trackEvent('view_work_section', {
    section: sectionId,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track CTA clicks in the conversion funnel
 */
export function trackCtaClick(ctaLabel: string, ctaLocation: string) {
  trackEvent('view_hero_cta', {
    cta_label: ctaLabel,
    location: ctaLocation,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track case study visits
 */
export function trackCaseStudyView(projectTitle: string, projectSlug: string) {
  trackEvent('view_case_study', {
    project_title: projectTitle,
    project_slug: projectSlug,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track contact form interactions
 */
export function trackContactFormStart() {
  trackEvent('start_contact_form', {
    timestamp: new Date().toISOString(),
  });
}

export function trackContactFormSubmit(source?: string) {
  trackEvent('submit_contact_form', {
    source: source || 'contact_page',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track next project navigation
 */
export function trackNextProject(projectTitle: string) {
  trackEvent('view_next_project', {
    project_title: projectTitle,
    timestamp: new Date().toISOString(),
  });
}
