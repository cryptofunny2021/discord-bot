import * as server from "../lib/server.js";
import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "../../generated/marketplace.graphql.js";

const client = getSdk(new GraphQLClient(`${process.env.MARKETPLACE_URL}`));

@Discord()
export class Floor {
  @SimpleCommand()
  async notfloor(command: SimpleCommandMessage) {
    // Disabled everywhere for now
    if (1 + 1 === 2) {
      return;
    }

    if (!server.isSmolBrains(command.message.guildId)) {
      return;
    }

    if ("917430194049007616" !== command.message.channelId) {
      return;
    }

    const message = command.message;

    await message.channel.sendTyping();

    try {
      const floors = await client.getFloorPrices();

      const female = floors.female[0].pricePerItem;
      const land = floors.land[0].pricePerItem;
      const male = floors.male[0].pricePerItem;
      const vroom = floors.vroom[0].pricePerItem;

      const fields = [
        ["Male", male],
        ["Female", female],
        ["Land", land],
        ["Vroom", vroom],
      ].map(([name, price]) => ({
        inline: true,
        name,
        value: `${(price / 1e18).toLocaleString()} $MAGIC`,
      }));

      await command.message.channel.send({
        embeds: [
          {
            title: "Floor Price\n\u200b",
            description: "",
            color: 0x7e22ce,
            fields,
          },
        ],
      });
    } catch (error) {
      console.log(error);

      await command.message.channel.send("Error fetching information.");
    }
  }
}
