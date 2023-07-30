import express, { Request, Response } from 'express';
import { User } from '../../models/user';
import { body } from 'express-validator';
import { Password } from '../../services/password';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../../middlewares/validate-request';
import { BadRequestError } from '../../errors/bad-request-error';

const router = express.Router();

router.post(
  '/api/auth/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }
    const passwordsMatch = await Password.compare(existingUser.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }
    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };
    res.status(201).send({ user: existingUser, token: userJwt, session: req.session });
  }
);

export { router as signinRouter };
