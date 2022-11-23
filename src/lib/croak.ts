import { Message } from 'discord.js'
import { gotScraping } from 'got-scraping'
import { proxy, snapshot } from 'valtio/vanilla'

import * as server from './server.js'

const state = proxy({ croaks: 0 })

const suffixes = [
  'Toadally awesome!',
  "Keep croakin'",
  'Run it up the tadpole!',
]

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

  if (!/\bcroak\b/i.test(message.content)) {
    return
  }

  try {
    state.croaks += 1

    const { croaks } = snapshot(state)
    const suffix = suffixes[(suffixes.length * Math.random()) | 0]

    await message.channel.send(
      `<:toad:913690221088997376>  **${croaks.toLocaleString()} Croaks**, and counting! ${suffix}`
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
