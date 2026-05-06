import { z } from 'zod';

const jsonValueSchema = z.unknown();

export const savedProblemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  problemStatement: z.string().trim().optional(),
  code: z.string().trim().min(1, 'Code is required.'),
  sampleInput: z.string().trim().optional(),
  expectedOutput: z.string().trim().optional(),
  pattern: z.string().trim().optional(),
  difficulty: z.string().trim().optional(),
  timeComplexity: z.string().trim().optional(),
  spaceComplexity: z.string().trim().optional(),
  explanation: jsonValueSchema.optional(),
  visualizationSteps: z.array(jsonValueSchema).optional(),
  dryRunTable: z.array(jsonValueSchema).optional(),
  bugsOrWarnings: z.array(jsonValueSchema).optional(),
  edgeCases: z.array(jsonValueSchema).optional(),
  similarProblems: z.array(jsonValueSchema).optional(),
  quizQuestions: z.array(jsonValueSchema).optional(),
});

export type SavedProblemBody = z.infer<typeof savedProblemSchema>;
