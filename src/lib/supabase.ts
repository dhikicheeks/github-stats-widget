import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const memoryFallback = new Map<string, number>();

export async function incrementVisitor(key: string): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('increment_visitor', { p_key: key });
    if (error) throw error;
    const count = typeof data === 'number' ? data : 1;
    memoryFallback.set(key, count);
    return count;
  } catch (err) {
    console.error('[supabase] incrementVisitor error:', err);
    const current = memoryFallback.get(key) ?? 0;
    const next = current + 1;
    memoryFallback.set(key, next);
    return next;
  }
}

export async function getVisitorCount(key: string): Promise<number> {
  try {
    const { data, error } = await supabase.from('visitors').select('count').eq('key', key).single();
    if (error) throw error;
    return (data as { count: number } | null)?.count ?? 0;
  } catch (err) {
    console.error('[supabase] getVisitorCount error:', err);
    return memoryFallback.get(key) ?? 0;
  }
}
