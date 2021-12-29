import * as server from "../lib/server.js";
import * as user from "../lib/user.js";
import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

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
      const minutes = getRandom(1, 6);
      const delay = minutes * 60_000;

      const fields = [
        { inline: true, name: "Delay", value: `${minutes} minutes` },
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

      // Enjoyeer
      const channel =
        command.message.guild?.channels.fetch("905953472816484433");

      if (!channel) {
        await info.edit({
          embeds: [
            {
              title: "Cannot find channel.",
              color: 0xcceedd,
            },
          ],
        });

        return;
      }

      // Wait between 1-5 minutes before sending the message
      await wait(delay);

      const message = await command.message.channel.send({
        embeds: [
          {
            description: "React to this message to get on the whitelist.",
            color: 0xcceedd,
          },
        ],
      });

      await message.react("👍");
      await message.awaitReactions({
        filter: (reaction, user) => {
          return "👍" === reaction.emoji.name && user.id !== message.author.id;
        },
        max,
        time,
      });

      await message.delete();

      const [users] = message.reactions.cache
        .map((reaction) => reaction.users.cache.filter((user) => !user.bot))
        .flat();

      await info.edit({
        embeds: [
          {
            title: "Whitelist Status",
            color: 0xcceedd,
            fields: [
              ...fields,
              {
                name: "Users",
                value: users.map((user) => user.username).join(", "),
              },
            ],
          },
        ],
      });

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
