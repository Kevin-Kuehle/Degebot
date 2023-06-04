import { DegewoBot } from "./classes/DegewoBot.js";
import { sendMail, arrayToContent } from "./modules/mailer/mailer.js";
import { DataChecker } from "./classes/DataChecker.js";
import { connectToDatabase, degewoDBAdd } from "./modules/database/database.js";

const target =
  "https://immosuche.degewo.de/de/search?size=1&page=1&property_type_id=1&categories%5B%5D=16&lat=&lon=&area=&address%5Bstreet%5D=&address%5Bcity%5D=&address%5Bzipcode%5D=&address%5Bdistrict%5D=&district=60&property_number=&price_switch=false&price_radio=null&price_from=&price_to=&qm_radio=null&qm_from=&qm_to=&rooms_radio=null&rooms_from=&rooms_to=&wbs_required=&order=rent_total_without_vat_asc";

async function main() {
  try {
    await connectToDatabase();

    setTimeout(() => {
      degewoDBAdd({ title: "test", meta: "test" });
    }, 15000);

    const degewoBot = new DegewoBot(target, {
      name: "DegewoBot",
      refreshInterval: 120 * 60 * 1000,
    });

    const onDegewoChanges$ = await degewoBot.run();

    const configDataCheckerDegewo = {
      compareAttr: ["title", "meta"],
      blacklist: ["Motorrad Stellplatz", "Motorradstellplatz", "Motorrad"],
      searchRegex:
        /\b(Waldsassener\sStraße|Waldsassener\sstrasse|Waldsassener|Tirschenreuther\sRing|Tirschenreutherring)\b/gi,
    };

    const degewoDataChecker = new DataChecker(configDataCheckerDegewo);

    onDegewoChanges$.subscribe(async (data) => {
      const foundItem = await degewoDataChecker.check(data);
      if (foundItem.length > 0) {
        console.log(`devlog: data`, data);
        sendMail(
          "🛣️ Degewo Neue Anzeige mit Waldsassener Straße!",
          "kevin.kuehle@gmail.com",
          arrayToContent(foundItem)
        );
      }
    });

    degewoBot.startScraping();
  } catch (error) {
    // sendMail(
    //   "🛣️ 🔴 Degewo Bot Error",
    //   "kevin.kuehle@gmail.com",
    //   `🛣️ Degewo Bot Error  ${error} `
    // );
  }
}
main();
