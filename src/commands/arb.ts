import { formatDistanceToNowStrict } from 'date-fns'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'
import { snapshot } from 'valtio/vanilla'

import state from '../lib/arb.js'

const spacer = { inline: true, name: '\u200b', value: '\u200b' }

const TOKEN_LOGO = 'https://i.postimg.cc/cJQLDJfQ/arbitrum.png'

@Discord()
export class Arbitrum {
  @SimpleCommand()
  async arb(command: SimpleCommandMessage) {
    const { message } = command
    const { channelId } = message
    const arb = snapshot(state)

    if (channelId === '882872974972162118') {
      return
    }

    try {
      await message.channel.sendTyping()

      const fields = [
        {
          inline: true,
          name: 'Price',
          value: arb.price || 'Unknown',
        },
        arb.change24h
          ? [
              spacer,
              {
                inline: true,
                name: '24 Hour Change',
                value: arb.change24h,
              },
            ]
          : [],
        arb.lastBuyPrice
          ? [
              {
                name: 'Last Buy Price',
                value: arb.lastBuyPrice,
              },
            ]
          : [],
      ]
        .flat()
        .filter(Boolean)

      await command.message.channel.send({
        embeds: [
          {
            title: '$ARB',
            description: `- View on [DexScreener](https://dexscreener.com/arbitrum/${arb.pairId})\n- Trade on [SushiSwap](https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1&chainId=42161)`,
            color: 0x0482cc,
            fields,
            thumbnail: {
              url: TOKEN_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by SushiSwap • ${formatDistanceToNowStrict(
                arb.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: 'https://app.sushi.com/icons/icon-96x96.png',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!arb Error: ', error)
    }
  }
}
