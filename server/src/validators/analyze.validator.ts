import { z } from 'zod';

export const analyzeCodeSchema = z.object({
  title: z.string().trim().optional(),
  problemStatement: z.string().trim().min(1, 'Problem statement is required.'),
  code: z
    .string()
    .trim()
    .min(1, 'Code is required.')
    .max(50_000, 'Code is too large. Please keep submissions under 50,000 characters.'),
  sampleInput: z.string().trim().optional(),
  expectedOutput: z.string().trim().optional(),
  languageMode: z.enum(['english', 'hinglish']),
});

export type AnalyzeCodeBody = z.infer<typeof analyzeCodeSchema>;
