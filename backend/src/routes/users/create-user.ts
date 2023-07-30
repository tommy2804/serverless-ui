import express, { Request, Response } from 'express';
import { User } from '../../models/user';
import { requireAuth } from '../../middlewares/require-auth';
import { requireRole } from '../../middlewares/require-role';
import { ROLE } from '../../types/role';
import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/validate-request';
import { BadRequestError } from '../../errors/bad-request-error';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users',
  requireAuth,
  requireRole,
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
    body('firstName').not().isEmpty().withMessage('First name is required'),
    body('lastName').not().isEmpty().withMessage('Last name is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError('Email in use');
      }

      const user = User.build({
        email,
        password,
        firstName,
        lastName,
        user: firstName + ' ' + lastName,
        role: ROLE.USER,
      });

      const savedUser = await user.save();

      const currentUser = req.currentUser;
      if (currentUser) {
        await User.updateOne({ id: currentUser.id }, { $push: { usersCreated: savedUser.id } });
      }

      res.status(201).send(user);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Failed to create user' });
    }
  }
);

// ... (export statement) ...

export { router as createUserRouter };
