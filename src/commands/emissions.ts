import { formatDistanceToNowStrict } from 'date-fns'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'

import emissions from '../lib/emissions.js'

const MAGIC_LOGO =
  'https://gateway.ipfscdn.io/ipfs/QmWQa5AXsT1rESYbpVJnRr2QzqiGmAmfEG8j94tX76iQk1'

@Discord()
export class Harvesters {
  @SimpleCommand()
  async emissions(command: SimpleCommandMessage) {
    const { message } = command
    const { channelId } = message

    if (channelId === '882872974972162118') {
      return
    }

    if (emissions.data.length === 0) {
      await command.message.reply('No emissions data currently.')

      return
    }

    try {
      await message.channel.sendTyping()

      await command.message.channel.send({
        embeds: [
          {
            title: 'Bridgeworld Emissions',
            description: '',
            color: 0xdd524d,
            fields: emissions.data,
            thumbnail: {
              url: MAGIC_LOGO,
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by Treasure • ${formatDistanceToNowStrict(
                emissions.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: 'https://bridgeworld.treasure.lol/favicon-32x32.png',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!emissions Error: ', error)
    }
  }
}
