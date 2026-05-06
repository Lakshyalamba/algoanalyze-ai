export type LanguageMode = 'english' | 'hinglish';

export type AnalysisStep = {
  stepNumber: number;
  line: number;
  variables: Record<string, unknown>;
  dataStructureState: {
    type:
      | 'array'
      | 'stack'
      | 'queue'
      | 'linked-list'
      | 'tree'
      | 'graph'
      | 'recursion'
      | 'dp'
      | 'sorting'
      | 'heap'
      | 'none';
    values: unknown;
    highlight: unknown;
  };
  annotation: string;
};

export type DryRunRow = {
  step: number;
  line: number;
  variables: Record<string, unknown>;
  output: string;
  explanation: string;
};

export type QuizQuestion = {
  question: string;
  answer: string;
};

export type AnalysisResult = {
  problemSummary: string;
  questionExplanation: string;
  hinglishExplanation: string;
  pattern: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeComplexity: string;
  spaceComplexity: string;
  bruteForceApproach: string;
  betterApproach: string;
  optimizedApproach: string;
  steps: AnalysisStep[];
  dryRunTable: DryRunRow[];
  bugsOrWarnings: string[];
  edgeCases: string[];
  similarProblems: string[];
  quizQuestions: QuizQuestion[];
};
