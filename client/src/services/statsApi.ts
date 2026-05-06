const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
const tokenStorageKey = 'algoanalyze_token';

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
  const token = localStorage.getItem(tokenStorageKey);
  const response = await fetch(`${API_BASE_URL}/api/stats/overview`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = (await response.json().catch(() => ({}))) as { message?: string };

  if (!response.ok) {
    throw new Error(data.message ?? 'Unable to load progress stats.');
  }

  return data as StatsOverview;
}
