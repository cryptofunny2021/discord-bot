// import { formatDistanceToNowStrict } from 'date-fns'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'
// import { snapshot } from 'valtio/vanilla'

// import state from '../lib/gfly.js'

const TOKEN_LOGO = 'https://magicswap.lol/img/tokens/gfly.png'

@Discord()
export class GFly {
  @SimpleCommand()
  async gfly(command: SimpleCommandMessage) {
    const { message } = command
    const { channelId } = message
    // const gfly = snapshot(state)

    if (channelId === '882872974972162118') {
      return
    }

    try {
      await message.channel.sendTyping()

      await command.message.channel.send({
        embeds: [
          {
            title: '$gFLY',
            description: '',
            // url: 'https://dexscreener.com/arbitrum/0xf904469497e6a179a9d47a7b468e4be42ec56e65',
            color: 0x04ccac,
            // fields: [
            //   {
            //     inline: true,
            //     name: 'Price',
            //     value: gfly.price,
            //   },
            // ],
            fields: [
              {
                inline: true,
                name: 'Launching',
                value: '<t:1669071600:R>',
              },
            ],
            thumbnail: {
              url: TOKEN_LOGO,
              height: 64,
              width: 64,
            },
            // footer: {
            //   text: `Powered by DEX Screener • ${formatDistanceToNowStrict(
            //     gfly.timestamp,
            //     { addSuffix: true }
            //   )}`,
            //   icon_url: 'https://dexscreener.com/favicon.png',
            // },
          },
        ],
      })
    } catch (error) {
      console.log('!gfly Error: ', error)
    }
  }
}
