import { formatDistanceToNowStrict } from 'date-fns'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'
import { snapshot } from 'valtio/vanilla'

import state from '../lib/vee.js'

const spacer = { inline: true, name: '\u200b', value: '\u200b' }

const TOKEN_LOGO = 'https://magicswap.lol/img/tokens/vee.png'

@Discord()
export class Vee {
  @SimpleCommand()
  async vee(command: SimpleCommandMessage) {
    const { message } = command
    const { channelId } = message
    const vee = snapshot(state)

    if (channelId === '882872974972162118') {
      return
    }

    try {
      await message.channel.sendTyping()

      const fields = [
        {
          inline: true,
          name: 'Price',
          value: vee.price,
        },
        vee.change24h
          ? [
              spacer,
              {
                inline: true,
                name: '24 Hour Change',
                value: vee.change24h,
              },
            ]
          : [],
        vee.lastBuyPrice
          ? [
              {
                name: 'Last Buy Price',
                value: vee.lastBuyPrice,
              },
            ]
          : [],
      ]
        .flat()
        .filter(Boolean)

      await command.message.channel.send({
        embeds: [
          {
            title: '$VEE',
            description: `- View on [DexScreener](https://dexscreener.com/arbitrum/${vee.pairId})\n- Trade on [Magicswap](https://magicswap.lol/?input=MAGIC&output=VEE)`,
            color: 0xe47454,
            fields,
            thumbnail: {
              url: TOKEN_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by Magicswap • ${formatDistanceToNowStrict(
                vee.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: 'https://magicswap.lol/img/favicon-32x32.png',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!vee Error: ', error)
    }
  }
}
