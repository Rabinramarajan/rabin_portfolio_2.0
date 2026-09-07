declare global {
  interface Window {
    gtag?: (
      command: string,
      target?: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
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
