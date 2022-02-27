import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { proxy, snapshot } from "valtio/vanilla";
import got from "got";
import puppeteer from "puppeteer";

type USD<T> = { usd: T };

const state = proxy({
  ath: "",
  ath_date: "",
  change24h: "",
  high_24h: "",
  low_24h: "",
  price: "",
  timestamp: 0,
});

const round = Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 5,
  style: "currency",
});

const args =
  process.env.NODE_ENV === "production"
    ? {
        args: [
          "--disable-dev-shm-usage",
          "--no-sandbox",
          "--disable-setuid-sandbox",
        ],
        executablePath: "/usr/bin/chromium-browser",
        ignoreHTTPSErrors: true,
      }
    : undefined;

async function getMagicInfo() {
  try {
    const browser = await puppeteer.launch(args);
    const page = await browser.newPage();

    await page.goto(
      "https://dexscreener.com/arbitrum/0xb7e50106a5bd3cf21af210a755f9c8740890a8c9"
    );

    const selector = "header + div > div > div";

    await page.waitForSelector(selector);

    const price = await page.$eval(
      `${selector} > div > span + span`,
      (element) => element.textContent ?? ""
    );

    const change24h = await page.$eval(
      `${selector} + div + div > ul > li + li + li + li > div > span + span`,
      (element) => element.textContent ?? ""
    );

    await browser.close();

    return { price, change24h };
  } catch (error) {
    console.log("dex-error", error);

    return null;
  }
}

async function fetch() {
  try {
    const info = await getMagicInfo();

    if (info) {
      state.price = info.price;
      state.change24h = info.change24h;
    }

    const { market_data: data } = await got(
      "https://api.coingecko.com/api/v3/coins/arbitrum-one/contract/0x539bde0d7dbd336b79148aa742883198bbf60342"
    ).json<{
      market_data: {
        ath: USD<number>;
        ath_date: USD<string>;
        low_24h: USD<number>;
        high_24h: USD<number>;
      };
    }>();

    state.ath = round.format(data.ath.usd);
    state.ath_date = formatDistanceToNowStrict(parseISO(data.ath_date.usd), {
      addSuffix: true,
    });
    state.high_24h = round.format(data.high_24h.usd);
    state.low_24h = round.format(data.low_24h.usd);

    state.timestamp = Date.now();
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error fetching price", error.message);
    }
  }
}

const { timestamp } = snapshot(state);

// Refresh every 30 seconds
if (timestamp === 0) {
  fetch();
  setInterval(fetch, 30_000);
}

export default state;
