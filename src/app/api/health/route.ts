import { NextResponse } from 'next/server';
import { redis } from '@/lib/cache';
import { createClient } from '@supabase/supabase-js';
import type { HealthResponse, HealthCheckResult } from '@/types';

async function checkRedis(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    await redis.ping();
    return { status: 'ok', latency_ms: Date.now() - start };
  } catch {
    return { status: 'error', latency_ms: Date.now() - start };
  }
}

async function checkSupabase(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { error } = await client.from('visitors').select('count').limit(1);
    if (error) throw error;
    return { status: 'ok', latency_ms: Date.now() - start };
  } catch {
    return { status: 'error', latency_ms: Date.now() - start };
  }
}

async function checkGitHub(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: '{ viewer { login } }' }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const remaining = Number(res.headers.get('X-RateLimit-Remaining') ?? 0);
    const resetTs = Number(res.headers.get('X-RateLimit-Reset') ?? 0);
    const reset = new Date(resetTs * 1000).toISOString();

    return {
      status: 'ok',
      latency_ms: Date.now() - start,
      rateLimit: { remaining, reset },
    };
  } catch {
    return { status: 'error', latency_ms: Date.now() - start };
  }
}

export async function GET(): Promise<NextResponse> {
  const [redisResult, supabaseResult, githubResult] = await Promise.all([
    checkRedis(),
    checkSupabase(),
    checkGitHub(),
  ]);

  const checks = { redis: redisResult, supabase: supabaseResult, github: githubResult };
  const statuses = Object.values(checks).map((c) => c.status);

  let status: HealthResponse['status'];
  if (statuses.every((s) => s === 'ok')) {
    status = 'ok';
  } else if (statuses.every((s) => s === 'error')) {
    status = 'error';
  } else {
    status = 'degraded';
  }

  const body: HealthResponse = {
    status,
    timestamp: new Date().toISOString(),
    checks,
  };

  return NextResponse.json(body, { status: status === 'error' ? 503 : 200 });
}
