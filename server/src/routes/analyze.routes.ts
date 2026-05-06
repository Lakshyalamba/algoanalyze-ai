import { Router } from 'express';
import { analyzeCodeController } from '../controllers/analyze.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const analyzeRouter = Router();

analyzeRouter.post('/', requireAuth, analyzeCodeController);

