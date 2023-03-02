import { formatDistanceToNowStrict } from 'date-fns'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'

import crypts from '../lib/crypts.js'

const HARVESTER_LOGOS = [
  'https://bridgeworld.treasure.lol/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fharvester_water.c998b9dc.webp&w=1920&q=75',
  'https://bridgeworld.treasure.lol/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fharvester_fire.822452fc.webp&w=1920&q=75',
  'https://bridgeworld.treasure.lol/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fharvester_light.e599fb1e.webp&w=1920&q=75',
  'https://bridgeworld.treasure.lol/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fharvester_earth.b585f60f.webp&w=1920&q=75',
  'https://bridgeworld.treasure.lol/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fharvester_time.b21aa0aa.webp&w=1920&q=75',
]

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomItem<T>(array: T[]) {
  const index = random(0, array.length - 1)

  return array[index]
}

@Discord()
export class Crypts {
  @SimpleCommand()
  async crypts(command: SimpleCommandMessage) {
    const { message } = command
    const { channelId } = message

    if (channelId === '882872974972162118') {
      return
    }

    if (crypts.data.length === 0) {
      await command.message.reply('No crypts data currently.')

      return
    }

    try {
      await message.channel.sendTyping()

      await command.message.channel.send({
        embeds: [
          {
            title: 'Corruption Crypts',
            description: '',
            color: 0x8650cf,
            fields: crypts.data,
            thumbnail: {
              url: randomItem(HARVESTER_LOGOS),
              height: 64,
              width: 64,
            },
            footer: {
              text: `Powered by Honeycomb • ${formatDistanceToNowStrict(
                crypts.timestamp,
                { addSuffix: true }
              )}`,
              icon_url: 'https://i.postimg.cc/K8c8tX1D/honeycomb.png',
            },
          },
        ],
      })
    } catch (error) {
      console.log('!crypts Error: ', error)
    }
  }
}
