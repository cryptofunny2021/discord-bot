import * as server from "../lib/server.js";
import * as sheets from "../lib/sheets.js";
import { CommandInteraction } from "discord.js";
import {
  Discord,
  Guild,
  Permission,
  Slash,
  SlashGroup,
  SlashOption,
} from "discordx";
import { utils } from "ethers";

@Discord()
@Guild(server.ENJOYOR)
@SlashGroup("wl", "Manage your whitelist information.")
class WL {
  @Permission(false)
  @Permission({ id: "925836438648533072", permission: true, type: "ROLE" })
  @Slash("add")
  async add(
    @SlashOption("wallet", {
      description: "The wallet to add to the whitelist.",
    })
    wallet: string,
    interaction: CommandInteraction
  ) {
    try {
      const isValid = utils.isAddress(wallet);

      if (!isValid) {
        return interaction.reply({
          content: `That is not a valid wallet address.`,
          ephemeral: true,
        });
      }

      const discriminator = interaction.user.discriminator;
      const username = interaction.user.username;

      const display = `${username}#${discriminator}`;
      const id = interaction.user.id;

      sheets.add(wallet, display, id);

      await interaction.reply({
        content: `Thank you for your submission, your wallet will be added shortly.`,
        ephemeral: true,
      });
    } catch (error) {
      console.log("/wl add error: ", error);
    }
  }
}
