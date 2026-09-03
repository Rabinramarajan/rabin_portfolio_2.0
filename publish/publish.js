const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(__dirname, "config.json");

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function run(command, args) {
  console.log(`→ ${command} ${args.join(" ")}`);
  execFileSync(command, args, { stdio: "inherit", cwd: ROOT });
}

// ---------- arguments ----------

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
const environments = Object.keys(config);

const [option, ...rest] = process.argv.slice(2);
const explicitVersion = rest.find((a) => /^\d+\.\d+\.\d+$/.test(a));
const bumpKind = rest.includes("--minor")
  ? "minor"
  : rest.includes("--major")
    ? "major"
    : "patch";

if (!option) fail(`Provide an environment. Options: ${environments.join(", ")}`);
if (!config[option]) fail(`No "${option}" entry in publish/config.json.`);

const target = config[option];
if (!target.docker) fail(`"${option}" has no "docker" repository configured.`);
if (!/^[A-Za-z0-9._\-/:]+$/.test(target.docker)) {
  fail(`"${option}".docker contains unexpected characters: ${target.docker}`);
}

// ---------- preflight ----------

// Never cut a production image from uncommitted work.
if (option === "prod") {
  const dirty = execFileSync("git", ["status", "--porcelain"], {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
  if (dirty && !rest.includes("--allow-dirty")) {
    fail(
      "Working tree is dirty. Commit first, or pass --allow-dirty to override.\n" +
        dirty,
    );
  }
}

if (!fs.existsSync(path.join(ROOT, "Dockerfile"))) {
  fail("No Dockerfile at the project root.");
}

/* Cheapest possible check that the daemon is reachable. Without it the run
   gets as far as writing the version module before docker reports it cannot
   connect — fail here instead, while nothing has been touched. */
try {
  execFileSync("docker", ["info"], { stdio: "ignore" });
} catch {
  fail(
    "Cannot reach the Docker daemon. Start Docker Desktop, wait for it to\n" +
      "  report Running, then re-run this command.",
  );
}

// ---------- version ----------

function nextVersion(current, kind) {
  const parts = String(current).split(".").map((n) => parseInt(n, 10));
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    fail(`Malformed version in config.json: "${current}"`);
  }
  let [major, minor, patch] = parts;
  if (kind === "major") return `${major + 1}.0.0`;
  if (kind === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

const version = explicitVersion || nextVersion(target.version, bumpKind);
const tag = `${target.docker}:v${version}`;

console.log(`Environment : ${option}`);
console.log(`Previous    : v${target.version}`);
console.log(`Publishing  : ${tag}\n`);

// ---------- build & push ----------

/* The site reads its version from a committed module, not from this folder:
   .dockerignore keeps publish/ out of the image. Generate it *before* the
   build so the image reports the version it is actually being tagged with.

   Because that write happens ahead of a step that can fail, stash the current
   contents first: a failed build must leave no trace of a version that was
   never pushed, or the working tree would claim a release that does not
   exist. */
const VERSION_MODULE = path.join(ROOT, "src", "generated", "version.json");
const versionModuleBefore = fs.existsSync(VERSION_MODULE)
  ? fs.readFileSync(VERSION_MODULE, "utf8")
  : null;

function restoreVersionModule() {
  if (versionModuleBefore === null) {
    if (fs.existsSync(VERSION_MODULE)) fs.rmSync(VERSION_MODULE);
  } else {
    fs.writeFileSync(VERSION_MODULE, versionModuleBefore, "utf8");
  }
}

run("node", ["scripts/generate-version.mjs", `--env=${option}`, `--version=${version}`]);

try {
  run("docker", [
    "buildx",
    "build",
    "--platform",
    "linux/amd64",
    "-t",
    tag,
    "--load",
    ".",
  ]);
  console.log(`✓ Built ${tag}`);

  run("docker", ["push", tag]);
  console.log(`✓ Pushed ${tag}`);
} catch (error) {
  restoreVersionModule();
  fail(
    `Build/push failed — version stays at v${target.version}.\n` +
      `  src/generated/version.json was rolled back; the tree is unchanged.\n${error.message}`,
  );
}

// ---------- record (only after a successful push) ----------

const digest = (() => {
  try {
    return execFileSync(
      "docker",
      ["inspect", "--format", "{{index .RepoDigests 0}}", tag],
      { encoding: "utf8" },
    ).trim();
  } catch {
    return "";
  }
})();

const now = new Date().toISOString();

// package.json is a mirror, not a source of truth — keep it from drifting.
const pkgPath = path.join(ROOT, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
if (pkg.version !== version) {
  pkg.version = version;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

target.version = version;
target.lastUpdated = now;
fs.writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`);

const logPath = path.join(__dirname, `build-log-${option}.txt`);
const previous = fs.existsSync(logPath) ? fs.readFileSync(logPath, "utf8") : "";
const entry = `Version: ${version}, Last Updated: ${now}${digest ? `, Digest: ${digest}` : ""}\n`;
fs.writeFileSync(logPath, entry + previous, "utf8");

console.log(`\n✓ v${version} published to ${target.docker}`);
console.log(
  "  Commit publish/config.json, the build log, package.json and\n" +
    "  src/generated/version.json to record this release.",
);
