import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/ratelimit';
import { getCache, setCache, getStale, setStale, getTtl } from '@/lib/cache';
import { fetchTopLanguages } from '@/lib/github';
import { renderTopLanguages } from '@/lib/svg/top-langs';
import { renderRateLimit } from '@/lib/svg/error';
import { FALLBACK_TOP_LANGUAGES } from '@/lib/fallback';
import type { TopLanguage } from '@/types';

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

  const cacheKey = `github_langs_${username}`;
  const baseHeaders = { 'X-Username': username };

  try {
    const cached = await getCache<TopLanguage[]>(cacheKey);
    if (cached) {
      return svgResponse(renderTopLanguages(cached, username), {
        ...baseHeaders,
        'X-Cache': 'HIT',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': '0',
      });
    }

    const rl = await checkRateLimit(username);

    if (!rl.success) {
      const stale = await getStale<TopLanguage[]>(cacheKey);
      if (stale) {
        return svgResponse(renderTopLanguages(stale, username), {
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

    const data = await fetchTopLanguages(username);
    const result = data ?? FALLBACK_TOP_LANGUAGES;
    const ttl = getTtl(username);

    await Promise.all([setCache(cacheKey, result, ttl), setStale(cacheKey, result)]);

    return svgResponse(renderTopLanguages(result, username), {
      ...baseHeaders,
      'X-Cache': 'MISS',
      'X-RateLimit-Remaining': String(rl.remaining),
      'X-RateLimit-Reset': String(rl.reset),
    });
  } catch (err) {
    console.error('[top-langs] unhandled error:', err);
    return svgResponse(renderTopLanguages(FALLBACK_TOP_LANGUAGES, username), {
      ...baseHeaders,
      'X-Cache': 'MISS',
    });
  }
}
