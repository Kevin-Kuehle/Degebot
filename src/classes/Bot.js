import puppeteer from "puppeteer";
import { BehaviorSubject } from "rxjs";

export class Bot {
  #targetUrl;
  #refreshInterval = 15 * 1000;
  #refreshIntervalId;

  browser;
  page;
  data;

  constructor(targetUrl, config = {}) {
    this.#targetUrl = targetUrl;
    this.#refreshInterval = config.refreshInterval || this.#refreshInterval;
    this.data = new BehaviorSubject([]);
  }

  async run() {
    try {
      // starten wir den Browser
      this.browser = await puppeteer.launch({ headless: false });
      this.page = await this.browser.newPage();
      this.page.setDefaultNavigationTimeout(2 * 60 * 1000);
      await this.page.goto(this.#targetUrl);

      return Promise.resolve(this.data);
    } catch (error) {
      this.stop();
      throw new Error(error);
    }
  }
  async stop() {
    clearInterval(this.#refreshIntervalId);
    await this.browser.close();
    console.log(`bot stopped`);
    return Promise.resolve();
  }
  async restart() {
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
    console.log(`devlog: startScraping`);

    this.scrapStrategy();
    this.#refreshIntervalId = setInterval(async () => {
      await this.page.reload({ ignoreCache: true });
      this.scrapStrategy();
    }, this.#refreshInterval);
  }
}
