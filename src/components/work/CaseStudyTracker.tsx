"use client";

import Link from "next/link";
import { useEffect } from "react";
import { trackCaseStudyView, trackEvent } from "@/lib/analytics";

export function CaseStudyTracker({
  projectTitle,
  projectSlug,
}: {
  projectTitle: string;
  projectSlug: string;
}) {
  useEffect(() => {
    trackCaseStudyView(projectTitle, projectSlug);
  }, [projectTitle, projectSlug]);

  return null;
}

export function NextProjectLink({
  href,
  projectTitle,
  children,
}: {
  href: string;
  projectTitle: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      className="wd__pager-link wd__pager-link--next"
      href={href}
      rel="next"
      onClick={() => trackEvent('view_next_project', { project: projectTitle })}
    >
      {children}
    </Link>
  );
}
