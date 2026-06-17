import type { AnalyzeCodeInput } from '../types/analysis.js';

export function buildAnalysisPrompt(input: AnalyzeCodeInput) {
  return `You are AlgoAnalyze AI, an expert DSA tutor and code visualizer.

Analyze the given code and DSA problem. Return ONLY a raw JSON object — no markdown, no \`\`\`json fences.

Required JSON schema:
{
  "problemSummary": string,
  "questionExplanation": string,
  "hinglishExplanation": string,
  "pattern": string,
  "difficulty": "Easy" | "Medium" | "Hard",
  "timeComplexity": string,
  "spaceComplexity": string,
  "bruteForceApproach": string,
  "betterApproach": string,
  "optimizedApproach": string,
  "steps": [
    {
      "stepNumber": number,
      "line": number,
      "variables": object,
      "dataStructureState": {
        "type": "array" | "stack" | "queue" | "linked-list" | "tree" | "graph" | "recursion" | "dp" | "sorting" | "heap" | "none",
        "values": any,
        "highlight": any
      },
      "annotation": string
    }
  ],
  "dryRunTable": [
    { "step": number, "line": number, "variables": object, "output": string, "explanation": string }
  ],
  "bugsOrWarnings": [
    { "title": string, "severity": "Low" | "Medium" | "High", "explanation": string, "fix": string, "suggestedCode": string }
  ],
  "edgeCases": string[],
  "similarProblems": string[],
  "quizQuestions": [
    { "question": string, "options": string[], "correctAnswer": string, "explanation": string }
  ]
}

Instructions:
- problemSummary: 1-2 sentence clear summary of what this problem asks.
- questionExplanation: Thorough beginner-friendly explanation of the algorithm logic and WHY it works.
- hinglishExplanation: Same explanation but in simple Hinglish (mix of Hindi and English). Don't translate keywords like array, loop, function, return, index, pointer.
- pattern: Precise DSA pattern (e.g. "Expand Around Center", "Two Pointers", "Sliding Window", "Dynamic Programming").
- difficulty: Easy / Medium / Hard based on LeetCode standard.
- timeComplexity / spaceComplexity: Exact Big-O with brief reason.
- bruteForceApproach: Naive solution with its complexity and why it's slow.
- betterApproach: Intermediate improvement if one exists.
- optimizedApproach: Best solution with step-by-step algorithm and complexity.
- steps: REAL step-by-step execution trace on the provided sample input. Generate 6-10 steps minimum. Include every loop iteration, comparison, branch decision, pointer movement, and state update. Use the most appropriate dataStructureState.type for this problem. Put relevant values in "values" array and active indices in "highlight".
- dryRunTable: One row per meaningful iteration. Include variable values and what changed.
- bugsOrWarnings: Specific bugs or pitfalls in this exact code. Return [] if none.
- edgeCases: 4-6 specific edge cases relevant to THIS problem (not generic).
- similarProblems: 4-5 related LeetCode problems.
- quizQuestions: Exactly 5 MCQs tailored to this specific algorithm. Each has 4 options, correctAnswer (exact match from options), explanation. Cover complexity, dry run, pattern, and edge cases.

Input:
Title: ${input.title || 'Untitled'}
Language mode: ${input.languageMode}

Problem statement:
${input.problemStatement || 'Not provided — infer from the code.'}

Code:
${input.code}

Sample input: ${input.sampleInput || 'Not provided'}
Expected output: ${input.expectedOutput || 'Not provided'}
`.trim();
}
