import * as server from "../lib/server.js";
import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

@Discord()
abstract class Pink {
  @SimpleCommand("pink", { aliases: ["smolist"] })
  async pink(command: SimpleCommandMessage) {
    if (!server.isSmolBrains(command.message.guildId)) {
      return;
    }

    const { message } = command;
    const { guild, member } = message;

    try {
      // Pull roles into cache
      await guild?.roles.fetch();

      // Smolist role
      const role = guild?.roles.cache.find(
        (role) => role.id === "915482397951262801"
      );

      if (role) {
        member?.roles.add(role);

        const display = member?.nickname ?? member?.user.username;
        const normalized = display?.toLowerCase().replace(/ /g, "");

        if (!normalized?.includes("smol")) {
          member?.setNickname(
            `smol ${member.nickname ?? member.user.username}`,
            "!pink"
          );
        }
      }
    } catch (error) {
      console.log("!pink Error: ", error);
    }
  }
}
