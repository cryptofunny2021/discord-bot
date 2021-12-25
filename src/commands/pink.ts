import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

@Discord()
abstract class Smol {
  @SimpleCommand("pink")
  async pink(command: SimpleCommandMessage) {
    const { message } = command;
    const { guild, member } = message;

    if (!guild || !member) {
      return;
    }

    // Smol Brains Discord
    if (guild.id != "897404773622505482") {
      return;
    }

    try {
      // Pull roles into cache
      await guild.roles.fetch();

      const role = guild.roles.cache.find((role) => role.name === "Smolist");

      if (role) {
        member.roles.add(role);

        const display = member.nickname ?? member.user.username;
        const normalized = display.toLowerCase().replace(/ /g, "");

        if (!normalized.includes("smol")) {
          member.setNickname(
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
