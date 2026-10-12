import { profile, SITE_URL } from './profile';

/**
 * Privacy and terms copy.
 *
 * These describe what this site actually does — a static, prerendered site on
 * Cloudflare with one enquiry form and no analytics. If a data path
 * changes (a new provider, a new stored field), the matching section here has
 * to change with it, or the page becomes a false statement rather than a
 * missing one.
 */

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDocument {
  title: string;
  description: string;
  path: string;
  lede: string;
  effective: string;
  sections: LegalSection[];
}

/** Single source of truth for the "last reviewed" stamp on both documents. */
const LEGAL_EFFECTIVE = '2026-10-12';

export const privacy: LegalDocument = {
  title: 'Privacy Policy',
  description:
    'How rabinr.in handles contact form submissions — what is collected, who processes it and how long it is kept. No analytics, no tracking cookies.',
  path: '/privacy',
  lede: 'This site is a personal portfolio operated by Rabin R. It collects very little, and this page describes all of it.',
  effective: LEGAL_EFFECTIVE,
  sections: [
    {
      heading: 'Who is responsible',
      paragraphs: [
        `This site is operated by ${profile.name}, an independent frontend engineering consultant based in ${profile.location}. There is no company behind it and no third party shares control of the data it handles. For any privacy question, or to ask that data be corrected or deleted, email ${profile.email}.`,
      ],
    },
    {
      heading: 'The enquiry form',
      paragraphs: [
        'If you submit the contact form, the details you type are emailed to me and are not written to any database. That submission contains exactly four things you provide: your name, your email address, a subject and your message.',
        'I use this only to reply to you and to discuss the work you are asking about. It is not added to a mailing list, not used for marketing, and not sold or shared with anyone. The email sits in my mailbox for as long as the conversation is useful; ask me to delete it and I will.',
      ],
    },
    {
      heading: 'Analytics and cookies',
      paragraphs: [
        'This site does not run analytics, advertising or tracking scripts, and it does not set cookies. Fonts are served from this site itself, so no third party is contacted while you browse.',
      ],
    },
    {
      heading: 'Server logs and abuse prevention',
      paragraphs: [
        'The contact endpoint is rate limited per IP address to stop abuse, and the form includes hidden spam checks. The IP address is used only to count recent requests and is not used to identify you. Standard request logs are produced by the hosting platform (Cloudflare) as part of running any website, and are retained under its own retention policy.',
      ],
    },
    {
      heading: 'Processors I rely on',
      paragraphs: [
        'I do not run my own infrastructure. These providers process data on my behalf in order for the site to function:',
      ],
      bullets: [
        'Cloudflare — hosting, request logs, rate limiting, and delivery of enquiry emails to my mailbox.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        `You can ask what I hold about you, ask for it to be corrected, or ask for it to be deleted, by emailing ${profile.email}. Because the only thing I retain is email correspondence you initiated, these requests are usually resolved the same day. If you are in a jurisdiction with statutory data rights such as the UK or EU, those rights apply and I will honour them on the same terms.`,
      ],
    },
    {
      heading: 'Children',
      paragraphs: [
        'This site offers professional engineering services and is not directed at children. I do not knowingly collect information from anyone under 16.',
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: [
        'If the way this site handles data changes, this page changes with it and the review date at the top is updated. There is no separate notification, so the date is the thing to check.',
      ],
    },
  ],
};

export const terms: LegalDocument = {
  title: 'Terms of Use',
  description:
    'The terms covering use of rabinr.in — the status of the content, intellectual property in the case studies, and the limits of what this site is and is not.',
  path: '/terms',
  lede: 'Plain terms covering what this site is, what you can do with its content, and what it does not promise.',
  effective: LEGAL_EFFECTIVE,
  sections: [
    {
      heading: 'What this site is',
      paragraphs: [
        `${SITE_URL} is the professional portfolio of ${profile.name}. It exists to describe engineering work I have done and services I offer. Using the site means accepting the terms on this page.`,
      ],
    },
    {
      heading: 'The content is informational, not advice',
      paragraphs: [
        'The case studies, insight articles and technical positions on this site describe approaches that worked in specific projects with specific constraints. They are written to be useful, but they are not engineering advice for your system, and applying them without judgement is your decision rather than my recommendation. Nothing here creates a professional relationship between us.',
      ],
    },
    {
      heading: 'Client work and confidentiality',
      paragraphs: [
        'The projects described in the case studies were built for clients including government, pension and insurance organisations. Screenshots and descriptions are published at a level of detail that does not expose client data, internal systems or anything covered by the agreements under which the work was done. Metrics quoted are the outcomes I measured on those projects.',
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'The writing, design, code and images on this site are mine unless credited otherwise, and client trademarks and logos belong to their respective owners. You are welcome to quote and link to anything here with attribution — that is what publishing it is for. Republishing an article in full, or reusing the site design, is not permitted without asking first.',
      ],
    },
    {
      heading: 'Acceptable use',
      paragraphs: ['When using this site, please do not:'],
      bullets: [
        'Attempt to break, overload or gain unauthorised access to the site or its endpoints.',
        'Use the enquiry form to send spam, malware or unlawful content.',
        'Scrape the site in a way that degrades it for other people.',
        'Misrepresent the content here as your own work.',
      ],
    },
    {
      heading: 'Availability and accuracy',
      paragraphs: [
        'This site is provided as is. I keep it accurate and online, but I do not guarantee that it will be uninterrupted, error free, or current at every moment. To the extent the law allows, I am not liable for loss arising from your use of the site or reliance on its content. Engagements are governed by the written agreement made for that engagement, not by this page.',
      ],
    },
    {
      heading: 'Governing law',
      paragraphs: [
        'These terms are governed by the laws of India, and the courts of Chennai, Tamil Nadu have jurisdiction over any dispute arising from use of this site.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [
        `Questions about these terms go to ${profile.email}.`,
      ],
    },
  ],
};
