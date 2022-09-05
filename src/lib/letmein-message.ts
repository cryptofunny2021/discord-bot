import * as server from "./server.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} from "discord.js";
import client from "./client.js";

export async function message() {
  try {
    // Find Bot
    const guild = client.guilds.cache.get(server.ENJOYOR);

    if (guild) {
      const channel = guild.channels.cache.get("931630282581344266");

      if (channel?.type === ChannelType.GuildText) {
        await channel.messages.fetch();

        if (!channel.lastMessage) {
          channel.send({
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                  .setLabel("Let Me In")
                  .setStyle(ButtonStyle.Primary)
                  .setCustomId("let-me-in-btn")
              ),
            ],
            embeds: [
              {
                color: 0xffccdd,
                description: `Welcome, you will need to click the button to interact with server.`,
              },
            ],
          });
        }
      }
    }
  } catch (error) {
    console.log("letmein-message error:", error);
  }
}
