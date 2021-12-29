import * as server from "../lib/server.js";
import * as user from "../lib/user.js";
import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";
import { TextChannel } from "discord.js";
import { formatDistanceToNowStrict } from "date-fns";
import client from "../lib/client.js";

function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function wait(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

@Discord()
abstract class WL {
  @SimpleCommand("wl")
  async wl(command: SimpleCommandMessage) {
    if (!server.isEnjoyor(command.message.guildId)) {
      return;
    }

    if (!user.isAdmin(command.message.member?.user.id)) {
      return;
    }

    // Only in bot-spam channel
    if (command.message.channelId !== "925856832625442906") {
      return;
    }

    try {
      const max = getRandom(15, 45);
      const seconds = getRandom(15, 46);
      const time = seconds * 1_000;

      const fields = [
        { inline: true, name: "Max Spots", value: `${max}` },
        { inline: true, name: "Max Time", value: `${seconds} seconds` },
      ];

      const info = await command.message.channel.send({
        embeds: [
          {
            title: "Whitelist Status",
            color: 0xcceedd,
            fields,
          },
        ],
      });

      // Reactions channel
      const channel = client.channels.cache.get(
        "925877130762539058"
      ) as TextChannel;

      const message = await channel?.send({
        embeds: [
          {
            description: "React to this message to see what is next.",
            color: 0xcceedd,
          },
        ],
      });
      const start = Date.now();

      await message.react("👍");
      await message.awaitReactions({
        filter: (reaction, user) => {
          return "👍" === reaction.emoji.name && user.id !== message.author.id;
        },
        max,
        time,
      });

      const value = formatDistanceToNowStrict(start, { addSuffix: true });

      await message.delete();

      const [users] = message.reactions.cache
        .map((reaction) => reaction.users.cache.filter((user) => !user.bot))
        .flat();

      if (users.size > 0) {
        try {
          await info.edit({
            embeds: [
              {
                title: "Whitelist Status",
                color: 0xcceedd,
                fields: [
                  ...fields,
                  { inline: true, name: "Filled", value },
                  {
                    name: "Users",
                    value: users.map((user) => user.username).join(", "),
                  },
                ],
              },
            ],
          });
        } catch (error) {
          console.log("Error editing embed:", error);
        }
      }

      // Add `Next` role
      const role = command.message.guild?.roles.cache.find(
        (role) => role.id === "925836438648533072"
      );

      for await (const [userId] of users) {
        const member = command.message.guild?.members.cache.find(
          (member) => member.user.id === userId
        );

        if (role) {
          await member?.roles.add(role);
        }
      }
    } catch (error) {
      console.log("!wl Error: ", error);
    }
  }
}
