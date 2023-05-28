import puppeteer from "puppeteer";
import { default as puppeteerCore } from "puppeteer-core";
import { BehaviorSubject } from "rxjs";
import dotenv from "dotenv";

dotenv.config();

export class Bot {
  #targetUrl;
  #refreshInterval = 15 * 1000;
  #refreshIntervalId;
  browser;
  page;
  data;
  #name;

  constructor(targetUrl, config = {}) {
    this.#targetUrl = targetUrl;
    this.#refreshInterval = config.refreshInterval || this.#refreshInterval;
    this.data = new BehaviorSubject([]);
    this.#name = config.name || "default Bot";
  }

  get name() {
    return this.#name;
  }

  async run() {
    try {
      console.log(`devlog: run: ${this.#name}`);
      // starten wir den Browser
      this.browser = await puppeteer.launch({ headless: true });
      this.page = await this.browser.newPage();
      this.page.setDefaultNavigationTimeout(2 * 60 * 1000);
      await this.page.goto(this.#targetUrl);

      return Promise.resolve(this.data);
    } catch (error) {
      this.stop();
      throw new Error(error);
    }
  }

  async runProxy() {
    try {
      console.log(`devlog: run Proxy: ${this.#name}`);

      const AUTH = `${process.env.PROXY_BROWSER_USERNAME}:${process.env.PROXY_BROWSER_PASSWORD}`;
      this.browser = await puppeteerCore.connect({
        browserWSEndpoint: `wss://${AUTH}@${process.env.PROXY_BROWSER_HOST}`,
      });

      if (!this.browser.isConnected()) {
        throw new Error("Browser not connected");
      }

      console.log(`devlog: run Proxy: ${this.#name} connected`);
      this.page = await this.browser.newPage();
      this.page.setDefaultNavigationTimeout(2 * 60 * 1000);
      await this.page.goto(this.#targetUrl);
      return Promise.resolve(this.data);
    } catch (error) {
      throw new Error(error);
    } finally {
      this.stop();
    }
  }

  async stop() {
    clearInterval(this.#refreshIntervalId);

    const isBrowserRunning = await this.browser.process();

    if (!!isBrowserRunning) {
      console.log(`devlog: stop: ${this.#name}`);
      await this.browser.close();
    }

    console.log(`${this.#name} stopped`);
    return Promise.resolve();
  }
  async restart() {
    console.log(`devlog: restart ${this.#name}`);
    await this.stop();
    await this.run();
    this.startScraping();
  }

  getData() {
    return this.data;
  }

  async scrapStrategy() {
    console.count(
      `scrapStrategy:: no strategy implemented.Overwrite this method in your subclass`
    );
  }

  startScraping() {
    console.log(`${this.#name} startScraping`);

    this.scrapStrategy();
    this.#refreshIntervalId = setInterval(async () => {
      await this.page.reload({ ignoreCache: true });
      this.scrapStrategy();
    }, this.#refreshInterval);
  }
}
