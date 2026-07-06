jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    ping: jest.fn().mockResolvedValue('PONG'),
  })),
}));

jest.mock('@upstash/ratelimit', () => {
  const MockRatelimit = jest.fn().mockImplementation(() => ({
    limit: jest.fn().mockResolvedValue({ success: true, remaining: 9, reset: Date.now() + 3600000 }),
  }));
  (MockRatelimit as unknown as Record<string, unknown>).slidingWindow = jest
    .fn()
    .mockReturnValue({});
  return { Ratelimit: MockRatelimit };
});

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    rpc: jest.fn().mockResolvedValue({ data: 1, error: null }),
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: { count: 0 }, error: null }),
        }),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
  }),
}));

afterEach(() => {
  jest.clearAllMocks();
});
