"use client";

import Link from "next/link";
import { trackCtaClick } from "@/lib/analytics";

/**
 * The closing CTA on a case study.
 *
 * Contextual on purpose: a reader who has just finished the Fiji immigration
 * write-up is not answering "let's work together", they are answering
 * "something like this". The category is the whole difference, and it is the
 * one thing this page knows that a generic CTA throws away.
 */
export function CaseStudyCta({ category, slug }: { category: string; slug: string }) {
  return (
    <section className="wd__cta" aria-labelledby="wd-cta">
      <h2 className="wd__cta-title" id="wd-cta">
        Building a {category.toLowerCase()}?
      </h2>
      <p className="wd__cta-body">
        Tell me what you are building and where it is stuck — I will say plainly whether
        this is the kind of problem I am useful on.
      </p>
      <div className="wd__cta-actions">
        <Link
          className="btn btn--solid"
          href="/contact"
          onClick={() => trackCtaClick("Discuss a similar project", "case_study")}
          data-project={slug}
        >
          <span className="btn__label">Discuss a similar project</span>
        </Link>
        <Link className="btn btn--line" href="/work">
          <span className="btn__label">View All Work</span>
        </Link>
      </div>
    </section>
  );
}
