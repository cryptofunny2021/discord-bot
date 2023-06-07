import { formatDistanceToNowStrict } from 'date-fns'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'
import { snapshot } from 'valtio/vanilla'

import state from '../lib/anima.js'

const spacer = { inline: true, name: '\u200b', value: '\u200b' }

const TOKEN_LOGO = 'https://magicswap.lol/img/tokens/anima.png'

@Discord()
export class Anima {
  @SimpleCommand()
  async anima(command: SimpleCommandMessage) {
    const { message } = command
    const { channelId } = message
    const anima = snapshot(state)

    if (channelId === '882872974972162118') {
      return
    }

    try {
      await message.channel.sendTyping()

      const fields = [
        {
          inline: true,
          name: 'Price',
          value: anima.price,
        },
        anima.change24h
          ? [
              spacer,
              {
                inline: true,
                name: '24 Hour Change',
                value: anima.change24h,
              },
            ]
          : [],
        anima.lastBuyPrice
          ? [
              {
                name: 'Last Buy Price',
                value: anima.lastBuyPrice,
              },
            ]
          : [],
      ]
        .flat()
        .filter(Boolean)

      await command.message.channel.send({
        embeds: [
          {
            title: '$ANIMA',
            description: `- View on [DexScreener](https://dexscreener.com/arbitrum/${anima.pairId})\n- Trade on [MagicSwap](https://magicswap.lol/?input=MAGIC&output=ANIMA)`,
            color: 0xe47454,
            fields,
            thumbnail: {
              url: TOKEN_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by MagicSwap • ${formatDistanceToNowStrict(
                anima.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: 'https://magicswap.lol/img/favicon-32x32.png',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!anima Error: ', error)
    }
  }
}
