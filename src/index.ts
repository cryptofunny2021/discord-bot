import "reflect-metadata";
import "dotenv/config";

import { Interaction, Message } from "discord.js";
import { dirname, importx } from "@discordx/importer";
import { message } from "./lib/letmein-message.js";
import { snapshot, subscribe } from "valtio/vanilla";
import { swolevent } from "./lib/swolevent.js";

import client from "./lib/client.js";
import magic from "./lib/magic.js";
import elm from "./lib/elm.js";

client.once("ready", async () => {
  try {
    // make sure all guilds are in cache
    await client.guilds.fetch();

    await client.initApplicationCommands({
      guild: { log: true },
      global: { log: true },
    });

    await client.initApplicationPermissions(true);
  } catch (error) {
    console.log("Error initializing:", error);
  }

  message();

  subscribe(magic, () => {
    const { price } = snapshot(magic);

    client.user?.setPresence({
      activities: [{ name: `$MAGIC: ${price}`, type: 3 }],
    });
  });

  subscribe(elm, () => {
    const { price } = snapshot(elm);

    client.user?.setPresence({
      activities: [{ name: `$ELM: ${price}`, type: 3 }],
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
  await importx(dirname(import.meta.url) + "/interactions/**/*.{js,ts}");

  client.login(`${process.env.BOT_TOKEN}`);
}

run();
