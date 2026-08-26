"use client";

export function PremiumContactHero() {

  return (
    <header className="premium-contact-hero">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="premium-contact-hero__video"
        aria-hidden="true"
      >
        <source src="/media/contact/hero.mp4" type="video/mp4" />
      </video>

      {/* Animated background elements */}
      <div className="premium-contact-hero__bg" aria-hidden="true">
        {/* Gradient orbs */}
        <div className="premium-contact-hero__orb premium-contact-hero__orb--1" />
        <div className="premium-contact-hero__orb premium-contact-hero__orb--2" />
        <div className="premium-contact-hero__orb premium-contact-hero__orb--3" />

        {/* Grid pattern */}
        <div className="premium-contact-hero__grid" />

        {/* Ambient light effects */}
        <div className="premium-contact-hero__ambient" />
      </div>

      {/* Content */}
      <div className="premium-contact-hero__content">
        <div className="premium-contact-hero__inner">
          <h1 className="premium-contact-hero__title">Contact Us</h1>
          <p className="premium-contact-hero__subtitle">
            Let's start a conversation about your next project
          </p>
          <div className="premium-contact-hero__cta-wrapper">
            <a href="#contact-form" className="premium-contact-hero__cta">
              <span className="premium-contact-hero__cta-text">Get in Touch</span>
              <svg className="premium-contact-hero__cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

    </header>
  );
}
