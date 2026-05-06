import type { User } from '@prisma/client';

export type AuthUser = Omit<User, 'passwordHash'>;

export type JwtPayload = {
  userId: string;
  email: string;
};

declare global {
  // Express request augmentation requires namespace merging.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
