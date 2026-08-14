const hits = new Map<string, { count: number; ts: number }>();
export function rateLimit(id: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const rec = hits.get(id);
  if (!rec || now - rec.ts > windowMs) { hits.set(id, { count: 1, ts: now }); return true; }
  rec.count += 1; return rec.count <= limit;
}
