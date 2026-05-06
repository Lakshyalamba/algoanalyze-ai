import { API_BASE_URL, getStoredToken, normalizeApiError, parseApiResponse } from '../utils/apiError';

export type StatsGroup = {
  name: string;
  count: number;
  percentage: number;
};

export type RecentProblem = {
  id: string;
  title: string;
  pattern: string;
  difficulty: string;
  createdAt: string;
};

export type ComplexityCount = {
  value: string;
  count: number;
};

export type StatsOverview = {
  totalProblems: number;
  topics: StatsGroup[];
  difficulty: Array<StatsGroup & { name: 'Easy' | 'Medium' | 'Hard' | 'Unknown' }>;
  recentProblems: RecentProblem[];
  complexityStats: {
    commonTimeComplexities: ComplexityCount[];
    commonSpaceComplexities: ComplexityCount[];
  };
};

export async function getStatsOverview() {
  try {
    const token = getStoredToken();
    const response = await fetch(`${API_BASE_URL}/api/stats/overview`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return await parseApiResponse<StatsOverview>(response, 'Unable to load progress stats.');
  } catch (error) {
    throw new Error(normalizeApiError(error, 'Unable to load progress stats.'));
  }
}
