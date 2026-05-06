import { Router } from 'express';
import {
  createSavedProblemController,
  deleteSavedProblemController,
  getSavedProblemByIdController,
  getSavedProblemsController,
} from '../controllers/savedProblem.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const savedProblemRouter = Router();

savedProblemRouter.use(requireAuth);
savedProblemRouter.post('/', createSavedProblemController);
savedProblemRouter.get('/', getSavedProblemsController);
savedProblemRouter.get('/:id', getSavedProblemByIdController);
savedProblemRouter.delete('/:id', deleteSavedProblemController);
