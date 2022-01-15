import * as server from "../lib/server.js";
import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

@Discord()
abstract class WLCheck {
  @SimpleCommand("wlcheck")
  async wlcheck(command: SimpleCommandMessage) {
    const message = command.message;
    const { channelId, guildId } = message;

    try {
      if (server.isEnjoyor(guildId) && channelId === "926595545928192041") {
        await message.reply(
          "The !wlcheck command is deprecated, use /wlcheck."
        );
      }
    } catch (error) {
      console.log("!wlcheck Error: ", error);
    }
  }
}
