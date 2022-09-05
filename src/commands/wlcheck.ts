import * as server from "../lib/server.js";
import * as sheets from "../lib/sheets.js";
import { AddressZero } from "@ethersproject/constants";
import {
  Discord,
  SimpleCommand,
  SimpleCommandMessage,
  SimpleCommandOption,
  SimpleCommandOptionType,
} from "discordx";
import { utils } from "ethers";

function isPartialAddress(wallet: string | undefined = ""): wallet is string {
  return /^[a-f0-9]+$/gi.test(wallet) || utils.isAddress(wallet);
}

@Discord()
export class WLCheck {
  @SimpleCommand()
  async wlcheck(
    @SimpleCommandOption({
      description: "The wallet to check against the whitelist.",
      name: "wallet",
      type: SimpleCommandOptionType.String,
    })
    wallet: string | undefined,
    command: SimpleCommandMessage
  ) {
    const message = command.message;
    const { channelId, guildId } = message;

    try {
      if (server.isEnjoyor(guildId) && channelId === "926595545928192041") {
        await message.reply(
          "The !wlcheck command is deprecated, use /wlcheck."
        );
      } else if (
        server.isToadstoolz(guildId) &&
        channelId === "929515043236757544"
      ) {
        if (!isPartialAddress(wallet)) {
          return message.reply(`Usage: \`\`!wlcheck ${AddressZero}\`\``);
        }

        await message.react(
          sheets
            .toadstoolz()
            .some((item) => item.endsWith(wallet.toLowerCase()))
            ? "✅"
            : "🚫"
        );
      }
    } catch (error) {
      console.log("!wlcheck Error: ", error);
    }
  }
}
