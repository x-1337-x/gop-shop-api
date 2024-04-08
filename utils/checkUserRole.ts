import { NextFunction, Request, Response } from 'express';
import { UserRole } from '@prisma/client';

export const checkUserRole =
  (roles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!res.locals.user) {
        res.sendStatus(401);
        return;
      }

      if (!roles.includes(res.locals.user.role)) {
        res.sendStatus(403);
        return;
      }

      next();
      return;
    } catch (error) {
      next(error);
    }
  };
