import { Router } from 'express';
import {
  loginController,
  logoutController,
  meController,
  signupController,
  updateProfileController,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const authRouter = Router();

authRouter.post('/signup', signupController);
authRouter.post('/login', loginController);
authRouter.get('/me', requireAuth, meController);
authRouter.post('/logout', logoutController);
authRouter.patch('/profile', requireAuth, updateProfileController);

