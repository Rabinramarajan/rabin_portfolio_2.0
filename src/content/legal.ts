import { profile, SITE_URL } from '@/content/profile';

/**
 * Privacy and terms copy.
 *
 * These describe what this site actually does — the enquiry form, the AI
 * assistant, attachment uploads and consent-gated analytics. If a data path
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
export const LEGAL_EFFECTIVE = '2026-09-12';

export const privacy: LegalDocument = {
  title: 'Privacy Policy',
  description:
    'How rabinr.in handles enquiry form submissions, AI assistant conversations, file attachments and consent-gated analytics — what is collected, why, and how long it is kept.',
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
        'If you submit the contact form, the details you type are emailed to me and are not written to any database. That submission includes whatever you chose to provide: your name, email address, and any of the optional project fields — role, project type, stage, technologies, timeline, budget range and engagement type — plus your message and how you found the site.',
        'I use this only to reply to you and to discuss the work you are asking about. It is not added to a mailing list, not used for marketing, and not sold or shared with anyone. The email sits in my mailbox for as long as the conversation is useful; ask me to delete it and I will.',
      ],
    },
    {
      heading: 'File attachments',
      paragraphs: [
        'The form optionally accepts a file attachment — a brief, a spec, a design. Attachments are uploaded to Vercel Blob storage so they can be delivered with your enquiry, and are removed once the enquiry has been dealt with. Please do not attach anything confidential, personal or regulated that you would not send by ordinary email.',
      ],
    },
    {
      heading: 'The AI assistant',
      paragraphs: [
        'This site has a chat assistant that answers questions about my work. The message you type is sent to an AI model provider to generate a reply, together with context drawn from the public content of this site. Conversations are used to produce the answer and to record anonymous usage events (such as which topics get asked about) so the assistant can be improved.',
        'Do not put personal, confidential or sensitive information into the chat. If you use the assistant to send an enquiry, the name and email you give at that point are handled exactly like a contact form submission above — emailed to me, not stored in a database.',
      ],
    },
    {
      heading: 'Analytics and cookies',
      paragraphs: [
        'This site loads Google Analytics with consent mode set to denied by default. Nothing is stored for analytics or advertising purposes until you actively accept, and if you never accept, no analytics cookies are written. You can withdraw consent at any time by clearing site data for this domain in your browser.',
        'Vercel Analytics also records aggregate page view data. It is cookieless, does not track you across sites, and does not build a profile of you as an individual.',
      ],
    },
    {
      heading: 'Server logs and abuse prevention',
      paragraphs: [
        'The form and chat endpoints are rate limited, which means your IP address is held very briefly in memory to count recent requests. It is not written to permanent storage and is not used to identify you. Standard request logs are produced by the hosting platform (Vercel) as part of running any website, and are retained under their own retention policy.',
      ],
    },
    {
      heading: 'Processors I rely on',
      paragraphs: [
        'I do not run my own infrastructure. These providers process data on my behalf in order for the site to function:',
      ],
      bullets: [
        'Vercel — hosting, request logs, Blob storage for attachments, and cookieless aggregate analytics.',
        'An email delivery provider — transports enquiry emails from the site to my mailbox.',
        'An AI model provider — generates the chat assistant replies.',
        'Google Analytics — consent-gated traffic measurement, loaded only after you accept.',
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
        'Use the enquiry form or chat assistant to send spam, malware or unlawful content.',
        'Scrape the site in a way that degrades it for other people.',
        'Misrepresent the content here as your own work.',
      ],
    },
    {
      heading: 'The AI assistant has limits',
      paragraphs: [
        'The chat assistant generates answers from the public content of this site. It can be wrong, out of date or incomplete, and it does not speak for me contractually. Nothing it says is an offer, a quote, or a commitment on my part. For anything that matters, use the contact form and talk to me directly.',
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

export const legalDocuments = [privacy, terms];
