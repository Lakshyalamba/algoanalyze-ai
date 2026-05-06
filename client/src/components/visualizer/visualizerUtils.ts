import type { AnalysisStep } from '../../types/analysis';

export type VisualizerState = AnalysisStep['dataStructureState'];

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function displayValue(value: unknown) {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (value === null || value === undefined) {
    return '-';
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function isHighlighted(value: unknown, index: number, highlight: unknown) {
  if (Array.isArray(highlight)) {
    return highlight.includes(index) || highlight.includes(value);
  }

  return highlight === index || highlight === value;
}

export function getState(step: AnalysisStep): VisualizerState {
  return step.dataStructureState ?? { type: 'none', values: [], highlight: null };
}

