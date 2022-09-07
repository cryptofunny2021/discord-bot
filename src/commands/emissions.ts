import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";
import { gotScraping } from "got-scraping";

const percent = Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  style: "percent",
});

const MAGIC_LOGO =
  "https://i.postimg.cc/1XcZH0Vg/Magic-logomark-On-Light-AW.png";

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
          name?: string;
          emissionsShare: number;
          emissionsPerSecond: number;
        }>
      >();

      await command.message.channel.send({
        embeds: [
          {
            title: "Bridgeworld Emissions",
            description: "",
            color: 0xdd524d,
            fields: data.map((item) => ({
              name: item.name ?? "Asiterra",
              value: percent.format(item.emissionsShare),
            })),
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
