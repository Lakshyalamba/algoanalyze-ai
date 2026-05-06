import type { AnalysisStep, DryRunRow, QuizQuestion } from '../types/analysis';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
const tokenStorageKey = 'algoanalyze_token';

export type SaveProblemPayload = {
  title: string;
  problemStatement?: string;
  code: string;
  sampleInput?: string;
  expectedOutput?: string;
  pattern?: string;
  difficulty?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  explanation?: {
    problemSummary: string;
    questionExplanation: string;
    hinglishExplanation: string;
    bruteForceApproach: string;
    betterApproach: string;
    optimizedApproach: string;
  };
  visualizationSteps?: AnalysisStep[];
  dryRunTable?: DryRunRow[];
  bugsOrWarnings?: string[];
  edgeCases?: string[];
  similarProblems?: string[];
  quizQuestions?: QuizQuestion[];
};

export type SavedProblemListItem = {
  id: string;
  title: string;
  pattern: string | null;
  difficulty: string | null;
  timeComplexity: string | null;
  spaceComplexity: string | null;
  createdAt: string;
};

export type SavedProblem = SavedProblemListItem & {
  problemStatement: string | null;
  code: string;
  sampleInput: string | null;
  expectedOutput: string | null;
  explanation: SaveProblemPayload['explanation'] | null;
  visualizationSteps: AnalysisStep[] | null;
  dryRunTable: DryRunRow[] | null;
  bugsOrWarnings: string[] | null;
  edgeCases: string[] | null;
  similarProblems: string[] | null;
  quizQuestions: QuizQuestion[] | null;
  updatedAt: string;
  userId: string;
};

function getToken() {
  return localStorage.getItem(tokenStorageKey);
}

async function request<T>(path: string, options: RequestInit = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = (await response.json().catch(() => ({}))) as { message?: string };

  if (!response.ok) {
    throw new Error(data.message ?? 'Saved problem request failed.');
  }

  return data as T;
}

export function saveProblem(payload: SaveProblemPayload) {
  return request<SavedProblem>('/api/saved-problems', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getSavedProblems() {
  return request<SavedProblemListItem[]>('/api/saved-problems');
}

export function getSavedProblemById(id: string) {
  return request<SavedProblem>(`/api/saved-problems/${id}`);
}

export function deleteSavedProblem(id: string) {
  return request<{ message: string }>(`/api/saved-problems/${id}`, {
    method: 'DELETE',
  });
}
