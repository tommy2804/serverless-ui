import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { ROLE } from '../types/role';

export const requireRole = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.currentUser?.role;
  if (userRole !== ROLE.ADMIN) {
    throw new NotAuthorizedError('User must be an admin in order to make this req');
  }
  next();
};
