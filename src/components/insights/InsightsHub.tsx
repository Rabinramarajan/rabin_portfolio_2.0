"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  featuredInsight,
  insightDate,
  insightNumber,
  insightReadMinutes,
  insightStatCopy,
  insightTopics,
  publishedInsights,
  quotableInsights,
  quoteIndexForDay,
} from "@/content/insights";
import type { InsightStatId } from "@/content/insights";
import type { Insight, InsightTopic } from "@/content/types";
import { sections } from "@/content/sections";
import { SectionKicker } from "@/components/ui";
import { InsightCard } from "@/components/insights/InsightCard";
import { InsightCover } from "@/components/insights/InsightCover";

const ALL = "All" as const;
type Filter = typeof ALL | InsightTopic;

/**
 * The /insights index.
 *
 * A client component because the topic filter and the search box are the
 * point of the page: with ten pieces across six subjects, "show me the
 * performance ones" is the first thing a visiting engineering lead does.
 * The whole set is static content compiled into the bundle, so filtering is
 * a render rather than a fetch, and every article is in the prerendered HTML
 * whatever the active filter is.
 *
 * `intro` is the standing prose about why these pieces exist. It is passed in
 * from the route rather than written here so it stays a server-rendered
 * subtree: it is the page's indexable copy, and it has no reason to ship in
 * the client bundle behind the filter.
 */
export function InsightsHub({ intro }: { intro?: ReactNode } = {}) {
  const [filter, setFilter] = useState<Filter>(ALL);
  const [query, setQuery] = useState("");
  const searchId = useId();

  const items = useMemo(() => publishedInsights(), []);
  const topics = useMemo(() => insightTopics(), []);
  const featured = useMemo(() => featuredInsight(), []);

  /* Keep the featured piece out of the recommendation rail. The complete
     article grid still includes it, including when searching or filtering. */
  const rest = useMemo(() => items.filter((i) => i.id !== featured?.id), [items, featured]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (filter !== ALL && i.topic !== filter) return false;
      if (!q) return true;
      return (i.title + " " + i.dek + " " + (i.topic ?? "")).toLowerCase().includes(q);
    });
  }, [items, filter, query]);

  const stats = useMemo(() => buildStats(items), [items]);
  const cadence = useMemo(() => buildCadence(items), [items]);

  /* The quote card rotates through the articles' own pull quotes.

     It starts on index 0 — the newest piece — because that is what the
     prerendered HTML contains, and hydration has to agree with it. The day's
     pick is applied after mount, where "today" is the reader's day rather than
     the day the site was built. */
  const quotes = useMemo(() => quotableInsights(), []);
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    setQuoteIndex(quoteIndexForDay(quotes.length));
  }, [quotes.length]);
  const quoted = quotes[quoteIndex];

  return (
    <div className="inh">
      <Hero />

      <div className="shell">
        {/* --- filter + search ---------------------------------------- */}
        <div className="inh-controls">
          <div className="inh-pills" role="group" aria-label="Filter insights by topic">
            {[ALL, ...topics].map((t) => (
              <button
                key={t}
                type="button"
                className="inh-pill"
                aria-pressed={filter === t}
                onClick={() => setFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="inh-search">
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden>
              <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="m10.5 10.5 3 3" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <label className="sr-only" htmlFor={searchId}>
              Search insights
            </label>
            <input
              id={searchId}
              type="search"
              placeholder="Search insights…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* --- figures ------------------------------------------------ */}
        <ul className="inh-stats">
          {stats.map((s) => (
            <li className="inh-stat" key={s.label}>
              <span className="inh-stat__icon" aria-hidden>
                {s.icon}
              </span>
              <span className="inh-stat__text">
                <span className="inh-stat__value">{s.value}</span>
                <span className="inh-stat__label">{s.label}</span>
                <span className="inh-stat__note">{s.note}</span>
              </span>
            </li>
          ))}
        </ul>

        {/* --- featured + rail ---------------------------------------- */}
        <div className="inh-lead">
          {featured ? <Featured item={featured} /> : null}
          <aside className="inh-rail" aria-label="Where to start">
            <div className="inh-rail__head">
              <h2 className="inh-panel__title">
                <SparkIcon />
                Start here
              </h2>
              <button
                type="button"
                className="inh-link inh-link--quiet"
                onClick={() => {
                  setFilter(ALL);
                  setQuery("");
                  document.getElementById("all-articles")?.scrollIntoView({ block: "start" });
                }}
              >
                View all <span aria-hidden>→</span>
              </button>
            </div>
            <ol className="inh-rail__list">
              {rest.slice(0, 4).map((i, index) => (
                <li key={i.id}>
                  <Link href={"/insights/" + i.id} className="inh-rail__item">
                    <span className="inh-rail__thumb">
                      <InsightCover item={i} sizes="72px" />
                      <span className="inh-rail__no" aria-hidden>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span>
                      <span className="inh-rail__title">{i.title}</span>
                      <span className="inh-rail__meta">
                        {i.topic} · {insightReadMinutes(i)} min read
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        {/* --- three panels ------------------------------------------- */}
        <div className="inh-panels">
          <section className="inh-panel">
            <h2 className="inh-panel__title">
              <TagIcon />
              What I write about
            </h2>
            <div className="inh-panel__chips">
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="inh-chip inh-chip--button"
                  aria-pressed={filter === t}
                  onClick={() => setFilter(t)}
                >
                  {t}
                  <span className="inh-chip__count">{count(items, t)}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="inh-link inh-link--quiet inh-panel__action"
              onClick={() => setFilter(ALL)}
            >
              Show every topic <span aria-hidden>→</span>
            </button>
          </section>

          <section className="inh-panel">
            <div className="inh-panel__head">
              <h2 className="inh-panel__title">
                <ChartIcon />
                Publishing cadence
              </h2>
              <span className="inh-panel__tag">Last 6 months</span>
            </div>
            <p className="inh-panel__note">Pieces published per month.</p>
            <div className="inh-chart" role="img" aria-label={cadenceLabel(cadence)}>
              {cadence.map((c) => (
                <div className="inh-chart__col" key={c.key}>
                  <div
                    className="inh-chart__bar"
                    data-empty={c.n === 0 ? "" : undefined}
                    style={{ "--h": c.height + "%" } as React.CSSProperties}
                  />
                  <span className="inh-chart__tick">{c.label}</span>
                </div>
              ))}
            </div>
          </section>

          {quoted ? (
            <section className="inh-panel inh-panel--quote">
              <span className="inh-quote__mark" aria-hidden>
                &ldquo;
              </span>
              <blockquote className="inh-quote" cite={"/insights/" + quoted.id}>
                {quoted.pullQuote}
              </blockquote>
              <p className="inh-quote__by">
                —{" "}
                <Link className="inh-quote__source" href={"/insights/" + quoted.id}>
                  {quoted.title}
                </Link>
              </p>
              <span className="inh-quote__rule" aria-hidden />
            </section>
          ) : null}
        </div>

        {/* --- the grid ----------------------------------------------- */}
        <div className="inh-grid-head" id="all-articles">
          <div>
            <p className="inh-eyebrow">All articles</p>
            <h2 className="inh-grid-title">{filter === ALL ? "Every insight" : filter}</h2>
          </div>
          <p className="inh-count" aria-live="polite">
            {matches.length}{" "}
            {matches.length === 1 ? "article" : "articles"}
          </p>
        </div>

        {matches.length ? (
          <div className="inh-grid">
            {matches.map((i, n) => (
              <InsightCard item={i} key={i.id} headingLevel="h1" index={n} />
            ))}
          </div>
        ) : (
          <p className="inh-empty">
            Nothing matches that yet.{" "}
            <button
              type="button"
              className="inh-link"
              onClick={() => {
                setFilter(ALL);
                setQuery("");
              }}
            >
              Clear the filters
            </button>
            .
          </p>
        )}

        {intro ? (
          <section className="inh-intro">
            <h2 className="inh-intro__title">Why there are only ten of these</h2>
            <div className="inh-intro__body">{intro}</div>
          </section>
        ) : null}

        {/* --- closing ask -------------------------------------------- */}
        <section className="inh-cta">
          <div>
            <h2 className="inh-cta__title">Recognise one of these problems?</h2>
            <p className="inh-cta__text">
              Every piece here came out of a production system that had to keep working. If
              one of them describes the codebase you are looking at, I do scoped assessments
              that say what is worth fixing, and in what order.
            </p>
          </div>
          <div className="inh-cta__actions">
            <Link className="btn btn--solid" href="/contact?intent=insights">
              <span className="btn__label">Start a conversation →</span>
            </Link>
            <Link className="btn btn--line" href="/work">
              <span className="btn__label">See the work</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- hero */

function Hero() {
  return (
    <header className="inh-hero">
      <div className="shell inh-hero__inner">
        <div className="inh-hero__copy">
          <SectionKicker
            index={sections.insights.index}
            label="Thoughts · Ideas · Perspectives"
          />
          <h1 className="inh-hero__title">
            Notes from
            <br />
            <span className="acc">the real work.</span>
          </h1>
          <p className="inh-hero__lede">
            Engineering positions taken on shipped Angular and frontend systems — what each
            decision bought, and what it cost.
          </p>
        </div>
        <div className="inh-hero__visual" aria-hidden>
          {/* Decorative, so no alt text, and the wrapper hides it from
              assistive tech. Deliberately not `priority`: the wrapper is
              display:none below 900px, and a preload would pull the file down
              on every phone that never shows it. The LCP element here is the
              headline, which is text. */}
          <Image
            className="inh-orb"
            src="/media/insights/1.webp"
            alt=""
            width={1422}
            height={1106}
            sizes="(max-width: 900px) 1px, 70vw"
          />
          <span className="inh-hero__rotule">
            Ideas
            <br />
            turn
            <br />
            into
            <br />
            impact
          </span>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------ featured */

function Featured({ item }: { item: Insight }) {
  return (
    <Link className="inh-featured" href={"/insights/" + item.id} data-topic={item.topic}>
      <InsightCover
        item={item}
        className="inh-featured__img"
        sizes="(max-width: 1024px) 100vw, 52rem"
        /* Top of the listing and the largest image on the route, so it is the
           LCP candidate. */
        priority
      />
      <span className="inh-featured__wash" aria-hidden />
      <span className="inh-featured__rotule" aria-hidden>
        {item.topic}
        <br />
        shipped
        <br />
        not
        <br />
        theorised
      </span>
      <span className="inh-featured__no" aria-hidden>
        {insightNumber(item.id)}
      </span>
      <span className="inh-featured__inner">
        <span className="inh-badge">Featured</span>
        <h2 className="inh-featured__title">{item.title}</h2>
        <p className="inh-featured__dek">{item.dek}</p>
        <span className="inh-featured__foot">
          <span className="btn btn--line inh-featured__btn">
            <span className="btn__label">Read article →</span>
          </span>
          <span className="inh-featured__meta">
            <span className="inh-card__read">{insightReadMinutes(item)} min read</span>
            {item.datePublished ? (
              <time dateTime={item.datePublished}>{insightDate(item.datePublished)}</time>
            ) : null}
          </span>
        </span>
        <span className="inh-featured__tags">
          {featuredTags(item).map((t) => (
            <span className="inh-tag" key={t}>
              #{t}
            </span>
          ))}
        </span>
      </span>
    </Link>
  );
}

/* ---------------------------------------------------------------- data */

/**
 * The hashtag row on the featured card.
 *
 * Derived from what the article already carries — its topic, plus the shape
 * of its related links — so there is no second taxonomy to keep in step with
 * the first.
 */
function featuredTags(item: Insight): string[] {
  const tags = [item.topic ?? "Engineering"];
  if (item.related?.some((r) => r.href.startsWith("/work"))) tags.push("Shipped");
  if (item.related?.some((r) => r.href.startsWith("/services"))) tags.push("Angular");
  return tags.slice(0, 3);
}

const count = (items: Insight[], topic: InsightTopic) =>
  items.filter((i) => i.topic === topic).length;

/* The glyph each figure is introduced by, keyed to the copy in content. A
   function rather than a module constant because the icons are declared at the
   foot of this file, and a constant would read them before they exist. */
const statIcons = (): Record<InsightStatId, ReactNode> => ({
  articles: <BookIcon />,
  subjects: <LayersIcon />,
  read: <ClockIcon />,
  published: <PulseIcon />,
});

/**
 * The four figures above the grid.
 *
 * All four values are derived from the content itself — article count,
 * subjects covered, typical length, last publication. A portfolio has no
 * honest way to show subscriber or rating numbers, and a figure nobody can
 * verify costs more trust than it buys.
 *
 * The labels and notes come from `insightStatCopy`; this only supplies the
 * numbers and the icons, and follows that array's order.
 */
function buildStats(items: Insight[]) {
  const minutes = items.map(insightReadMinutes);
  const avg = minutes.length
    ? Math.round(minutes.reduce((a, b) => a + b, 0) / minutes.length)
    : 0;
  const latest = [...items]
    .map((i) => i.datePublished)
    .filter(Boolean)
    .sort()
    .pop();
  const values: Record<InsightStatId, string> = {
    articles: String(items.length),
    subjects: String(insightTopics().length),
    read: avg + " min",
    published: latest
      ? new Date(latest + "T00:00:00Z").toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        })
      : "—",
  };
  const icons = statIcons();
  return insightStatCopy.map((stat) => ({
    ...stat,
    value: values[stat.id],
    icon: icons[stat.id],
  }));
}

/**
 * Articles per month over the six months ending at the most recent
 * publication.
 *
 * The window is a fixed six months rather than "months that have an article"
 * so the chart reads as a timeline: a quiet month has to be visible as a
 * quiet month, otherwise a run of four pieces in one week draws the same
 * shape as four spread over half a year.
 */
function buildCadence(items: Insight[]) {
  const tally = new Map<string, number>();
  for (const i of items) {
    if (!i.datePublished) continue;
    const key = i.datePublished.slice(0, 7);
    tally.set(key, (tally.get(key) ?? 0) + 1);
  }
  const last = [...tally.keys()].sort().pop();
  if (!last) return [];
  const end = new Date(last + "-01T00:00:00Z");
  const keys = Array.from({ length: 6 }, (_, n) => {
    const d = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - (5 - n), 1));
    return d.toISOString().slice(0, 7);
  });
  const peak = Math.max(1, ...keys.map((k) => tally.get(k) ?? 0));
  return keys.map((key) => {
    const n = tally.get(key) ?? 0;
    return {
      key,
      n,
      label: new Date(key + "-01T00:00:00Z").toLocaleDateString("en-GB", {
        month: "short",
        timeZone: "UTC",
      }),
      /* A month with nothing in it keeps a 3% stub, which reads as a
         baseline tick rather than as a rendering failure; a month with one
         piece gets a floor of 12% so it is unmistakably a bar. */
      height: n === 0 ? 3 : Math.max(12, Math.round((n / peak) * 100)),
    };
  });
}

const cadenceLabel = (cadence: { label: string; n: number }[]) =>
  "Articles published per month: " + cadence.map((c) => c.label + ", " + c.n).join("; ");

/* --------------------------------------------------------------- icons */
/* Inline rather than pulled from the icon package: four glyphs used once
   each, at a fixed size, with no variants to configure. */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
    <path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.4 10.1 12.8 4.5 10.9 10.1 9z" {...stroke} />
  </svg>
);
const TagIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
    <path d="M4 11V4.5A.5.5 0 0 1 4.5 4H11l8.5 8.5-6.5 6.5z" {...stroke} />
    <circle cx="8" cy="8" r="1.4" {...stroke} />
  </svg>
);
const ChartIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
    <path d="M4 20V10M10 20V5M16 20v-7M22 20H2" {...stroke} />
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
    <path
      d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"
      {...stroke}
    />
  </svg>
);
const LayersIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
    <path d="m12 3 8 4.5-8 4.5-8-4.5zM4 12l8 4.5 8-4.5M4 16.5 12 21l8-4.5" {...stroke} />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
    <circle cx="12" cy="12" r="8.5" {...stroke} />
    <path d="M12 7.5V12l3 2" {...stroke} />
  </svg>
);
const PulseIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
    <path d="M3 12h4l2.5-6 4 12L16 12h5" {...stroke} />
  </svg>
);
