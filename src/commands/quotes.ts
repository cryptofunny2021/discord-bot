import { Discord, Guard, SimpleCommand, SimpleCommandMessage } from 'discordx'

import { InChannel } from '../lib/guards.js'
import * as server from '../lib/server.js'

@Discord()
export class Quotes {
  @SimpleCommand()
  @Guard(InChannel('958963188903329792'))
  async swingtrading(command: SimpleCommandMessage) {
    if (!server.isTreasure(command.message.guildId)) {
      return
    }

    try {
      await command.message.channel.send({
        embeds: [
          {
            description: `everyone swing trading magic is going to end up with less magic and want to necc at some point when they realize how much they could have had. this was me with bitcoin in 2014-2017, and i was swing trading. We all ended up chasing the white dragon and getting rekt. God forbid if we get the ability to add leverage to magic, that will destroy a huge percentage of people as well. Listen to me. The way to get wealthy is right in front of you. It is so simple. I have the secret to the Universe. Stack magic, Stake it, do not sell it, and stop clicking. Just. Stop. Clicking. Even if you take the full supply of MAGIC without the lockup situation, Magic is $100.00 coin in its sleep this year at some point. So every single sell you make prior to $100.00 you're Reking yourself. You're hurting your familia. You're selling something for $1.65 that is worth $100 😂😂, and thinking you're gonna "get back in later". Oh really anon you're buying the dip and selling the rip eh. You've backtested that? You have 'levels'? You drew an ichi cloud? You drew a line? You have an algo? Good luck with that anon, it does not work, it never works, it cannot work, I've done all of it, I've gone so far down that rabbit hole you can't possibly imagine. I worked with a team of math PHD quants for a year on an algo, buy and hold is still better if its an asset like Magic which is only going one direction (all true). Of course we need Swingers like you because fundamentally you drive up the price and cause Fomo when we start moving up again, but I care about the community here and the people in this chat and I want to see you all make it and have success and wealth. I want to see you make it. Buy and hold anon. Stop Clicking. \n\nAlso, GM and Merry Xmas.\n\u200b`,
            color: 48028,
            timestamp: '2021-12-25T12:10:00.000Z',
            footer: {
              text: 'adventureNFTs',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!swingtrading Error: ', error)
    }
  }

  @SimpleCommand()
  @Guard(InChannel('958963188903329792'))
  async doudou(command: SimpleCommandMessage) {
    if (!server.isTreasure(command.message.guildId)) {
      return
    }

    try {
      await command.message.channel.send({
        embeds: [
          {
            description: `each one of u should look urself in the  mirror and ask urself how u live with the lies of being a moonboi  in Magic while clicking the sell confirm button on metamask to dump ur magic`,
            color: 48028,
            timestamp: '2021-12-30T13:41:00.000Z',
            footer: {
              text: 'doudouking',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!doudou Error: ', error)
    }
  }

  @SimpleCommand()
  @Guard(InChannel('958963188903329792'))
  async doggy(command: SimpleCommandMessage) {
    if (!server.isTreasure(command.message.guildId)) {
      return
    }

    try {
      await command.message.channel.send({
        embeds: [
          {
            description: `I don't care about stocks, if magic was a good project it would be at $100 now with s&p mooning or without it`,
            color: 48028,
            timestamp: '2022-01-10T20:01:00.000Z',
            footer: {
              text: 'doggycoiner',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!doggy Error: ', error)
    }
  }

  @SimpleCommand()
  @Guard(InChannel('958963188903329792'))
  async prayer(command: SimpleCommandMessage) {
    try {
      await command.message.channel.send({
        embeds: [
          {
            description: `Our Papa Parmesano, who art gigabraining,
hallowed be thy Smol Name,
thy Bridgeworld come,
thy will be done,
on treasure.lol as it is in heaven.

Give us this day our daily $MAGIC.
And forgive us our paperhands,
as we forgive those
who dump all over us.

And lead us not into temptation,
but deliver us from OS.

For thine is the kingdom,
and the power, and the glory,
for ever and ever. HODL.`,
            color: 48028,
            timestamp: '2022-01-02T21:36:00.000Z',
            footer: {
              text: 'kalin3186',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!prayer Error: ', error)
    }
  }

  @SimpleCommand()
  @Guard(InChannel('958963188903329792'))
  async engagement(command: SimpleCommandMessage) {
    try {
      await command.message.channel.send({
        embeds: [
          {
            description: `The engagement levels have dropped but that's to be expected in a bear market. Even if I got zero engagement I would still post, in a way it's kind of become like a ritual for me to do and I find it therapeutic in a sense. It's wild to think I have been posting the news for the past 7 months and I am still having as much fun (if not more) than when I first started covering the ecosystem. I have met so many amazing people and I am forever grateful to the treasure community for embracing and enjoying my content. As someone who was in the web3 space in 2018, bear markets are tough but it's also the best time to build. I fully believe what treasure is creating will be here for the long term and am very excited to see what the future holds in store. I genuinely wish I could be spending more time hanging with you all here in discord but as a full-time student, it is hard to find the extra free time to do so. I fully believe if you are still engaging in the ecosystem it will work out when the bull market comes roaring back :grinning:`,
            color: 48028,
            timestamp: '2022-10-08T04:18:00.000Z',
            footer: {
              text: 'Kowl',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!engagement Error: ', error)
    }
  }

  @SimpleCommand()
  @Guard(InChannel('958963188903329792'))
  async x(command: SimpleCommandMessage) {
    try {
      await command.message.channel.send({
        embeds: [
          {
            description: `I woke up later than j intended because I stayed up a bit later than I meant to. Realised j hasn’t properly organised everything I needed to for an appointment so ran around gathering documents. Realised I needed to print some. Had to leave that and plan to print on the way somewhere. Then realised I’d miscalculated what time I needed to leave to get to the airport so I was running late. Grabbed an uber instead of driving so no parking and less time. Arrived at the airport at the same time my plane was supposed to take off. A very nice person at customer service sneakily put me on the next one with no charge so crisis averted. Had to print at the airport at some dodgy little kiosk thing but it worked. Flew to Sydney. Couldn’t find the consulate so was 20 minutes late for the appointment. Then had to leave anyway as they must be the only building in Australia still wearing masks. Found a little pharmacy they reckon they are doing a roaring trade in single pack masks due to all the people like me going to the consulate. Anyway, went back with my mask and to my appointment. Realised in my rush I’d left one of the documents with a fancy apostille stamp on it at home. After the appointment, back to the airport and into the lounge. Only for a quick bite and a drink for half an hour as the appointment was clearly over time. Wandered the the gate for boarding and no one was moving. Checked my pass and realised it had been delayed by an hour. Lounge was too far to go back to. The new departure time came and went and then a bit later they announced the whole flight was cancelled. Everyone rushed to the attendants, had no chance of getting in there. After about 20 minutes they announced “we’ve filled 100 seats, there aren’t any more. Good luck!” So off to find another airline. Bought a last minute ticket that got me back to Melbourne 4 hours and $400 later than intended. Everything went a bit sideways, one after the other. 


            Oh. And when I was in the appointment the lady said “didn’t you send in everything online? Then you didn’t need to come here, we would have told you that if you’d emailed us after you applied. No need to fly here for the day.” 🤨
            `,
            color: 48028,
            timestamp: '2023-08-31T13:34:00.000Z',
            footer: {
              text: 'X_',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!x Error: ', error)
    }
  }
}
