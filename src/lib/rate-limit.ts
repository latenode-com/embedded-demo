import { headers } from "next/headers";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitStore {
  map: Map<string, RateLimitEntry>;
  lastCleanup: number;
}

const globalForRateLimit = globalThis as unknown as {
  __rateLimitStore: RateLimitStore;
};

if (!globalForRateLimit.__rateLimitStore) {
  globalForRateLimit.__rateLimitStore = {
    map: new Map(),
    lastCleanup: Date.now(),
  };
}

const store = globalForRateLimit.__rateLimitStore;

const CLEANUP_INTERVAL_MS = 60_000;

function cleanup() {
  const now = Date.now();
  if (now - store.lastCleanup < CLEANUP_INTERVAL_MS) return;
  store.lastCleanup = now;
  for (const [key, entry] of store.map) {
    if (entry.resetAt <= now) store.map.delete(key);
  }
}

/**
 * In-memory sliding-window rate limiter.
 * Returns null if the request is allowed, or an error string if rate-limited.
 */
export function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): string | null {
  cleanup();

  const now = Date.now();
  const entry = store.map.get(key);

  if (!entry || entry.resetAt <= now) {
    store.map.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count++;

  if (entry.count > maxAttempts) {
    const waitSec = Math.ceil((entry.resetAt - now) / 1000);
    return `Too many requests. Please try again in ${waitSec} seconds.`;
  }

  return null;
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}
