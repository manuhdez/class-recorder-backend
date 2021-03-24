import { Browser, Page } from 'puppeteer';

export interface Scraper<T> {
  scraper: T;
  getBrowser: () => Promise<Browser>;
  getPage: (browser: Browser) => Promise<Page>;
  getScreenshot: (page: Page) => Promise<string | Buffer | void>;
  takeScreenshotFromUrl: (url: string) => Promise<string | Buffer | void>;
}
