import { GoogleGenAI } from '@google/genai';
import { buildAnalysisPrompt } from '../prompts/analysis.prompt.js';
import type { AnalysisResult, AnalyzeCodeInput } from '../types/analysis.js';

const model = 'gemini-2.5-flash';

function createFallbackAnalysis(
  input: AnalyzeCodeInput,
  warning = 'Gemini analysis is unavailable. Showing a development fallback response.',
): AnalysisResult {
  return {
    problemSummary: `${input.title || 'This problem'} needs a clear DSA pattern and careful dry run.`,
    questionExplanation:
      input.problemStatement ||
      'No problem statement was provided. This analysis is inferred from the submitted code and optional sample input/output.',
    hinglishExplanation:
      'Pehle problem statement ko dhyan se samjho, phir code ko sample input par dry run karo. Programming words jaise array, loop, function, return same rahenge.',
    pattern: 'General Problem Solving',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    bruteForceApproach:
      'Try all possibilities directly and verify which one satisfies the expected output.',
    betterApproach:
      'Track useful state while iterating so repeated work is reduced.',
    optimizedApproach:
      'Use the smallest required data structure and process the input in one clean pass where possible.',
    steps: [
      {
        stepNumber: 1,
        line: 1,
        variables: { input: input.sampleInput || 'not provided' },
        dataStructureState: {
          type: 'none',
          values: [],
          highlight: null,
        },
        annotation: warning,
      },
      {
        stepNumber: 2,
        line: 2,
        variables: { expectedOutput: input.expectedOutput || 'not provided' },
        dataStructureState: {
          type: 'none',
          values: [],
          highlight: null,
        },
        annotation: 'Run the code manually against the sample input and compare output.',
      },
    ],
    dryRunTable: [
      {
        step: 1,
        line: 1,
        variables: { sampleInput: input.sampleInput || 'not provided' },
        output: '-',
        explanation: 'Start with the provided sample input.',
      },
      {
        step: 2,
        line: 2,
        variables: { expectedOutput: input.expectedOutput || 'not provided' },
        output: input.expectedOutput || '-',
        explanation: 'Compare the observed output with the expected output.',
      },
    ],
    bugsOrWarnings: [warning],
    edgeCases: ['Empty input', 'Single item input', 'Duplicate values', 'Large constraints'],
    similarProblems: ['Two Sum', 'Valid Parentheses', 'Subarray Sum Equals K'],
    quizQuestions: [
      {
        question: 'Why is dry running important before optimizing?',
        answer: 'It confirms what the code actually does and reveals bugs before changing the approach.',
      },
      {
        question: 'What should complexity analysis depend on?',
        answer: 'It should depend on how the algorithm scales with input size and extra memory usage.',
      },
    ],
  };
}

function extractJson(text: string) {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error('Gemini response did not contain a JSON object.');
    }

    return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1)) as unknown;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function normalizeAnalysis(value: unknown, input: AnalyzeCodeInput): AnalysisResult {
  if (!isRecord(value)) {
    return createFallbackAnalysis(input, 'Gemini returned an invalid JSON object.');
  }

  const difficulty = value.difficulty;
  const normalizedDifficulty =
    difficulty === 'Easy' || difficulty === 'Hard' || difficulty === 'Medium'
      ? difficulty
      : 'Medium';

  return {
    problemSummary: String(value.problemSummary ?? ''),
    questionExplanation: String(value.questionExplanation ?? ''),
    hinglishExplanation: String(value.hinglishExplanation ?? ''),
    pattern: String(value.pattern ?? 'Unknown'),
    difficulty: normalizedDifficulty,
    timeComplexity: String(value.timeComplexity ?? 'Unknown'),
    spaceComplexity: String(value.spaceComplexity ?? 'Unknown'),
    bruteForceApproach: String(value.bruteForceApproach ?? ''),
    betterApproach: String(value.betterApproach ?? ''),
    optimizedApproach: String(value.optimizedApproach ?? ''),
    steps: Array.isArray(value.steps)
      ? value.steps.map((step, index) => {
          const record = isRecord(step) ? step : {};
          const state = isRecord(record.dataStructureState) ? record.dataStructureState : {};

          return {
            stepNumber: Number(record.stepNumber ?? index + 1),
            line: Number(record.line ?? 1),
            variables: isRecord(record.variables) ? record.variables : {},
            dataStructureState: {
              type:
                state.type === 'array' ||
                state.type === 'stack' ||
                state.type === 'queue' ||
                state.type === 'linked-list' ||
                state.type === 'tree' ||
                state.type === 'graph' ||
                state.type === 'recursion' ||
                state.type === 'dp' ||
                state.type === 'sorting' ||
                state.type === 'heap'
                  ? state.type
                  : 'none',
              values: state.values ?? [],
              highlight: state.highlight ?? null,
            },
            annotation: String(record.annotation ?? ''),
          };
        })
      : [],
    dryRunTable: Array.isArray(value.dryRunTable)
      ? value.dryRunTable.map((row, index) => {
          const record = isRecord(row) ? row : {};

          return {
            step: Number(record.step ?? index + 1),
            line: Number(record.line ?? 1),
            variables: isRecord(record.variables) ? record.variables : {},
            output: String(record.output ?? ''),
            explanation: String(record.explanation ?? ''),
          };
        })
      : [],
    bugsOrWarnings: toStringArray(value.bugsOrWarnings),
    edgeCases: toStringArray(value.edgeCases),
    similarProblems: toStringArray(value.similarProblems),
    quizQuestions: Array.isArray(value.quizQuestions)
      ? value.quizQuestions.map((question) => {
          const record = isRecord(question) ? question : {};

          return {
            question: String(record.question ?? ''),
            answer: String(record.answer ?? ''),
          };
        })
      : [],
  };
}

export async function analyzeCodeWithGemini(input: AnalyzeCodeInput): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return createFallbackAnalysis(input);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: buildAnalysisPrompt(input),
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const text = response.text ?? '';
    const json = extractJson(text);

    return normalizeAnalysis(json, input);
  } catch (error) {
    console.error('Gemini analysis failed:', error);
    return createFallbackAnalysis(
      input,
      'Gemini analysis failed or returned invalid JSON. Showing a fallback response.',
    );
  }
}
