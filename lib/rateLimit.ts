/**
 * In-memory sliding window rate limiter.
 * Limits requests per IP to protect against abuse and DDoS.
 *
 * Config:
 *   MAX_REQUESTS — max allowed requests per window
 *   WINDOW_MS    — rolling window duration in ms
 *   BLOCK_MS     — how long to block an IP after limit exceeded
 */

const MAX_REQUESTS = 10;
const WINDOW_MS = 60_000;   // 1 minute
const BLOCK_MS = 120_000;   // 2 minutes cooldown after exceeding limit

interface IpRecord {
  timestamps: number[];
  blockedUntil: number;
}

const store = new Map<string, IpRecord>();

// Periodically clean up old entries to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of store.entries()) {
    const stale = record.blockedUntil < now &&
      record.timestamps.every((t) => now - t > WINDOW_MS);
    if (stale) store.delete(ip);
  }
}, 60_000);

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSec: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  let record = store.get(ip);

  if (!record) {
    record = { timestamps: [], blockedUntil: 0 };
    store.set(ip, record);
  }

  // Still blocked
  if (record.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((record.blockedUntil - now) / 1000),
    };
  }

  // Purge timestamps outside the window
  record.timestamps = record.timestamps.filter((t) => now - t < WINDOW_MS);

  if (record.timestamps.length >= MAX_REQUESTS) {
    record.blockedUntil = now + BLOCK_MS;
    return {
      allowed: false,
      retryAfterSec: Math.ceil(BLOCK_MS / 1000),
    };
  }

  record.timestamps.push(now);
  return { allowed: true, retryAfterSec: 0 };
}
