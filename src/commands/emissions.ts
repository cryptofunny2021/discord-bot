import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";
import { gotScraping } from "got-scraping";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "../../generated/hasura.graphql.js";

const percent = Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  style: "percent",
});

const MAGIC_LOGO =
  "https://i.postimg.cc/1XcZH0Vg/Magic-logomark-On-Light-AW.png";

const client = getSdk(
  new GraphQLClient(`${process.env.HASURA_URL}`, {
    headers: {
      "x-hasura-user-id": `${process.env.HASURA_API_KEY}`,
      "x-hasura-role": "tressy",
    },
  })
);

@Discord()
export class Harvesters {
  @SimpleCommand()
  async emissions(command: SimpleCommandMessage) {
    const { message } = command;
    const { channelId } = message;

    if (channelId === "882872974972162118") {
      return;
    }

    try {
      await message.channel.sendTyping();

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

      await command.message.channel.send({
        embeds: [
          {
            title: "Bridgeworld Emissions",
            description: "",
            color: 0xdd524d,
            fields: data
              .map((item) => {
                const boost = Object.entries(boosts)
                  .filter(
                    ([key, extractor]) =>
                      key === item.name.toLowerCase() &&
                      typeof extractor?.aggregate?.sum?.staked === "number"
                  )
                  .map(
                    ([, extractor]) =>
                      `${extractor?.aggregate?.sum?.staked} for ${extractor.aggregate?.sum?.boost}%`
                  )
                  .join("");

                return [
                  {
                    inline: true,
                    name: item.name,
                    value: percent.format(item.emissionsShare),
                  },
                  {
                    inline: true,
                    name: "MAGIC/Day",
                    value: (item.emissionsPerSecond * 86_400).toLocaleString(),
                  },
                  {
                    inline: true,
                    name: "Extractor Info",
                    value: item.name === "Atlas Mine" ? "N/A" : boost || "None",
                  },
                ];
              })
              .flat(),
            thumbnail: {
              url: MAGIC_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: "Powered by Treasure",
              icon_url: "https://bridgeworld.treasure.lol/favicon-32x32.png",
            },
          },
        ],
      });
    } catch (error) {
      console.log("!emissions Error: ", error);
    }
  }
}
