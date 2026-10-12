import { profile } from './profile';

/** Direct contact details shown beside the contact form. */
export const contactInfo = {
  email: profile.email,
  phone: profile.phone,
  phoneHours: profile.phoneHours,
  location: profile.location,
  availability: profile.availability.label,
  responseTime: profile.availability.responseTime,
} as const;
