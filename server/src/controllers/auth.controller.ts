import type { Request, Response } from 'express';
import { login, signup, updateUserName } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginSchema, signupSchema, updateProfileSchema } from '../validators/auth.validator.js';

export const signupController = asyncHandler(async (request: Request, response: Response) => {
  const input = signupSchema.parse(request.body);
  const result = await signup(input);

  response.status(201).json(result);
});

export const loginController = asyncHandler(async (request: Request, response: Response) => {
  const input = loginSchema.parse(request.body);
  const result = await login(input);

  response.status(200).json(result);
});

export function meController(request: Request, response: Response) {
  response.status(200).json({ user: request.user });
}

export function logoutController(_request: Request, response: Response) {
  response.status(200).json({ message: 'Logged out successfully.' });
}

export const updateProfileController = asyncHandler(async (request: Request, response: Response) => {
  const { name } = updateProfileSchema.parse(request.body);
  const user = await updateUserName(request.user!.id, name);
  response.status(200).json({ user });
});
