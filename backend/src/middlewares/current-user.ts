import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ROLE } from '../types/role';

interface UserPayload {
  id: string;
  email: string;
  role: ROLE;
}
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const decoded = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = decoded;
  } catch (error) {
    return next();
  }

  next();
};
