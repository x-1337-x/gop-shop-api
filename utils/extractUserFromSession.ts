import { NextFunction, Request, Response } from 'express';
import { prisma } from '../client';

export const extractUserFromSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      !req.session.lastSignIn ||
      Date.now() - req.session.lastSignIn > 4 * 60 * 60 * 1000
    ) {
      return next();
    }

    if (!req.session.userId) {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
    });

    if (!user) {
      return next();
    }

    res.locals.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};
