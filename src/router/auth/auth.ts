import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { hashSync, genSaltSync, compare } from 'bcrypt';
import { validationResult } from 'express-validator';
import {
  loginValidation,
  signupValidation,
} from '../../middlewares/validation/auth';
import User from '../../models/user';
import { ValidationMsg } from '../../types/validation';

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

function handleBodyValidation(req: Request) {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const [error] = validationErrors.array();
    throw new Error(error.msg);
  }
}

async function checkPasswordMatch(password: string, hashedPassword: string) {
  const isSamePassword = await compare(password, hashedPassword);
  if (!isSamePassword) throw new Error(ValidationMsg.invalidLogin);
}

export function generateToken(data: string): string {
  const jwtSecret = process.env.JWT_SECRET || '__default_secret__';
  return jwt.sign(data, jwtSecret);
}

authRouter.post(
  '/login',
  loginValidation,
  async (req: Request, res: Response) => {
    try {
      handleBodyValidation(req);
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) throw new Error(ValidationMsg.invalidLogin);

      await checkPasswordMatch(password, user.password as string);

      res.status(200).json({
        id: user.id,
        email,
        token: generateToken(email),
      });
    } catch (error) {
      res.status(400).json({ error: error.message || error });
    }
  }
);

authRouter.post(
  '/signup',
  signupValidation,
  async (req: Request, res: Response) => {
    try {
      handleBodyValidation(req);
      const { username, email, password } = req.body;

      const isUsernameRegistered = await isUsernameInUse(username);
      if (isUsernameRegistered) throw new Error(ValidationMsg.usernameInUse);

      const isEmailRegistered = await isEmailInUse(email);
      if (isEmailRegistered) throw new Error(ValidationMsg.emailInUse);

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
