import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './cache';
import type { RateLimitResult } from '@/types';

const ownerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  prefix: 'rl:owner',
});

const nonOwnerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, '4 h'),
  prefix: 'rl:user',
});

export function isOwner(username: string): boolean {
  const owner = process.env.GITHUB_OWNER_USERNAME ?? '';
  return username.toLowerCase() === owner.toLowerCase();
}

export async function checkRateLimit(username: string): Promise<RateLimitResult> {
  try {
    const limiter = isOwner(username) ? ownerLimiter : nonOwnerLimiter;
    const result = await limiter.limit(username.toLowerCase());
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (err) {
    console.error('[ratelimit] checkRateLimit error:', err);
    return { success: true, remaining: 0, reset: Date.now() + 3600000 };
  }
}
