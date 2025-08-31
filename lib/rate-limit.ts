// Simple in-memory rate limiter for development/local use.
// For production/serverless use a distributed solution (e.g., Upstash Ratelimit).
type Key = string;

const hits = new Map<Key, { count: number; resetAt: number }>();

export function rateLimit(key: Key, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const item = hits.get(key);
  if (!item || now > item.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (item.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: item.resetAt };
  }
  item.count += 1;
  return { allowed: true, remaining: limit - item.count, resetAt: item.resetAt };
}

