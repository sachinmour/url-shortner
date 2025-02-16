import Redis from "ioredis";
import { env } from "~/env";

// Reuse the same Redis instance across the application
export const redis = new Redis(env.REDIS_URL);

// Cache TTL in seconds (24 hours)
export const CACHE_TTL = 24 * 60 * 60;

// Key prefix for URL cache
export const URL_CACHE_PREFIX = "url:";

// Helper functions for URL caching
export async function getCachedUrl(slug: string): Promise<string | null> {
  try {
    return redis.get(`${URL_CACHE_PREFIX}${slug}`);
  } catch (error) {
    // Log error but don't throw - treat as cache miss
    console.error("Redis getCachedUrl error:", error);
    return null;
  }
}

export async function setCachedUrl(
  slug: string,
  longUrl: string,
): Promise<void> {
  try {
    await redis.set(`${URL_CACHE_PREFIX}${slug}`, longUrl, "EX", CACHE_TTL);
  } catch (error) {
    // Log error but don't throw - cache updates are non-critical
    console.error("Redis setCachedUrl error:", error);
  }
}

export async function deleteCachedUrl(slug: string): Promise<void> {
  try {
    await redis.del(`${URL_CACHE_PREFIX}${slug}`);
  } catch (error) {
    // Log error but don't throw - cache deletions are non-critical
    console.error("Redis deleteCachedUrl error:", error);
  }
}
