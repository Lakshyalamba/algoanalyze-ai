import type { Request, Response } from 'express';
import { analyzeCodeWithGemini } from '../services/gemini.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { analyzeCodeSchema } from '../validators/analyze.validator.js';

export const analyzeCodeController = asyncHandler(async (request: Request, response: Response) => {
  const input = analyzeCodeSchema.parse(request.body);
  const analysisResult = await analyzeCodeWithGemini(input);

  response.status(200).json(analysisResult);
});
