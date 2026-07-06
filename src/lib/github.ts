import type { TopLanguage, StreakData, TrophyData } from '@/types';
import { FALLBACK_STREAK } from '@/lib/fallback';

const GITHUB_API = 'https://api.github.com/graphql';

async function gqlFetch<T>(query: string, variables: Record<string, unknown>): Promise<T | null> {
  try {
    const res = await fetch(GITHUB_API, {
      method: 'POST',
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (res.status === 403 || res.status === 429) {
      console.error('[github] rate limit hit:', res.status);
      return null;
    }

    if (!res.ok) {
      console.error('[github] http error:', res.status);
      return null;
    }

    const json = (await res.json()) as { data?: T; errors?: unknown[] };

    if (json.errors) {
      console.error('[github] graphql errors:', json.errors);
      return null;
    }

    return json.data ?? null;
  } catch (err) {
    console.error('[github] fetch error:', err);
    return null;
  }
}

const TOP_LANGS_QUERY = `
  query TopLanguages($username: String!) {
    user(login: $username) {
      repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
        nodes {
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

interface TopLangsGQL {
  user: {
    repositories: {
      nodes: Array<{
        languages: {
          edges: Array<{
            size: number;
            node: { name: string; color: string | null };
          }>;
        };
      }>;
    };
  } | null;
}

export async function fetchTopLanguages(username: string): Promise<TopLanguage[] | null> {
  try {
    const data = await gqlFetch<TopLangsGQL>(TOP_LANGS_QUERY, { username });
    if (!data?.user) return null;

    const langMap = new Map<string, { size: number; color: string }>();

    for (const repo of data.user.repositories.nodes) {
      for (const edge of repo.languages.edges) {
        const { name, color } = edge.node;
        const existing = langMap.get(name);
        langMap.set(name, {
          size: (existing?.size ?? 0) + edge.size,
          color: color ?? '#ccc',
        });
      }
    }

    const total = Array.from(langMap.values()).reduce((sum, l) => sum + l.size, 0);
    if (total === 0) return null;

    return Array.from(langMap.entries())
      .map(([name, { size, color }], i) => ({
        name,
        color,
        percentage: Math.round((size / total) * 1000) / 10,
        rank: i + 1,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 8)
      .map((l, i) => ({ ...l, rank: i + 1 }));
  } catch (err) {
    console.error('[github] fetchTopLanguages error:', err);
    return null;
  }
}

const USER_CREATED_AT_QUERY = `
  query UserCreatedAt($username: String!) {
    user(login: $username) {
      createdAt
    }
  }
`;

interface UserCreatedAtGQL {
  user: { createdAt: string } | null;
}

const CONTRIBUTION_YEAR_QUERY = `
  query ContributionYear($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

interface ContributionYear {
  totalContributions: number;
  weeks: Array<{
    contributionDays: Array<{
      contributionCount: number;
      date: string;
    }>;
  }>;
}

interface ContributionYearGQL {
  user: {
    contributionsCollection: {
      contributionCalendar: ContributionYear;
    };
  } | null;
}

function getYearRanges(createdAt: string): Array<{ from: string; to: string }> {
  const startYear = new Date(createdAt).getFullYear();
  const currentYear = new Date().getFullYear();
  const ranges: Array<{ from: string; to: string }> = [];

  for (let year = startYear; year <= currentYear; year++) {
    ranges.push({
      from: `${year}-01-01T00:00:00Z`,
      to: year === currentYear ? new Date().toISOString() : `${year}-12-31T23:59:59Z`,
    });
  }

  return ranges;
}

async function fetchContributionYear(
  username: string,
  from: string,
  to: string
): Promise<ContributionYear | null> {
  const data = await gqlFetch<ContributionYearGQL>(CONTRIBUTION_YEAR_QUERY, { username, from, to });
  return data?.user?.contributionsCollection?.contributionCalendar ?? null;
}

export async function fetchStreak(username: string): Promise<StreakData | null> {
  try {
    const createdAtData = await gqlFetch<UserCreatedAtGQL>(USER_CREATED_AT_QUERY, { username });
    if (!createdAtData?.user) return null;

    const yearRanges = getYearRanges(createdAtData.user.createdAt);

    const results = await Promise.all(
      yearRanges.map(async (range) => {
        const result = await fetchContributionYear(username, range.from, range.to);
        if (result === null) {
          console.error('[streak] failed year:', range.from);
        }
        return result;
      })
    );

    const validResults = results.filter((r): r is ContributionYear => r !== null);

    if (validResults.length === 0) {
      return FALLBACK_STREAK;
    }

    let totalContributions = 0;
    const allWeeks: ContributionYear['weeks'] = [];
    const seenWeeks = new Set<string>();

    for (const result of validResults) {
      totalContributions += result.totalContributions;
      for (const week of result.weeks) {
        const key = week.contributionDays[0]?.date;
        if (key && !seenWeeks.has(key)) {
          seenWeeks.add(key);
          allWeeks.push(week);
        }
      }
    }

    allWeeks.sort((a, b) => {
      const dateA = a.contributionDays[0]?.date ?? '';
      const dateB = b.contributionDays[0]?.date ?? '';
      return dateA.localeCompare(dateB);
    });

    let firstContribution = '';
    let lastContribution = '';

    for (const week of allWeeks) {
      for (const day of week.contributionDays) {
        if (day.contributionCount > 0) {
          if (!firstContribution || day.date < firstContribution) firstContribution = day.date;
          if (!lastContribution || day.date > lastContribution) lastContribution = day.date;
        }
      }
    }

    const weekActivity = allWeeks.map((w) => w.contributionDays.some((d) => d.contributionCount > 0));

    let longestStreak = 0;
    let streak = 0;
    for (const active of weekActivity) {
      if (active) {
        streak++;
        if (streak > longestStreak) longestStreak = streak;
      } else {
        streak = 0;
      }
    }

    let currentStreak = 0;
    let i = weekActivity.length - 1;
    if (!weekActivity[i]) i--;
    while (i >= 0 && weekActivity[i]) {
      currentStreak++;
      i--;
    }

    const today = new Date().toISOString().split('T')[0];

    return {
      totalContributions,
      currentStreak,
      longestStreak,
      firstContribution: firstContribution || today,
      lastContribution: lastContribution || today,
    };
  } catch (err) {
    console.error('[github] fetchStreak error:', err);
    return null;
  }
}

const TROPHY_QUERY = `
  query Trophy($username: String!) {
    user(login: $username) {
      repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
        totalCount
        nodes {
          stargazerCount
        }
      }
      followers {
        totalCount
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
      }
      createdAt
    }
  }
`;

interface TrophyGQL {
  user: {
    repositories: {
      totalCount: number;
      nodes: Array<{ stargazerCount: number }>;
    };
    followers: { totalCount: number };
    contributionsCollection: {
      totalCommitContributions: number;
      totalPullRequestContributions: number;
      totalIssueContributions: number;
    };
    createdAt: string;
  } | null;
}

export async function fetchTrophyData(username: string): Promise<TrophyData | null> {
  try {
    const data = await gqlFetch<TrophyGQL>(TROPHY_QUERY, { username });
    if (!data?.user) return null;

    const { user } = data;
    const totalStars = user.repositories.nodes.reduce((sum, r) => sum + r.stargazerCount, 0);
    const accountAge = Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365)
    );

    return {
      totalStars,
      followers: user.followers.totalCount,
      commits: user.contributionsCollection.totalCommitContributions,
      prs: user.contributionsCollection.totalPullRequestContributions,
      issues: user.contributionsCollection.totalIssueContributions,
      accountAge,
    };
  } catch (err) {
    console.error('[github] fetchTrophyData error:', err);
    return null;
  }
}
