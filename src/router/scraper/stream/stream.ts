import { Router } from 'express';

const streamRouter = Router();

streamRouter.post('/', async (req, res) => {
  const { url } = req.body;
});

export default streamRouter;
