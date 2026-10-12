import { profile } from './profile';

/** Direct contact details shown beside the contact form. */
export const contactInfo = {
  email: profile.email,
  phone: profile.phone,
  phoneHours: profile.phoneHours,
  location: profile.location,
  availability: profile.availability.label,
  responseTime: profile.availability.responseTime,
  /**
   * [longitude, latitude] of the neighbourhood centre for the location map (Madipakkam,
   * Chennai). Deliberately neighbourhood-level: the pin is not placed on a home, and the
   * full street address is never printed on the page.
   */
  mapCenter: [80.2, 12.962] as [number, number],
} as const;
