export interface TopLanguage {
  name: string;
  color: string;
  percentage: number;
  rank: number;
}

export interface StreakData {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  firstContribution: string;
  lastContribution: string;
}

export interface TrophyData {
  totalStars: number;
  followers: number;
  commits: number;
  prs: number;
  issues: number;
  accountAge: number;
}

export interface VisitorData {
  count: number;
  label: string;
}

export type TrophyTier = 'S' | 'AAA' | 'AA' | 'A' | 'B' | 'C' | '';

export interface GitHubApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface CacheConfig {
  ownerTtl: number;
  nonOwnerTtl: number;
}

export interface RateLimitConfig {
  ownerLimit: number;
  nonOwnerLimit: number;
  ownerWindow: string;
  nonOwnerWindow: string;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

export interface HealthCheckResult {
  status: 'ok' | 'error';
  latency_ms: number;
  rateLimit?: {
    remaining: number;
    reset: string;
  };
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  checks: {
    redis: HealthCheckResult;
    supabase: HealthCheckResult;
    github: HealthCheckResult;
  };
}
