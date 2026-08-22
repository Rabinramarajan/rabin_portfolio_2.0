import { Mail, MapPin, Clock } from "lucide-react";
import { profile } from "@/content/profile";
import { contactCopy } from "@/content/contact";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { SmartImage } from "@/components/SmartImage";
import { ContactReveal } from "@/components/contact/ContactMedia";

export function ContactIntro() {
  const linkedin = profile.socials.find((s) => s.id === "linkedin");
  const github = profile.socials.find((s) => s.id === "github");
  const { conversation } = contactCopy.media;

  return (
    <div className="cp-intro">
      <div className="cp-intro__copy">
        <p className="cp-intro__kicker">A conversation, not a ticket</p>
        <h2 id="contact-intro-title" className="cp-intro__title">
          {contactCopy.intro.title}
        </h2>
        <p className="cp-intro__body">{contactCopy.intro.body}</p>
        <dl className="cp-facts">
          <div className="cp-fact">
            <dt>
              <Mail size={16} aria-hidden /> Email
            </dt>
            <dd>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </dd>
          </div>
          <div className="cp-fact">
            <dt>
              <MapPin size={16} aria-hidden /> Location
            </dt>
            <dd>{profile.location}</dd>
          </div>
          <div className="cp-fact">
            <dt>
              <Clock size={16} aria-hidden /> Response time
            </dt>
            <dd>{profile.availability.responseTime}</dd>
          </div>
          {linkedin ? (
            <div className="cp-fact">
              <dt>
                <LinkedinIcon width={16} height={16} /> LinkedIn
              </dt>
              <dd>
                <a href={linkedin.href} target="_blank" rel="me noopener noreferrer">
                  linkedin.com/in/rabinr
                </a>
              </dd>
            </div>
          ) : null}
          {github ? (
            <div className="cp-fact">
              <dt>
                <GithubIcon width={16} height={16} /> GitHub
              </dt>
              <dd>
                <a href={github.href} target="_blank" rel="me noopener noreferrer">
                  github.com/Rabinramarajan
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      <ContactReveal className="cp-intro__visual" delay={0.1} hover="lift">
        <figure className="cp-frame cp-frame--conversation">
          <span className="cp-frame__glow" aria-hidden />
          <SmartImage
            src={conversation.src}
            alt={conversation.alt}
            fill
            sizes="(max-width: 1023px) 92vw, 55vw"
            className="cp-frame__media"
          />
          <figcaption className="cp-frame__meta">
            <span>{conversation.index}</span>
            <span>{conversation.caption}</span>
          </figcaption>
        </figure>
      </ContactReveal>
    </div>
  );
}
