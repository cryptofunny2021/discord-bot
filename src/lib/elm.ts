import { gotScraping } from "got-scraping";
import { proxy, snapshot } from "valtio/vanilla";
import { queue } from "./queue.js";

const state = proxy({
  price: "",
  timestamp: 0,
});

async function fetch() {
  queue.add(async () => {
    try {
      const {
        tradingHistory: [info],
      } = await gotScraping(
        "https://io.dexscreener.com/u/trading-history/recent/arbitrum/0xf904469497e6a179a9d47a7b468e4be42ec56e65"
      ).json<{
        tradingHistory: Array<{
          blockNumber: number;
          blockTimestamp: number;
          txnHash: string;
          logIndex: number;
          type: "buy" | "sell";
          priceUsd: string;
          volumeUsd: string;
          amount0: string;
          amount1: string;
        }>;
      }>();

      state.price = `$${info.priceUsd}`;
      state.timestamp = Date.now();
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error fetching price", error.message);
      }
    }
  });
}

const { timestamp } = snapshot(state);

// Refresh every 2 minutes
if (timestamp === 0) {
  fetch();
  setInterval(fetch, 120_000);
}

export default state;
