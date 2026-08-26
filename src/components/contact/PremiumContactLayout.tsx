"use client";

import { ReactNode } from "react";

export interface PremiumContactLayoutProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

export function PremiumContactLayout({ left, center, right }: PremiumContactLayoutProps) {
  return (
    <div className="premium-contact-page">
      <div className="premium-contact-page__left">
        {left}
      </div>

      <div className="premium-contact-page__center">
        <div className="premium-contact-page__globe-container">
          {center}
        </div>
      </div>

      <div className="premium-contact-page__right">
        {right}
      </div>
    </div>
  );
}
