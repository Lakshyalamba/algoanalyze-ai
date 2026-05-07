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

export type BugReport = {
  title: string;
  severity: 'Low' | 'Medium' | 'High' | string;
  explanation: string;
  fix: string;
  suggestedCode?: string;
};

export type QuizQuestion = {
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  answer?: string;
};

export type AnalysisResult = {
  problemSummary: string;
  questionExplanation: string;
  hinglishExplanation: string;
  pattern: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  timeComplexity: string;
  spaceComplexity: string;
  bruteForceApproach: string;
  betterApproach: string;
  optimizedApproach: string;
  steps: AnalysisStep[];
  dryRunTable: DryRunRow[];
  bugsOrWarnings: Array<string | BugReport>;
  edgeCases: string[];
  similarProblems: string[];
  quizQuestions: QuizQuestion[];
};
