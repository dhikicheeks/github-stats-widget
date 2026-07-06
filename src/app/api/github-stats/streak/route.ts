import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/ratelimit';
import { getCache, setCache, getStale, setStale, getTtl } from '@/lib/cache';
import { fetchStreak } from '@/lib/github';
import { renderStreak } from '@/lib/svg/streak';
import { renderRateLimit } from '@/lib/svg/error';
import { FALLBACK_STREAK } from '@/lib/fallback';
import type { StreakData } from '@/types';

function svgResponse(svg: string, extra?: Record<string, string>): NextResponse {
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      ...extra,
    },
  });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const username =
    request.nextUrl.searchParams.get('username') ?? process.env.GITHUB_OWNER_USERNAME ?? '';

  const cacheKey = `github_streak_${username}`;
  const baseHeaders = { 'X-Username': username };

  try {
    const cached = await getCache<StreakData>(cacheKey);
    if (cached) {
      return svgResponse(renderStreak(cached, username), {
        ...baseHeaders,
        'X-Cache': 'HIT',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': '0',
      });
    }

    const rl = await checkRateLimit(username);

    if (!rl.success) {
      const stale = await getStale<StreakData>(cacheKey);
      if (stale) {
        return svgResponse(renderStreak(stale, username), {
          ...baseHeaders,
          'X-Cache': 'STALE',
          'X-RateLimit-Remaining': String(rl.remaining),
          'X-RateLimit-Reset': String(rl.reset),
        });
      }
      return svgResponse(renderRateLimit(), {
        ...baseHeaders,
        'X-Cache': 'MISS',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(rl.reset),
      });
    }

    const data = await fetchStreak(username);
    const result = data ?? FALLBACK_STREAK;
    const ttl = getTtl(username);

    await Promise.all([setCache(cacheKey, result, ttl), setStale(cacheKey, result)]);

    return svgResponse(renderStreak(result, username), {
      ...baseHeaders,
      'X-Cache': 'MISS',
      'X-RateLimit-Remaining': String(rl.remaining),
      'X-RateLimit-Reset': String(rl.reset),
    });
  } catch (err) {
    console.error('[streak] unhandled error:', err);
    return svgResponse(renderStreak(FALLBACK_STREAK, username), {
      ...baseHeaders,
      'X-Cache': 'MISS',
    });
  }
}
