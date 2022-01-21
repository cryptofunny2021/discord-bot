import * as server from "../lib/server.js";
import * as user from "../lib/user.js";
import { CommandInteraction } from "discord.js";
import { Discord, Guild, Permission, Slash } from "discordx";

@Discord()
@Guild(server.SMOLBODIES)
class StartEvent {
  @Permission(false)
  @Permission({ id: user.TRAVELERR, permission: true, type: "USER" })
  @Slash("startevent")
  async startevent(interaction: CommandInteraction) {
    try {
      const channel =
        interaction.guild?.channels.cache.get("903447705492283482");

      if (channel?.isText()) {
        await interaction.guild?.emojis.fetch();

        const emoji = interaction.guild?.emojis.cache.get("934146325656784906");

        if (!emoji) {
          throw new Error("Emoji not found");
        }

        const exists = channel.messages.cache.has("");
        const message = exists
          ? channel.messages.cache.get("")!
          : await channel.send({
              embeds: [
                {
                  color: 0x1338be,
                  description: `React with the ${emoji} emoji now for the TSUNAMI SWOL role and to see event channels.`,
                },
              ],
            });

        const role = interaction.guild?.roles.cache.find(
          (role) => role.id === "934083245644071002"
        );

        await message.react(emoji);

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

      await interaction.reply({
        content: "Event has been started.",
        ephemeral: true,
      });
    } catch (error) {
      console.log("/startevent error: ", error);
    }
  }
}
