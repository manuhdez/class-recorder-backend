import { Router } from 'express';
import ScreenshotRouter from './screenshot/screenshot';

const ScraperRouter = Router();

ScraperRouter.use('/screenshot', ScreenshotRouter);

export default ScraperRouter;
