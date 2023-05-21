export class DataChecker {
  #dataHistory;
  #compareAttr;
  #blacklist;
  #searchRegex;

  constructor(config) {
    this.#dataHistory = config.dataHistory || [];
    this.#compareAttr = config.compareAttr || [];
    this.#blacklist = config.blacklist || [];
    this.#searchRegex = config.searchRegex || null;
  }

  async check(data) {
    // gehe durch alle Daten

    const filtered = data.filter((item) => {
      const isBlacklisted = this.#blacklist.some((blacklistItem) => {
        return this.#compareAttr.some((attr) => {
          return item[attr].includes(blacklistItem);
        });
      });

      if (isBlacklisted) {
        return false;
      }

      const isAlreadyKnown = this.#dataHistory.some((historyItem) => {
        return JSON.stringify(item) === JSON.stringify(historyItem);
      });

      if (isAlreadyKnown) {
        return false;
      }

      const isMatching = this.#compareAttr.some((rule) => {
        return this.#searchRegex.test(item[rule]);
      });

      if (isMatching) {
        this.#dataHistory.push(item);
        return true;
      }

      return false;
    });

    return filtered;
  }
}
