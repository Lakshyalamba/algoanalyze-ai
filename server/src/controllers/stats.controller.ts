import type { Request, Response } from 'express';
import { getStatsOverview } from '../services/stats.service.js';

function getUserId(request: Request, response: Response) {
  const userId = request.user?.id;

  if (!userId) {
    response.status(401).json({ message: 'Authentication token is required.' });
    return null;
  }

  return userId;
}

export async function getStatsOverviewController(request: Request, response: Response) {
  const userId = getUserId(request, response);
  if (!userId) return;

  try {
    const overview = await getStatsOverview(userId);
    response.status(200).json(overview);
  } catch (error) {
    console.error('Failed to load stats overview:', error);
    response.status(500).json({ message: 'Unable to load progress stats. Please try again.' });
  }
}
