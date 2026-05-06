import jwt, { type SignOptions } from 'jsonwebtoken';
import type { JwtPayload } from '../types/auth.js';

const defaultExpiresIn = '7d';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return secret;
}

export function signJwt(payload: JwtPayload) {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN?.trim() || defaultExpiresIn) as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, getJwtSecret(), options);
}

export function verifyJwt(token: string): JwtPayload {
  const payload = jwt.verify(token, getJwtSecret());

  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof payload.userId !== 'string' ||
    typeof payload.email !== 'string'
  ) {
    throw new Error('Invalid token payload.');
  }

  return {
    userId: payload.userId,
    email: payload.email,
  };
}

