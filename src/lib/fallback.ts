import type { TopLanguage, StreakData, TrophyData } from '@/types';

export const FALLBACK_TOP_LANGUAGES: TopLanguage[] = [
  { name: 'TypeScript', color: '#3178c6', percentage: 38.0, rank: 1 },
  { name: 'Dart', color: '#00B4AB', percentage: 25.0, rank: 2 },
  { name: 'PHP', color: '#4F5D95', percentage: 20.0, rank: 3 },
  { name: 'Go', color: '#00ADD8', percentage: 17.0, rank: 4 },
];

export const FALLBACK_STREAK: StreakData = {
  totalContributions: 0,
  currentStreak: 0,
  longestStreak: 0,
  firstContribution: new Date().toISOString().split('T')[0],
  lastContribution: new Date().toISOString().split('T')[0],
};

export const FALLBACK_TROPHY: TrophyData = {
  totalStars: 0,
  followers: 0,
  commits: 0,
  prs: 0,
  issues: 0,
  accountAge: 0,
};
