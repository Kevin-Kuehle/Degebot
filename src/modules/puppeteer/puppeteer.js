import puppeteer from "puppeteer";

const target =
  "https://immosuche.degewo.de/de/search?size=1&page=1&property_type_id=1&categories%5B%5D=16&lat=&lon=&area=&address%5Bstreet%5D=&address%5Bcity%5D=&address%5Bzipcode%5D=&address%5Bdistrict%5D=&district=60&property_number=&price_switch=false&price_radio=null&price_from=&price_to=&qm_radio=null&qm_from=&qm_to=&rooms_radio=null&rooms_from=&rooms_to=&wbs_required=&order=rent_total_without_vat_asc";

export async function run() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(2 * 60 * 1000);
  await page.goto(target);

  const html = await page.evaluate(() => {
    const articles = document.querySelectorAll(".article-list__item");
    const outputData = [];
    if (articles.length > 0) {
      outputData = articles.map((article) => {
        // hier weiter machen
      });
    }
  });
}
