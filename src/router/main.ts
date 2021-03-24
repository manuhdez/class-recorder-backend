import { Router } from 'express';
import authRouter from './auth/auth';
import ScraperRouter from './scraper/scraper';

const mainRouter = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/scraper', ScraperRouter);

export default mainRouter;
