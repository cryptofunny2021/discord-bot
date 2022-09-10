import { gotScraping } from "got-scraping";
import { GraphQLClient } from "graphql-request";
import { proxy, snapshot } from "valtio/vanilla";
import { getSdk } from "../../generated/hasura.graphql.js";
import { pluralize } from "./helpers.js";

const state = proxy({
  data: [] as Array<Record<"name" | "value", string>>,
  timestamp: 0,
});

const client = getSdk(
  new GraphQLClient(`${process.env.HASURA_URL}`, {
    headers: {
      "x-hasura-user-id": `${process.env.HASURA_API_KEY}`,
      "x-hasura-role": "tressy",
    },
  })
);

const percent = Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  style: "percent",
});

async function fetch() {
  try {
    const data = await gotScraping("https://api.treasure.lol/mines").json<
      Array<{
        address: string;
        name: string;
        emissionsShare: number;
        emissionsPerSecond: number;
      }>
    >();

    const { __typename, ...boosts } =
      await client.getHarvesterExtractorBoosts();

    state.data = data.map((item) => {
      const boost = Object.entries(boosts)
        .filter(
          ([key, extractor]) =>
            key === item.name.toLowerCase() &&
            typeof extractor?.aggregate?.sum?.staked === "number"
        )
        .map(
          ([, extractor]) =>
            `${extractor?.aggregate?.sum?.staked} extractor${pluralize(
              extractor?.aggregate?.sum?.staked ?? 0
            )} for ${extractor.aggregate?.sum?.boost}%`
        )
        .join("");

      return {
        name: item.name,
        value: [
          `${percent.format(item.emissionsShare)} for ${Math.round(
            item.emissionsPerSecond * 86_400
          ).toLocaleString()} MAGIC/day`,
          boost,
        ]
          .filter(Boolean)
          .join("\n"),
      };
    });

    state.timestamp = Date.now();
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching emissions\n${error.stack}`);
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
