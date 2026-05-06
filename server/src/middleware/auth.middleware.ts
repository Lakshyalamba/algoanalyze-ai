import type { NextFunction, Request, Response } from 'express';
import { getUserById } from '../services/auth.service.js';
import { AppError } from '../utils/AppError.js';
import { verifyJwt } from '../utils/jwt.js';

function getBearerToken(header: string | undefined) {
  if (!header?.startsWith('Bearer ')) {
    return null;
  }

  const token = header.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
}

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
  try {
    const token = getBearerToken(request.header('Authorization'));

    if (!token) {
      throw new AppError('Authentication token is required.', 401);
    }

    const payload = verifyJwt(token);
    const user = await getUserById(payload.userId);

    if (!user) {
      throw new AppError('Authentication token is invalid.', 401);
    }

    request.user = user;
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Authentication token is invalid.', 401));
  }
}
