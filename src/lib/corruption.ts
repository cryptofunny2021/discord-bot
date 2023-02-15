import { gotScraping } from 'got-scraping'
import { proxy, snapshot } from 'valtio/vanilla'

import { abbreviateNumber, spacer } from './helpers.js'

const state = proxy({
  data: [] as Array<Record<'name' | 'value', string>>,
  timestamp: 0,
})

async function fetch() {
  try {
    const data = await gotScraping(
      'https://api.treasure.lol/bridgeworld/corruption'
    ).json<
      Array<{
        name: string
        balance: number
        boost: number
        ratePerSecond: number
        boostedRatePerSecond: number
        generatedCorruptionCap: number
      }>
    >()

    state.data = data.flatMap((item, index) => {
      return [
        index % 2 === 1 ? spacer : null,
        {
          name: item.name,
          inline: true,
          value: [
            `Corruption: ${Math.round(
              item.balance
            ).toLocaleString()}/${abbreviateNumber(
              item.generatedCorruptionCap
            )}`,
            `Rate: ${Math.round(
              item.boostedRatePerSecond * 3600
            ).toLocaleString()}/hour`,
          ].join('\n'),
        },
      ].filter((item): item is NonNullable<typeof item> => Boolean(item))
    })

    state.timestamp = Date.now()
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching corruption\n${error.stack}`)
    }
  }
}

const { timestamp } = snapshot(state)

// Refresh every 30 seconds
if (timestamp === 0) {
  fetch()
  setInterval(fetch, 30_000)
}

export default state
