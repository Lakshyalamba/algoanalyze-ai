import { Router } from 'express';
import { getStatsOverviewController } from '../controllers/stats.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const statsRouter = Router();

statsRouter.use(requireAuth);
statsRouter.get('/overview', getStatsOverviewController);
