import Link from "next/link";
import { ArrowUpRight, FileText, Mail } from "lucide-react";
import { contactCopy } from "@/content/contact";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";

const CHANNELS = [
  { ...contactCopy.channels.email, id: "email", Icon: Mail, external: false },
  { ...contactCopy.channels.linkedin, id: "linkedin", Icon: LinkedinIcon, external: true },
  { ...contactCopy.channels.github, id: "github", Icon: GithubIcon, external: true },
  { ...contactCopy.channels.resume, id: "resume", Icon: FileText, external: false },
] as const;

export function ContactChannels() {
  return (
    <section className="cp-channels" aria-labelledby="cp-channels-title">
      <div className="shell">
        <p className="pf-sec-label">
          <span className="pf-sec-label__index">11</span>
          Channels
        </p>
        <h2 id="cp-channels-title" className="cp-channels__title">
          Other ways to reach me.
        </h2>
        <ul className="cp-channels__grid">
          {CHANNELS.map(({ id, label, description, href, Icon, external }) => {
            const inner = (
              <>
                <span className="cp-channel__icon" aria-hidden>
                  <Icon size={20} width={20} height={20} />
                </span>
                <span className="cp-channel__copy">
                  <span className="cp-channel__label">{label}</span>
                  <span className="cp-channel__desc">{description}</span>
                </span>
                <ArrowUpRight className="cp-channel__arrow" aria-hidden size={18} />
              </>
            );

            return (
              <li key={id}>
                {external ? (
                  <a className="cp-channel" href={href} target="_blank" rel="me noopener noreferrer">
                    {inner}
                  </a>
                ) : href.startsWith("mailto:") ? (
                  <a className="cp-channel" href={href}>
                    {inner}
                  </a>
                ) : (
                  <Link className="cp-channel" href={href}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
