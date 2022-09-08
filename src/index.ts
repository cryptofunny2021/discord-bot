import "reflect-metadata";
import "dotenv/config";
import "./lib/extractors.js";

import { Interaction, Message } from "discord.js";
import { dirname, importx } from "@discordx/importer";
import { message } from "./lib/letmein-message.js";
import { snapshot, subscribe } from "valtio/vanilla";

import client from "./lib/client.js";
import magic from "./lib/magic.js";

client.once("ready", async () => {
  await client.initApplicationCommands();

  message();

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
  await importx(
    dirname(import.meta.url) + "/{commands,interactions}/**/*.{js,ts}"
  );

  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  client.login(process.env.BOT_TOKEN);
}

run();
