import * as server from "../lib/server.js";
import client from "./client.js";

export async function swolevent() {
  try {
    // Find Bot
    const guild = client.guilds.cache.get(server.SMOLBODIES);
    const channel = guild?.channels.cache.get("903447705492283482");

    if (channel?.isText()) {
      await guild?.emojis.fetch();

      const emoji = guild?.emojis.cache.get("934146325656784906");

      if (!emoji) {
        throw new Error("Emoji not found");
      }

      await channel.messages.fetch();

      const message = channel.messages.cache.get("934105790325854218");

      if (!message) {
        throw new Error("Cannot find message");
      }

      const role = guild?.roles.cache.find(
        (role) => role.id === "934083245644071002"
      );

      const collector = message.createReactionCollector({
        filter: (reaction, user) =>
          emoji.name === reaction.emoji.name &&
          !user.bot &&
          user.id !== message.author.id,
      });

      collector.on("collect", async (_, user) => {
        if (role) {
          const member = message.guild?.members.cache.find(
            (member) => member.user.id === user.id
          );

          await member?.roles.add(role);
        }
      });
    }
  } catch (error) {
    console.log("swolevent error: ", error);
  }
}
