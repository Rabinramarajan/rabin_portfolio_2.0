export function createReferenceId(now = new Date()): string {
  const stamp = now.toISOString().slice(0, 10).replaceAll("-", "");
  const entropy = crypto.randomUUID().replaceAll("-", "").slice(0, 4).toUpperCase();
  return `RR-${stamp}-${entropy}`;
}
