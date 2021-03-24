import { Router } from 'express';
import * as puppeteer from 'puppeteer';
import PuppeteerScraper from '../../../context/Scrapper/PuppeteerScraper';

const ScreenshotRouter = Router();

ScreenshotRouter.get('/', async (_, res) => {
  const scraper = new PuppeteerScraper(puppeteer);
  const url =
    'https://dev.to/sagar/how-to-capture-screenshots-with-puppeteer-3mb2';

  try {
    const screenshot = await scraper.takeScreenshotFromUrl(url);
    if (!screenshot) throw new Error('Empty screenshot data found');
    res.status(200).send(screenshot);
  } catch (err) {
    res.status(500).send('could not generate the screenshot');
  } finally {
    scraper.close();
  }
});

export default ScreenshotRouter;
