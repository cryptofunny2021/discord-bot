import { formatDistanceToNowStrict } from 'date-fns'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'
import { snapshot } from 'valtio/vanilla'

import state from '../lib/elm.js'

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

      await command.message.channel.send({
        embeds: [
          {
            title: '$ELM Price',
            description: '',
            url: 'https://dexscreener.com/arbitrum/0xf904469497e6a179a9d47a7b468e4be42ec56e65',
            color: 0xe47454,
            fields: [
              {
                inline: true,
                name: 'Price',
                value: elm.price,
              },
            ],
            thumbnail: {
              url: TOKEN_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by DEX Screener • ${formatDistanceToNowStrict(
                elm.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: 'https://dexscreener.com/favicon.png',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!elm Error: ', error)
    }
  }
}
