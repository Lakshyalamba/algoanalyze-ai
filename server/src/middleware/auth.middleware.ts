import type { NextFunction, Request, Response } from 'express';
import { getUserById } from '../services/auth.service.js';
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
      response.status(401).json({ message: 'Authentication token is required.' });
      return;
    }

    const payload = verifyJwt(token);
    const user = await getUserById(payload.userId);

    if (!user) {
      response.status(401).json({ message: 'Authentication token is invalid.' });
      return;
    }

    request.user = user;
    next();
  } catch {
    response.status(401).json({ message: 'Authentication token is invalid.' });
  }
}

