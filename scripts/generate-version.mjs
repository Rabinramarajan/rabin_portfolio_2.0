/**
 * Bakes the release record into `src/generated/version.json`.
 *
 * The site cannot read `publish/` at runtime: `.dockerignore` keeps both
 * `publish/` and `.git` out of the image, and the standalone output only
 * carries `.next` + `public`. So the record is generated ahead of the build,
 * committed, and imported as a plain module — which works identically for the
 * Docker image and for a Git-based Vercel deploy.
 *
 * Run by `publish/publish.js` just before `docker buildx build`, with the
 * version that is about to be published. Run without `--version` it simply
 * mirrors whatever `publish/config.json` already records.
 *
 * Deliberately free of volatile fields (build timestamp, commit SHA): the file
 * must change only when a release happens, or every build would dirty the tree
 * and trip the clean-tree guard in publish.js.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "publish", "config.json");
const OUT_PATH = path.join(ROOT, "src", "generated", "version.json");

const args = process.argv.slice(2);
const flag = (name) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};

const environment = flag("env") ?? "prod";
const forcedVersion = flag("version");

// Inside the Docker build context `publish/` does not exist. Leave the
// committed file exactly as it is rather than replacing it with a stub.
if (!fs.existsSync(CONFIG_PATH)) {
  console.log("· publish/config.json not present — keeping existing version.json");
  process.exit(0);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
const target = config[environment];
if (!target) {
  console.error(`✗ No "${environment}" entry in publish/config.json.`);
  process.exit(1);
}

/* ---------- release history ---------- */

const LOG_LINE =
  /^Version:\s*([0-9.]+),\s*Last Updated:\s*([^,\s]+)(?:,\s*Digest:\s*(\S+))?\s*$/;

const logPath = path.join(ROOT, "publish", `build-log-${environment}.txt`);
const releases = (fs.existsSync(logPath) ? fs.readFileSync(logPath, "utf8") : "")
  .split("\n")
  .map((line) => LOG_LINE.exec(line.trim()))
  .filter(Boolean)
  .map(([, version, releasedAt, digest]) => ({
    version,
    releasedAt,
    // The log stores `repo@sha256:…`; the repo half is already known.
    digest: digest?.includes("@") ? digest.slice(digest.indexOf("@") + 1) : (digest ?? null),
  }));

/* The log is only written *after* a successful push, so the version currently
   being built is not in it yet. Add it so the image reports itself correctly. */
const version = forcedVersion ?? target.version;
const releasedAt =
  releases.find((r) => r.version === version)?.releasedAt ??
  (forcedVersion ? new Date().toISOString() : target.lastUpdated);

if (!releases.some((r) => r.version === version)) {
  releases.unshift({ version, releasedAt, digest: null });
}

/* ---------- write ---------- */

const record = {
  environment,
  project: target.project,
  registry: target.docker,
  version,
  releasedAt,
  releases,
};

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log(`✓ src/generated/version.json → v${version} (${releases.length} releases)`);
