import { formatDistanceToNowStrict } from 'date-fns'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'
import { snapshot } from 'valtio/vanilla'

import state from '../lib/gfly.js'

const spacer = { inline: true, name: '\u200b', value: '\u200b' }

const TOKEN_LOGO = 'https://magicswap.lol/img/tokens/gfly.png'

@Discord()
export class GFly {
  @SimpleCommand()
  async gfly(command: SimpleCommandMessage) {
    const { message } = command
    const { channelId } = message
    const gfly = snapshot(state)

    if (channelId === '882872974972162118') {
      return
    }

    try {
      await message.channel.sendTyping()

      const fields = [
        {
          inline: true,
          name: 'Price',
          value: gfly.price || 'Unknown',
        },
        gfly.change24h
          ? [
              spacer,
              {
                inline: true,
                name: '24 Hour Change',
                value: gfly.change24h,
              },
            ]
          : [],
        gfly.lastBuyPrice
          ? [
              {
                name: 'Last Buy Price',
                value: gfly.lastBuyPrice,
              },
            ]
          : [],
      ]
        .flat()
        .filter(Boolean)

      await command.message.channel.send({
        embeds: [
          {
            title: '$gFLY',
            description: `- View on [DexScreener](https://dexscreener.com/arbitrum/${gfly.pairId})\n- Trade on [MagicSwap](https://magicswap.lol/?input=MAGIC&output=GFLY)`,
            color: 0x04ccac,
            fields,
            thumbnail: {
              url: TOKEN_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by MagicSwap • ${formatDistanceToNowStrict(
                gfly.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: 'https://magicswap.lol/img/favicon-32x32.png',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!gfly Error: ', error)
    }
  }
}
