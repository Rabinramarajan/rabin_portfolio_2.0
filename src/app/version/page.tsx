import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import {
  formatReleaseDate,
  formatReleaseTime,
  releaseKind,
  releases,
  versionRecord,
} from "@/lib/version";

export const metadata = {
  ...pageMetadata({
    title: "Release History",
    description:
      "Deployment and release history for this site — every published version, when it shipped, and the container image digest behind it.",
    path: "/version",
  }),
  // A build ledger has no search value and would dilute the indexed pages.
  robots: { index: false, follow: true },
};

const KIND_LABEL = {
  major: "Major",
  minor: "Minor",
  patch: "Patch",
  initial: "Initial",
} as const;

export default function Page() {
  const [current] = releases;

  return (
    <main className="vr">
      <header className="vr__head">
        <p className="vr__eyebrow">Build ledger</p>
        <h1 className="vr__title">Release History</h1>
        <p className="vr__lede">
          Every version of this site is built as a container image and pushed to the Vercel
          registry. This is the full record — newest first.
        </p>

        <dl className="vr__facts">
          <div className="vr__fact">
            <dt>Running</dt>
            <dd className="vr__fact-strong">v{versionRecord.version}</dd>
          </div>
          <div className="vr__fact">
            <dt>Shipped</dt>
            <dd>{formatReleaseDate(versionRecord.releasedAt)}</dd>
          </div>
          <div className="vr__fact">
            <dt>Environment</dt>
            <dd>{versionRecord.environment}</dd>
          </div>
          <div className="vr__fact">
            <dt>Releases</dt>
            <dd>{releases.length}</dd>
          </div>
        </dl>

        <p className="vr__registry">
          <span>Registry</span>
          <code>{versionRecord.registry}</code>
        </p>
      </header>

      <ol className="vr__list">
        {releases.map((release, i) => {
          const kind = releaseKind(release.version, releases[i + 1]?.version);
          const isCurrent = release.version === current?.version;

          return (
            <li key={release.version} className="vr__item">
              <div className="vr__marker" aria-hidden>
                <span className={`vr__dot${isCurrent ? " vr__dot--live" : ""}`} />
              </div>

              <article className="vr__card">
                <div className="vr__row">
                  <h2 className="vr__version">v{release.version}</h2>
                  <span className={`vr__tag vr__tag--${kind}`}>{KIND_LABEL[kind]}</span>
                  {isCurrent ? <span className="vr__tag vr__tag--live">Live</span> : null}
                </div>

                <p className="vr__when">
                  <time dateTime={release.releasedAt}>{formatReleaseDate(release.releasedAt)}</time>
                  <span aria-hidden>·</span>
                  <span>{formatReleaseTime(release.releasedAt)}</span>
                </p>

                {release.digest ? (
                  <p className="vr__digest">
                    <span className="vr__digest-label">Image digest</span>
                    <code title={release.digest}>{release.digest}</code>
                  </p>
                ) : (
                  <p className="vr__digest vr__digest--none">Digest not recorded</p>
                )}
              </article>
            </li>
          );
        })}
      </ol>

      <footer className="vr__foot">
        <p>
          Curious how it is built and deployed?{" "}
          <Link href="/skills">
            See the stack
            <ArrowUpRight size={14} aria-hidden />
          </Link>
        </p>
      </footer>
    </main>
  );
}
