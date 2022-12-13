import { formatDistanceToNowStrict } from 'date-fns'
import { Discord, Guard, SimpleCommand, SimpleCommandMessage } from 'discordx'
import { snapshot } from 'valtio/vanilla'

import { InChannel } from '../lib/guards.js'
import state from '../lib/magic.js'

const spacer = { inline: true, name: '\u200b', value: '\u200b' }

const MAGIC_LOGO =
  'https://i.postimg.cc/1XcZH0Vg/Magic-logomark-On-Light-AW.png'

@Discord()
export class Magic {
  @SimpleCommand()
  async magic(command: SimpleCommandMessage) {
    const { message } = command
    const { channelId } = message
    const magic = snapshot(state)

    if (channelId === '882872974972162118') {
      return
    }

    try {
      await message.channel.sendTyping()

      const fields = [
        {
          inline: true,
          name: 'Price',
          value: magic.price,
        },
        magic.change24h
          ? [
              spacer,
              {
                inline: true,
                name: '24 Hour Change',
                value: magic.change24h,
              },
            ]
          : [],
        magic.lastBuyPrice
          ? [
              {
                inline: Boolean(magic.market_cap),
                name: 'Last Buy Price',
                value: magic.lastBuyPrice,
              },
            ]
          : [],
        magic.market_cap
          ? [
              spacer,
              {
                inline: true,
                name: 'Market Cap',
                value: magic.market_cap,
              },
            ]
          : [],
      ]
        .flat()
        .filter(Boolean)

      await command.message.channel.send({
        embeds: [
          {
            title: '$MAGIC',
            description: `- View on [DexScreener](https://dexscreener.com/arbitrum/${magic.pairId})\n- Trade on [SushiSwap](https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x539bdE0d7Dbd336b79148AA742883198BBF60342&chainId=42161)`,
            color: 0xe02424,
            fields,
            thumbnail: {
              url: MAGIC_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by Treasure • ${formatDistanceToNowStrict(
                magic.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: 'https://bridgeworld.treasure.lol/favicon-32x32.png',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!magic Error: ', error)
    }
  }

  @SimpleCommand()
  @Guard(InChannel('958963188903329792'))
  async magicstats(command: SimpleCommandMessage) {
    const { message } = command
    const magic = snapshot(state)

    try {
      await message.channel.sendTyping()

      const fields = [
        {
          inline: true,
          name: 'Price',
          value: magic.price,
        },
        magic.change24h
          ? [
              spacer,
              {
                inline: true,
                name: '24 Hour Change',
                value: magic.change24h,
              },
            ]
          : [],
        magic.lastBuyPrice
          ? [
              {
                name: 'Last Buy Price',
                value: magic.lastBuyPrice,
              },
            ]
          : [],
      ]
        .flat()
        .filter(Boolean)

      await command.message.channel.send({
        embeds: [
          {
            title: '$MAGIC Price',
            description: '',
            url: `https://defined.fi/arb/0xb7e50106a5bd3cf21af210a755f9c8740890a8c9`,
            color: 0xdd524d,
            fields,
            thumbnail: {
              url: MAGIC_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by Defined • ${formatDistanceToNowStrict(
                magic.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: 'https://defined.fi/logo192.png',
            },
          },
          {
            title: '$MAGIC Stats',
            description: '',
            url: `https://www.coingecko.com/en/coins/magic`,
            color: 0xdd524d,
            fields: [
              {
                inline: true,
                name: 'All Time High',
                value: magic.ath,
              },
              {
                inline: true,
                name: 'All Time High Date',
                value: magic.ath_date,
              },
              spacer,
              { inline: true, name: '24 Hour High', value: magic.high_24h },
              { inline: true, name: '24 Hour Low', value: magic.low_24h },
            ],
            thumbnail: {
              url: MAGIC_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by CoinGecko • ${formatDistanceToNowStrict(
                magic.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: 'https://www.coingecko.com/favicon-96x96.png',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!magicstats Error: ', error)
    }
  }
}
