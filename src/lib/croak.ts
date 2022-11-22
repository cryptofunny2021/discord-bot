import { Message } from 'discord.js'
import { gotScraping } from 'got-scraping'
import { proxy, snapshot } from 'valtio/vanilla'

import * as server from './server.js'

const state = proxy({ croaks: 0 })

export async function croak(message: Message) {
  if (!snapshot(state).croaks) {
    console.log('~> Fetching croaks')

    const { croaks } = await gotScraping('https://jsonbin.org/wyze/croaks', {
      headers: {
        authorization: `token ${process.env.JSONBIN_API_KEY}`,
      },
    }).json<{ croaks: number }>()

    if (croaks) {
      state.croaks = croaks
    }
  }

  if (message.guildId !== server.TOADSTOOLZ) {
    return
  }

  if (!/\bcroak\b/.test(message.content)) {
    return
  }

  try {
    state.croaks += 1

    const { croaks } = snapshot(state)

    await message.channel.send(
      `<:toad:1038399228239679551>  **${croaks.toLocaleString()} Croaks**, and counting! Toadally awesome!`
    )

    await gotScraping('https://jsonbin.org/wyze/croaks', {
      method: 'post',
      json: { croaks },
      headers: {
        authorization: `token ${process.env.JSONBIN_API_KEY}`,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error('~> croak error:', error.stack)
    }
  }
}
