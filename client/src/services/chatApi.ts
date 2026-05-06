import type { AnalysisResult, LanguageMode } from '../types/analysis';
import { API_BASE_URL, normalizeApiError, parseApiResponse } from '../utils/apiError';

export type ChatPayload = {
  message: string;
  problemStatement?: string;
  code?: string;
  sampleInput?: string;
  expectedOutput?: string;
  languageMode: LanguageMode;
  analysisContext: AnalysisResult | null;
};

export type ChatResponse = {
  reply: string;
  suggestedQuestions: string[];
};

export async function sendChatMessage(payload: ChatPayload, token: string | null) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const data = await parseApiResponse<ChatResponse>(
      response,
      'Unable to send chat message. Please try again.',
    );

    return {
      reply: data.reply ?? '',
      suggestedQuestions: Array.isArray(data.suggestedQuestions) ? data.suggestedQuestions : [],
    };
  } catch (error) {
    throw new Error(normalizeApiError(error, 'Unable to send chat message. Please try again.'));
  }
}
