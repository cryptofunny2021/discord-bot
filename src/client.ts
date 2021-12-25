import "reflect-metadata";
import "dotenv/config";
import { Client } from "discordx";
import { Intents, Interaction, Message } from "discord.js";
import { dirname, importx } from "@discordx/importer";
import { snapshot, subscribe } from "valtio/vanilla";
import magic from "./lib/magic.js";
import version from "./lib/version.js";

const client = new Client({
  simpleCommand: {
    prefix: "!",
  },
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
  silent: true,
});

client.once("ready", async () => {
  await client.initApplicationCommands({
    guild: { log: true },
    global: { log: true },
  });
  await client.initApplicationPermissions();

  client.guilds.cache.map((g, id, x) => {
    console.log(id, g.name);
  });

  subscribe(magic, () => {
    const { price } = snapshot(magic); // A snapshot is an immutable object

    client.user?.setPresence({
      activities: [{ name: `$MAGIC: ${price}`, type: 3 }],
    });
  });

  console.log("Bot started");
});

client.on("interactionCreate", (interaction: Interaction) => {
  client.executeInteraction(interaction);
});

client.on("messageCreate", (message: Message) => {
  client.executeCommand(message);
});

async function run() {
  // await importx("./src/commands/**/*.{js,ts}");
  await importx(dirname(import.meta.url) + "/commands/**/*.{js,ts}");

  client.login(process.env.BOT_TOKEN ?? ""); // provide your bot token

  try {
    console.log("checking Version");
    version();
  } catch (error) {
    console.log("Fatal", error);
  }
}

run();
