import version from "@/generated/version.json";

/* Probe endpoint for Kubernetes liveness/readiness (see deploy/base/deployment.yaml).
   Deliberately does no I/O: it answers "is this process serving?", not "are the
   downstream services healthy?". A readiness probe that fails on a slow upstream
   would pull healthy pods out of rotation for someone else's outage. */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { status: "ok", version: version.version, uptime: process.uptime() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
