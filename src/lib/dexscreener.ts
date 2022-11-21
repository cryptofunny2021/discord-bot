import { gotScraping } from 'got-scraping'
import { proxy, snapshot } from 'valtio/vanilla'

import { round } from './helpers.js'
import pairsState from './pairs.js'
import { queue } from './queue.js'

const state = proxy<{
  tokens: Array<{
    id: string
    priceUsd: string
  }>
  timestamp: number
}>({
  tokens: [],
  timestamp: 0,
})

async function fetch() {
  try {
    const { pairs } = snapshot(pairsState)

    state.tokens = await Promise.all(
      [{ id: '0xb7e50106a5bd3cf21af210a755f9c8740890a8c9' }, ...pairs].map(
        (pair) =>
          queue.add(async () => {
            console.log('~> Fetching DexScreener for', pair.id)

            const {
              quoteTokenSymbol,
              tradingHistory: [info],
            } = await gotScraping(
              `https://io.dexscreener.com/u/trading-history/recent/arbitrum/${pair.id}`
            ).json<{
              quoteTokenSymbol: string
              tradingHistory: Array<{
                blockNumber: number
                blockTimestamp: number
                txnHash: string
                logIndex: number
                type: 'buy' | 'sell'
                priceUsd: string
                volumeUsd: string
                amount0: string
                amount1: string
              }>
            }>()

            const priceUsd =
              quoteTokenSymbol === 'GFLY'
                ? round(parseFloat(info.volumeUsd) / parseFloat(info.amount1))
                : round(parseFloat(info.priceUsd))

            return { id: pair.id, priceUsd }
          })
      )
    )

    state.timestamp = Date.now()
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching pairs\n${error.stack}`)
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
