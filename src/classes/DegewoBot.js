import { Bot } from "./Bot.js";
import { BehaviorSubject } from "rxjs";

export class DegewoBot extends Bot {
  // #targetUrl;
  // #refreshInterval = 10 * 1000;
  // #browser;
  // #page;
  // #refreshIntervalId;
  // data;
  counter = 0;

  constructor(params) {
    super(params);
  }

  async scrapStrategy() {
    if (this.data) {
      this.data.next([this.counter++]);
    }
  }
}
