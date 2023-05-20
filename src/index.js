import { run } from "./modules/puppeteer/puppeteer.js";
import { Bot } from "./classes/Bot.js";
import { DegewoBot } from "./classes/DegewoBot.js";

const target =
  "https://immosuche.degewo.de/de/search?size=1&page=1&property_type_id=1&categories%5B%5D=16&lat=&lon=&area=&address%5Bstreet%5D=&address%5Bcity%5D=&address%5Bzipcode%5D=&address%5Bdistrict%5D=&district=60&property_number=&price_switch=false&price_radio=null&price_from=&price_to=&qm_radio=null&qm_from=&qm_to=&rooms_radio=null&rooms_from=&rooms_to=&wbs_required=&order=rent_total_without_vat_asc";

async function main() {
  const bot = new Bot(target);
  const degewoBot = new DegewoBot(target);

  const a = await bot.run(target);
  const b = await degewoBot.run(target);

  a.subscribe((data) => {
    console.log(`devlog: data A`, data);
  });

  b.subscribe((data) => {
    console.log(`devlog: data B`, data);
  });

  bot.startScraping();
  degewoBot.startScraping();
}
main();
