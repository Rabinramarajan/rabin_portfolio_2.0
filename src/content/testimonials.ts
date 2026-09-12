/**
 * Named references. EMPTY UNTIL REAL ONES EXIST.
 *
 * Every section on this site is rendered from content that can be traced to
 * something that happened; a testimonial is the one kind that cannot be
 * derived from the repository at all, so this array stays empty rather than
 * being seeded with plausible filler. `TestimonialsSection` renders nothing
 * while it is empty, which means adding the first real quote is the only step
 * needed to publish the section.
 *
 * What makes one worth publishing:
 *   - It names what I owned and what changed. "Rabin owned the frontend
 *     architecture and cut our case-screen load time in half" is evidence.
 *     "Great developer to work with" is decoration, and a reader discounts
 *     the whole section for containing it.
 *   - The person is identifiable: name, role, company. An anonymous quote
 *     proves nothing and costs credibility.
 *   - They agreed to it being on a public page. Ask explicitly.
 *
 * Three is plenty: a manager, a product owner, and a senior engineer or
 * client — the three people who can speak to different halves of the work.
 */
export interface Testimonial {
  /** The quote, as they wrote it. Do not edit for tone. */
  quote: string;
  name: string;
  role: string;
  company: string;
  /** The project this refers to, when it maps to a case study slug. */
  projectSlug?: string;
}

export const testimonials: Testimonial[] = [];
