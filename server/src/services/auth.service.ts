import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import type { AuthUser } from '../types/auth.js';
import { AppError } from '../utils/AppError.js';
import { signJwt } from '../utils/jwt.js';
import type { LoginInput, SignupInput } from '../validators/auth.validator.js';

const passwordSaltRounds = 12;

export class AuthError extends AppError {}

function toAuthUser(user: {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function createAuthResponse(user: AuthUser) {
  return {
    user,
    token: signJwt({
      userId: user.id,
      email: user.email,
    }),
  };
}

export async function signup(input: SignupInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AuthError('An account with this email already exists.', 409);
  }

  const passwordHash = await bcrypt.hash(input.password, passwordSaltRounds);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return createAuthResponse(toAuthUser(user));
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AuthError('Invalid email or password.', 401);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AuthError('Invalid email or password.', 401);
  }

  return createAuthResponse(toAuthUser(user));
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user ? toAuthUser(user) : null;
}
