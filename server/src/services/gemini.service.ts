import { GoogleGenAI } from '@google/genai';
import { buildAnalysisPrompt } from '../prompts/analysis.prompt.js';
import type { AnalysisResult, AnalysisStep, AnalyzeCodeInput, BugReport, QuizQuestion } from '../types/analysis.js';

const model = 'gemini-2.5-flash';
const geminiTimeoutMs = 30_000;

function parseFirstNumberArray(...sources: Array<string | undefined>) {
  for (const source of sources) {
    const match = source?.match(/\[([\d\s,.-]+)\]/);
    if (!match) continue;
    const values = match[1]
      .split(',')
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value));
    if (values.length > 0) return values;
  }

  return [];
}

function findTarget(...sources: Array<string | undefined>) {
  for (const source of sources) {
    const match = source?.match(/target\s*=?\s*(-?\d+)/i);
    if (match) return Number(match[1]);
  }

  return null;
}

function createBubbleSortSteps(values: number[]): AnalysisStep[] {
  const array = [...values];
  const steps: AnalysisStep[] = [];
  let stepNumber = 1;

  for (let i = 0; i < array.length - 1; i += 1) {
    for (let j = 0; j < array.length - i - 1; j += 1) {
      steps.push({
        stepNumber: stepNumber++,
        line: 4,
        variables: { i, j, left: array[j], right: array[j + 1], condition: `${array[j]} > ${array[j + 1]}` },
        dataStructureState: { type: 'sorting', values: [...array], highlight: [j, j + 1] },
        annotation: `Compare index ${j} (${array[j]}) with index ${j + 1} (${array[j + 1]}).`,
      });

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.push({
          stepNumber: stepNumber++,
          line: 5,
          variables: { i, j, swapped: true, array: [...array] },
          dataStructureState: { type: 'sorting', values: [...array], highlight: [j, j + 1] },
          annotation: `Swap the values because the left value is larger. Array is now [${array.join(', ')}].`,
        });
      }
    }
  }

  steps.push({
    stepNumber: stepNumber++,
    line: 6,
    variables: { sorted: true, array: [...array] },
    dataStructureState: { type: 'sorting', values: [...array], highlight: [] },
    annotation: 'All passes are complete; the array is sorted.',
  });

  return steps;
}

function createTwoSumSteps(values: number[], target: number): AnalysisStep[] {
  const seen = new Map<number, number>();

  return values.map((value, index) => {
    const complement = target - value;
    const foundAt = seen.get(complement);
    if (foundAt === undefined) {
      seen.set(value, index);
    }

    return {
      stepNumber: index + 1,
      line: foundAt === undefined ? 5 : 4,
      variables: {
        index,
        value,
        target,
        complement,
        seen: Object.fromEntries(seen),
        result: foundAt === undefined ? null : [foundAt, index],
      },
      dataStructureState: { type: 'array', values: [...values], highlight: [index, ...(foundAt === undefined ? [] : [foundAt])] },
      annotation:
        foundAt === undefined
          ? `Complement ${complement} is not stored yet, so store ${value} at index ${index}.`
          : `Complement ${complement} was seen at index ${foundAt}; return [${foundAt}, ${index}].`,
    };
  });
}

function createLinearScanSteps(values: number[]): AnalysisStep[] {
  let currentMax = Number.NEGATIVE_INFINITY;

  return values.map((value, index) => {
    const previousMax = currentMax;
    currentMax = Math.max(currentMax, value);
    const updated = currentMax !== previousMax;

    return {
      stepNumber: index + 1,
      line: 3,
      variables: { i: index, value, previousMax: Number.isFinite(previousMax) ? previousMax : null, max: currentMax, updated },
      dataStructureState: { type: 'array', values: [...values], highlight: [index] },
      annotation: updated
        ? `Read nums[${index}] = ${value}. max is updated to ${currentMax}.`
        : `Read nums[${index}] = ${value}. max stays ${currentMax}.`,
    };
  });
}

function inferExecutionSteps(input: AnalyzeCodeInput): AnalysisStep[] {
  const values = parseFirstNumberArray(input.sampleInput, input.code, input.problemStatement);
  if (values.length === 0) return [];

  const codeAndProblem = `${input.title ?? ''} ${input.problemStatement ?? ''} ${input.code}`.toLowerCase();
  const target = findTarget(input.sampleInput, input.problemStatement, input.code);

  if (codeAndProblem.includes('bubble') || (codeAndProblem.includes('sort') && /for\s+.+for\s+/s.test(input.code))) {
    return createBubbleSortSteps(values);
  }

  if ((codeAndProblem.includes('two sum') || codeAndProblem.includes('complement')) && target !== null) {
    return createTwoSumSteps(values, target);
  }

  return createLinearScanSteps(values);
}

function rowsFromSteps(steps: AnalysisStep[]) {
  return steps.map((step) => ({
    step: step.stepNumber,
    line: step.line,
    variables: step.variables,
    output:
      step.stepNumber === steps.length && Array.isArray(step.dataStructureState.values)
        ? JSON.stringify(step.dataStructureState.values)
        : '-',
    explanation: step.annotation,
  }));
}

function createProblemSpecificEdgeCases(input: AnalyzeCodeInput) {
  const text = `${input.title ?? ''} ${input.problemStatement ?? ''} ${input.code}`.toLowerCase();
  const cases = new Set<string>();

  if (text.includes('sort')) {
    ['Already sorted array', 'Reverse-sorted array', 'Array with duplicate values', 'Array containing negative numbers', 'Single-element array', 'Large array to expose O(n²) behavior'].forEach((item) => cases.add(item));
  } else if (text.includes('two sum') || text.includes('target') || text.includes('complement')) {
    ['No pair sums to target', 'Duplicate values form the answer', 'Negative numbers with positive target', 'Target made by zero values', 'Pair appears at the last two indexes', 'Very large input requiring O(n) hash lookup'].forEach((item) => cases.add(item));
  } else if (text.includes('stack') || text.includes('parentheses') || text.includes('bracket')) {
    ['Empty string', 'Only opening brackets', 'Only closing brackets', 'Nested valid brackets', 'Mismatched bracket type', 'Long input testing stack growth'].forEach((item) => cases.add(item));
  } else {
    ['Empty or missing input if constraints allow it', 'Single item input', 'Duplicate values', 'Negative and zero values when numeric inputs are allowed', 'Boundary values from the stated constraints', 'Large input size to confirm complexity'].forEach((item) => cases.add(item));
  }

  return [...cases];
}

function createQuiz(input: AnalyzeCodeInput): QuizQuestion[] {
  const text = `${input.title ?? ''} ${input.problemStatement ?? ''} ${input.code}`.toLowerCase();
  const isSort = text.includes('sort');
  const isTwoSum = text.includes('two sum') || text.includes('complement');

  if (isSort) {
    return [
      { question: 'What does one bubble sort comparison decide?', options: ['Whether two adjacent elements are in the correct order', 'Whether the whole array is already sorted', 'Whether a hash map contains a key', 'Whether recursion should stop'], correctAnswer: 'Whether two adjacent elements are in the correct order', explanation: 'Bubble sort repeatedly compares adjacent values and swaps them when they are out of order.' },
      { question: 'What is bubble sort worst-case time complexity?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 'O(n²)', explanation: 'Nested passes compare adjacent pairs many times, producing quadratic work in the worst case.' },
      { question: 'Which input is worst for basic ascending bubble sort?', options: ['Already sorted array', 'Reverse-sorted array', 'Single-element array', 'All elements equal'], correctAnswer: 'Reverse-sorted array', explanation: 'A reverse-sorted array causes many adjacent swaps.' },
      { question: 'What changes after a swap step?', options: ['Only the loop counter', 'The compared elements exchange positions', 'The target value changes', 'The recursion stack is cleared'], correctAnswer: 'The compared elements exchange positions', explanation: 'A swap mutates the array state by exchanging the adjacent values.' },
      { question: 'What is bubble sort extra space complexity?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'], correctAnswer: 'O(1)', explanation: 'In-place bubble sort only needs a constant amount of extra temporary storage.' },
    ];
  }

  if (isTwoSum) {
    return [
      { question: 'Why is a hash map useful for Two Sum?', options: ['It sorts the array', 'It stores seen values for O(1) complement lookup', 'It removes duplicates automatically', 'It converts numbers to strings'], correctAnswer: 'It stores seen values for O(1) complement lookup', explanation: 'For each value, the algorithm checks whether target - value was seen earlier.' },
      { question: 'What should be checked before storing the current value?', options: ['Whether its complement already exists', 'Whether the array is sorted', 'Whether the output is empty', 'Whether index is negative'], correctAnswer: 'Whether its complement already exists', explanation: 'Checking first prevents using the same element twice and finds earlier pairs.' },
      { question: 'What is the optimized time complexity?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 'O(n)', explanation: 'Each number is processed once with average constant-time hash map operations.' },
      { question: 'Which edge case is important?', options: ['Duplicate numbers that form the target', 'Only uppercase strings', 'Disconnected graph nodes', 'Tree height overflow'], correctAnswer: 'Duplicate numbers that form the target', explanation: 'Inputs like [3, 3] with target 6 require handling duplicates correctly.' },
      { question: 'What does complement mean?', options: ['target - current value', 'current value - index', 'sum of all values', 'the last array element'], correctAnswer: 'target - current value', explanation: 'The complement is the number needed with the current value to reach target.' },
    ];
  }

  return [
    { question: 'What is the purpose of a dry run?', options: ['To trace variables step by step', 'To change the programming language', 'To hide edge cases', 'To skip complexity analysis'], correctAnswer: 'To trace variables step by step', explanation: 'A dry run shows how variables and outputs evolve for a concrete input.' },
    { question: 'What should complexity analysis measure?', options: ['Scaling with input size', 'Variable names', 'File name length', 'Comment count'], correctAnswer: 'Scaling with input size', explanation: 'Time and space complexity describe growth as input size increases.' },
    { question: 'Why are edge cases tested?', options: ['They reveal boundary bugs', 'They make code longer', 'They replace unit tests', 'They remove loops'], correctAnswer: 'They reveal boundary bugs', explanation: 'Boundary and unusual inputs often expose incorrect assumptions.' },
    { question: 'Which dry-run detail is most useful?', options: ['Current variables and condition result', 'Editor font size', 'Button color', 'Page route'], correctAnswer: 'Current variables and condition result', explanation: 'Variables and condition results explain why each branch or update happened.' },
    { question: 'What makes an optimized approach reliable?', options: ['It preserves correctness while reducing cost', 'It always uses recursion', 'It removes all variables', 'It avoids sample tests'], correctAnswer: 'It preserves correctness while reducing cost', explanation: 'Optimization should improve complexity without changing the correct output.' },
  ];
}

function createFallbackAnalysis(
  input: AnalyzeCodeInput,
  warning = 'Gemini analysis is unavailable. Showing a development fallback response.',
): AnalysisResult {
  const inferredSteps = inferExecutionSteps(input);
  const steps: AnalysisStep[] =
    inferredSteps.length > 0
      ? inferredSteps
      : [
          {
            stepNumber: 1,
            line: 1,
            variables: { input: input.sampleInput || 'not provided' },
            dataStructureState: {
              type: 'none',
              values: [],
              highlight: null,
            },
            annotation: 'Read the provided input and initialize the variables used by the solution.',
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
            annotation: 'Compare the computed output with the expected output.',
          },
        ];

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
    steps,
    dryRunTable: rowsFromSteps(steps),
    bugsOrWarnings: [
      {
        title: 'AI analysis fallback',
        severity: 'Low',
        explanation: warning,
        fix: 'Re-run analysis when the Gemini service is available. The local fallback still traces common array, sorting, and hash-map patterns.',
        suggestedCode: '',
      },
    ],
    edgeCases: createProblemSpecificEdgeCases(input),
    similarProblems: ['Two Sum', 'Valid Parentheses', 'Subarray Sum Equals K'],
    quizQuestions: createQuiz(input),
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

function normalizeBugReports(value: unknown): Array<string | BugReport> {
  if (!Array.isArray(value)) return [];

  return value
    .map((item): string | BugReport | null => {
      if (typeof item === 'string') return item;
      if (!isRecord(item)) return null;

      const severity = item.severity;
      return {
        title: String(item.title ?? item.issue ?? 'Potential issue'),
        severity: severity === 'Low' || severity === 'Medium' || severity === 'High' ? severity : 'Medium',
        explanation: String(item.explanation ?? item.reason ?? ''),
        fix: String(item.fix ?? item.recommendation ?? ''),
        suggestedCode: item.suggestedCode === undefined ? undefined : String(item.suggestedCode),
      };
    })
    .filter((item): item is string | BugReport => item !== null);
}

function normalizeQuizQuestions(value: unknown): QuizQuestion[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((question): QuizQuestion | null => {
      const record = isRecord(question) ? question : {};
      const options = Array.isArray(record.options)
        ? record.options.map((option) => String(option)).filter(Boolean).slice(0, 4)
        : [];
      const legacyAnswer = String(record.answer ?? '');
      const correctAnswer = String(record.correctAnswer ?? legacyAnswer);
      const explanation = String(record.explanation ?? legacyAnswer);
      const prompt = String(record.question ?? '');

      if (!prompt) return null;

      return {
        question: prompt,
        options,
        correctAnswer,
        explanation,
        answer: legacyAnswer || explanation,
      };
    })
    .filter((item): item is QuizQuestion => item !== null);
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

  const normalized: AnalysisResult = {
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
    bugsOrWarnings: normalizeBugReports(value.bugsOrWarnings),
    edgeCases: toStringArray(value.edgeCases),
    similarProblems: toStringArray(value.similarProblems),
    quizQuestions: normalizeQuizQuestions(value.quizQuestions),
  };

  const inferredSteps = inferExecutionSteps(input);
  if (normalized.steps.length < 3 && inferredSteps.length > normalized.steps.length) {
    normalized.steps = inferredSteps;
  }

  const fallback = createFallbackAnalysis(input);

  return {
    ...normalized,
    problemSummary: normalized.problemSummary || fallback.problemSummary,
    questionExplanation: normalized.questionExplanation || fallback.questionExplanation,
    bruteForceApproach: normalized.bruteForceApproach || fallback.bruteForceApproach,
    betterApproach: normalized.betterApproach || fallback.betterApproach,
    optimizedApproach: normalized.optimizedApproach || fallback.optimizedApproach,
    steps: normalized.steps.length > 0 ? normalized.steps : fallback.steps,
    dryRunTable:
      normalized.dryRunTable.length >= Math.min(3, normalized.steps.length)
        ? normalized.dryRunTable
        : rowsFromSteps(normalized.steps.length > 0 ? normalized.steps : fallback.steps),
    bugsOrWarnings: normalized.bugsOrWarnings,
    edgeCases:
      normalized.edgeCases.length >= 4 ? normalized.edgeCases : fallback.edgeCases,
    similarProblems:
      normalized.similarProblems.length > 0 ? normalized.similarProblems : fallback.similarProblems,
    quizQuestions:
      normalized.quizQuestions.length >= 5 ? normalized.quizQuestions : fallback.quizQuestions,
  };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_resolve, reject) => {
      setTimeout(() => reject(new Error('Gemini request timed out.')), timeoutMs);
    }),
  ]);
}

export async function analyzeCodeWithGemini(input: AnalyzeCodeInput): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return createFallbackAnalysis(input);
  }

  const ai = new GoogleGenAI({ apiKey });
  let lastError: unknown = null;

  for (const temperature of [0.2, 0]) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents: buildAnalysisPrompt(input),
          config: {
            responseMimeType: 'application/json',
            temperature,
          },
        }),
        geminiTimeoutMs,
      );

      const text = response.text ?? '';
      const json = extractJson(text);

      return normalizeAnalysis(json, input);
    } catch (error) {
      lastError = error;
      console.error('Gemini analysis attempt failed:', error);
    }
  }

  console.error('Gemini analysis failed after retries:', lastError);
  return createFallbackAnalysis(
    input,
    'AI analysis was unavailable, so this response uses the built-in structured fallback.',
  );
}
