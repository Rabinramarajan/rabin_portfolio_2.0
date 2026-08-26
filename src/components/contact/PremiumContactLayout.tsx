"use client";

import { ReactNode } from "react";

export interface PremiumContactLayoutProps {
  left: ReactNode;
  /**
   * The globe. Rendered as an ambient background layer sitting behind both
   * columns rather than as its own grid track — in the reference the orbits
   * pass underneath the copy and the form, which a third column can't do.
   */
  center: ReactNode;
  right: ReactNode;
  footer?: ReactNode;
}

export function PremiumContactLayout({ left, center, right, footer }: PremiumContactLayoutProps) {
  return (
    <div className="premium-contact-page">
      <div className="premium-contact-page__stage" aria-hidden="true">
        <div className="premium-contact-page__globe">{center}</div>
      </div>

      <div className="premium-contact-page__grid">
        <div className="premium-contact-page__left">{left}</div>
        <div className="premium-contact-page__right">{right}</div>
      </div>

      {footer ? <div className="premium-contact-page__footer">{footer}</div> : null}
    </div>
  );
}
