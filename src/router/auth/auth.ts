import { Router } from 'express';

const authRouter = Router();

authRouter.get('/login', (_, res) => {
  res.status(200).send('user authenticated successfully');
});

export default authRouter;
