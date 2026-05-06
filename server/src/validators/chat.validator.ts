import { z } from 'zod';

export const chatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Message is required.')
    .max(5_000, 'Message is too large. Please keep chat messages under 5,000 characters.'),
  problemStatement: z.string().trim().optional(),
  code: z.string().trim().max(50_000, 'Code context is too large.').optional(),
  sampleInput: z.string().trim().optional(),
  expectedOutput: z.string().trim().optional(),
  languageMode: z.enum(['english', 'hinglish']),
  analysisContext: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type ChatInput = z.infer<typeof chatSchema>;
