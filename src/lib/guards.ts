import {
  ButtonInteraction,
  CommandInteraction,
  ContextMenuInteraction,
  Message,
  MessageReaction,
  SelectMenuInteraction,
  VoiceState,
} from "discord.js";
import { ArgsOf, GuardFunction, SimpleCommandMessage } from "discordx";

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

// Courtesy of https://github.com/oceanroleplay/discord.ts/blob/d21715569f4ba977bc648f9a39ae73159d838212/packages/discordx/examples/guards/guards/NotBot.ts
export const NotBot: GuardFunction<
  | ArgsOf<"messageCreate" | "messageReactionAdd" | "voiceStateUpdate">
  | CommandInteraction
  | ContextMenuInteraction
  | SelectMenuInteraction
  | ButtonInteraction
  | SimpleCommandMessage
> = async (arg, _client, next) => {
  const argObj = arg instanceof Array ? arg[0] : arg;
  const user =
    argObj instanceof CommandInteraction
      ? argObj.user
      : argObj instanceof MessageReaction
      ? argObj.message.author
      : argObj instanceof VoiceState
      ? argObj.member?.user
      : argObj instanceof Message
      ? argObj.author
      : argObj instanceof SimpleCommandMessage
      ? argObj.message.author
      : argObj instanceof CommandInteraction ||
        argObj instanceof ContextMenuInteraction ||
        argObj instanceof SelectMenuInteraction ||
        argObj instanceof ButtonInteraction
      ? argObj.member?.user
      : argObj.message.author;

  if (!user?.bot) {
    await next();
  }
};
