import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";
import { gotScraping } from "got-scraping";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "../../generated/hasura.graphql.js";

const spacer = { inline: true, name: "\u200b", value: "\u200b" };

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

      const boosts = await client.getHarvesterExtractors();

      await command.message.channel.send({
        embeds: [
          {
            title: "Bridgeworld Emissions",
            description: "",
            color: 0xdd524d,
            fields: data
              .map((item) => {
                const boost = [
                  boosts.harvester_extractors.find(
                    (extractor) => extractor.name === item.name
                  ),
                ]
                  .filter(Boolean)
                  .map(
                    (extractor) =>
                      `${extractor?.staked} for ${extractor?.boost}%`
                  )
                  .flat()
                  .join("");

                return [
                  {
                    inline: true,
                    name: item.name,
                    value: percent.format(item.emissionsShare),
                  },
                  spacer,
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
              text: "Powered by Treasure API",
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
