import { Router } from 'express';
import ScreenshotRouter from './screenshot/screenshot';
import streamRouter from './stream/stream';

const ScraperRouter = Router();

ScraperRouter.use('/screenshot', ScreenshotRouter);
ScraperRouter.use('/stream', streamRouter);

export default ScraperRouter;
