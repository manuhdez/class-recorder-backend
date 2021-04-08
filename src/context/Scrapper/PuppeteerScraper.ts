import puppeteer from 'puppeteer';
import { Browser, Page, Viewport } from 'puppeteer';
import { Scraper } from './Scraper';

type Puppeteer = typeof puppeteer;

export default class PuppeteerScraper implements Scraper<Puppeteer> {
  scraper = puppeteer;
  viewportSize: Viewport = { width: 1920, height: 1080 };

  getBrowser = async (headless = true): Promise<Browser> => {
    return await this.scraper.launch({ headless });
  };

  getPage = async (browser: Browser): Promise<Page> => {
    if (!browser) throw new Error('No valid browser was received.');
    const page = await browser.newPage();
    page.setViewport(this.viewportSize);
    return page;
  };

  getScreenshot = async (page: Page): Promise<string | Buffer | void> => {
    return await page.screenshot();
  };

  getFullPageScreenshot = async (
    page: Page
  ): Promise<string | Buffer | void> => {
    return await page.screenshot({ fullPage: true });
  };

  takeScreenshotFromUrl = async (
    url: string
  ): Promise<string | void | Buffer> => {
    try {
      const browser = await this.getBrowser();
      const page = await this.getPage(browser);
      await page.goto(url);
      const screenshot = await this.getScreenshot(page);
      await browser.close();
      return screenshot;
    } catch (err) {
      return err.message;
    }
  };

  takeFullPageScreenshot = async (
    url: string
  ): Promise<string | void | Buffer> => {
    try {
      const browser = await this.getBrowser();
      const page = await this.getPage(browser);
      await page.goto(url);
      const screenshot = await this.getFullPageScreenshot(page);
      await browser.close();
      return screenshot;
    } catch (err) {
      return err.message;
    }
  };

  // stream = async () => {};
}
