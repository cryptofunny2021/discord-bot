import { formatDistanceToNow } from "date-fns";
import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const now = Date.now();

@Discord()
abstract class Uptime {
  @SimpleCommand("uptime")
  async uptime(command: SimpleCommandMessage) {
    const { message } = command;
    const { guild } = message;

    if (!guild) {
      return;
    }

    try {
      await command.message.channel.send({
        embeds: [
          {
            title: "Uptime",
            description: formatDistanceToNow(now),
            color: 0x663399,
          },
        ],
      });
    } catch (error) {
      console.log("!uptime Error: ", error);
    }
  }
}
