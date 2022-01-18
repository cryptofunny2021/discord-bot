import { Client } from "discordx";
import { Intents } from "discord.js";

export default new Client({
  simpleCommand: {
    prefix: "!",
  },
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});
