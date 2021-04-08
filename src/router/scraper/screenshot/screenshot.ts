import { Request, Response, Router } from 'express';
import { screenshotValidation } from '../../../middlewares/validation/scraper';
import PuppeteerScraper from '../../../context/Scrapper/PuppeteerScraper';
import Validation from '../../../tools/Validation/Validation';

const ScreenshotRouter = Router();
const scraper = new PuppeteerScraper();

async function handleDefaultScreenshot(url: string) {
  return await scraper.takeScreenshotFromUrl(url);
}

async function handleFullPageScreenshot(url: string) {
  return await scraper.takeFullPageScreenshot(url);
}

ScreenshotRouter.post(
  '/',
  screenshotValidation,
  async (req: Request, res: Response) => {
    try {
      Validation.handleBodyValidation(req);

      const { size } = req.query;
      const { url } = req.body;

      let screenshot: string | Buffer | void;
      if (size === 'full') {
        screenshot = await handleFullPageScreenshot(url);
      } else {
        screenshot = await handleDefaultScreenshot(url);
      }

      if (!screenshot) throw new Error('Empty screenshot data found');
      res.status(200).contentType('jpeg').send(screenshot);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default ScreenshotRouter;
