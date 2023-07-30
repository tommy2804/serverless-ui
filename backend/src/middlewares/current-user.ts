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
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;

    req.currentUser = decoded;
  } catch (error) {
    console.log('Invalid Token');
  }

  next();
};
