import { Request, Response, Router } from 'express';
import { validationResult } from 'express-validator';
import {
  loginValidation,
  signupValidation,
} from '../../middlewares/validation/auth';
import User from '../../models/user';
import { ValidationMsg } from '../../types/validation';
import Token from '../../tools/Token/Token';
import Password from '../../tools/Password/Password';

const authRouter = Router();

async function isUsernameInUse(username: string): Promise<boolean> {
  const user = await User.findOne({ username });
  return user ? true : false;
}

async function isEmailInUse(email: string): Promise<boolean> {
  const user = await User.findOne({ email });
  return user ? true : false;
}

function handleBodyValidation(req: Request) {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const [error] = validationErrors.array();
    throw new Error(error.msg);
  }
}

authRouter.post(
  '/login',
  loginValidation,
  async (req: Request, res: Response) => {
    try {
      handleBodyValidation(req);
      const { email, password } = req.body;

      // TODO: move method to utility class that throws an error if no user is found
      const user = await User.findOne({ email });
      if (!user) throw new Error(ValidationMsg.invalidLogin);

      Password.verify(password, user.password as string);

      const jwt = new Token();
      const token = jwt.generateToken({ id: user.id, username: user.username });

      res.status(200).json({
        id: user.id,
        email,
        token,
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

      const hashedPassword = Password.generateHash(password);
      const newUser = new User({ username, email, password: hashedPassword });
      const savedUser = await newUser.save();

      res.status(201).json({ user: savedUser });
    } catch (err) {
      res.status(400).json({ error: err.message || err });
    }
  }
);

export default authRouter;
