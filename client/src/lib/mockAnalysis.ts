import type { AnalysisResult } from '../types/analysis';

type MockAnalysisInput = {
  title?: string;
  problemStatement?: string;
  sampleInput: string;
  expectedOutput: string;
};

export function createMockAnalysis(input: MockAnalysisInput): AnalysisResult {
  const title = input.title?.trim() || 'Submitted code';
  const sampleInput = input.sampleInput.trim() || 'Example input';
  const expectedOutput = input.expectedOutput.trim() || 'Expected output';

  return {
    problemSummary: `${title} asks you to transform the given input into the required output using a clear algorithmic pattern.`,
    questionExplanation:
      input.problemStatement?.trim() ||
      'No problem statement was provided. The analysis is based on the submitted code and optional sample input/output.',
    hinglishExplanation:
      'Is problem mein pehle input ko samjho, phir pattern identify karo. Agar repeated lookup ho raha hai, to hash map ya precomputation help karega.',
    pattern: 'Hashing / Iteration',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    bruteForceApproach:
      'Try every possible candidate or pair, validate it directly, and return the first valid answer. This is simple but usually costs O(n^2).',
    betterApproach:
      'Store useful intermediate information while scanning the input so repeated checks become faster.',
    optimizedApproach:
      'Use one pass with a lookup structure, update state as you go, and return as soon as the target condition is satisfied.',
    steps: [
      {
        stepNumber: 1,
        line: 1,
        variables: { sampleInput },
        dataStructureState: {
          type: 'none',
          values: [],
          highlight: null,
        },
        annotation: `Start with the sample input: ${sampleInput}. Identify the values that change during iteration.`,
      },
      {
        stepNumber: 2,
        line: 2,
        variables: { state: 'tracking useful values' },
        dataStructureState: {
          type: 'none',
          values: [],
          highlight: null,
        },
        annotation: 'Maintain the smallest useful state instead of recomputing previous work.',
      },
      {
        stepNumber: 3,
        line: 3,
        variables: { expectedOutput },
        dataStructureState: {
          type: 'none',
          values: [],
          highlight: null,
        },
        annotation: `Compare the final result with the expected output: ${expectedOutput}.`,
      },
    ],
    dryRunTable: [
      {
        step: 1,
        line: 1,
        variables: { input: sampleInput },
        output: '-',
        explanation: 'Initialize pointers, counters, or lookup map.',
      },
      {
        step: 2,
        line: 2,
        variables: { iteration: 'first' },
        output: 'No final answer yet',
        explanation: 'Update state with current element.',
      },
      {
        step: 3,
        line: 3,
        variables: { condition: 'satisfied' },
        output: expectedOutput,
        explanation: 'Return the expected output when the condition is satisfied.',
      },
    ],
    bugsOrWarnings: [
      {
        title: 'Validate empty inputs',
        severity: 'Medium',
        explanation: 'Index access or loops that assume data exists can fail on minimum constraints.',
        fix: 'Return the documented default result before reading the first element.',
      },
      {
        title: 'Confirm output format',
        severity: 'Low',
        explanation: 'A correct algorithm can still fail if it returns the wrong container or text format.',
        fix: 'Match the platform signature and sample output exactly.',
      },
    ],
    edgeCases: [
      'Empty input or minimum constraint values',
      'Single element input',
      'Duplicate values',
      'Already sorted or reverse sorted data',
      'Large input near constraint limits',
    ],
    similarProblems: [
      'Two Sum',
      'Valid Anagram',
      'Longest Substring Without Repeating Characters',
      'Subarray Sum Equals K',
    ],
    quizQuestions: [
      {
        question: 'Why does the optimized approach improve over brute force?',
        options: ['It stores reusable state', 'It adds more nested loops', 'It ignores edge cases', 'It changes the sample input'],
        correctAnswer: 'It stores reusable state',
        explanation: 'Reusable state prevents repeated work and often reduces time complexity.',
      },
      {
        question: 'What should you verify before submitting?',
        options: ['Edge cases and output format', 'Only variable names', 'Only button styling', 'Only comments'],
        correctAnswer: 'Edge cases and output format',
        explanation: 'Correctness depends on boundary inputs and matching the expected output shape.',
      },
      {
        question: 'When can O(n) space be acceptable?',
        options: ['When it reduces time and fits memory limits', 'Never', 'Only for empty arrays', 'Only with recursion'],
        correctAnswer: 'When it reduces time and fits memory limits',
        explanation: 'Extra memory is often a good tradeoff when constraints allow it and time improves.',
      },
      {
        question: 'What makes a dry run useful?',
        options: ['Tracking variable changes', 'Changing the theme', 'Skipping conditions', 'Removing tests'],
        correctAnswer: 'Tracking variable changes',
        explanation: 'A dry run shows how state changes through each meaningful step.',
      },
      {
        question: 'Why compare complexity with constraints?',
        options: ['To know if the solution will scale', 'To rename functions', 'To choose colors', 'To remove imports'],
        correctAnswer: 'To know if the solution will scale',
        explanation: 'Constraints determine whether the algorithm can finish within time and memory limits.',
      },
    ],
  };
}
