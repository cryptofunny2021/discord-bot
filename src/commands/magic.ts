import { formatDistanceToNowStrict } from "date-fns";
import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";
import { snapshot } from "valtio/vanilla";
import state from "../lib/magic.js";

@Discord()
abstract class Magic {
  @SimpleCommand("magic")
  async magic(command: SimpleCommandMessage) {
    const { message } = command;
    const { guild } = message;

    if (!guild) {
      return;
    }

    const magic = snapshot(state);

    try {
      await message.channel.sendTyping();

      await command.message.channel.send({
        embeds: [
          {
            title: "$MAGIC Price",
            description: "",
            url: `https://defined.fi/arb/0xb7e50106a5bd3cf21af210a755f9c8740890a8c9`,
            color: 0xdd524d,
            fields: [
              {
                name: "Price",
                value: magic.price,
              },
              {
                name: "24 Hour Change",
                value: magic.change24h,
              },
            ],
            thumbnail: {
              url: "https://s2.coinmarketcap.com/static/img/coins/64x64/14783.png",
              height: 64,
              width: 64,
            },
            footer: {
              text: `Courtesy of Defined • ${formatDistanceToNowStrict(
                magic.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: "https://defined.fi/logo192.png",
            },
          },
        ],
      });
    } catch (error) {
      console.log("!magic Error: ", error);
    }
  }
}
