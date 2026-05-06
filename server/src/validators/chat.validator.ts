import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().trim().min(1, 'Message is required.'),
  problemStatement: z.string().trim().optional(),
  code: z.string().trim().optional(),
  sampleInput: z.string().trim().optional(),
  expectedOutput: z.string().trim().optional(),
  languageMode: z.enum(['english', 'hinglish']),
  analysisContext: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type ChatInput = z.infer<typeof chatSchema>;
