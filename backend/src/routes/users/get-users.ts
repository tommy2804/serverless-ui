import express, { Request, Response } from 'express';
import { User } from '../../models/user';
import { requireAuth } from '../../middlewares/require-auth';
import { requireRole } from '../../middlewares/require-role';
import { ROLE } from '../../types/role';
import { BadRequestError } from '../../errors/bad-request-error';

const router = express.Router();

router.get('/api/users', requireAuth, async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: ROLE.USER });
    if (!users) {
      throw new BadRequestError('users db is empty');
    }
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: 'Failed to get users' });
  }
});

router.get('/api/users/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new BadRequestError('This user does not exist');
    }
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send({ message: 'Failed to get user' });
  }
});

export { router as getUsersRouter };
