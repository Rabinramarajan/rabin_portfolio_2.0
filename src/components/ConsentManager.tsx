'use client';

import { useEffect } from 'react';

export function ConsentManager() {
  useEffect(() => {
    // Initialize GTM consent defaults BEFORE loading GTM
    window.dataLayer = window.dataLayer || [];

    // Set default consent states to 'denied'
    window.gtag?.('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      personalization_storage: 'denied',
      functionality_storage: 'denied',
      security_storage: 'granted',
    });

    // Listen for CookieScript consent changes
    window.addEventListener('CookieScriptConsent', (e: Event) => {
      const customEvent = e as CustomEvent;
      const cookies = customEvent?.detail?.cookies;

      if (cookies) {
        // Update GTM consent based on CookieScript choices
        const consentMap: Record<string, 'granted' | 'denied'> = {
          analytics: cookies.analytics ? 'granted' : 'denied',
          marketing: cookies.marketing ? 'granted' : 'denied',
          functional: cookies.functional ? 'granted' : 'denied',
          necessary: 'granted', // Always granted
        };

        window.gtag?.('consent', 'update', {
          ad_storage: consentMap.marketing,
          analytics_storage: consentMap.analytics,
          personalization_storage: consentMap.marketing,
          functionality_storage: consentMap.functional,
          security_storage: 'granted',
        });

        // Store consent state in localStorage for reference
        localStorage.setItem('cookieConsent', JSON.stringify({
          analytics: consentMap.analytics === 'granted',
          marketing: consentMap.marketing === 'granted',
          functional: consentMap.functional === 'granted',
          timestamp: new Date().toISOString(),
        }));
      }
    });
  }, []);

  return null;
}
