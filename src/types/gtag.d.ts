/**
 * gtag.js surface actually used by this app.
 *
 * `unknown` rather than `any` for the config bag: every call site passes an
 * object literal, and nothing reads a value back out, so no property access
 * needs to type-check through it.
 */
type GtagConfigParams = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (
      command: string,
      target?: string,
      config?: GtagConfigParams
    ) => void;
    /* The GTM/GA snippets push heterogeneous records and an `arguments`
       object, so the element type is deliberately open. */
    dataLayer?: unknown[];
    CookieScriptConsent?: Event;
  }
}

export interface CookieConsentDetail {
  cookies: {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
    [key: string]: boolean;
  };
}

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export {};
