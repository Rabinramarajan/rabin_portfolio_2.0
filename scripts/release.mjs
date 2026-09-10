/**
 * One command to cut a release and take it live on Vercel.
 *
 *   npm run release              # release the pending version, or bump patch
 *   npm run release -- --minor   # force a minor bump
 *   npm run release -- 1.2.0     # release an explicit version
 *   npm run release -- --dry-run # show what would happen, touch nothing
 *   npm run release -- --no-deploy
 *
 * This is the *Vercel* path. `publish/publish.js` is the separate
 * Kubernetes/ArgoCD path: it builds and pushes a `:vX.Y.Z` tag locally.
 * Vercel builds its own image from Dockerfile.vercel and never reads those
 * tags, so the two must not be run for the same release.
 *
 * Order matters. The version record is baked into the image at build time
 * (src/generated/version.json is imported as a module — see src/lib/version.ts),
 * so every version file must be written and committed *before* the deploy.
 * A failed deploy therefore leaves a commit describing a release that is not
 * live; the script says so explicitly rather than silently rolling back, since
 * rewriting an already-created commit is the more surprising outcome.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENV = "prod";

const CONFIG_PATH = path.join(ROOT, "publish", "config.json");
const PKG_PATH = path.join(ROOT, "package.json");
const LOG_PATH = path.join(ROOT, "publish", `build-log-${ENV}.txt`);

const args = process.argv.slice(2);
const has = (f) => args.includes(`--${f}`);
const dryRun = has("dry-run");
const noDeploy = has("no-deploy");
const explicitVersion = args.find((a) => /^\d+\.\d+\.\d+$/.test(a));
const bumpKind = has("major") ? "major" : has("minor") ? "minor" : "patch";

const fail = (m) => {
  console.error(`\n✗ ${m}\n`);
  process.exit(1);
};
const step = (m) => console.log(`\n→ ${m}`);

/* On Windows npm and vercel are `.cmd` shims. execFile reports ENOENT for the
   bare name and EINVAL for the explicit `.cmd` (Node 20+ refuses to launch a
   batch file without a shell), so a shim run without `shell` looks exactly
   like a tool that is not installed. Hence the flag — scoped to these two.
   `shell: true` concatenates arguments unescaped, which is safe only because
   every argument passed to them here is a literal flag containing no spaces;
   git keeps the default path since its commit message does contain spaces. */
const SHIMS = new Set(["npm", "vercel"]);
const needsShell = (cmd) => process.platform === "win32" && SHIMS.has(cmd);

const run = (cmd, cmdArgs) => {
  if (dryRun) {
    console.log(`  [dry-run] ${cmd} ${cmdArgs.join(" ")}`);
    return "";
  }
  return execFileSync(cmd, cmdArgs, {
    cwd: ROOT,
    stdio: "inherit",
    shell: needsShell(cmd),
  });
};

/* ---------- work out the version ---------- */

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
const target = config[ENV];
if (!target) fail(`No "${ENV}" entry in publish/config.json.`);

const log = fs.existsSync(LOG_PATH) ? fs.readFileSync(LOG_PATH, "utf8") : "";
const released = new Set(
  log
    .split("\n")
    .map((l) => /^Version:\s*([0-9.]+),/.exec(l.trim()))
    .filter(Boolean)
    .map((m) => m[1]),
);

function bump(current, kind) {
  const parts = String(current).split(".").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    fail(`Malformed version in publish/config.json: "${current}"`);
  }
  const [major, minor, patch] = parts;
  if (kind === "major") return `${major + 1}.0.0`;
  if (kind === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

/* config.json can already name a version that was bumped by hand but never
   shipped. The build log is the record of what actually went out, so a version
   absent from it is still pending — release that rather than skipping a number. */
const pending = !released.has(target.version);
const version =
  explicitVersion ??
  (pending && !has("major") && !has("minor") ? target.version : bump(target.version, bumpKind));

if (released.has(version)) {
  fail(
    `v${version} is already in ${path.relative(ROOT, LOG_PATH)}.\n` +
      `  Pass an explicit version, or --minor / --major.`,
  );
}

const releasedAt = new Date().toISOString();

console.log(`Environment : ${ENV}`);
console.log(`Previous    : v${target.version}${pending ? " (pending, never shipped)" : ""}`);
console.log(`Releasing   : v${version}`);
console.log(`Timestamp   : ${releasedAt}`);
if (dryRun) console.log("\n(dry run — no files written, nothing deployed)");

/* ---------- preflight ---------- */

if (!noDeploy && !dryRun) {
  try {
    execFileSync("vercel", ["--version"], { stdio: "ignore", shell: needsShell("vercel") });
  } catch {
    fail("Vercel CLI not found. Install it with `npm i -g vercel`, then re-run.");
  }
}

step("Gate: lint, typecheck, tests, build");
run("npm", ["run", "lint"]);
run("npm", ["run", "typecheck"]);
run("npm", ["test"]);
run("npm", ["run", "build"]);

/* ---------- write every version file ---------- */

step("Updating version files");

if (!dryRun) {
  target.version = version;
  target.lastUpdated = releasedAt;
  fs.writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`);

  const pkg = JSON.parse(fs.readFileSync(PKG_PATH, "utf8"));
  pkg.version = version;
  fs.writeFileSync(PKG_PATH, `${JSON.stringify(pkg, null, 2)}\n`);

  /* Newest first, matching the order generate-version.mjs expects. The digest
     is left off: Vercel builds the image itself, so nothing local can report
     one. `vercel vcr tag ls` has it if it is ever needed. */
  fs.writeFileSync(LOG_PATH, `Version: ${version}, Last Updated: ${releasedAt}\n${log}`, "utf8");
}

console.log("  publish/config.json, package.json, publish/build-log-prod.txt");

// Rebuilt from the log above, so the timeline on /version and the footer agree.
run("node", ["scripts/generate-version.mjs", `--env=${ENV}`]);

/* ---------- commit ---------- */

step("Committing the release");
run("git", [
  "add",
  "publish/config.json",
  "package.json",
  `publish/build-log-${ENV}.txt`,
  "src/generated/version.json",
]);
run("git", ["commit", "-m", `chore: release v${version}`]);

/* ---------- deploy ---------- */

if (noDeploy) {
  console.log(`\n✓ v${version} committed. Deploy with: vercel deploy --prod --yes\n`);
  process.exit(0);
}

step(`Deploying v${version} to production`);
try {
  run("vercel", ["deploy", "--prod", "--yes"]);
} catch (error) {
  fail(
    `Deploy failed. v${version} is committed but NOT live.\n` +
      `  Fix the cause and run: vercel deploy --prod --yes\n` +
      `  (Do not re-run this script — it would skip to the next version.)\n${error.message}`,
  );
}

if (dryRun) {
  console.log(`\n✓ Dry run complete — v${version} would be released. Nothing was changed.\n`);
} else {
  console.log(`\n✓ v${version} is live.`);
  console.log("  Verify: curl https://www.rabinr.in/api/health");
  console.log("  Push the release commit: git push\n");
}
