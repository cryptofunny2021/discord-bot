import * as server from "../lib/server.js";
import * as stakers from "../lib/stakers.js";
import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const emojis = ["0️⃣", "1️⃣", "2️⃣"];

@Discord()
abstract class WLCheck {
  @SimpleCommand("wlcheck")
  async wlcheck(command: SimpleCommandMessage) {
    if (!server.isEnjoyor(command.message.guildId)) {
      return;
    }

    // Only in wl-checkooor channel
    if (command.message.channelId !== "926595545928192041") {
      return;
    }

    const message = command.message;
    const [, argument] = message.content.split(" ");

    try {
      const wallet = argument.toLowerCase();
      const count = [stakers.bodies, stakers.brains].reduce(
        (acc, wallets) =>
          wallets.some((item) => item.endsWith(wallet)) ? acc + 1 : acc,
        0
      );

      await message.react(emojis[count]);
    } catch (error) {
      console.log("!wlcheck Error: ", error);
    }
  }
}
