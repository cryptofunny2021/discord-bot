import { formatDistanceToNowStrict } from 'date-fns'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'

import corruption from '../lib/corruption.js'

const CORRUPTION_LOGO =
  'https://i.postimg.cc/tCQ9QzFz/Corruptions-Essence.png'

@Discord()
export class Corruption {
  @SimpleCommand()
  async corruption(command: SimpleCommandMessage) {
    const { message } = command
    const { channelId } = message

    if (channelId === '882872974972162118') {
      return
    }

    if (corruption.data.length === 0) {
      await command.message.reply('No corruption data currently.')

      return
    }

    try {
      await message.channel.sendTyping()

      await command.message.channel.send({
        embeds: [
          {
            title: 'Bridgeworld Corruption',
            description: '',
            color: 0x8650cf,
            fields: corruption.data,
            thumbnail: {
              url: CORRUPTION_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by Treasure • ${formatDistanceToNowStrict(
                corruption.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: 'https://bridgeworld.treasure.lol/favicon-32x32.png',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!corruption Error: ', error)
    }
  }
}
