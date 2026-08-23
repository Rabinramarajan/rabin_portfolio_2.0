export const INQUIRY_TYPES = [
  "Project",
  "Full-time Opportunity",
  "Contract",
  "Consultation",
  "Collaboration",
  "Other",
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const PREFERRED_CONTACT_METHODS = ["Email", "LinkedIn", "Phone"] as const;

export type PreferredContactMethod = (typeof PREFERRED_CONTACT_METHODS)[number];

import type {
  BudgetRange,
  ContactRole,
  Engagement,
  ProjectStage,
  ReferralSource,
  Technology,
  Timeline,
} from "@/content/contact-fields";

export interface ContactAttachment {
  filename: string;
  contentType: string;
  size: number;
  content: Buffer;
}

export interface ContactPayload {
  name: string;
  email: string;
  inquiryType: InquiryType;
  message: string;
  company?: string;
  projectUrl?: string;
  budget?: string | BudgetRange;
  timeline?: string | Timeline;
  preferredContact?: PreferredContactMethod | "";
  /** Legacy homepage field — mapped to inquiryType when needed. */
  projectType?: string;
  role?: ContactRole | "";
  projectStage?: ProjectStage | "";
  engagement?: Engagement | "";
  referralSource?: ReferralSource | "";
  technologies?: Technology[];
  /** Set when the enquiry arrived with a file; the bytes ride separately. */
  attachmentName?: string;
  /** Honeypot. Must stay empty. */
  website?: string;
}

export interface ContactSuccess {
  ok: true;
  referenceId: string;
  responseTime: string;
}

export interface ContactFailure {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
}

export type ContactResult = ContactSuccess | ContactFailure;
