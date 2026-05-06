import type { AnalysisResult, LanguageMode } from '../types/analysis';

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

export async function sendChatMessage(payload: ChatPayload, token: string | null) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as {
    message?: string;
    reply?: string;
    suggestedQuestions?: string[];
  };

  if (!response.ok) {
    throw new Error(data.message ?? 'Unable to send chat message. Please try again.');
  }

  return {
    reply: data.reply ?? '',
    suggestedQuestions: Array.isArray(data.suggestedQuestions) ? data.suggestedQuestions : [],
  };
}
