import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { analyzeCodeWithGemini } from '../services/gemini.service.js';
import { analyzeCodeSchema } from '../validators/analyze.validator.js';

function getValidationMessage(error: ZodError) {
  return error.issues[0]?.message ?? 'Invalid analysis request.';
}

export async function analyzeCodeController(request: Request, response: Response) {
  try {
    const input = analyzeCodeSchema.parse(request.body);
    const analysisResult = await analyzeCodeWithGemini(input);

    response.status(200).json(analysisResult);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ message: getValidationMessage(error) });
      return;
    }

    console.error(error);
    response.status(500).json({ message: 'Unable to analyze code. Please try again.' });
  }
}

