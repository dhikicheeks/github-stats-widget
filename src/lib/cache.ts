import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get<T>(key);
    return value ?? null;
  } catch (err) {
    console.error('[cache] getCache error:', err);
    return null;
  }
}

export async function setCache<T>(key: string, value: T, ttl: number): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttl });
  } catch (err) {
    console.error('[cache] setCache error:', err);
  }
}

export async function getStale<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get<T>(`stale:${key}`);
    return value ?? null;
  } catch (err) {
    console.error('[cache] getStale error:', err);
    return null;
  }
}

export async function setStale<T>(key: string, value: T): Promise<void> {
  try {
    await redis.set(`stale:${key}`, value);
  } catch (err) {
    console.error('[cache] setStale error:', err);
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (err) {
    console.error('[cache] deleteCache error:', err);
  }
}

export function getTtl(username: string): number {
  const owner = process.env.GITHUB_OWNER_USERNAME ?? '';
  return username.toLowerCase() === owner.toLowerCase() ? 3600 : 14400;
}

export { redis };
