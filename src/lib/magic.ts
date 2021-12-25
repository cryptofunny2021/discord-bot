import { GraphQLClient } from "graphql-request";
import { getSdk } from "../../generated/defined.graphql.js";
import { proxy, snapshot } from "valtio/vanilla";

const state = proxy({ change24h: "", price: "", timestamp: 0 });

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
    state.timestamp = Date.now();

    console.log(state.timestamp);
    // const { market_data: data } = await got(
    //   "https://api.coingecko.com/api/v3/coins/arbitrum-one/contract/0x539bde0d7dbd336b79148aa742883198bbf60342"
    // ).json<{
    //   market_data: {
    //     current_price: USD;
    //     price_change_percentage_24h_in_currency: USD;
    //     price_change_percentage_7d_in_currency: USD;
    //   };
    // }>();

    // this.price = data.current_price.usd;
    // this.change24h = data.price_change_percentage_24h_in_currency.usd;
    // this.change7d = data.price_change_percentage_7d_in_currency.usd;
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
