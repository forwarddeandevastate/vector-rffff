/**
 * In-memory rate limiter (sliding window, per IP).
 * Подходит для serverless/edge только если один инстанс.
 * Для мультиинстансного деплоя — заменить на Redis.
 */

interface WindowEntry {
  count: number;
  resetAt: number; // unix ms
}

const store = new Map<string, WindowEntry>();

// Чистим старые записи каждые 5 минут, чтобы не копить память
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  /** Максимум запросов за windowMs */
  limit: number;
  /** Ширина окна в миллисекундах */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // unix ms
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    // Новое окно
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}
