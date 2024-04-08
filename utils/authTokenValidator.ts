import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '../../shared/types';
import { prisma } from '../client';

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.token || req.query.token || req.headers.token;

  if (!token) return res.status(403).end();

  try {
    const decoded = (await jwt.verify(
      token,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.JWT_SECRET!
    )) as AuthTokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(403).end();
    }

    res.locals.userId = decoded.id;

    next();
  } catch (err) {
    next(err);
  }
};
