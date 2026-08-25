"use client";

import { useReducedMotion } from "motion/react";

export function ContactHeroVideo() {
  const reduce = useReducedMotion();

  return (
    <div className="contact-hero-video">
      <video
        src="/media/contact/Create_a_minimal_second_loo.mp4"
        poster="/media/contact/contact_h.png"
        autoPlay={!reduce}
        loop
        muted
        playsInline
        preload={reduce ? "none" : "metadata"}
        disablePictureInPicture
        aria-label="Contact - Let's build something together"
        className="contact-hero-video__element"
      />
    </div>
  );
}
