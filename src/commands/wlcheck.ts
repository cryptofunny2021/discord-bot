import * as server from "../lib/server.js";
import * as sheets from "../lib/sheets.js";
import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const emojis = ["0️⃣", "1️⃣", "2️⃣"];

@Discord()
abstract class WLCheck {
  @SimpleCommand("wlcheck")
  async wlcheck(command: SimpleCommandMessage) {
    const message = command.message;
    const { channelId, content, guildId } = message;
    const [, argument] = content.split(" ");

    try {
      const wallet = argument.trim().toLowerCase();

      switch (true) {
        case server.isEnjoyor(guildId) && channelId === "926595545928192041":
          await message.react(emojis[sheets.enjoyor(wallet)]);

          break;

        case server.isToadstoolz(guildId) && channelId === "929515043236757544":
          await message.react(
            sheets.toadstoolz().some((item) => item.endsWith(wallet))
              ? "✅"
              : "🚫"
          );

          break;
      }
    } catch (error) {
      console.log("!wlcheck Error: ", error);
    }
  }
}
