import * as server from "../lib/server.js";
import * as sheets from "../lib/sheets.js";
import { AddressZero } from "@ethersproject/constants";
import {
  Discord,
  SimpleCommand,
  SimpleCommandMessage,
  SimpleCommandOption,
} from "discordx";
import { utils } from "ethers";

function isPartialAddress(wallet: string | undefined = ""): wallet is string {
  return /^[a-f0-9]+$/g.test(wallet) || utils.isAddress(wallet);
}

@Discord()
abstract class WLCheck {
  @SimpleCommand("wlcheck")
  async wlcheck(
    @SimpleCommandOption("wallet", {
      description: "The wallet to check against the whitelist.",
      type: "STRING",
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
