import * as server from "../lib/server.js";
import * as sheets from "../lib/sheets.js";
import * as user from "../lib/user.js";
import { CommandInteraction } from "discord.js";
import { Discord, Guild, Permission, Slash, SlashOption } from "discordx";

@Discord()
abstract class WLCheck {
  @Guild(server.ENJOYOR)
  @Slash("wlcheck")
  async enjoyor(
    @SlashOption("wallet", {
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
      console.log("[enjoyor] /wlcheck error: ", error);
    }
  }

  @Permission({
    id: user.ORANJE,
    type: "USER",
    permission: true,
  })
  @Guild(server.TOADSTOOLZ)
  @Slash("wlcheck")
  async toadstoolz(
    @SlashOption("wallet", {
      description: "The wallet to check against the whitelist.",
    })
    wallet: string,
    interaction: CommandInteraction
  ) {
    try {
      const found = sheets.toadstoolz().some((item) => item.endsWith(wallet));

      await interaction.reply({
        content: `That wallet is ${found ? "" : "not "}on the whitelist.`,
        ephemeral: true,
      });
    } catch (error) {
      console.log("[toadstoolz] /wlcheck error: ", error);
    }
  }
}
