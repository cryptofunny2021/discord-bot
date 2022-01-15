import * as server from "../lib/server.js";
import * as sheets from "../lib/sheets.js";
import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

@Discord()
abstract class WLCheck {
  @SimpleCommand("wlcheck")
  async wlcheck(command: SimpleCommandMessage) {
    const message = command.message;
    const { channelId, content, guildId } = message;
    const [, argument] = content.split(" ");

    try {
      const wallet = argument.trim().toLowerCase();

      if (server.isEnjoyor(guildId) && channelId === "926595545928192041") {
        await message.reply(
          "The !wlcheck command is deprecated, use /wlcheck."
        );
      } else if (
        server.isToadstoolz(guildId) &&
        channelId === "929515043236757544"
      ) {
        await message.react(
          sheets.toadstoolz().some((item) => item.endsWith(wallet))
            ? "✅"
            : "🚫"
        );
      }
    } catch (error) {
      console.log("!wlcheck Error: ", error);
    }
  }
}
