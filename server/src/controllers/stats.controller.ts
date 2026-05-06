import type { Request, Response } from 'express';
import { getStatsOverview } from '../services/stats.service.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function getUserId(request: Request) {
  const userId = request.user?.id;

  if (!userId) {
    throw new AppError('Authentication token is required.', 401);
  }

  return userId;
}

export const getStatsOverviewController = asyncHandler(async (request: Request, response: Response) => {
  const userId = getUserId(request);
  const overview = await getStatsOverview(userId);

  response.status(200).json(overview);
});
