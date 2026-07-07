import { NextRequest, NextResponse } from 'next/server';
import { incrementVisitor } from '@/lib/supabase';
import { renderVisitor } from '@/lib/svg/visitor';

function svgResponse(svg: string, extra?: Record<string, string>): NextResponse {
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-store, max-age=0',
      ...extra,
    },
  });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const label = request.nextUrl.searchParams.get('label') ?? 'Profile views';
  const key = `visitor_${label.toLowerCase().replace(/\s+/g, '-')}`;

  try {
    const count = await incrementVisitor(key);
    return svgResponse(renderVisitor(count, label));
  } catch (err) {
    console.error('[visitor] unhandled error:', err);
    return svgResponse(renderVisitor(0, label));
  }
}
