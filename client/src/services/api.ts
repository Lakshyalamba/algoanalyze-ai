import type { AnalysisResult, LanguageMode } from '../types/analysis';
import {
  API_BASE_URL,
  normalizeAnalysisResult,
  normalizeApiError,
  parseApiResponse,
} from '../utils/apiError';

export type AnalyzeCodePayload = {
  title?: string;
  problemStatement?: string;
  code: string;
  sampleInput?: string;
  expectedOutput?: string;
  languageMode: LanguageMode;
};

export async function analyzeCode(payload: AnalyzeCodePayload, token: string | null) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const data = await parseApiResponse<AnalysisResult>(
      response,
      'Unable to analyze code. Please try again.',
    );
    return normalizeAnalysisResult(data);
  } catch (error) {
    throw new Error(normalizeApiError(error, 'Unable to analyze code. Please try again.'));
  }
}
