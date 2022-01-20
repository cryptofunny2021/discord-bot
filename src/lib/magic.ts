import { GraphQLClient } from "graphql-request";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { getSdk } from "../../generated/defined.graphql.js";
import { proxy, snapshot } from "valtio/vanilla";
import got from "got";

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

const client = getSdk(
  new GraphQLClient(`${process.env.DEFINED_URL}`, {
    headers: { "x-api-key": `${process.env.DEFINED_API_KEY} ` },
  })
);

const percent = Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  style: "percent",
});

const round = Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 5,
  style: "currency",
});

async function fetch() {
  try {
    const body = await client.getMagicPrice();

    state.price = round.format(Number(body.pairMetadata?.price));
    state.change24h = percent.format(body.pairMetadata?.priceChange ?? 0);

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
