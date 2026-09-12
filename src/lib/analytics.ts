/**
 * Google Analytics event tracking for the conversion funnel.
 *
 * Sessions and pageviews say how many people arrived. They do not say whether
 * anyone went search → proof → enquiry, which is the only path that matters
 * here, so the events below name each step of it: the hero CTA taken, a case
 * study opened, an article handing off to the work that produced it, and the
 * form started and finished.
 */

export type ConversionEvent =
  /* Hero: which of the two funnels the visitor chose. */
  | 'hero_view_work'
  | 'hero_contact'
  | 'hero_resume'
  /* Proof. */
  | 'view_work_section'
  | 'project_open'
  | 'view_case_study'
  | 'view_next_project'
  | 'article_to_case_study'
  /* Enquiry, by the page the enquiry started on. */
  | 'case_study_contact'
  | 'service_contact'
  | 'contact_start'
  | 'contact_submit'
  /* Direct contact, which never reaches the form. */
  | 'email_click'
  | 'phone_click'
  | 'resume_download'
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
  window.gtag?.('event', eventName, params);

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Analytics: ${eventName}`, params);
  }
}

/**
 * Track CTA clicks in the conversion funnel
 */
/**
 * A CTA click, routed to the event for where it was clicked.
 *
 * Everything used to arrive as `view_hero_cta` regardless of which button it
 * was, which made the two hero paths — case studies versus contact —
 * indistinguishable in GA.
 */
const CTA_EVENTS: Record<string, ConversionEvent> = {
  hero_primary: 'hero_view_work',
  hero_secondary: 'hero_contact',
  hero_recruiter: 'hero_resume',
  case_study: 'case_study_contact',
  service: 'service_contact',
};

export function trackCtaClick(ctaLabel: string, ctaLocation: string) {
  trackEvent(CTA_EVENTS[ctaLocation] ?? 'hero_view_work', {
    cta_label: ctaLabel,
    location: ctaLocation,
    timestamp: new Date().toISOString(),
  });
}

/** A mailto, tel or résumé link — an enquiry that never touches the form. */
export function trackDirectContact(
  channel: 'email' | 'phone' | 'resume',
  location: string,
) {
  const event: ConversionEvent =
    channel === 'email' ? 'email_click' : channel === 'phone' ? 'phone_click' : 'resume_download';
  trackEvent(event, { location, timestamp: new Date().toISOString() });
}

/** An article handing the reader off to the work that produced the argument. */
export function trackArticleHandoff(fromSlug: string, href: string) {
  trackEvent('article_to_case_study', { from: fromSlug, href });
}

/** The form: started (first edit) and submitted. Counted once each per page. */
export function trackContactStart(location: string) {
  trackEvent('contact_start', { location });
}

export function trackContactSubmit(location: string) {
  trackEvent('contact_submit', { location });
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
