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
      'Check empty input before accessing indexes.',
      'Avoid returning placeholder values after the answer is found.',
      'Confirm the output format matches the platform requirement.',
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
        answer: 'It stores reusable state so each element is processed once instead of comparing against every other element.',
      },
      {
        question: 'What should you verify before submitting?',
        answer: 'Validate edge cases, output format, and complexity against the stated constraints.',
      },
      {
        question: 'When can O(n) space be acceptable?',
        answer: 'When it reduces time significantly and fits within memory constraints for the input size.',
      },
    ],
  };
}
