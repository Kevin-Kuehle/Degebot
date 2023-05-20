import { Bot } from "./Bot.js";
import { BehaviorSubject } from "rxjs";

export class DegewoBot extends Bot {
  constructor(params) {
    super(params);
  }

  async scrapStrategy() {
    if (this.page) {
      const myData = await this.page.evaluate(() => {
        const articles = document.querySelectorAll(".article-list__item");
        const extractedData = [];

        articles.forEach((article) => {
          const meta = article.querySelector(".article__meta");
          const title = article.querySelector(".article__title");

          const data = {
            meta: meta ? meta.innerText : "",
            title: title ? title.innerText : "",
          };

          extractedData.push(data);
        });

        return extractedData;
      });

      if (myData) {
        this.data.next(myData);
      }
    }
  }
}
