import { CommandInteraction, GuildMemberRoleManager } from "discord.js";
import { GuardFunction, SimpleCommandMessage } from "discordx";

export function HasRole(id: string): any {
  const guard: GuardFunction<
    CommandInteraction | SimpleCommandMessage
  > = async (interaction, _client, next) => {
    const member =
      interaction instanceof SimpleCommandMessage
        ? interaction.message.member
        : interaction.member;

    if (
      member?.roles instanceof GuildMemberRoleManager &&
      member.roles.cache.some((role) => role.id === id)
    ) {
      await next();
    }

    if (Array.isArray(member?.roles) && member?.roles.includes(id)) {
      await next();
    }
  };

  return guard;
}

export function InChannel(id: string): any {
  const guard: GuardFunction<
    CommandInteraction | SimpleCommandMessage
  > = async (interaction, _client, next) => {
    const channelId =
      interaction instanceof SimpleCommandMessage
        ? interaction.message.channelId
        : interaction.channelId;

    if (channelId === id) {
      await next();
    }
  };

  return guard;
}

export function IsUser(id: string): any {
  const guard: GuardFunction<
    CommandInteraction | SimpleCommandMessage
  > = async (interaction, _client, next) => {
    const userId =
      interaction instanceof SimpleCommandMessage
        ? interaction.message.author.id
        : interaction.user.id;

    if (userId === id) {
      await next();
    }
  };

  return guard;
}
