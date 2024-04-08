import { NextFunction, Request, Response } from 'express';
import { prisma } from '../client';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      !req.session.lastSignIn ||
      Date.now() - req.session.lastSignIn > 6 * 60 * 1000
    ) {
      res.sendStatus(401);
      return;
    }

    if (!req.session.userId) {
      res.sendStatus(401);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
    });

    if (!user) {
      res.sendStatus(401);
      return;
    }

    res.json();
    return;
  } catch (error) {
    next(error);
  }
};
