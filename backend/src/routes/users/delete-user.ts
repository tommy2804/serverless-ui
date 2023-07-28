import express, { Request, Response } from 'express';
import { User } from '../../models/user';
import { requireAuth } from '../../middlewares/require-auth';
import { requireRole } from '../../middlewares/require-role';
import { ROLE } from '../../types/role';
import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/validate-request';
import { BadRequestError } from '../../errors/bad-request-error';
import { NotAuthorizedError } from '../../errors/not-authorized-error';

//create user

const router = express.Router();

router.delete('/api/users/:id', requireAuth, requireRole, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      throw new BadRequestError('This user does not exist');
    }
    await User.deleteOne({ id: user.id });
    res.status(200).send('User deleted successfully');
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete user' });
  }
});

export { router as userRouter };
