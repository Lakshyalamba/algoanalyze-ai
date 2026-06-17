/**
 * AI Analysis Service
 * Primary:  NVIDIA Nemotron (OpenAI-compatible, fast)
 * Fallback: Google Gemini 2.5-flash
 * Last:     Local structured fallback
 */
import { GoogleGenAI } from '@google/genai';
import { buildAnalysisPrompt } from '../prompts/analysis.prompt.js';
import type { AnalysisResult, AnalysisStep, AnalyzeCodeInput, BugReport, QuizQuestion } from '../types/analysis.js';

/* ─────────────── Config ─────────────── */
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_MODEL   = 'nvidia/llama-3.3-nemotron-super-49b-v1';
const GEMINI_MODEL   = 'gemini-2.5-flash';
const NVIDIA_TIMEOUT = 120_000;
const GEMINI_TIMEOUT = 90_000;

/* ─────────────── Local fallback helpers ─────────────── */

function parseFirstNumberArray(...sources: Array<string | undefined>) {
  for (const source of sources) {
    const match = source?.match(/\[([\d\s,.-]+)\]/);
    if (!match) continue;
    const values = match[1]
      .split(',')
      .map((v) => Number(v.trim()))
      .filter((v) => Number.isFinite(v));
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
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
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
          annotation: `Swap values. Array is now [${array.join(', ')}].`,
        });
      }
    }
  }
  steps.push({
    stepNumber: stepNumber++,
    line: 6,
    variables: { sorted: true, array: [...array] },
    dataStructureState: { type: 'sorting', values: [...array], highlight: [] },
    annotation: 'All passes complete; the array is now sorted.',
  });
  return steps;
}

function createTwoSumSteps(values: number[], target: number): AnalysisStep[] {
  const seen = new Map<number, number>();
  return values.map((value, index) => {
    const complement = target - value;
    const foundAt = seen.get(complement);
    if (foundAt === undefined) seen.set(value, index);
    return {
      stepNumber: index + 1,
      line: foundAt === undefined ? 5 : 4,
      variables: { index, value, target, complement, seen: Object.fromEntries(seen), result: foundAt === undefined ? null : [foundAt, index] },
      dataStructureState: { type: 'array', values: [...values], highlight: [index, ...(foundAt === undefined ? [] : [foundAt])] },
      annotation: foundAt === undefined
        ? `Complement ${complement} not found yet — store ${value} at index ${index}.`
        : `Complement ${complement} was seen at index ${foundAt} → return [${foundAt}, ${index}].`,
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
        ? `Read nums[${index}] = ${value}. max updated to ${currentMax}.`
        : `Read nums[${index}] = ${value}. max stays ${currentMax}.`,
    };
  });
}

function inferExecutionSteps(input: AnalyzeCodeInput): AnalysisStep[] {
  const values = parseFirstNumberArray(input.sampleInput, input.code, input.problemStatement);
  if (values.length === 0) return [];
  const ctx = `${input.title ?? ''} ${input.problemStatement ?? ''} ${input.code}`.toLowerCase();
  const target = findTarget(input.sampleInput, input.problemStatement, input.code);
  if (ctx.includes('bubble') || (ctx.includes('sort') && /for\s+.+for\s+/s.test(input.code))) return createBubbleSortSteps(values);
  if ((ctx.includes('two sum') || ctx.includes('complement')) && target !== null) return createTwoSumSteps(values, target);
  return createLinearScanSteps(values);
}

function rowsFromSteps(steps: AnalysisStep[]) {
  return steps.map((step) => ({
    step: step.stepNumber,
    line: step.line,
    variables: step.variables,
    output: step.stepNumber === steps.length && Array.isArray(step.dataStructureState.values)
      ? JSON.stringify(step.dataStructureState.values) : '-',
    explanation: step.annotation,
  }));
}

function createProblemSpecificEdgeCases(input: AnalyzeCodeInput) {
  const text = `${input.title ?? ''} ${input.problemStatement ?? ''} ${input.code}`.toLowerCase();
  const cases = new Set<string>();
  if (text.includes('palindrome')) {
    ['Single character string — always a palindrome', 'All same characters like "aaaa"', 'String with all unique characters like "abcd"', 'Even-length palindrome like "abba"', 'Odd-length palindrome like "racecar"', 'Empty string'].forEach((c) => cases.add(c));
  } else if (text.includes('sort')) {
    ['Already sorted array', 'Reverse-sorted array', 'Array with duplicate values', 'Array containing negative numbers', 'Single-element array', 'Large array to expose O(n²) behavior'].forEach((c) => cases.add(c));
  } else if (text.includes('two sum') || text.includes('target') || text.includes('complement')) {
    ['No pair sums to target', 'Duplicate values form the answer', 'Negative numbers with positive target', 'Target made by zero values', 'Pair appears at the last two indexes', 'Very large input requiring O(n) hash lookup'].forEach((c) => cases.add(c));
  } else if (text.includes('stack') || text.includes('parentheses') || text.includes('bracket')) {
    ['Empty string', 'Only opening brackets', 'Only closing brackets', 'Nested valid brackets', 'Mismatched bracket type', 'Long input testing stack growth'].forEach((c) => cases.add(c));
  } else {
    ['Empty or missing input if constraints allow it', 'Single item input', 'Duplicate values', 'Negative and zero values when numeric inputs are allowed', 'Boundary values from the stated constraints', 'Large input size to confirm complexity'].forEach((c) => cases.add(c));
  }
  return [...cases];
}

function createQuiz(input: AnalyzeCodeInput): QuizQuestion[] {
  const text = `${input.title ?? ''} ${input.problemStatement ?? ''} ${input.code}`.toLowerCase();
  if (text.includes('palindrome')) {
    return [
      { question: 'What does "expanding around center" mean in palindrome detection?', options: ['Sorting characters outward', 'Starting from a center index and extending left/right while characters match', 'Finding the middle element of the array', 'Reversing the string from the center'], correctAnswer: 'Starting from a center index and extending left/right while characters match', explanation: 'We pick every index as a potential center and expand outward symmetrically as long as s[left] === s[right].' },
      { question: 'Why must we check both odd-length and even-length palindromes separately?', options: ['For performance', 'Odd palindromes have one center character; even palindromes have two center characters', 'Even strings are not palindromes', 'The algorithm only works for odd lengths'], correctAnswer: 'Odd palindromes have one center character; even palindromes have two center characters', explanation: '"aba" expands from index 1 (single center). "abba" expands from the gap between indices 1 and 2 (double center).' },
      { question: 'What is the time complexity of the expand-around-center approach?', options: ['O(n³)', 'O(n²)', 'O(n log n)', 'O(n)'], correctAnswer: 'O(n²)', explanation: 'We have O(n) center positions and each expansion can take O(n) time in the worst case, giving O(n²) total.' },
      { question: 'What does solve(i, i+1) check vs solve(i, i)?', options: ['solve(i,i) checks even palindromes; solve(i,i+1) checks odd', 'solve(i,i) checks odd palindromes; solve(i,i+1) checks even', 'Both check the same thing', 'solve(i,i+1) checks if i and i+1 are equal'], correctAnswer: 'solve(i,i) checks odd palindromes; solve(i,i+1) checks even', explanation: 'solve(i,i) starts with a single center character (odd). solve(i,i+1) starts with two adjacent characters as the center (even).' },
      { question: 'What is returned by s[left+1:right] after the while loop exits?', options: ['The character at left+1', 'The longest palindrome centered at the original start point', 'The entire string', 'An empty string'], correctAnswer: 'The longest palindrome centered at the original start point', explanation: 'When the loop exits, left and right have moved one step beyond the valid palindrome. So s[left+1:right] is the actual palindrome substring.' },
    ];
  }
  if (text.includes('sort')) {
    return [
      { question: 'What does one bubble sort comparison decide?', options: ['Whether two adjacent elements are in the correct order', 'Whether the whole array is already sorted', 'Whether a hash map contains a key', 'Whether recursion should stop'], correctAnswer: 'Whether two adjacent elements are in the correct order', explanation: 'Bubble sort repeatedly compares adjacent values and swaps them when they are out of order.' },
      { question: 'What is bubble sort worst-case time complexity?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 'O(n²)', explanation: 'Nested passes compare adjacent pairs many times, producing quadratic work in the worst case.' },
      { question: 'Which input is worst for ascending bubble sort?', options: ['Already sorted array', 'Reverse-sorted array', 'Single-element array', 'All elements equal'], correctAnswer: 'Reverse-sorted array', explanation: 'A reverse-sorted array causes the maximum number of adjacent swaps.' },
      { question: 'What is bubble sort extra space complexity?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'], correctAnswer: 'O(1)', explanation: 'In-place bubble sort only needs constant extra temporary storage for swapping.' },
      { question: 'After k passes of bubble sort, what is guaranteed?', options: ['First k elements are sorted', 'Last k elements are in their correct final positions', 'The array is fully sorted', 'No swaps occurred'], correctAnswer: 'Last k elements are in their correct final positions', explanation: 'Each pass "bubbles" the largest unsorted element to its correct position at the right end.' },
    ];
  }
  if (text.includes('two sum') || text.includes('complement')) {
    return [
      { question: 'Why is a hash map useful for Two Sum?', options: ['It sorts the array', 'It stores seen values for O(1) complement lookup', 'It removes duplicates automatically', 'It converts numbers to strings'], correctAnswer: 'It stores seen values for O(1) complement lookup', explanation: 'For each value, the algorithm checks whether target - value was seen earlier in O(1).' },
      { question: 'What should be checked before storing the current value?', options: ['Whether its complement already exists', 'Whether the array is sorted', 'Whether the output is empty', 'Whether index is negative'], correctAnswer: 'Whether its complement already exists', explanation: 'Checking first prevents using the same element twice and finds earlier pairs correctly.' },
      { question: 'What is the optimized time complexity?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 'O(n)', explanation: 'Each number is processed once with average O(1) hash map operations.' },
      { question: 'Which edge case is important?', options: ['Duplicate numbers that form the target', 'Only uppercase strings', 'Disconnected graph nodes', 'Tree height overflow'], correctAnswer: 'Duplicate numbers that form the target', explanation: 'Inputs like [3, 3] with target 6 require handling duplicates correctly.' },
      { question: 'What does complement mean?', options: ['target - current value', 'current value - index', 'sum of all values', 'the last array element'], correctAnswer: 'target - current value', explanation: 'The complement is the number needed alongside the current value to reach the target.' },
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

function createFallbackAnalysis(input: AnalyzeCodeInput, warning = 'AI analysis is temporarily unavailable.'): AnalysisResult {
  const inferredSteps = inferExecutionSteps(input);
  const steps: AnalysisStep[] = inferredSteps.length > 0
    ? inferredSteps
    : [
        { stepNumber: 1, line: 1, variables: { input: input.sampleInput || 'not provided' }, dataStructureState: { type: 'none', values: [], highlight: null }, annotation: 'Read the input and initialise variables.' },
        { stepNumber: 2, line: 2, variables: { expectedOutput: input.expectedOutput || 'not provided' }, dataStructureState: { type: 'none', values: [], highlight: null }, annotation: 'Compare computed output with expected output.' },
      ];

  return {
    problemSummary: `${input.title || 'This problem'} needs a clear DSA pattern and careful dry run.`,
    questionExplanation: input.problemStatement || 'No problem statement provided — analysis inferred from code.',
    hinglishExplanation: 'Pehle problem statement ko dhyan se samjho, phir code ko sample input par dry run karo.',
    pattern: 'General Problem Solving',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    bruteForceApproach: 'Try all possibilities and verify which one satisfies the expected output.',
    betterApproach: 'Track useful state while iterating so repeated work is reduced.',
    optimizedApproach: 'Use the most appropriate data structure and process the input in a single clean pass.',
    steps,
    dryRunTable: rowsFromSteps(steps),
    bugsOrWarnings: [{ title: 'AI analysis fallback', severity: 'Low', explanation: warning, fix: 'Re-run the analysis once the AI service is available.' }],
    edgeCases: createProblemSpecificEdgeCases(input),
    similarProblems: ['Two Sum', 'Valid Parentheses', 'Subarray Sum Equals K'],
    quizQuestions: createQuiz(input),
  };
}

/* ─────────────── JSON extraction ─────────────── */

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  // Strip markdown fences if present
  const stripped = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  try { return JSON.parse(stripped); } catch { /* fall through */ }
  try { return JSON.parse(trimmed); } catch { /* fall through */ }
  // Find first { … } block
  const firstBrace = stripped.indexOf('{');
  const lastBrace  = stripped.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return JSON.parse(stripped.slice(firstBrace, lastBrace + 1));
  }
  throw new Error('No valid JSON object found in AI response.');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

function normalizeBugReports(value: unknown): Array<string | BugReport> {
  if (!Array.isArray(value)) return [];
  return value.map((item): string | BugReport | null => {
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
  }).filter((i): i is string | BugReport => i !== null);
}

function normalizeQuizQuestions(value: unknown): QuizQuestion[] {
  if (!Array.isArray(value)) return [];
  return value.map((q): QuizQuestion | null => {
    const rec = isRecord(q) ? q : {};
    const options = Array.isArray(rec.options) ? rec.options.map((o) => String(o)).filter(Boolean).slice(0, 4) : [];
    const legacyAnswer = String(rec.answer ?? '');
    const correctAnswer = String(rec.correctAnswer ?? legacyAnswer);
    const explanation   = String(rec.explanation ?? legacyAnswer);
    const prompt        = String(rec.question ?? '');
    if (!prompt) return null;
    return { question: prompt, options, correctAnswer, explanation, answer: legacyAnswer || explanation };
  }).filter((q): q is QuizQuestion => q !== null);
}

function normalizeAnalysis(value: unknown, input: AnalyzeCodeInput): AnalysisResult {
  if (!isRecord(value)) return createFallbackAnalysis(input, 'AI returned an invalid response.');

  const difficulty = value.difficulty;
  const normalizedDifficulty = difficulty === 'Easy' || difficulty === 'Hard' || difficulty === 'Medium' ? difficulty : 'Medium';

  const normalized: AnalysisResult = {
    problemSummary:       String(value.problemSummary ?? ''),
    questionExplanation:  String(value.questionExplanation ?? ''),
    hinglishExplanation:  String(value.hinglishExplanation ?? ''),
    pattern:              String(value.pattern ?? 'Unknown'),
    difficulty:           normalizedDifficulty,
    timeComplexity:       String(value.timeComplexity ?? 'Unknown'),
    spaceComplexity:      String(value.spaceComplexity ?? 'Unknown'),
    bruteForceApproach:   String(value.bruteForceApproach ?? ''),
    betterApproach:       String(value.betterApproach ?? ''),
    optimizedApproach:    String(value.optimizedApproach ?? ''),
    steps: Array.isArray(value.steps)
      ? value.steps.map((step, idx) => {
          const rec   = isRecord(step) ? step : {};
          const state = isRecord(rec.dataStructureState) ? rec.dataStructureState : {};
          const validTypes = ['array','stack','queue','linked-list','tree','graph','recursion','dp','sorting','heap'] as const;
          type ValidType = typeof validTypes[number];
          const dsType: ValidType | 'none' = validTypes.includes(state.type as ValidType) ? (state.type as ValidType) : 'none';
          return {
            stepNumber:         Number(rec.stepNumber ?? idx + 1),
            line:               Number(rec.line ?? 1),
            variables:          isRecord(rec.variables) ? rec.variables : {},
            dataStructureState: { type: dsType, values: state.values ?? [], highlight: state.highlight ?? null },
            annotation:         String(rec.annotation ?? ''),
          };
        })
      : [],
    dryRunTable: Array.isArray(value.dryRunTable)
      ? value.dryRunTable.map((row, idx) => {
          const rec = isRecord(row) ? row : {};
          return { step: Number(rec.step ?? idx + 1), line: Number(rec.line ?? 1), variables: isRecord(rec.variables) ? rec.variables : {}, output: String(rec.output ?? ''), explanation: String(rec.explanation ?? '') };
        })
      : [],
    bugsOrWarnings:  normalizeBugReports(value.bugsOrWarnings),
    edgeCases:       toStringArray(value.edgeCases),
    similarProblems: toStringArray(value.similarProblems),
    quizQuestions:   normalizeQuizQuestions(value.quizQuestions),
  };

  // Fill thin AI responses with inferred steps
  const inferredSteps = inferExecutionSteps(input);
  if (normalized.steps.length < 3 && inferredSteps.length > normalized.steps.length) {
    normalized.steps = inferredSteps;
  }

  const fallback = createFallbackAnalysis(input);
  return {
    ...normalized,
    problemSummary:     normalized.problemSummary     || fallback.problemSummary,
    questionExplanation:normalized.questionExplanation|| fallback.questionExplanation,
    bruteForceApproach: normalized.bruteForceApproach || fallback.bruteForceApproach,
    betterApproach:     normalized.betterApproach     || fallback.betterApproach,
    optimizedApproach:  normalized.optimizedApproach  || fallback.optimizedApproach,
    steps:              normalized.steps.length > 0   ? normalized.steps       : fallback.steps,
    dryRunTable:        normalized.dryRunTable.length >= Math.min(3, normalized.steps.length)
                          ? normalized.dryRunTable
                          : rowsFromSteps(normalized.steps.length > 0 ? normalized.steps : fallback.steps),
    bugsOrWarnings:     normalized.bugsOrWarnings,
    edgeCases:          normalized.edgeCases.length   >= 4 ? normalized.edgeCases       : fallback.edgeCases,
    similarProblems:    normalized.similarProblems.length > 0 ? normalized.similarProblems : fallback.similarProblems,
    quizQuestions:      normalized.quizQuestions.length >= 5 ? normalized.quizQuestions  : fallback.quizQuestions,
  };
}

/* ─────────────── Timeout helper ─────────────── */

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)),
  ]);
}

/* ─────────────── NVIDIA Nemotron provider ─────────────── */

async function analyzeWithNvidia(input: AnalyzeCodeInput, apiKey: string): Promise<AnalysisResult> {
  const prompt = buildAnalysisPrompt(input);

  const response = await withTimeout(
    fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert DSA tutor. You MUST respond with ONLY a raw JSON object — no markdown, no code fences, no explanation outside the JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4096,
        top_p: 0.9,
      }),
    }),
    NVIDIA_TIMEOUT,
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`NVIDIA API error ${response.status}: ${body.slice(0, 300)}`);
  }

  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const text = data?.choices?.[0]?.message?.content ?? '';
  if (!text) throw new Error('NVIDIA API returned empty content.');

  const json = extractJson(text);
  return normalizeAnalysis(json, input);
}

/* ─────────────── Gemini provider (fallback) ─────────────── */

async function analyzeWithGemini(input: AnalyzeCodeInput, apiKey: string): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey });
  const response = await withTimeout(
    ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildAnalysisPrompt(input),
      config: { responseMimeType: 'application/json', temperature: 0.3 },
    }),
    GEMINI_TIMEOUT,
  );
  const text = response.text ?? '';
  const json = extractJson(text);
  return normalizeAnalysis(json, input);
}

/* ─────────────── Main export ─────────────── */

export async function analyzeCodeWithGemini(input: AnalyzeCodeInput): Promise<AnalysisResult> {
  const nvidiaKey = process.env.NVIDIA_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();

  // 1. Try NVIDIA Nemotron (primary — fast, generous quota)
  if (nvidiaKey) {
    try {
      console.log('[AI] Using NVIDIA Nemotron...');
      const result = await analyzeWithNvidia(input, nvidiaKey);
      console.log('[AI] NVIDIA Nemotron succeeded.');
      return result;
    } catch (err) {
      console.error('[AI] NVIDIA Nemotron failed:', String(err).slice(0, 200));
    }
  }

  // 2. Try Gemini (secondary fallback)
  if (geminiKey) {
    try {
      console.log('[AI] Falling back to Gemini 2.5-flash...');
      const result = await analyzeWithGemini(input, geminiKey);
      console.log('[AI] Gemini succeeded.');
      return result;
    } catch (err) {
      const errStr = String(err);
      if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota')) {
        console.error('[AI] Gemini quota exhausted.');
      } else {
        console.error('[AI] Gemini failed:', errStr.slice(0, 200));
      }
    }
  }

  // 3. Local structured fallback
  console.warn('[AI] All providers failed — returning local fallback.');
  return createFallbackAnalysis(input, 'All AI providers are temporarily unavailable. Please try again in a moment.');
}
