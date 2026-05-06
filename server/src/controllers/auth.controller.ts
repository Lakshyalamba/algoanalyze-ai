import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { AuthError, login, signup } from '../services/auth.service.js';
import { loginSchema, signupSchema } from '../validators/auth.validator.js';

function getValidationMessage(error: ZodError) {
  return error.issues[0]?.message ?? 'Invalid request body.';
}

function handleAuthError(error: unknown, response: Response) {
  if (error instanceof ZodError) {
    response.status(400).json({ message: getValidationMessage(error) });
    return;
  }

  if (error instanceof AuthError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(error);
  response.status(500).json({ message: 'Something went wrong. Please try again.' });
}

export async function signupController(request: Request, response: Response) {
  try {
    const input = signupSchema.parse(request.body);
    const result = await signup(input);

    response.status(201).json(result);
  } catch (error) {
    handleAuthError(error, response);
  }
}

export async function loginController(request: Request, response: Response) {
  try {
    const input = loginSchema.parse(request.body);
    const result = await login(input);

    response.status(200).json(result);
  } catch (error) {
    handleAuthError(error, response);
  }
}

export function meController(request: Request, response: Response) {
  response.status(200).json({ user: request.user });
}

export function logoutController(_request: Request, response: Response) {
  response.status(200).json({ message: 'Logged out successfully.' });
}

