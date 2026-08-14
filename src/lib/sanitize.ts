export function clean(value: unknown, max = 3000) {
  return String(value ?? '').replace(/<[^>]*>/g, '').trim().slice(0, max);
}
export function isEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
