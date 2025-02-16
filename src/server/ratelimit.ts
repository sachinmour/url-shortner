import Redis from "ioredis";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";

const redis = new Redis(env.REDIS_URL);

const WINDOW_SIZE = 10; // 10 seconds
const MAX_REQUESTS = 10; // 10 requests per window

export async function checkRateLimit(identifier: string): Promise<void> {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const windowStart = now - WINDOW_SIZE;
  const key = `ratelimit:${identifier}`;

  // Remove old requests and add new request
  await redis
    .multi()
    .zremrangebyscore(key, 0, windowStart) // Remove old entries
    .zadd(key, now, `${now}-${Math.random()}`) // Add current request with unique score
    .zcard(key) // Get count of requests in window
    .expire(key, WINDOW_SIZE) // Set expiry
    .exec();

  // Get the current count of requests
  const count = await redis.zcard(key);

  if (count > MAX_REQUESTS) {
    // Get the oldest request timestamp
    const oldestRequest = await redis.zrange(key, 0, 0, "WITHSCORES");
    const resetTime = oldestRequest[1]
      ? parseInt(oldestRequest[1]) + WINDOW_SIZE
      : now + WINDOW_SIZE;

    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `Rate limit exceeded. Please try again in ${resetTime - now} seconds`,
    });
  }
}
