import { formatDistanceToNowStrict } from 'date-fns'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'
import { snapshot } from 'valtio/vanilla'

import state from '../lib/magic.js'

const spacer = { inline: true, name: '\u200b', value: '\u200b' }

const LP_LOGO =
  'https://i.postimg.cc/q7PhHxgs/Screen-Shot-2022-12-13-at-8-52-02-AM-removebg-preview.png'

@Discord()
export class LP {
  @SimpleCommand()
  async lp(command: SimpleCommandMessage) {
    const { message } = command
    const { channelId } = message
    const { lp } = snapshot(state)

    if (channelId === '882872974972162118') {
      return
    }

    try {
      await message.channel.sendTyping()

      const fields = [
        {
          inline: true,
          name: 'TVL',
          value: lp.liquidity,
        },
        spacer,
        {
          inline: true,
          name: 'APY',
          value: lp.apy,
        },
        {
          inline: true,
          name: 'Volume 1d',
          value: lp.volume,
        },
        spacer,
        {
          inline: true,
          name: 'Fees 1d',
          value: lp.fees,
        },
      ]

      await command.message.channel.send({
        embeds: [
          {
            title: 'MAGIC/WETH',
            description: `- View on [Sushi](https://app.sushi.com/analytics/pools/0xb7e50106a5bd3cf21af210a755f9c8740890a8c9?chainId=42161)`,
            color: 0xb1b3e6,
            fields,
            thumbnail: {
              url: LP_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by Sushi • ${formatDistanceToNowStrict(
                lp.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: 'https://app.sushi.com/icons/icon-72x72.png',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!lp Error: ', error)
    }
  }
}
