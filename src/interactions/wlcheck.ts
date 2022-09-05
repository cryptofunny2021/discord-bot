import * as server from "../lib/server.js";
import * as sheets from "../lib/sheets.js";
import { CommandInteraction } from "discord.js";
import { Discord, Guild, Slash, SlashOption } from "discordx";

@Discord()
@Guild(server.ENJOYOR)
export class WLCheck {
  @Slash()
  async wlcheck(
    @SlashOption({
      name: "wallet",
      description: "The wallet to check against the whitelist.",
    })
    wallet: string,
    interaction: CommandInteraction
  ) {
    try {
      const count = sheets.enjoyor(wallet.trim().toLowerCase());

      await interaction.reply({
        content: `That wallet has ${count} whitelist mint${
          count === 1 ? "" : "s"
        }.`,
        ephemeral: true,
      });
    } catch (error) {
      console.log("/wlcheck error: ", error);
    }
  }
}
