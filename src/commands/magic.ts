import { formatDistanceToNowStrict } from "date-fns";
import { Discord, Guard, SimpleCommand, SimpleCommandMessage } from "discordx";
import { snapshot } from "valtio/vanilla";
import { InChannel } from "../lib/guards.js";
import state from "../lib/magic.js";

const spacer = { inline: true, name: "\u200b", value: "\u200b" };

const MAGIC_LOGO =
  "https://i.postimg.cc/1XcZH0Vg/Magic-logomark-On-Light-AW.png";

@Discord()
export class Magic {
  @SimpleCommand()
  async magic(command: SimpleCommandMessage) {
    const { message } = command;
    const { channelId } = message;
    const magic = snapshot(state);

    console.log("herre");

    if (channelId === "882872974972162118") {
      return;
    }

    try {
      await message.channel.sendTyping();

      await command.message.channel.send({
        embeds: [
          {
            title: "$MAGIC Price",
            description: "",
            url: "https://dexscreener.com/arbitrum/0xb7e50106a5bd3cf21af210a755f9c8740890a8c9",
            color: 0xdd524d,
            fields: [
              {
                inline: true,
                name: "Price",
                value: magic.price,
              },
              spacer,
              {
                inline: true,
                name: "24 Hour Change",
                value: magic.change24h,
              },
            ],
            thumbnail: {
              url: MAGIC_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by DEX Screener • ${formatDistanceToNowStrict(
                magic.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: "https://dexscreener.com/favicon.png",
            },
          },
        ],
      });
    } catch (error) {
      console.log("!magic Error: ", error);
    }
  }

  @SimpleCommand()
  @Guard(InChannel("958963188903329792"))
  async magicstats(command: SimpleCommandMessage) {
    const { message } = command;
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
                inline: true,
                name: "Price",
                value: magic.price,
              },
              spacer,
              {
                inline: true,
                name: "24 Hour Change",
                value: magic.change24h,
              },
            ],
            thumbnail: {
              url: MAGIC_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by Defined • ${formatDistanceToNowStrict(
                magic.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: "https://defined.fi/logo192.png",
            },
          },
          {
            title: "$MAGIC Stats",
            description: "",
            url: `https://www.coingecko.com/en/coins/magic`,
            color: 0xdd524d,
            fields: [
              {
                inline: true,
                name: "All Time High",
                value: magic.ath,
              },
              {
                inline: true,
                name: "All Time High Date",
                value: magic.ath_date,
              },
              spacer,
              { inline: true, name: "24 Hour High", value: magic.high_24h },
              { inline: true, name: "24 Hour Low", value: magic.low_24h },
            ],
            thumbnail: {
              url: MAGIC_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by CoinGecko • ${formatDistanceToNowStrict(
                magic.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: "https://www.coingecko.com/favicon-96x96.png",
            },
          },
        ],
      });
    } catch (error) {
      console.log("!magic Error: ", error);
    }
  }
}
