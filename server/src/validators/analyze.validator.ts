import { z } from 'zod';

export const analyzeCodeSchema = z.object({
  title: z.string().trim().optional(),
  problemStatement: z.string().trim().optional(),
  code: z.string().trim().min(1, 'Code is required.'),
  sampleInput: z.string().trim().optional(),
  expectedOutput: z.string().trim().optional(),
  languageMode: z.enum(['english', 'hinglish']),
});

export type AnalyzeCodeBody = z.infer<typeof analyzeCodeSchema>;
