import express, { Request, Response } from 'express';
import { User } from '../../models/user';
import { requireAuth } from '../../middlewares/require-auth';
import { requireRole } from '../../middlewares/require-role';
import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/validate-request';
import { BadRequestError } from '../../errors/bad-request-error';

const router = express.Router();

router.put(
  '/api/users/:id',
  [body('email').optional().isEmail().withMessage('Email must be valid')],
  validateRequest,
  requireAuth,
  requireRole,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;

    try {
      const user = await User.findById(id);
      if (!user) {
        throw new BadRequestError('This user does not exist');
      }
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new BadRequestError('Email in use');
        }
      }
      user.set({
        firstName,
        lastName,
        email,
        user: firstName + ' ' + lastName,
      });

      await user.save();

      res.status(201).send(user);
    } catch (error) {
      res.status(500).send({ message: 'Failed to update user' });
    }
  }
);

export { router as editUserRouter };
