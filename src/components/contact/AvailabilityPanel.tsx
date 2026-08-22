import { contactCopy } from "@/content/contact";
import { ContactLazyVideo, ContactReveal } from "@/components/contact/ContactMedia";

export function AvailabilityPanel() {
  const { availability, media } = contactCopy;

  return (
    <section className="cp-avail" aria-labelledby="cp-avail-title">
      <div className="shell cp-avail__grid">
        <div className="cp-avail__copy">
          <p className="pf-sec-label">
            <span className="pf-sec-label__index">10</span>
            Availability
          </p>
          <h2 id="cp-avail-title" className="cp-avail__title">
            {availability.title}
          </h2>
          <ul className="cp-avail__modes">
            {availability.modes.map((mode) => (
              <li key={mode}>{mode}</li>
            ))}
          </ul>
          <dl className="cp-avail__meta">
            <div>
              <dt>Response time</dt>
              <dd>{availability.responseTime}</dd>
            </div>
            <div>
              <dt>Location / timezone</dt>
              <dd>
                {availability.location}
                <span> · {availability.timezone}</span>
              </dd>
            </div>
            <div>
              <dt>Working model</dt>
              <dd>{availability.workingModel}</dd>
            </div>
          </dl>
        </div>

        <ContactReveal className="cp-avail__visual" delay={0.08}>
          <div className="cp-frame cp-frame--signal">
            <span className="cp-frame__glow cp-frame__glow--quiet" aria-hidden />
            <ContactLazyVideo src={media.availability.src} />
          </div>
        </ContactReveal>
      </div>
    </section>
  );
}
