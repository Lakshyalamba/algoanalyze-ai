import type { AnalysisResult } from '../types/analysis';

export const tokenStorageKey = 'algoanalyze_token';

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

function getFallbackApiBaseUrl() {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }

  const hostname = window.location.hostname || 'localhost';
  return `http://${hostname}:5000`;
}

function normalizeApiBaseUrl(value: string) {
  const trimmedValue = value.trim().replace(/\/+$/, '');
  const withoutApiSuffix = trimmedValue.endsWith('/api') ? trimmedValue.slice(0, -4) : trimmedValue;

  if (typeof window === 'undefined') {
    return withoutApiSuffix;
  }

  try {
    const url = new URL(withoutApiSuffix);
    if (
      (url.hostname === 'localhost' || url.hostname === '127.0.0.1') &&
      window.location.hostname &&
      url.hostname !== window.location.hostname
    ) {
      url.hostname = window.location.hostname;
      return url.toString().replace(/\/+$/, '');
    }
  } catch {
    return withoutApiSuffix;
  }

  return withoutApiSuffix;
}

if (!configuredApiBaseUrl?.trim()) {
  console.warn(
    `VITE_API_BASE_URL is missing. Falling back to ${getFallbackApiBaseUrl()}.`,
  );
}

export const API_BASE_URL = normalizeApiBaseUrl(configuredApiBaseUrl || getFallbackApiBaseUrl());

type ApiErrorBody = {
  message?: string;
  details?: unknown;
};

export function getStoredToken() {
  try {
    return localStorage.getItem(tokenStorageKey);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string) {
  try {
    localStorage.setItem(tokenStorageKey, token);
  } catch {
    console.warn('Unable to persist auth token in localStorage.');
  }
}

export function removeStoredToken() {
  try {
    localStorage.removeItem(tokenStorageKey);
  } catch {
    // Ignore storage failures while clearing an invalid session.
  }
}

export function normalizeApiError(error: unknown, fallbackMessage = 'Request failed. Please try again.') {
  if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
    return 'Backend is not reachable. Please check if the server is running.';
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
}

export async function parseApiResponse<T>(response: Response, fallbackMessage: string) {
  const data = (await response.json().catch(() => ({}))) as ApiErrorBody;

  if (!response.ok) {
    const details = Array.isArray(data.details)
      ? data.details
          .map((detail) =>
            typeof detail === 'object' && detail !== null && 'message' in detail
              ? String(detail.message)
              : '',
          )
          .filter(Boolean)
          .join(' ')
      : '';

    throw new Error([data.message ?? fallbackMessage, details].filter(Boolean).join(' '));
  }

  return data as T;
}

export function normalizeAnalysisResult(value: AnalysisResult): AnalysisResult {
  return {
    ...value,
    steps: Array.isArray(value.steps) ? value.steps : [],
    dryRunTable: Array.isArray(value.dryRunTable) ? value.dryRunTable : [],
    bugsOrWarnings: Array.isArray(value.bugsOrWarnings) ? value.bugsOrWarnings : [],
    edgeCases: Array.isArray(value.edgeCases) ? value.edgeCases : [],
    similarProblems: Array.isArray(value.similarProblems) ? value.similarProblems : [],
    quizQuestions: Array.isArray(value.quizQuestions) ? value.quizQuestions : [],
  };
}
