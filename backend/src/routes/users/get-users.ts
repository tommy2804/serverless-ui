import express, { Request, Response } from 'express';
import { User } from '../../models/user';
import { requireAuth } from '../../middlewares/require-auth';
import { requireRole } from '../../middlewares/require-role';
import { ROLE } from '../../types/role';

const router = express.Router();

router.get('/api/users', requireAuth, async (req: Request, res: Response) => {
  const users = await User.find({ role: ROLE.USER });
  res.send(users);
});

export { router as getUsersRouter };
