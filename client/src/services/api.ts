import type { AnalysisResult, LanguageMode } from '../types/analysis';

export type AnalyzeCodePayload = {
  title?: string;
  problemStatement?: string;
  code: string;
  sampleInput?: string;
  expectedOutput?: string;
  languageMode: LanguageMode;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

export async function analyzeCode(payload: AnalyzeCodePayload, token: string | null) {
  const response = await fetch(`${API_BASE_URL}/api/analyze-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as { message?: string };

  if (!response.ok) {
    throw new Error(data.message ?? 'Unable to analyze code. Please try again.');
  }

  return data as AnalysisResult;
}
