import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../../models/user';
import { validateRequest } from '../../middlewares/validate-request';
import { BadRequestError } from '../../errors/bad-request-error';
import jwt from 'jsonwebtoken';
import { ROLE } from '../../types/role';

const router = express.Router();

router.post(
  '/api/auth/signup',
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
      role: ROLE.ADMIN,
    });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send({ user, token: userJwt });
  }
);

export { router as signupRouter };
// kubectl create secret generic jwt-secret --from-leteral=JWT_KEY=Tommy2
