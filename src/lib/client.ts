import { Client } from "discordx";
import { GatewayIntentBits, IntentsBitField } from "discord.js";

export default new Client({
  simpleCommand: {
    prefix: "!",
  },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    IntentsBitField.Flags.MessageContent,
  ],
});
