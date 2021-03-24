import * as puppeteer from 'puppeteer';
import { Browser, Page, Viewport } from 'puppeteer';
import { Scraper } from './Scraper';

type Puppeteer = typeof puppeteer;

export default class PuppeteerScraper implements Scraper<Puppeteer> {
  scraper: Puppeteer;
  currentBrowser: Browser | null = null;
  currentPage: Page | null = null;
  viewportSize: Viewport;

  constructor(
    scraper: Puppeteer,
    viewport: Viewport = { width: 1920, height: 1080 }
  ) {
    this.scraper = scraper;
    this.viewportSize = viewport;
  }

  getBrowser = async (headless: boolean = true): Promise<Browser> => {
    return await this.scraper.launch({ headless });
  };

  getPage = async (browser: Browser): Promise<Page> => {
    if (!browser) throw new Error('no browser received');
    const page = await browser.newPage();
    page.setViewport(this.viewportSize);
    return page;
  };

  getScreenshot = async (page: Page): Promise<string | Buffer | void> => {
    return await page.screenshot({
      path: 'screenshots/test.jpeg',
    });
  };

  takeScreenshotFromUrl = async (url: string) => {
    try {
      const browser = await this.getBrowser(false);
      const page = await this.getPage(browser);
      await page.goto(url);
      return await this.getScreenshot(page);
    } catch (err) {}
  };

  stream = async () => {};

  close = () => {
    this.currentBrowser?.close();
  };
}
