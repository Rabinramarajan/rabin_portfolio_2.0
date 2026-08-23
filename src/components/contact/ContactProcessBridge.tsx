"use client";

import { contactCopy } from "@/content/contact";
import { ContactLazyVideo, ContactReveal } from "@/components/contact/ContactMedia";

export function ContactProcessBridge() {
  const { process } = contactCopy.media;

  return (
    <section className="cp-bridge" aria-labelledby="cp-bridge-title">
      <ContactReveal className="cp-bridge__stage">
        {process.src ? (
          <ContactLazyVideo src={process.src} className="cp-bridge__video" />
        ) : null}
        <div className="cp-bridge__veil" aria-hidden />
        <div className="cp-bridge__copy">
          <h2 id="cp-bridge-title" className="cp-bridge__kicker">
            {process.kicker}
          </h2>
          <a className="cp-bridge__next" href="#cp-flow">
            {process.index}
          </a>
        </div>
      </ContactReveal>
    </section>
  );
}
