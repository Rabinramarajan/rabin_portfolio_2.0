/**
 * Fixed-window in-process rate limiter.
 *
 * SCOPE: per instance, in memory. Behind more than one server process (or
 * across serverless invocations) each instance keeps its own counters, so the
 * effective limit is `limit x instances`. That is acceptable for what it
 * guards here — abuse dampening on the contact and chat endpoints, not quota
 * enforcement. A shared store would be needed to make it exact.
 */
const hits = new Map<string, { count: number; ts: number }>();

/* Entries were previously never removed: one map key per client identity, kept
   for the lifetime of the process. In a long-lived container that grows
   without bound. Sweeping on write keeps it proportional to *active* clients
   with no timer to leak. */
const SWEEP_EVERY = 500;
let writesSinceSweep = 0;

function sweep(now: number, windowMs: number) {
  for (const [key, rec] of hits) {
    if (now - rec.ts > windowMs) hits.delete(key);
  }
}

export function rateLimit(id: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();

  if (++writesSinceSweep >= SWEEP_EVERY) {
    writesSinceSweep = 0;
    sweep(now, windowMs);
  }

  const rec = hits.get(id);
  if (!rec || now - rec.ts > windowMs) {
    hits.set(id, { count: 1, ts: now });
    return true;
  }
  rec.count += 1;
  return rec.count <= limit;
}
