import { Request, Response, NextFunction } from 'express';
import { SessionOverError } from '../errors/session-over-error';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new SessionOverError();
  }
  next();
};
