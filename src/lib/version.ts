import record from "@/generated/version.json";

/**
 * The published release record, baked in at build time by
 * `scripts/generate-version.mjs` (see that file for why it cannot be read
 * from `publish/` at runtime).
 */

export interface Release {
  version: string;
  releasedAt: string;
  /** `sha256:…` of the pushed image. Null for a release built but not yet pushed. */
  digest: string | null;
}

export interface VersionRecord {
  environment: string;
  project: string;
  registry: string;
  version: string;
  releasedAt: string;
  releases: Release[];
}

export const versionRecord = record as VersionRecord;

/** Current version, display-ready: `v1.0.3`. */
export const displayVersion = `v${versionRecord.version}`;

/** Newest first — the generator writes them in that order. */
export const releases: Release[] = versionRecord.releases;

/** `2 Sep 2026` in a fixed locale, so server and client render the same string. */
export function formatReleaseDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** `21:06 UTC` — paired with the date on the release timeline. */
export function formatReleaseTime(iso: string): string {
  return `${new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  })} UTC`;
}

/**
 * Semver kind relative to the release that preceded it — drives the badge on
 * the timeline. The oldest entry has nothing to compare against.
 */
export function releaseKind(version: string, previous?: string): "major" | "minor" | "patch" | "initial" {
  if (!previous) return "initial";
  const [maj, min] = version.split(".").map(Number);
  const [pMaj, pMin] = previous.split(".").map(Number);
  if (maj !== pMaj) return "major";
  if (min !== pMin) return "minor";
  return "patch";
}
