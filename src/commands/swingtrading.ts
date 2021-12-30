import * as server from '../lib/server.js'
import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

@Discord()
abstract class SwingTrading {
  @SimpleCommand("swingtrading")
  async swingtrading(command: SimpleCommandMessage) {
    if (!server.isTreasure(command.message.guildId)) {
      return
    }

    try {
      await command.message.channel.send({
        embeds: [
          {
            title: "adventureNFTs on Swing Trading",
            description:
              "everyone swing trading magic is going to end up with less magic and want to necc at some point when they realize how much they could have had. this was me with bitcoin in 2014-2017, and i was swing trading. We all ended up chasing the white dragon and getting rekt. God forbid if we get the ability to add leverage to magic, that will destroy a huge percentage of people as well. Listen to me. The way to get wealthy is right in front of you. It is so simple. I have the secret to the Universe. Stack magic, Stake it, do not sell it, and stop clicking. Just. Stop. Clicking. Even if you take the full supply of MAGIC without the lockup situation, Magic is $100.00 coin in its sleep this year at some point. So every single sell you make prior to $100.00 you're Reking yourself. You're hurting your familia. You're selling something for $1.65 that is worth $100 😂😂, and thinking you're gonna "get back in later". Oh really anon you're buying the dip and selling the rip eh. You've backtested that? You have 'levels'? You drew an ichi cloud? You drew a line? You have an algo? Good luck with that anon, it does not work, it never works, it cannot work, I've done all of it, I've gone so far down that rabbit hole you can't possibly imagine. I worked with a team of math PHD quants for a year on an algo, buy and hold is still better if its an asset like Magic which is only going one direction (all true). Of course we need Swingers like you because fundamentally you drive up the price and cause Fomo when we start moving up again, but I care about the community here and the people in this chat and I want to see you all make it and have success and wealth. I want to see you make it. Buy and hold anon. Stop Clicking. \n\nAlso, GM and Merry Xmas.\n\u200b",
            color: 48028,
            timestamp: "2021-12-25T12:10:00.000Z",
          },
        ],
      });
    } catch (error) {
      console.log("!swingtrading Error: ", error);
    }
  }
}
