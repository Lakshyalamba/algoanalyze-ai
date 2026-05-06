export type SaveProblemInput = {
  title: string;
  problemStatement?: string;
  code: string;
  sampleInput?: string;
  expectedOutput?: string;
  pattern?: string;
  difficulty?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  explanation?: unknown;
  visualizationSteps?: unknown;
  dryRunTable?: unknown;
  bugsOrWarnings?: unknown;
  edgeCases?: unknown;
  similarProblems?: unknown;
  quizQuestions?: unknown;
};
