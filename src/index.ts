import "reflect-metadata";
import "dotenv/config";
import { Interaction, Message } from "discord.js";
import { snapshot, subscribe } from "valtio/vanilla";
import client from "./lib/client.js";
// import commands from "./lib/commands.js";
import magic from "./lib/magic.js";
// import version from "./lib/version.js";
import { dirname, importx } from "@discordx/importer";

client.once("ready", async () => {
  // make sure all guilds are in cache
  await client.guilds.fetch();

  await client.initApplicationCommands({
    guild: { log: false },
    global: { log: false },
  });

  await client.initApplicationPermissions();

  // await importx(dirname(import.meta.url) + "/commands/shared/**.{js,ts}");

  subscribe(magic, () => {
    const { price } = snapshot(magic);

    client.user?.setPresence({
      activities: [{ name: `$MAGIC: ${price}`, type: 3 }],
    });
  });

  console.log("Bot started!");
});

client.on("interactionCreate", (interaction: Interaction) => {
  client.executeInteraction(interaction);
});

client.on("messageCreate", (message: Message) => {
  client.executeCommand(message);
});

async function run() {
  await importx(dirname(import.meta.url) + "/commands/**/*.{js,ts}");

  client.login(`${process.env.BOT_TOKEN}`);
}

run();
