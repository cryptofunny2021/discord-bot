import { gotScraping } from 'got-scraping'
import { proxy, snapshot } from 'valtio/vanilla'

import { round } from './helpers.js'
import pairsState from './pairs.js'

const state = proxy<{
  tokens: Array<{
    id: string
    apy: string
    fees: string
    liquidity: string
    volume: string
  }>
  timestamp: number
}>({
  tokens: [],
  timestamp: 0,
})

async function fetch() {
  try {
    const { pairs } = snapshot(pairsState)

    const tokens = pairs
      .map((pair) => pair.id)
      .concat('0xb7e50106a5bd3cf21af210a755f9c8740890a8c9') // Add MAGIC/WETH pair
      .filter((token, index, tokens) => tokens.indexOf(token) === index)

    console.log('~> Fetching Sushi data')

    const data = await gotScraping(
      'https://app.sushi.com/api/analytics/pairs/42161'
    ).json<
      Array<{
        apy: string
        fees1d: number
        liquidity: string
        pair: {
          id: string
        }
        volume1d: number
      }>
    >()

    state.tokens = data
      .filter(({ pair: { id } }) => tokens.includes(id))
      .map(({ apy, fees1d, liquidity, pair: { id }, volume1d }) => {
        return {
          id,
          apy,
          fees: round(fees1d, 2, 'compact'),
          liquidity: round(Number(liquidity), 2, 'compact'),
          volume: round(volume1d, 2, 'compact'),
        }
      })

    state.timestamp = Date.now()
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching Sushi\n${error.stack}`)
    }
  }
}

const { timestamp } = snapshot(state)

// Refresh every 15 seconds
if (timestamp === 0) {
  fetch()
  setInterval(fetch, 15_000)
}

export default state
