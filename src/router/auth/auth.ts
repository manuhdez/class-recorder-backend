import { Request, Response, Router } from 'express';
// import jwt from 'jsonwebtoken';
import { hashSync, genSaltSync } from 'bcrypt';
import { validationResult } from 'express-validator';
import { signupValidation } from '../../middlewares/validation/auth';
import User from '../../models/user';

const authRouter = Router();

async function isUsernameInUse(username: string): Promise<boolean> {
  const user = await User.find({ username });
  return user.length > 0;
}

async function isEmailInUse(email: string): Promise<boolean> {
  const user = await User.find({ email });
  return user.length > 0;
}

async function getPasswordHash(
  password: string,
  saltRounds = 10
): Promise<string> {
  const salt = genSaltSync(saltRounds);
  const hashedPassword = hashSync(password, salt);
  return hashedPassword;
}

authRouter.get('/login', (_, res) => {
  res.status(200).send('user authenticated successfully');
});

authRouter.post(
  '/signup',
  signupValidation,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new Error(errors.array()[0].msg);
      }

      const { username, email, password } = req.body;

      const isUsernameRegistered = await isUsernameInUse(username);
      const isEmailRegistered = await isEmailInUse(email);

      if (isUsernameRegistered) throw new Error('Username is already in use');
      if (isEmailRegistered) throw new Error('Email is already in use');

      const hashedPassword = await getPasswordHash(password);
      const newUser = new User({ username, email, password: hashedPassword });
      const savedUser = await newUser.save();

      res.status(201).json({ user: savedUser });
    } catch (err) {
      res.status(400).json({ error: err.message || err });
    }
  }
);

export default authRouter;
