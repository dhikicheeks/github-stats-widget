import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/ratelimit';
import { getCache, setCache, getStale, setStale, getTtl } from '@/lib/cache';
import { fetchTrophyData } from '@/lib/github';
import { renderTrophy } from '@/lib/svg/trophy';
import { renderRateLimit } from '@/lib/svg/error';
import { FALLBACK_TROPHY } from '@/lib/fallback';
import type { TrophyData } from '@/types';

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

  const cacheKey = `github_trophy_${username}`;
  const baseHeaders = { 'X-Username': username };

  try {
    const cached = await getCache<TrophyData>(cacheKey);
    if (cached) {
      return svgResponse(renderTrophy(cached, username), {
        ...baseHeaders,
        'X-Cache': 'HIT',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': '0',
      });
    }

    const rl = await checkRateLimit(username);

    if (!rl.success) {
      const stale = await getStale<TrophyData>(cacheKey);
      if (stale) {
        return svgResponse(renderTrophy(stale, username), {
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

    const data = await fetchTrophyData(username);
    const result = data ?? FALLBACK_TROPHY;
    const ttl = getTtl(username);

    await Promise.all([setCache(cacheKey, result, ttl), setStale(cacheKey, result)]);

    return svgResponse(renderTrophy(result, username), {
      ...baseHeaders,
      'X-Cache': 'MISS',
      'X-RateLimit-Remaining': String(rl.remaining),
      'X-RateLimit-Reset': String(rl.reset),
    });
  } catch (err) {
    console.error('[trophy] unhandled error:', err);
    return svgResponse(renderTrophy(FALLBACK_TROPHY, username), {
      ...baseHeaders,
      'X-Cache': 'MISS',
    });
  }
}
