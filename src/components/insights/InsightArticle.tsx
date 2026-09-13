import Image from "next/image";
import Link from "next/link";
import {
  insightReadMinutes,
  isLinkLive,
  isPublished,
  publishedInsights,
} from "@/content/insights";
import { hero, profile } from "@/content/profile";
import type { Insight } from "@/content/types";
import { InsightBody } from "@/components/insights/InsightBody";
import { InsightCover } from "@/components/insights/InsightCover";
import { InsightShare } from "@/components/insights/InsightShare";
import { InsightToc } from "@/components/insights/InsightToc";
import { insightSections } from "@/lib/insightSections";
import { absoluteUrl } from "@/lib/seo";

/** "12 Sep 2026" — the byline date, short enough to sit on one line on a phone. */
function shortDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * The three sibling articles offered in the rail.
 *
 * Authored cross-links come first — they are the pieces this argument was
 * actually formed against — then same-topic articles, then the most recent.
 * Filling from three sources rather than one means the rail is never short on
 * a piece with no `related` entries pointing at another article, and a
 * scheduled or unwritten sibling is never linked from a live page.
 */
function siblingArticles(item: Insight): Insight[] {
  const live = publishedInsights().filter((i) => i.id !== item.id);
  const byId = new Map(live.map((i) => [i.id, i]));
  const picked: Insight[] = [];

  const add = (candidate?: Insight) => {
    if (candidate && picked.length < 3 && !picked.some((p) => p.id === candidate.id)) {
      picked.push(candidate);
    }
  };

  for (const link of item.related ?? []) {
    const match = /^\/insights\/([^/#?]+)/.exec(link.href);
    if (match) add(byId.get(match[1]));
  }
  for (const candidate of live) if (candidate.topic === item.topic) add(candidate);
  for (const candidate of live) add(candidate);

  return picked;
}

/**
 * The article page.
 *
 * Two columns on desktop: the prose at a real reading measure, and a sticky
 * rail carrying the things a reader reaches for without leaving the piece —
 * where they are in it, what it claims, what to read next, who wrote it, and
 * how to start a conversation. Below 1080px the rail stops being sticky and
 * stacks under the article, in that same order.
 *
 * Everything except the contents rail's active mark and the copy-link button
 * is server-rendered: the page's whole value is its text, so the text must not
 * wait on a bundle.
 */
export function InsightArticle({ item }: { item: Insight }) {
  const live = isPublished(item);
  const scheduled = !live && (item.body?.length ?? 0) > 0;
  const sections = insightSections(item.body);
  const minutes = insightReadMinutes(item);
  const related = item.related?.filter((r) => isLinkLive(r.href)) ?? [];
  const siblings = siblingArticles(item);
  const url = absoluteUrl("/insights/" + item.id);
  const topics = [item.topic, ...tagsFrom(item)].filter(Boolean) as string[];

  return (
    <article className="insd">
      {/* --- hero ------------------------------------------------------ */}
      <header className="insd-hero">
        <div className="insd-hero__art">
          <InsightCover
            item={item}
            className="insd-hero__img"
            sizes="(max-width: 1080px) 100vw, 46rem"
            priority
          />
        </div>

        <div className="shell insd-hero__inner">
          <Link className="insd-back" href="/insights">
            <span className="insd-back__arrow" aria-hidden>
              &larr;
            </span>
            Back to Insights
          </Link>

          {topics.length ? (
            <ul className="insd-tags">
              {topics.map((t, i) => (
                <li key={t}>
                  <span className="insd-tag" data-lead={i === 0 ? "true" : undefined}>
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          <h1 className="insd-title">{item.title}</h1>
          {item.dek ? <p className="insd-dek">{item.dek}</p> : null}

          <div className="insd-byline">
            <div className="insd-byline__author">
              <Image
                className="insd-avatar"
                src={hero.portrait.src}
                alt=""
                width={96}
                height={96}
                sizes="48px"
              />
              <span>
                <span className="insd-byline__name">{profile.name}</span>
                <span className="insd-byline__role">{profile.role}</span>
              </span>
            </div>

            <p className="insd-byline__meta">
              {item.datePublished ? (
                <>
                  {scheduled ? "Scheduled for " : null}
                  <time dateTime={item.datePublished}>{shortDate(item.datePublished)}</time>
                </>
              ) : null}
              <span className="insd-byline__sep" aria-hidden>
                &bull;
              </span>
              {minutes} min read
              {item.dateModified && item.dateModified !== item.datePublished ? (
                <>
                  <span className="insd-byline__sep" aria-hidden>
                    &bull;
                  </span>
                  Updated{" "}
                  <time dateTime={item.dateModified}>{shortDate(item.dateModified)}</time>
                </>
              ) : null}
            </p>
          </div>
        </div>
      </header>

      {/* --- body + rail ----------------------------------------------- */}
      <div className="shell insd-grid">
        <div className="insd-main">
          {scheduled ? (
            <p className="insd-note" role="note">
              This piece is finished but not published yet. It is not listed, not in the
              sitemap and not indexed until its publication date.
            </p>
          ) : null}

          {item.body?.length ? (
            <InsightBody blocks={item.body} />
          ) : (
            <p className="insd-p">
              This is a working position from shipped Angular and frontend work — the full
              write-up is still being drafted.
            </p>
          )}

          {related.length ? (
            <aside className="insd-applies">
              <h2 className="insd-applies__title">Where this applies</h2>
              <ul>
                {related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href}>
                      <span>{r.label}</span>
                      <span className="insd-applies__arrow" aria-hidden>
                        &rarr;
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}

          <InsightShare url={url} title={item.title ?? "Insight"} />
        </div>

        {/* Ordered as a reader needs them: position, claims, what next,
            who wrote it, how to start a conversation. */}
        <aside className="insd-rail">
          <div className="insd-rail__sticky">
            <InsightToc sections={sections} />

            {item.takeaways?.length ? (
              <section className="insd-panel insd-takeaways" aria-labelledby="insd-takeaways-title">
                <p className="insd-panel__title" id="insd-takeaways-title">
                  <BulbIcon />
                  Key Takeaways
                </p>
                <ul className="insd-takeaways__list">
                  {item.takeaways.map((t, i) => (
                    <li key={t}>
                      <span className="insd-takeaways__icon" aria-hidden>
                        <TakeawayGlyph index={i} />
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {siblings.length ? (
              <section className="insd-panel insd-more" aria-labelledby="insd-more-title">
                <p className="insd-panel__title" id="insd-more-title">
                  <BookIcon />
                  Related Articles
                  <Link className="insd-panel__link" href="/insights">
                    View All <span aria-hidden>&rarr;</span>
                  </Link>
                </p>
                <ul className="insd-more__list">
                  {siblings.map((s) => (
                    <li key={s.id}>
                      <Link className="insd-more__item" href={"/insights/" + s.id}>
                        <span className="insd-more__thumb">
                          <InsightCover item={s} className="" sizes="88px" />
                        </span>
                        <span className="insd-more__text">
                          <span className="insd-more__title">{s.title}</span>
                          <span className="insd-more__meta">
                            {insightReadMinutes(s)} min read
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="insd-panel insd-author" aria-labelledby="insd-author-title">
              <div className="insd-author__head">
                <Image
                  className="insd-avatar insd-avatar--lg"
                  src={hero.portrait.src}
                  alt=""
                  width={96}
                  height={96}
                  sizes="52px"
                />
                <span>
                  <span className="insd-author__name" id="insd-author-title">
                    {profile.name}
                  </span>
                  <span className="insd-author__role">{profile.role}</span>
                </span>
              </div>
              <p className="insd-author__bio">
                {profile.focus}. I write about the decisions behind shipped frontend work —
                architecture, performance and the interfaces people use for years.
              </p>
              <div className="insd-author__actions">
                <Link className="insd-author__cta" href="/about">
                  About Rabin
                </Link>
                <span className="insd-author__socials">
                  {profile.socials
                    .filter((s) => s.id === "linkedin" || s.id === "github")
                    .map((s) => (
                      <a
                        key={s.id}
                        className="insd-author__social"
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                      >
                        {s.id === "linkedin" ? <LinkedInIcon /> : <GitHubIcon />}
                      </a>
                    ))}
                </span>
              </div>
            </section>

            {/* The reference puts a newsletter capture here. There is no list
                to subscribe anyone to, and a form that silently does nothing
                is worse than no form — so the slot carries the ask the article
                has actually earned. */}
            <section className="insd-panel insd-ask" aria-labelledby="insd-ask-title">
              <span className="insd-ask__glow" aria-hidden />
              <MailIcon />
              <p className="insd-ask__title" id="insd-ask-title">
                Working on something like this?
              </p>
              <p className="insd-ask__text">
                {item.cta ??
                  "I work as an embedded senior frontend engineer on Angular and React products."}
              </p>
              <Link className="insd-ask__cta" href={"/contact?intent=" + item.id}>
                Start a conversation <span aria-hidden>&rarr;</span>
              </Link>
            </section>
          </div>
        </aside>
      </div>
    </article>
  );
}

/**
 * The secondary tags beside the topic pill.
 *
 * Derived from the article's own fields rather than a new authored list: a
 * second content field that only feeds three pills would drift out of date the
 * first time a piece was edited.
 */
function tagsFrom(item: Insight): string[] {
  const tags: string[] = [];
  if (item.kicker) tags.push(item.kicker);
  if (tags.length === 0 && item.number) tags.push("Insight " + item.number);
  return tags;
}

/* --- icons ---------------------------------------------------------- */

function BulbIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden focusable="false">
      <path
        d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6V16h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden focusable="false">
      <path
        d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      className="insd-ask__icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4 7.5 8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.06 3.76-2.06C21.2 8.64 22 10.9 22 14.06V21h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.27V21h-4V9Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

/** Four abstract glyphs, cycled, so the takeaways read as a set. */
function TakeawayGlyph({ index }: { index: number }) {
  const paths = [
    "M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5",
    "M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    "M4 19V9m5 10V5m5 14v-7m5 7V8",
    "M4 12h6l2-5 2 10 2-5h4",
  ];
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden focusable="false">
      <path
        d={paths[index % paths.length]}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
