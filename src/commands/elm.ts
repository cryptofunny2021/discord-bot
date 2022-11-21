import { formatDistanceToNowStrict } from 'date-fns'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'
import { snapshot } from 'valtio/vanilla'

import state from '../lib/elm.js'

const spacer = { inline: true, name: '\u200b', value: '\u200b' }

const TOKEN_LOGO = 'https://magicswap.lol/img/tokens/elm.png'

@Discord()
export class Ellerium {
  @SimpleCommand()
  async elm(command: SimpleCommandMessage) {
    const { message } = command
    const { channelId } = message
    const elm = snapshot(state)

    if (channelId === '882872974972162118') {
      return
    }

    try {
      await message.channel.sendTyping()

      const fields = [
        {
          inline: true,
          name: 'Price',
          value: elm.price,
        },
        elm.change24h
          ? [
              spacer,
              {
                inline: true,
                name: '24 Hour Change',
                value: elm.change24h,
              },
            ]
          : [],
        elm.lastBuyPrice
          ? [
              {
                name: 'Last Buy Price',
                value: elm.lastBuyPrice,
              },
            ]
          : [],
      ]
        .flat()
        .filter(Boolean)

      await command.message.channel.send({
        embeds: [
          {
            title: '$ELM Price',
            description: `- View on [DexScreener](https://dexscreener.com/arbitrum/${elm.pairId})\n- Trade on [MagicSwap](https://magicswap.lol/?input=ELM&output=MAGIC)`,
            color: 0xe47454,
            fields,
            thumbnail: {
              url: TOKEN_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by MagicSwap • ${formatDistanceToNowStrict(
                elm.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: 'https://magicswap.lol/img/favicon-32x32.png',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!elm Error: ', error)
    }
  }
}
